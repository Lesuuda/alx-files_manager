/* eslint-disable */

const express = require('express');
const routes = require('./routes/index');

const app = express();
const PORT = process.env.PORT || 5000;


//middleware to parse JSON bodies
app.use(express.json());
//use routes from routes/index.js
app.use('/', routes);

//start the server

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
