const express = require("express");
const cors = require('cors');
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
    // if
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
