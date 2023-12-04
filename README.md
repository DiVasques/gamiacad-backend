# GamiAcad API

### Author: Diogo Vasques

This is a REST API built with TypeScript and Express for an Academic Gamification application. The API serves as the backend to manage gamified educational experiences.

## Introduction

The Academic Gamification API facilitates the management of gamified elements within an educational context. It allows for the creation, tracking, and management of various gamification features to enhance the learning experience.

## Prerequisites

- Node.js 18
- Running MongoDB database

## Installing Dependencies (using Yarn)

To install the project dependencies using Yarn, run the following command:

```yarn install```

## Configuration Steps

Before running the application, make sure to set up the required environment variables:

- DEBUG: Set to true to enable debug mode.
- SERVER_PORT: Specify the port number for the server.
- MONGO_CONNECTION_STRING: MongoDB connection string.
- ACCESS_TOKEN_SECRET: Secret key for generating access tokens.
- REFRESH_TOKEN_SECRET: Secret key for generating refresh tokens.
- CLIENT_ID: Client ID for authentication purposes.

Create a .env file at the root of the project and add these variables:

```properties
DEBUG=true
SERVER_PORT=3000
MONGO_CONNECTION_STRING=mongodb://localhost:27017/gamiacad
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
CLIENT_ID=your_client_id
```

## Running the API

### In Development

Attach the `yarn dev` command to your debugger in order to have hot reloading.

### In Production

Build the application with `yarn build`.

Start the server using `yarn start`.

## Husky Hooks, ESLint, and Commitlint

This project utilizes Husky hooks along with ESLint for code linting and Commitlint for enforcing conventional commit messages. Ensure your commits follow the specified format and linting rules.
