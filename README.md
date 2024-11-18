# SmartCar API Adapter

## Introduction

This is a take-home project for SouthernCode. The primary goal is to create an API that adapts the poorly structured Generic Motors (GM) API into a cleaner, more consistent format following the SmartCar API specification. The API serves as an intermediary, handling requests and responses to transform them into a standardized, user-friendly format.

The project uses **TypeScript**, **Node.js**, **Express**, and is containerized using **Docker** and **Docker Compose**. Unit tests are implemented with **Jest** to ensure code quality and correctness.

## Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** (>= 20.x)
- **Docker** and **Docker Compose**
- **npm** (Node Package Manager)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/GiulianaEOlmos/SmartCar-API-Adapter.git
cd smartcar-api-adapter
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Install Dependencies

#### Running in Development

```bash
npm run dev
```

#### Running with Docker Compose

```bash
docker compose build
docker compose up
```

#### To stop the Docker containers:

```bash
docker compose down
```

## Running Tests

To run the Jest test suite:

```bash
npm run test
```

## API Endpoints

### Base URL

Replace `{{BaseURL}}` with the local or deployed server URL:

- **Development**: `http://localhost:3000`

### Endpoints

| Endpoint                       | Method | Description                          |
| ------------------------------ | ------ | ------------------------------------ |
| `/api/v1/vehicles/:id`         | GET    | Retrieve vehicle information         |
| `/api/v1/vehicles/:id/doors`   | GET    | Retrieve security (door lock) status |
| `/api/v1/vehicles/:id/fuel`    | GET    | Retrieve fuel range                  |
| `/api/v1/vehicles/:id/battery` | GET    | Retrieve battery range               |
| `/api/v1/vehicles/:id/engine`  | POST   | Start or stop the engine             |

### Postman Collection

For your convenience, a Postman collection file is provided: **SmartCar Souther Code.postman_collection.json**. You can import it into Postman to test all endpoints with pre-configured requests.

## Environment Variables

This project uses environment variables for configuration. The `.env` file includes:

- `GM_API_URL`: Base URL for the GM API.

> **Note**: For the purpose of this take-home project, the `GM_API_URL` is also hardcoded into the code to make it easier to run.

## License

This project is provided as a part of a take-home assignment for SouthernCode. Usage of this code is restricted to assessment purposes.
