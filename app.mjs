import mysql from 'mysql2/promise';

import express from 'express';
const app = express();
const port = 3000;

const connection = await mysql.createConnection({
  host: '192.168.178.53',
  user: 'lroca',
  database: 'mydb',
  password: 'lroca',
});

// Middleware to parse JSON requests
app.use(express.json());


// Sample route with a dynamic parameter
app.get('/foodata', async (req, res) => {
  // A simple SELECT query
  try {
    const [results, fields] = await connection.query(
      `SELECT 
      frames.latitud, 
      frames.longitud, 
      frames.place, 
      frames.frame1, 
      frames.frame2, 
      frames.frame3, 
      frames.frame4, 
      frames.frame5, 
      files.title, 
      files.director, 
      files.start, 
      files.company, 
      towns.town

      FROM frames
      INNER JOIN files ON files.id = frames.files_id
      INNER JOIN towns ON towns.id = frames.towns_id;`
    );
  
    console.log(results); // results contains rows returned by server
    //console.log(fields); // fields contains extra meta data about results, if available
    res.send(results);
  } catch (err) {
    console.log(err);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});