# Face Detective Backend

This is the backend repository for the Face Detective project. This repository contains a Node.js server with endpoints for user registration, authentication, and more.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Setting Up a PostgreSQL Database](#setting-up-a-postgresql-database)
- [Environment Variables](#environment-variables)
- [Running the Server](#running-the-server)
- [Modifying the Code](#modifying-the-code)
- [Submitting Issues and Pull Requests](#submitting-issues-and-pull-requests)

## Prerequisites

- Node.js (>=14.0.0)
- npm (>=6.0.0)
- PostgreSQL (>=12.0.0)

## Installation

Clone the repository:

```bash
git clone https://github.com/ritabradley/face-detective-backend.git
cd face-detective-backend
```

Install the dependencies:

```bash
npm install
``` 
or
```bash
npm i
```

## Setting Up a PostgreSQL Database

1. Install PostgreSQL on your machine if you haven't already. You can follow the official [PostgreSQL installation guide](https://www.postgresql.org/download/).

2. Create a new PostgreSQL database and user:

```bash
createdb face_detective
createuser -P -s -e face_detective_user
```

3. Set up the necessary tables by running the following SQL commands in the `psql` command-line interface:

```sql
CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE NOT NULL,
  entries INTEGER DEFAULT 0,
  joined TIMESTAMP NOT NULL
);

CREATE TABLE logins (
  login_id SERIAL PRIMARY KEY,
  email VARCHAR(100) UNIQUE NOT NULL,
  hash VARCHAR(100) NOT NULL
);
```

## Environment Variables

Create a `.env` file in the project root directory with the following variables:

```
DB_URL=your_database_url
DB_HOST=localhost
DB_PORT=5432
DB_USER=face_detective_user
DB_PASSWORD=your_database_password
```

Replace `your_database_url` and `your_database_password` with the appropriate values for your PostgreSQL setup.

## Running the Server

To start the development server, run:

```bash
npm start
```

## Modifying the Code

Feel free to modify the code to suit your needs. If you want to change the database connection details, you can update the `knex` configuration in `server.js`.

## Submitting Issues and Pull Requests

1. For issues, open a new issue on the [GitHub repository](https://github.com/ritabradley```/face-detective-backend/issues) and provide a detailed description of the problem.
2. For pull requests, create a new branch, make your changes, and submit a pull request. Please provide a clear description of the changes you've made. 
