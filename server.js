const express        = require('express');
const MongoClient    = require('mongodb').MongoClient;
const bodyParser     = require('body-parser');
const app            = express();
const url = "mongodb://localhost:27017/mapdb";
const port = 8000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

MongoClient.connect(url, function(err, db) {
    if (err) return console.log(err);
    require('./app/routes')(app, db);
    app.listen(port, () => {
        console.log('Listening ' + port);
    });
});

