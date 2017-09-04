module.exports = function (app, db) {
    app.use(function (req, res, next) {
        // Request headers you wish to allow
        res.header("Access-Control-Allow-Origin", "http://localhost:4200");
        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        // Request headers you wish to allow
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader('Access-Control-Allow-Credentials', true);
        next();
    });

    app.get('/users/:email/:password', (req, res) => {
        const email = req.params.email;
        const password = req.params.password;

        const details = {'email': email};
        db.collection('users').findOne(details, (err, item) => {
            if (err) {
                res.send({'error': 'An error has occurred'});
            } else {
                if (item) {
                    if (password == item.password) {
                        res.send(item);
                    } else {
                        res.send("666");//wrong password
                    }
                } else {
                    res.send("555");//wrong email
                }
            }
        });
    });

    app.get('/users', (req, res) => {
        db.collection('users').find().toArray(function (err, item) {
            res.send(item);
        });
    });

    app.post('/users', (req, res) => {
        const note = {email: req.body.email, password: req.body.password, userId: req.body.userId};
        const emailForSearch = {'email': req.body.email};
        db.collection('users').findOne(emailForSearch, (err, item) => {
            if (err) {
                res.send({'error': 'An error has occurred'});
            } else {
                if (item) {
                    res.send("777");//email is in database already
                } else {
                    db.collection('users').insert(note, (err, result) => {
                        if (err) {
                            res.send({'error': 'An error has occurred'});
                        } else {
                            res.send(result.ops[0]);
                        }
                    });
                }
            }
        });
    });

    app.post('/points', (req, res) => {
        let date = new Date();
        const note = {
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            object: req.body.object,
            description: req.body.description,
            userId: req.body.userId,
            timestamp: date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear() + "(" + date.getHours() + ":" + date.getMinutes() + ")"
        };
        db.collection('points').insert(note, (err, result) => {
            if (err) {
                res.send({'error': 'An error has occurred'});
            } else {
                res.send(result.ops[0]);
            }
        });
    });

    app.get('/points/:latitude/:longitude', (req, res) => {
        const latitude = +req.params.latitude;
        const longitude = +req.params.longitude;

        const details = {'latitude': latitude, 'longitude': longitude};
        db.collection('points').findOne(details, (err, item) => {
            if (err) {
                res.send({'error': 'An error has occurred'});
            } else {

                if (item) {
                    res.send(item);
                } else {
                    res.send("888");//no the point
                }
            }
        });
    });

    app.get('/points/:object', (req, res) => {
        const object = req.params.object;

        const details = {'object': object};
        db.collection('points').find(details).toArray((err, item) => {
            if (err) {
                res.send({'error': 'An error has occurred'});
            } else {
                if (item) {
                    res.send(item);
                } else {
                    res.send("888");//no the points
                }
            }
        });
    });

};