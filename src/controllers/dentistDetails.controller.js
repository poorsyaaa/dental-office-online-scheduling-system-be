const { ScanCommand } = require("@aws-sdk/lib-dynamodb");
const dynamoDBClient = require("../config/dbConfig");

const getAllDentist = async (req, res) => {
  try {
    const dentistInfo = await dynamoDBClient.send(
      new ScanCommand({
        TableName: "dental_clinic_dentist_list_table",
      }),
    );

    if (!dentistInfo.Items) {
      return res.apiError({
        error: "Dentist not found",
        message: "Dentist not found",
        statusCode: 404,
      });
    }

    res.apiResponse({
      data: dentistInfo.Items,
      message: "",
      statusCode: 200,
    });
  } catch (error) {
    res.apiError({
      error: error.message,
      message: "Failed to get list of dentist",
      statusCode: 500,
    });
  }
};

module.exports = getAllDentist;
