const { QueryCommand } = require("@aws-sdk/lib-dynamodb");
const dynamoDBClient = require("../config/dbConfig");

const getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    const userInfo = await dynamoDBClient.send(
      new QueryCommand({
        TableName: "dental_clinic_users_table",
        IndexName: "userId-index",
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: { ":userId": userId },
      }),
    );

    res.apiResponse({
      data: userInfo.Items[0],
      message: "",
      statusCode: 200,
    });
  } catch (error) {
    res.apiError({
      error: error.message,
      message: "Failed to get user details",
      statusCode: 500,
    });
  }
};

module.exports = getUserDetails;
