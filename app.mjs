import mysql from 'mysql2/promise';
import { locationsConverter } from './utils/locationConverter.mjs';
//TODO: Remove when finished
import express from 'express';
import cors from 'cors';

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
app.use(cors());

// Sample route with a dynamic parameter
app.get('/locations', async (req, res) => {
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
      files.finish, 
      files.company, 
      towns.town,
      regions.region, 
      states.state

      FROM frames
      INNER JOIN files ON files.id = frames.files_id
      INNER JOIN towns ON towns.id = frames.towns_id
      INNER JOIN regions ON regions.id = frames.regions_id
      INNER JOIN states ON states.id = frames.states_id;`
    );

    console.log(locationsConverter(results)); // results contains rows returned by server
    //console.log(fields); // fields contains extra meta data about results, if available
    res.send(locationsConverter(results));
  } catch (err) {
    console.log(err);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
