// src/config/dbConfig.js
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");

const { REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = process.env; // e.g., 'us-west-2'

// Setting up DynamoDB Client
const ddbClient = new DynamoDBClient({
  region: REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

// DynamoDB Document Client for higher-level operations
const dynamoDBClient = DynamoDBDocumentClient.from(ddbClient);

module.exports = dynamoDBClient;
