const express = require("express");
const app = express();
app.listen(3000, () => {
    console.log("The mock-server is currently running on port 3000 ...");
});

app.get("/url", (req, res, next) => {
    res.json(["a", "b", "c", "d", "e"]);
});

app.get('/api/ping', (req, res, next) => {
    res.json(["a", "b", "c", "d", "e"]);
});

app.get('/api/generateMarkings', (req, res, next) => {
    res.json(["a", "b", "c", "d", "e"]);
});

app.get('/api/generateMarkingsForParagraphs', (req, res, next) => {
    res.json(["a", "b", "c", "d", "e"]);
});

app.get('/api/getMarkingDetails/:marking_details_id', (req, res, next) => {
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
