const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const icongen = require('icon-gen');
const fs = require('fs-extra');
const zipFolder = require('zip-folder');
const uniqid = require('uniqid');
const exec = require('child-process-promise').exec;


app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
    'extended': 'true'
}));
app.use(bodyParser.json());
app.use(bodyParser.json({
    type: 'application/vnd.api+json'
}));
app.use(methodOverride());

const port = process.env.PORT || 8080;

app.get('/api/download/:dir', (req, res) => {
    const tempDir = 'tmp/' + req.params.dir;
    res.download(tempDir + '/icons.zip');

    fs.remove(tempDir, () => {});
});

app.post('/api/convert', (req, res) => {
    console.log("Converting");
    console.log(req.body.image);

    const tmp_name = uniqid();
    const dir = './tmp/' + tmp_name;
    const src = dir + '/src';
    const dist = dir + '/dist';

    fs.ensureDir(src, err => {
        console.log(err);

        fs.ensureDir(dist, err => {
            console.log(err);

            fs.writeFile(src + "/image.svg", req.body.image, err => {
                if (err) {
                    return console.log(err);
                }

                console.log("The file was saved!");

                const options = {
                    report: true
                };

                const cmd = 'icon-gen -i ' + src + '/image.svg -o ' + dist + ' -r';

                exec(cmd)
                    .then(function (result) {
                        zipFolder(dist, dir + '/icons.zip', err => {
                            if (err) {
                                console.log('oh no!', err);
                                res.send('error');
                            } else {
                                console.log('EXCELLENT');
                                res.send(tmp_name);
                            }
                        });
                    })
                    .catch(function (err) {
                        console.error(err);
                        res.send('error');
                    });
            });
        });
    });
});

app.get('*', function (req, res) {
    res.sendfile('./public/index.html');
});

app.listen(port);
console.log("app listening on " + port);