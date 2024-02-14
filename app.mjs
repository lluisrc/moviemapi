import mysql from 'mysql2/promise';
import { locationsConverter } from './utils/locationConverter.mjs';
import { routesConverter} from './utils/routeConverter.mjs';
import express from 'express';
import cors from 'cors';


const app = express();
const port = 3005;

const connection = await mysql.createConnection({
  host: 'moviemapp.tv',
  user: 'lroca',
  database: 'moviemapp',
  password: '',
});

// Middleware to parse JSON requests
app.use(express.json());
app.use(cors());

// Sample route with a dynamic parameter
app.get('/getLocations', async (req, res) => {
  // A simple SELECT query
  try {
    const [results, fields] = await connection.query(
      `SELECT *
      FROM frames
      INNER JOIN files ON files.files_id = frames.frames_files_id
      INNER JOIN countries ON countries.countries_id = frames.frames_countries_id
      INNER JOIN states ON states.states_id = frames.frames_states_id
      INNER JOIN regions ON regions.regions_id = frames.frames_regions_id
      INNER JOIN towns ON towns.towns_id = frames.frames_towns_id
      INNER JOIN sponsors1 ON sponsors1.sponsors1_id = frames.frames_sponsors1_id
      INNER JOIN sponsors2 ON sponsors2.sponsors2_id = frames.frames_sponsors2_id
      INNER JOIN sponsors3 ON sponsors3.sponsors3_id = frames.frames_sponsors3_id
      ;`
    );
    res.send(locationsConverter(results));

  } catch (err) {
    console.log(err);
  }
});

app.get('/getSavedLocations', async (req, res) => {
  try {
    const { userId } = req.query;
    
    const [results, fields] = await connection.query(
      `SELECT *
      FROM saved
      INNER JOIN users ON users.users_id = saved.saved_users_id
      INNER JOIN frames ON frames.frames_id = saved.saved_frames_id
      INNER JOIN files ON files.files_id = frames.frames_files_id
      INNER JOIN countries ON countries.countries_id = frames.frames_countries_id
      INNER JOIN towns ON towns.towns_id = frames.frames_towns_id
      INNER JOIN regions ON regions.regions_id = frames.frames_regions_id
      INNER JOIN states ON states.states_id = frames.frames_states_id
      INNER JOIN sponsors1 ON sponsors1.sponsors1_id = frames.frames_sponsors1_id
      INNER JOIN sponsors2 ON sponsors2.sponsors2_id = frames.frames_sponsors2_id
      INNER JOIN sponsors3 ON sponsors3.sponsors3_id = frames.frames_sponsors3_id
      WHERE saved.saved_users_id = ${userId};`
    );
    res.send(locationsConverter(results));

  } catch (err) {
    console.log(err);
  }
});

app.get('/getRoutes', async (req, res) => {
  // A simple SELECT query
  try {
    const { userId } = req.query;
    
    const [results, fields] = await connection.query(
      //Mostrar las listas de localizaciones del usuario con id = 1 (usuario test)
      // Falta seleccionar los campos de *
      `SELECT * ,
      (SELECT COUNT(*)
       FROM locationslistxframes
       INNER JOIN locationslist ON locationslist.locationslist_id = locationslistxframes.locationslistxframes_locationslist_id
       WHERE locationslist.locationslist_name = l.locationslist_name
         AND locationslist.locationslist_users_id = 1) AS total_locations
      FROM locationslist l
      WHERE locationslist_users_id = ${userId};`
      //Aquí nos interesa información sobre algún frame incluido en las listas? por ejemplo si queremos enseñar un frame como portada o una localización en el titulo
    );

    res.send(routesConverter(results));

  } catch (err) {
    console.log(err);
  }
});

