const { Pool } = require("pg")
const prompt = require("prompt-sync")()
const fs = require("fs")
const path = require("path")

const createDatabaseAndTables = async () => {
  // Prompt the user for their database username and password
  const username = prompt("Enter your database username: ")
  const password = prompt("Enter your database password: ", { echo: "*" })

  const dbName = "studentsubmissions"

  // Write the credentials to a .env file
  const envPath = path.join(__dirname, ".env")
  fs.writeFileSync(
    envPath,
    `DB_USERNAME=${username}\nDB_PASSWORD=${password}\nDB_NAME=${dbName}\n`
  )
  console.log(".env file created successfully.")

  const poolSystem = new Pool({
    user: username,
    host: "localhost",
    database: "postgres",
    password: password,
    port: 5432,
  })

  try {
    // Connect to the default 'postgres' database to create a new database
    await poolSystem.query(`CREATE DATABASE ${dbName};`)
    console.log(`Database ${dbName} created successfully.`)

    // Connect to the new database to create tables
    const poolNewDB = new Pool({
      user: username,
      host: "localhost",
      database: dbName,
      password: password,
      port: 5432,
    })

    // Add your table creation queries here
    const createTablesQuery = `
      CREATE TABLE IF NOT EXISTS students (
        student_id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL
      );
    
      CREATE TABLE IF NOT EXISTS coordinate_sets (
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
    
      CREATE TABLE IF NOT EXISTS attempts (
        attempt_id SERIAL PRIMARY KEY,
        set_id INT NOT NULL REFERENCES coordinate_sets(set_id),
        slope NUMERIC(4,1) NOT NULL,
        intercept NUMERIC(4,1) NOT NULL,
        is_correct BOOLEAN,
        attempt_number INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `

    await poolNewDB.query(createTablesQuery)
    console.log("Tables created successfully.")

    await poolSystem.end()
    await poolNewDB.end()
  } catch (err) {
    console.error("Error creating database or tables:", err)
    process.exit(1)
  }
}

createDatabaseAndTables()
