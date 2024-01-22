# My Express.js Backend Service on AWS EKS

Welcome to the README for our Express.js backend service, which is deployed on Amazon Elastic Kubernetes Service (EKS). This service powers the backend of our application, providing APIs and server-side functionality.

## Table of Contents

- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
- [Deployment](#deployment)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Architecture](#architecture)
- [Documentation and Walkthrough](#documentation-and-walkthrough)

## Getting Started

These instructions will guide you through setting up and running the backend service locally for development and testing purposes.

### Prerequisites

Before you begin, make sure you have the following software/tools installed:

- Node.js: You can download it from [nodejs.org](https://nodejs.org/).
- Docker: For creating containerized applications (optional but recommended for local testing).
- Kubernetes (kubectl): For interacting with your AWS EKS cluster.
- AWS CLI: You'll need the AWS Command Line Interface to manage AWS resources and interact with your AWS EKS cluster.

   - You can install the AWS CLI by following the instructions at [AWS CLI Installation Guide](https://aws.amazon.com/cli/).

   - Configure the AWS CLI with your AWS credentials using `aws configure` to enable access to your AWS resources.

### Deployment

To deploy this Express.js backend service on AWS EKS, follow these steps:

1. **Set Up AWS EKS Cluster:**
   - Set up your Amazon EKS cluster using AWS services and configure it according to your requirements.

2. **Containerization (Docker):**
   - Ensure your Express.js application is containerized using Docker.

3. **AWS ECR Repository:**
   - Create a repository in Amazon Elastic Container Registry (ECR) where you will store your Docker container images.

   - Use the AWS CLI or the AWS Management Console to create the ECR repository.

4. **Push Docker Image to ECR:**
   - Build your Docker container image and push it to the ECR repository you created in the previous step.

5. **Kubernetes Deployment:**
   - Create Kubernetes deployment and service YAML files to deploy your Docker container on AWS EKS.

6. **EKS Deployment:**
   - Use `kubectl` or AWS CLI to apply the deployment YAML to your EKS cluster.

### Usage

To run the Express.js backend service locally for development, follow these steps:

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/4sya/dental-office-online-scheduling-system-be.git

2. Navigate to the project directory:

   ```bash
   cd your-express-backend

3. Install the project dependencies:

   ```bash
   npm install

4. Start the server:

   ```bash
   npm run watch:dev

## API Documentation

### Create Appointment

This API endpoint allows users to create a new appointment.

- **Endpoint**: `/api/appointments`
- **HTTP Method**: POST

#### Request Body

The request body should be a JSON object containing the following fields:

- `userId` (string, required): The ID of the user creating the appointment.
- `appointmentDate` (string, required): The date of the appointment.
- `serviceType` (string, required): The type of service for the appointment.
- `dentistId` (string, required): The ID of the dentist associated with the appointment.
- `status` (string): The status of the appointment.
- `specialNotes` (string): Special notes or instructions for the appointment (optional).

#### Request Example

```json
{
  "userId": "8c4961fe-7577-49a4-a2c1-56c356f3fbb9",
  "appointmentDate": "2024-01-30",
  "serviceType": "Tooth extraction",
  "dentistId": "e388083a-1063-4b53-8561-b93ac572d1fd",
  "status": "Open",
  "specialNotes": "Patient has a history of allergies."
}
```
### Get Appointment

This API endpoint allows users to retrieve appointment information by specifying the appointment ID as a URL parameter.

- **Endpoint**: `/api/appointment/:appointmentId`
- **HTTP Method**: GET

#### URL Parameter

- `appointmentId` (string, required): The ID of the appointment you want to retrieve.

#### Request Example

```http
GET /api/appointments/8c4961fe-7577-49a4-a2c1-56c356f3fbb9
```
### Update Appointment

This API endpoint allows users to update their existing appointments.

- **Endpoint**: `/api/appointment`
- **HTTP Method**: PUT

#### Request Body

The request body should be a JSON object containing the following fields:

- `appointmentId` (string, required): The appointment ID of the user rebooking the appointment.
- `appointmentDate` (string, required): The date of the appointment.
- `dentistId` (string, required): The ID of the dentist associated with the appointment.
- `status` (string): The status of the appointment.
- `specialNotes` (string): Special notes or instructions for the appointment (optional).

#### Request Example

```json
{
  "appointmentId": "8c4961fe-7577-49a4-a2c1-56c356f3fbb9",
  "appointmentDate": "2024-01-30",
  "dentistId": "e388083a-1063-4b53-8561-b93ac572d1fd",
  "specialNotes": "Patient has a history of allergies."
}
```

### Cancel Appointment

This API endpoint allows users to cancel their appointments.

- **Endpoint**: `/api/appointment/cancel`
- **HTTP Method**: PUT

#### Request Body

The request body should be a JSON object containing the following fields:

- `userId` (string, required): The ID of the user creating the appointment.
- `appointmentId` (string, required): The appointment ID of the user rebooking the appointment.
- `status` (string): The status of the appointment.

#### Request Example

```json
{
  "userId": "8c4961fe-7577-49a4-a2c1-56c356f3fbb9",
  "appointmentId": "8c4961fe-7577-49a4-a2c1-56c356f3fbb9",
  "status": "Cancelled",
}
```

### Get All Appointments

This API endpoint allows users to get all their appointments.

- **Endpoint**: `/api/appointment/:appointmentId`
- **Endpoint**: `/api/appointment/user/:userId`

#### URL Parameter

- `userId` (string, required): The ID of the user creating the appointment.

#### Request Example

```http
GET /api/appointments/user/8c4961fe-7577-49a4-a2c1-56c356f3fbb9
```

### User Registration

This API endpoint allows users to register a new account.

- **Endpoint**: `/api/auth/register`
- **HTTP Method**: POST

#### Request Body

The request body should be a JSON object containing the following fields:

- `userName` (string, required): The desired username for the new account.
- `password` (string, required): The password for the new account.
- `firstName` (string, required): The first name of the user.
- `lastName` (string, required): The last name of the user.
- `email` (string, required): The email address of the user.
- `phoneNumber` (string, required): The phone number of the user.

#### Request Example

```json
{
  "userName": "john_doe",
  "password": "SecureP@ssw0rd",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phoneNumber": "123-456-7890"
}
```

### User Login

This API endpoint allows users to login their account.

- **Endpoint**: `/api/auth/login`
- **HTTP Method**: POST

#### Request Body

The request body should be a JSON object containing the following fields:

- `userName` (string, required): The desired username for the new account.
- `password` (string, required): The password for the new account.

#### Request Example

```json
{
  "userName": "john_doe",
  "password": "SecureP@ssw0rd",
}
```

### Authenticate user

This API endpoint allows users to login their account.

- **Endpoint**: `/api/auth/:token`
- **HTTP Method**: GET

#### URL Parameter

- `token` (string, required): The token from the user.

#### Request Example

```http
GET /api/auth/8c4961fe-7577-49a4-a2c1-56c356f3fbb9
```

### Get All Dentist

This API endpoint returns all the dentists.

- **Endpoint**: `/api/dentist`
- **HTTP Method**: GET

#### Request Body

#### Request Example

### Get User Details

This API endpoint returns user details.

- **Endpoint**: `/api/user/:userId`
- **HTTP Method**: GET

#### URL Parameter

- `userId` (string, required): The ID of the user creating the appointment.

#### Request Example

```http
GET /api/user/8c4961fe-7577-49a4-a2c1-56c356f3fbb9
```

### Get List of Available Slots

This API endpoint returns all the booked slots for a specific dentist.

- **Endpoint**: `/api/slots/:dentistId`
- **HTTP Method**: GET

#### URL Parameter

- `dentistId` (string, required): The ID of the dentist.

#### Request Example

```http
GET /api/slots/8c4961fe-7577-49a4-a2c1-56c356f3fbb9
```

### Architecture

## Core Components

### Express.js Backend

- **Functionality**: Handles business logic, API endpoints, and server-side operations.
- **Deployment**: Packaged in Docker containers for consistency across environments.

### Docker

- **Role**: Encapsulates the application in a container, ensuring consistency across different development and production environments.
- **Integration**: Works with AWS EKS and ECR for seamless deployment and scaling.

### AWS Elastic Kubernetes Service (EKS)

- **Purpose**: Manages the deployment, scaling, and operations of Docker containers.
- **Benefits**: Offers high availability, scalability, and robust management of containerized applications.

### AWS Elastic Container Registry (ECR)

- **Function**: Stores our Docker container images securely.
- **Integration**: Seamlessly works with AWS EKS for container orchestration.

### DynamoDB Tables

#### 1. `dental_clinic_appointments_table`
- **Purpose**: Stores all the appointment details.
- **Attributes**:
  - `appointmentId` (String): Unique identifier for each appointment.
  - `userId` (String): Identifier for the user who made the appointment.
  - `appointmentDate` (String): Date of the appointment.
  - `dentistId` (String): Identifier for the dentist assigned to the appointment.
  - `serviceType` (String): Type of dental service requested.
  - `specialNotes` (String): Any special notes or instructions related to the appointment.
  - `status` (String): Current status of the appointment (e.g., scheduled, cancelled).
- **Keys**:
  - Partition Key: `appointmentId`
  - Sort Key: `userId`
  - Global Secondary Index: `userId-index` for efficient querying by user ID.

#### 2. `dental_clinic_dentist_list_table`
- **Purpose**: Stores information about each dentist.
- **Attributes**:
  - `dentistId` (String): Unique identifier for each dentist.
  - `name` (String): Name of the dentist.
- **Keys**:
  - Partition Key: `dentistId`
  - Sort Key: `name`

#### 3. `dental_clinic_slots_table`
- **Purpose**: Keeps track of all booked slots for appointments.
- **Attributes**:
  - `dentistId` (String): Identifier for the dentist.
  - `appointmentDate` (String): Date of the booked slot.
  - `appointmentId` (String): Associated appointment ID for the slot.
- **Keys**:
  - Partition Key: `dentistId`
  - Sort Key: `appointmentDate`

#### 4. `dental_clinic_users_table`
- **Purpose**: Manages user account information.
- **Attributes**:
  - `userName` (String): Username for account login.
  - `email` (String): Email address of the user.
  - `firstName` (String): First name of the user.
  - `lastName` (String): Last name of the user.
  - `password` (String): Hashed password for account security.
  - `phoneNumber` (String): Contact phone number.
  - `userId` (String): Unique identifier for the user.
- **Keys**:
  - Partition Key: `userName`
  - Global Secondary Index: `userId-index` for efficient user ID querying.

## Documentation and Walkthrough

For a more detailed look at the project, including documentation and a 5-minute walkthrough video, please visit the following Google Drive link:

[Google Drive Documentation and Video](https://drive.google.com/drive/folders/1aMoTSZP7cTKxK-n0wSWJUrGI1r8cdKmf?usp=sharing)

Please ensure that you have appropriate access rights to view the contents of the link.