app.get('/getRouteLocations', async (req, res) => {
  // A simple SELECT query
  try {
    const { routeId, userId } = req.query;

    const [results, fields] = await connection.query(
      //Mostrar todos los frames de la lista 'Viaje Santander' del usuario con id = 1 (usuario test)
      // Falta seleccionar los campos de *
      `SELECT *
      FROM locationslistxframes
      INNER JOIN locationslist ON locationslist.locationslist_id = locationslistxframes.locationslistxframes_locationslist_id
      INNER JOIN frames ON frames.frames_id = locationslistxframes.locationslistxframes_frames_id
      INNER JOIN files ON files.files_id = frames.frames_files_id
      INNER JOIN countries ON countries.countries_id = frames.frames_countries_id
      INNER JOIN towns ON towns.towns_id = frames.frames_towns_id
      INNER JOIN regions ON regions.regions_id = frames.frames_regions_id
      INNER JOIN states ON states.states_id = frames.frames_states_id
      INNER JOIN sponsors1 ON sponsors1.sponsors1_id = frames.frames_sponsors1_id
      INNER JOIN sponsors2 ON sponsors2.sponsors2_id = frames.frames_sponsors2_id
      INNER JOIN sponsors3 ON sponsors3.sponsors3_id = frames.frames_sponsors3_id
      WHERE locationslist.locationslist_users_id = ${userId}
      AND locationslist.locationslist_id = ${routeId};`
    );

    res.send(locationsConverter(results));

  } catch (err) {
    console.log(err);
  }
});

app.get('/isLocationSaved', async (req, res) => {
  const { locationId, userId } = req.query;
  // A simple SELECT query
  try {
    const [results, fields] = await connection.query(
      //Mostrar si una localización se encuentra guardada por el usuario
      // Falta seleccionar los campos de *
      `SELECT * FROM saved WHERE saved_frames_id = ${locationId} AND saved_users_id = ${userId};`
      );
      let response = {"isLocationSaved":false}
      if(results[0]){
        response.isLocationSaved = true
      }
      res.json(response);

  } catch (err) {
    console.log(err);
  }
});


app.post('/saveLocation', async (req, res) => {
  try {
    const { locationId, userId } = req.body;
    const [results, fields] = await connection.query(
      `INSERT INTO saved (saved_users_id, saved_frames_id) VALUES (${userId}, ${locationId});`
    );
    res.send(results);
  } catch (err) {
    console.log(err);
  }
});

app.delete('/deleteLocation', async (req, res) => {
  try {
    const { locationId, userId } = req.body;
    const [results, fields] = await connection.query(
      `DELETE FROM saved WHERE saved_users_id = ${userId} AND saved_frames_id = ${locationId};`
    );
    res.send(results);

  } catch (err) {
    console.log(err);
  }
});

app.post('/createRoute', async (req, res) => {
  try {
    const { routeTitle, userId } = req.body;
    const [results, fields] = await connection.query(
      `INSERT INTO locationslist (locationslist_name, locationslist_users_id) VALUES ('${routeTitle}', ${userId});`
    );
    res.send(results);
  } catch (err) {
    console.log(err);
  }
});

app.delete('/deleteRoute', async (req, res) => {
  try {
    const { routeId, userId } = req.body;
    const [results, fields] = await connection.query(
      `DELETE FROM locationslist WHERE locationslist_users_id = ${userId} AND locationslist_id = ${routeId};`
    );
    res.send(results);
  } catch (err) {
    console.log(err);
  }
});


app.post('/addLocationToRoute', async (req, res) => {
  try {
    const { routeId, locationId } = req.body;
    const [results, fields] = await connection.query(
      `INSERT INTO locationslistxframes (locationslistxframes_locationslist_id, locationslistxframes_frames_id) VALUES (${routeId}, ${locationId});`
    );
    res.send(results);
  } catch (err) {
    console.log(err);
  }
});


app.delete('/removeLocationFromRoute', async (req, res) => {
  try {
    const { routeId, locationId } = req.body;
    const [results, fields] = await connection.query(
      `DELETE FROM locationslistxframes WHERE locationslistxframes_locationslist_id = ${routeId} AND locationslistxframes_frames_id = ${locationId};`
    );
    res.send(results);
  } catch (err) {
    console.log(err);
  }
});

app.post('/createInitializedRoute', async (req, res) => {
  try {
    const { routeTitle, locationId, userId } = req.body;
    const [results, fields] = await connection.query(
      `INSERT INTO locationslist (locationslist_name, locationslist_users_id) VALUES ('${routeTitle}', ${userId});`
    );
    const [results1, fields1] = await connection.query(
      `INSERT INTO locationslistxframes (locationslistxframes_locationslist_id, locationslistxframes_frames_id) VALUES (LAST_INSERT_ID(), ${locationId});`
    );
    res.send(results);
  } catch (err) {
    console.log(err);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});