# Linear Regression Checker

## Submission Questions

### Do you have production experience with Node prior to submission?

A - yes, I have roughly 3 years experience building full stack applications with node in my previous role. I have plenty more experience using node and npm purely as a package manager.

### Do you have production experience with React prior to submission?

A - yes, React is one of my favourite frameworks to work with and it is one of my strongest languages. I have built plenty of React projects for my own personal portfolio, and in professional settings.

### Your name?

A - Cameron Brown

## Overview

Linear Regression Checker is a web application that allows users to visualize scatter plots and perform linear regression analysis on the data points. It provides a user-friendly interface for inputting data, drawing linear regression lines, and verifying user-submitted linear equations against the calculated line of best fit.

## Features

- Scatter Plot Visualization: Display scatter plots example data points.
- Linear Regression Analysis: Calculate and draw the line of best fit for the given data points.
- User Interaction: Allow users to input their linear equations and verify them against the calculated line of best fit.
- Statistics Tracking: Track user attempts and success rates for solving linear regression problems.

## Technologies Used

- Frontend: React.js, Chart.js
- Backend: Node.js, Express.js, PostgreSQL
- Database: PostgreSQL
- Testing: Jest, React Testing Library
- Styling: SCSS

## Setup Instructions

### Clone the repository:

```
git clone https://github.com/your-username/linear-regression-checker.git
```

### Navigate to the project directory:

```
cd linear-regression-checker
```

### Install dependencies:

```
# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### Set up the database:

1. Install PostgreSQL - https://www.postgresql.org/download/
2. Start PostgreSQL server, the initialization command depends on your computer's configuration

- Mac : `pg_ctl -D /usr/local/var/postgres start`
- Mac & Homebrew : `brew services start postgres`
- Linux : `/usr/local/pgsql/bin/pg_ctl -D /usr/local/pgsql/data start`
- Windows (administrator command prompt): `net start postgresql-x64-<version>`

3. Access the PostgreSQL shell
   `psql`

- If you have used PostgreSQL on your machine before, you may need to connect with
  `psql postgres`

4. Create Database
   `CREATE DATABASE studentsubmissions;`
5. Coonect to the database
   `\c studentsubmissions;`
6. Create tables

```
  CREATE TABLE students (
    student_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
  );

  CREATE TABLE coordinate_sets (
    set_id SERIAL PRIMARY KEY,
    student_id INT NOT NULL REFERENCES students(student_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    x1 NUMERIC(4,1) NOT NULL,
    y1 NUMERIC(4,1) NOT NULL,
    x2 NUMERIC(4,1) NOT NULL,
    y2 NUMERIC(4,1) NOT NULL,
    x3 NUMERIC(4,1) NOT NULL,
    y3 NUMERIC(4,1) NOT NULL,
    x4 NUMERIC(4,1) NOT NULL,
    y4 NUMERIC(4,1) NOT NULL,
    x5 NUMERIC(4,1) NOT NULL,
    y5 NUMERIC(4,1) NOT NULL
  );

  CREATE TABLE attempts (
    attempt_id SERIAL PRIMARY KEY,
    set_id INT NOT NULL REFERENCES coordinate_sets(set_id),
    slope NUMERIC(4,1) NOT NULL,
    intercept NUMERIC(4,1) NOT NULL,
    is_correct BOOLEAN,
    attempt_number INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
```

7. IMPORTANT configure /linear-regression-checker/backend/db.js

- You will need to alter the code to include your username and password (you may not have a password)
- If previous steps were done successfully, the host, database name and port should already be correct.

```
const USER_NAME = "" // your postgres username here
const HOST = "localhost"
const DATABASE_NAME = "studentsubmissions"
const PASSWORD = ""
const PORT = 5432
```

8. If you encounter any issues with local database setup PLEASE contact me directly cam.brown94@gmail.com

### Start the backend server:

```
cd backend && npm start
```

### Start the frontend server:

```
cd frontend && npm start
```

Vite should open a browser window automatically for you, likely open on https://localhost:5173

## Testing

Jest is used to test the primary use cases for the app. To run the test suite do the following:

```
cd backend && npm test
```

## Usage

Visit http://localhost:3000 in your web browser to access the application.
Input data points in the provided form fields.
Draw linear regression lines using the input form.
Verify user-submitted linear equations against the calculated line of best fit.
View statistics and success rates for solving linear regression problems.
