var path = require('path');
var webpack = require('webpack');
var express = require('express');
var cors = require('cors');
var config = require('./webpack.config');
var bodyParser = require('body-parser');
var request = require('request-promise');
var uuid = require('uuid');

var compiler = webpack(config);
var app = express();

app.use(cors());
app.use(bodyParser.json());

app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
}));
app.use(require('webpack-hot-middleware')(compiler));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});
app.use(express.static('res'));

app.post('/analytics', function (req, res) {
    try {
        console.dir(req.body);
        const requestInfo = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "App-Secret": req.body.appSecret,
                "Install-ID": req.body.installId,
                "LogCount": req.body.logCount,
                "X-Correlation-ID": uuid.v1()
            },
            body: req.body.analyticsData
        };
        request('https://in.appcenter.ms/logs?Api-version=1.0.0', requestInfo)
            .then((value) => {
                res.sendStatus(200);
            })
            .error((error) => {
                res.sendStatus(500);
            });
    } catch (error) {
        console.dir(error);
        res.sendStatus(400);
    }
});

app.listen(3000, 'localhost', function (err) {
    if (err) {
        console.log(err);
        return;
    }
    console.log('Listening at http://localhost:3000');
});