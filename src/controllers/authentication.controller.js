const { GetCommand, PutCommand } = require("@aws-sdk/lib-dynamodb");
const dynamoDBClient = require("../config/dbConfig");
const { compare, hash } = require("bcrypt");
const crypto = require("crypto");
const { generateTokens } = require("../utils/generate-token");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const { userName, password, firstName, lastName, email, phoneNumber } = req.body;

    const hashedPassword = await hash(password, 10);
    const userId = crypto.randomUUID();

    await dynamoDBClient.send(
      new PutCommand({
        TableName: "dental_clinic_users_table",
        Item: {
          userName,
          firstName,
          lastName,
          userId,
          email,
          phoneNumber,
          password: hashedPassword,
        },
        ConditionExpression: "attribute_not_exists(userName)",
      }),
    );

    res.apiResponse({
      message: "User registered successfully! Please log in",
      statusCode: 201,
    });
  } catch (error) {
    res.apiError({
      error: error.message,
      message: "Failed to register",
      statusCode: 500,
    });
  }
};

const login = async (req, res) => {
  try {
    const { userName, password } = req.body;

    const userDetails = await dynamoDBClient.send(
      new GetCommand({
        TableName: "dental_clinic_users_table",
        Key: {
          userName: userName,
        },
      }),
    );

    if (!userDetails.Item || !(await compare(password, userDetails.Item.password))) {
      return res.apiError({
        error: "Invalid credentials",
        message: "Invalid credentials",
        statusCode: 500,
      });
    }

    const { accessToken } = generateTokens(userDetails.Item.userId, userDetails.Item.userName);

    res.apiResponse({
      data: {
        accessToken,
        userId: userDetails.Item.userId,
      },
      message: "Successfully logged in",
      statusCode: 200,
    });
  } catch (error) {
    res.apiError({
      error: error.message,
      message: "Failed to login",
      statusCode: 500,
    });
  }
};

const authenticateUser = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.apiError({
        message: "Unauthorized",
        statusCode: 401,
      });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
      if (err instanceof jwt.JsonWebTokenError || err instanceof jwt.TokenExpiredError || err instanceof jwt.NotBeforeError) {
        switch (err.name) {
          case "TokenExpiredError":
            return res.apiError({ message: "Access Token Expired", statusCode: 403 });
          case "JsonWebTokenError":
          case "NotBeforeError":
            return res.apiError({ message: "Invalid Access Token", statusCode: 403 });
          default:
            return res.apiError({ message: "Token Verification Failed", statusCode: 403 });
        }
      }

      res.apiResponse({
        data: "",
        message: "User is authorized",
        statusCode: 200,
      });
    });
  } catch (e) {
    res.apiError({
      error: error.message,
      message: "Failed to authenticate",
      statusCode: 500,
    });
  }
};
module.exports = {
  registerUser,
  login,
  authenticateUser,
};
