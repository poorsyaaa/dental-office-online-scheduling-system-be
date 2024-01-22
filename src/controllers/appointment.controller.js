const { PutCommand, GetCommand, UpdateCommand, DeleteCommand, QueryCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");
const dynamoDBClient = require("../config/dbConfig");
const crypto = require("crypto");

const createAppointment = async (req, res) => {
  try {
    const { userId, appointmentDate, duration, serviceType, dentistId, status, specialNotes } = req.body;

    const slotData = await dynamoDBClient.send(
      new GetCommand({
        TableName: "dental_clinic_slots_table",
        Key: {
          dentistId: dentistId,
          appointmentDate: appointmentDate,
        },
      }),
    );

    if (slotData.Item || (slotData.Item?.isBooked && slotData.Item?.appointmentId)) {
      return res.apiError({
        error: "Slot is not available",
        message: "Slot is not available",
        statusCode: 400,
      });
    }

    const appointmentId = crypto.randomUUID();

    // Mark the slot as booked
    await dynamoDBClient.send(
      new UpdateCommand({
        TableName: "dental_clinic_slots_table",
        Key: {
          dentistId: dentistId,
          appointmentDate: appointmentDate,
        },
        UpdateExpression: "set appointmentId = :appointmentId",
        ExpressionAttributeValues: {
          ":appointmentId": appointmentId,
        },
      }),
    );

    // Create the appointment
    await dynamoDBClient.send(
      new PutCommand({
        TableName: "dental_clinic_appointments_table",
        Item: {
          appointmentId,
          userId,
          appointmentDate,
          duration,
          serviceType,
          dentistId,
          specialNotes,
          status,
        },
      }),
    );

    res.apiResponse({
      data: { appointmentId },
      message: "Appointment successfully created",
      statusCode: 201,
    });
  } catch (error) {
    res.apiError({
      error: error.message,
      message: "Failed to create appointment",
      statusCode: 500,
    });
  }
};

const getAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    // Fetch appointment details
    const appointmentData = await dynamoDBClient.send(
      new QueryCommand({
        TableName: "dental_clinic_appointments_table",
        KeyConditionExpression: "appointmentId = :appointmentId",
        ExpressionAttributeValues: { ":appointmentId": appointmentId },
      }),
    );

    if (!appointmentData.Items) {
      return res.apiError({
        error: "Appointment not found",
        message: "Appointment not found",
        statusCode: 404,
      });
    }

    const appointment = appointmentData.Items[0];

    // Fetch user details
    const userData = await dynamoDBClient.send(
      new QueryCommand({
        TableName: "dental_clinic_users_table",
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: { ":userId": appointment.userId },
      }),
    );

    // Fetch dentist details
    const dentistData = await dynamoDBClient.send(
      new QueryCommand({
        TableName: "dental_clinic_dentist_list_table",
        KeyConditionExpression: "dentistId = :dentistId",
        ExpressionAttributeValues: { ":dentistId": appointment.dentistId },
      }),
    );

    const response = {
      appointmentDetails: appointment,
      userDetails: userData.Items,
      dentistDetails: dentistData.Items,
    };

    res.apiResponse({
      data: response,
      message: "Appointment details retrieved successfully",
      statusCode: 200,
    });
  } catch (error) {
    res.apiError({
      error: error.message,
      message: "Failed to retrieve appointment",
      statusCode: 500,
    });
  }
};

