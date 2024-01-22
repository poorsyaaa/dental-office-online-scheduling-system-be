const { QueryCommand } = require("@aws-sdk/lib-dynamodb");
const dynamoDBClient = require("../config/dbConfig");

const listAvailableSlots = async (req, res) => {
  try {
    const { dentistId } = req.params; // Assuming you're passing date as a parameter

    // Query to find available slots for a specific dentist on a specific date
    const slotsData = await dynamoDBClient.send(
      new QueryCommand({
        TableName: "dental_clinic_slots_table",
        KeyConditionExpression: "dentistId = :dentistId",
        ExpressionAttributeValues: {
          ":dentistId": dentistId,
        },
      }),
    );

    res.apiResponse({
      data: slotsData.Items,
      message: "Available slots retrieved successfully",
      statusCode: 200,
    });
  } catch (error) {
    res.apiError({
      error: error.message,
      message: "Failed to retrieve slots",
      statusCode: 500,
    });
  }
};

module.exports = {
  listAvailableSlots,
};
