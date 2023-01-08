const express = require("express");
const cors = require('cors');
const fs = require('fs')
const app = express();

app.use(cors());
// app.use(express.urlencoded());
app.use(express.text());

app.listen(3000, () => {
    console.log("The mock-server is currently running on port 3000 ...");
});

app.get("/url", (req, res, next) => {
    res.json(["a", "b", "c", "d", "e"]);
});

app.get('/api/ping', (req, res, next) => {
    res.json(["a", "b", "c", "d", "e"]);
});

app.post('/api/generateMarkings', (req, res, next) => {
    res.json(["a", "b", "c", "d", "e"]);
});

app.post('/api/generateMarkingsForParagraphs', (req, res, next) => {
    const payload = req.body;

    // TODO write a script to fetch the responses for a list of requests from an actual server
    if (payload === ) {
        console.log('the payload matches the string');
        const response = {
            'text': '<p>asd&nbsp;</p>',
            'textMarkings': [{
                'from': 0,
                'to': 3,
                'type': 'typo',
                'subtype': 'gabim gramatikor, drejtshkrim',
                'description': 'kjo fjal\u00eb nuk ekziston, a doje t\u00eb shkruaje',
                'suggestions': [{ 'display': 'sad', 'action': 'sad' }, {
                    'display': 'bas',
                    'action': 'bas',
                }, { 'display': 'mas', 'action': 'mas' }, { 'display': 'has', 'action': 'has' }, {
                    'display': 'and',
                    'action': 'and',
                }, { 'display': 'aks', 'action': 'aks' }, { 'display': 'asi', 'action': 'asi' }, {
                    'display': 'as',
                    'action': 'as',
                }, { 'display': 'qas', 'action': 'qas' }, { 'display': 'tas', 'action': 'tas' }, {
                    'display': 'kas',
                    'action': 'kas',
                }, { 'display': 'aso', 'action': 'aso' }, { 'display': 'ras', 'action': 'ras' }, {
                    'display': 'aed',
                    'action': 'aed',
                }, { 'display': 'ase', 'action': 'ase' }, { 'display': 'uas', 'action': 'uas' }, {
                    'display': 'pas',
                    'action': 'pas',
                }, { 'display': 'ad', 'action': 'ad' }, { 'display': 'kad', 'action': 'kad' }, {
                    'display': 'ars',
                    'action': 'ars',
                }],
                'paragraph': 0,
            }],
        }
        res.json(response);
    }
    // console.log(req)
    // console.log(req)
    console.log(req.body)
    // console.log(req.params)
    // console.log(JSON.stringify(req.body))
    res.json(["a", "b", "c", "d", "e"]);
});

app.post('/api/getMarkingDetails/:marking_details_id', (req, res, next) => {
    const markingDetailsID = req.body;
    res.json(["a", "b", "c", "d", "e"]);
});

app.get('/api/getMarkingTypes', (req, res, next) => {
    res.json(["a", "b", "c", "d", "e"]);
});

app.get('/api/getMarkingTypesCount', (req, res, next) => {
    res.json(["a", "b", "c", "d", "e"]);
});

app.get('/api/uploadDocument', (req, res, next) => {
    res.json(["a", "b", "c", "d", "e"]);
});

function fetchRealValuesFromServer() {
    fs.writeFileSync('mock-server/data/data.json', JSON.stringify(['1', 2, null, '4'], null, 2), 'utf-8');
}

fetchRealValuesFromServer();