const updateAppointment = async (req, res) => {
  try {
    const { appointmentId, appointmentDate, dentistId, specialNotes } = req.body;

    // Fetch the existing appointment
    const currentAppointmentData = await dynamoDBClient.send(
      new QueryCommand({
        TableName: "dental_clinic_appointments_table",
        KeyConditionExpression: "appointmentId = :appointmentId",
        ExpressionAttributeValues: { ":appointmentId": appointmentId },
      }),
    );

    if (!currentAppointmentData.Items) {
      return res.apiError({
        error: "Appointment not found",
        message: "Appointment not found",
        statusCode: 404,
      });
    }

    const currentAppointment = currentAppointmentData.Items[0];

    // Check if the new slot is available
    const newSlotData = await dynamoDBClient.send(
      new GetCommand({
        TableName: "dental_clinic_slots_table",
        Key: {
          dentistId: dentistId,
          appointmentDate,
        },
      }),
    );

    if (newSlotData.Item || newSlotData.Item?.appointmentId) {
      return res.apiError({
        error: "New slot is not available",
        message: "New slot is not available",
        statusCode: 400,
      });
    }

    // Delete the previous slots
    await dynamoDBClient.send(
      new DeleteCommand({
        TableName: "dental_clinic_slots_table",
        Key: {
          dentistId: currentAppointment.dentistId,
          appointmentDate: currentAppointment.appointmentDate,
        },
      }),
    );

    // Create a new slot with the updated date
    await dynamoDBClient.send(
      new PutCommand({
        TableName: "dental_clinic_slots_table",
        Item: {
          dentistId: dentistId,
          appointmentDate,
          appointmentId: currentAppointment.appointmentId,
        },
      }),
    );

    // Update the appointment with the new date and time
    await dynamoDBClient.send(
      new UpdateCommand({
        TableName: "dental_clinic_appointments_table",
        Key: { appointmentId, userId: currentAppointment.userId },
        UpdateExpression: "set #appointmentDate = :appointmentDate, #specialNotes = :specialNotes, #dentistId = :dentistId",
        ExpressionAttributeValues: {
          ":appointmentDate": appointmentDate,
          ":specialNotes": specialNotes,
          ":dentistId": dentistId,
        },
        ExpressionAttributeNames: {
          "#appointmentDate": "appointmentDate",
          "#specialNotes": "specialNotes",
          "#dentistId": "dentistId",
        },
      }),
    );

    res.apiResponse({
      message: "Appointment successfully rescheduled",
      data: {
        appointmentId,
      },
      statusCode: 200,
    });
  } catch (error) {
    res.apiError({
      error: error.message,
      message: "Failed to reschedule appointment",
      statusCode: 500,
    });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const { userId, appointmentId, status } = req.body;

    // Fetch the existing appointment
    const currentAppointmentData = await dynamoDBClient.send(
      new QueryCommand({
        TableName: "dental_clinic_appointments_table",
        KeyConditionExpression: "appointmentId = :appointmentId",
        ExpressionAttributeValues: { ":appointmentId": appointmentId },
      }),
    );

    if (!currentAppointmentData.Items) {
      return res.apiError({
        error: "Appointment not found",
        message: "Appointment not found",
        statusCode: 404,
      });
    }

    // Delete the previous slots
    await dynamoDBClient.send(
      new DeleteCommand({
        TableName: "dental_clinic_slots_table",
        Key: {
          dentistId: currentAppointmentData.Items[0].dentistId,
          appointmentDate: currentAppointmentData.Items[0].appointmentDate,
        },
      }),
    );

    // Update appointment status
    await dynamoDBClient.send(
      new UpdateCommand({
        TableName: "dental_clinic_appointments_table",
        Key: { appointmentId, userId },
        UpdateExpression: "set #status = :status",
        ExpressionAttributeValues: {
          ":status": status,
        },
        ExpressionAttributeNames: {
          "#status": "status",
        },
      }),
    );

    res.apiResponse({
      message: "Appointment successfully cancelled",
      statusCode: 200,
    });
  } catch (error) {
    res.apiError({
      error: error.message,
      message: "Failed to cancel appointment",
      statusCode: 500,
    });
  }
};

const getAllAppointments = async (req, res) => {
  try {
    const { userId } = req.params;

    const allAppointments = await dynamoDBClient.send(
      new QueryCommand({
        TableName: "dental_clinic_appointments_table",
        IndexName: "userId-index",
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: { ":userId": userId },
      }),
    );

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

    const newData = allAppointments.Items.map((data) => {
      const matchingDentist = dentistInfo.Items.find((dentist) => dentist.dentistId === data.dentistId);

      if (matchingDentist) {
        return { ...data, dentistName: matchingDentist.name };
      } else {
        return data;
      }
    });
    // Assuming newData contains all combined appointment data
    const openAppointments = newData.filter((appointment) => appointment.status === "OPEN").sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));

    const otherAppointments = newData.filter((appointment) => appointment.status !== "OPEN").sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));

    const sortedAppointments = [...openAppointments, ...otherAppointments];

    res.apiResponse({
      data: sortedAppointments,
      message: "",
      statusCode: 200,
    });
  } catch (error) {
    res.apiError({
      error: error.message,
      message: "Failed to get all apointment",
      statusCode: 500,
    });
  }
};

module.exports = {
  createAppointment,
  getAppointment,
  updateAppointment,
  cancelAppointment,
  getAllAppointments,
};
