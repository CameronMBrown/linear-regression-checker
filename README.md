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
bash
git clone https://github.com/your-username/linear-regression-checker.git
```

### Navigate to the project directory:

```
bash
cd linear-regression-checker
```

### Install dependencies:

```
bash
# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### Set up the database:

### Start the backend server:

```
bash
cd backend && npm start
```

### Start the frontend server:

```
bash
cd frontend && npm start
```

## Testing

Jest is used to test the primary use cases for the app. To run the test suite do the following:

```
bash
cd backend && npm test
```

## Usage

Visit http://localhost:3000 in your web browser to access the application.
Input data points in the provided form fields.
Draw linear regression lines using the input form.
Verify user-submitted linear equations against the calculated line of best fit.
View statistics and success rates for solving linear regression problems.
