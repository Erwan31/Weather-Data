const fetch = require('node-fetch');

// Include express server
const express = require('express');
const app = express();

// Include file system
const fs = require('fs');

// Include NeDB database
const Datastore = require('nedb');

require('dotenv').config();

const api_key = process.env.API_KEY;


let record = [];

// Create database file
const database = new Datastore('database.db');
database.loadDatabase();

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`listening at ${port}`));
app.use(express.static('public'));
app.use(express.json({ limit: '1mb'}));

app.post('/api', (request, response) => {
    console.log('I have a request ');
    const data = request.body;

    /*
    // Store data locally
    const datafile = [data.lat, data.lon, data.veggie];
    // Save into a file with timestamp
    const currentDate = new Date();
    const date = currentDate.getDate();
    const stringFile = "";
    */
 
    /*
    // Keep the position
    record.push( stringFile.concat(Date.now(),",", datafile, "\r\n") ); 
 
   // See the recorded values inside the server console
    console.log('record', record);

    // File sytem saving
    fs.appendFile("/test.txt", record, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    }); 
    */
    
    const timestamp = Date.now();
    data.timestamp = timestamp;
    database.insert(data);
    // Display an answer onto the client
    response.json(data);
}); 

// 2.5
app.get('/api', (request, response) => {
    database.find({}, (err, data) => {
        if(err){
            response.end();
            return;
        }
        response.json(data);
    });
})

app.get('/weather/:lat/:lon', async (request, response) => {

    console.log('api key ', api_key);
    const lat = request.params.lat;
    const lon = request.params.lon;
    console.log(lat, lon);
    const weather_url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`
    const weather_response = await fetch(weather_url);
    const w_json = await weather_response.json();
   // response.json(w_json);

    const aq_url = `https://api.openaq.org/v1/latest?coordinates=${lat},${lon}`
    const aq_response = await fetch(aq_url);
    const aq_json = await aq_response.json();

    const json = {
        weather: w_json,
        air_quality: aq_json,
    };

    response.json(json);
    
});
