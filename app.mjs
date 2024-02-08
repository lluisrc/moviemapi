import mysql from 'mysql2/promise';
import { locationsConverter } from './utils/locationConverter.mjs';
//TODO: Remove when finished
import express from 'express';
import cors from 'cors';

const app = express();
const port = 3005;

const connection = await mysql.createConnection({
  host: '192.168.178.53',
  user: 'lroca',
  database: 'moviedev',
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
      `SELECT *
      FROM frames
      INNER JOIN files ON files.files_id = frames.frames_files_id
      INNER JOIN towns ON towns.towns_id = frames.frames_towns_id
      INNER JOIN regions ON regions.regions_id = frames.frames_regions_id
      INNER JOIN states ON states.states_id = frames.frames_states_id;`
    );

    // console.log(locationsConverter(results)); // results contains rows returned by server
    // console.log(fields); // fields contains extra meta data about results, if available
    res.send(locationsConverter(results));
    // res.send(results);
  } catch (err) {
    console.log(err);
  }
});

app.get('/saveds', async (req, res) => {
  // A simple SELECT query
  try {
    const [results, fields] = await connection.query(
      //Mostrar todas las localizaciones guardadas del usuario con id = 1 (usuario de test)
      // Falta seleccionar los campos de *
      `SELECT *
      FROM moviedev.saved 
      INNER JOIN users ON users.users_id = saved.saved_users_id
      INNER JOIN frames ON frames.frames_id = saved.saved_frames_id
      WHERE saved.saved_users_id = 1;`
    );
    // console.log(locationsConverter(results)); // results contains rows returned by server
    // console.log(fields); // fields contains extra meta data about results, if available
    // res.send(locationsConverter(results));
    res.send(results);
  } catch (err) {
    console.log(err);
  }
});

app.get('/getAllLists', async (req, res) => {
  // A simple SELECT query
  try {
    const [results, fields] = await connection.query(
      //Mostrar las listas de localizaciones del usuario con id = 1 (usuario test)
      // Falta seleccionar los campos de *
      `SELECT *
      FROM moviedev.locationslist 
      INNER JOIN users ON users.users_id = locationslist.locationslist_users_id
      WHERE locationslist.locationslist_users_id = 1;`
      //Aquí nos interesa información sobre algún frame incluido en las listas? por ejemplo si queremos enseñar un frame como portada o una localización en el titulo
    );
    // console.log(locationsConverter(results)); // results contains rows returned by server
    // console.log(fields); // fields contains extra meta data about results, if available
    // res.send(locationsConverter(results));
    res.send(results);
  } catch (err) {
    console.log(err);
  }
});


app.get('/getFramesFromList', async (req, res) => {
  // A simple SELECT query
  try {
    const [results, fields] = await connection.query(
      //Mostrar todos los frames de la lista 'Viaje Santander' del usuario con id = 1 (usuario test)
      // Falta seleccionar los campos de *
      `SELECT *
      FROM moviedev.locationslistxframes
      INNER JOIN locationslist ON locationslist.locationslist_id = locationslistxframes.locationslistxframes_locationslist_id
      INNER JOIN frames ON frames.frames_id = locationslistxframes.locationslistxframes_frames_id
      WHERE locationslist.locationslist_users_id = 1
      AND locationslist.locationslist_name = 'Viaje Santander';`
    );
    // console.log(locationsConverter(results)); // results contains rows returned by server
    // console.log(fields); // fields contains extra meta data about results, if available
    // res.send(locationsConverter(results));
    res.send(results);
  } catch (err) {
    console.log(err);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
