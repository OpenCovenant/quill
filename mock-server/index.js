const express = require("express");
const cors = require("cors");
const fs = require("fs");
const multer = require("multer");
// const textract = require('textract');
const path = require('path');

const app = express();

const uploadImg = multer({ dest: "uploads/" }).single('uploadFile');


app.use(cors());

app.use(express.text());

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`The mock-server is currently running on port ${PORT} ...`);
});

app.get("/api/ping", (req, res, next) => {});

app.post("/api/generateMarkings", (req, res, next) => {
    const markings = readParsedDataFromFile("generateMarkings.json");

    const filteredMarkings = markings.filter((mFP) => mFP.request === req.body);

    if (filteredMarkings.length === 0) {
        console.log("no data in the mock server for this payload");
        res.sendStatus(404).end();
        return;
    }

    if (filteredMarkings.length > 1) {
        console.log(
            "more than one data with this payload in the mock server was found, returning one of them"
        );
        res.json(filteredMarkings[0]["response"]);
        return;
    }

    // TODO write a script to fetch the responses for a list of requests from an actual server
    if (req.body === filteredMarkings[0]["request"]) {
        res.json(filteredMarkings[0]["response"]);
    }
});

app.post("/api/generateMarkingsForParagraphs", (req, res, next) => {
    const markingsForParagraphs = readParsedDataFromFile(
        "generateMarkingsForParagraphs.json"
    );

    const filteredMarkingsForParagraphs = markingsForParagraphs.filter(
        (mFP) => mFP.request === req.body
    );

    if (filteredMarkingsForParagraphs.length === 0) {
        console.log("no data in the mock server for this payload");
        res.sendStatus(404).end();
        return;
    }

    if (filteredMarkingsForParagraphs.length > 1) {
        console.log(
            "more than one data with this payload in the mock server was found, returning one of them"
        );
        res.json(filteredMarkingsForParagraphs[0]["response"]);
        return;
    }

    // TODO write a script to fetch the responses for a list of requests from an actual server
    if (req.body === filteredMarkingsForParagraphs[0]["request"]) {
        res.json(filteredMarkingsForParagraphs[0]["response"]);
    }
});

app.post("/api/getMarkingDetails/:marking_details_id", (req, res, next) => {
    const markingDetailsID = req.body;
    // TODO
    res.sendStatus(404).end();
});

app.get("/api/getMarkingTypes", (req, res, next) => {
    const markingTypes = readParsedDataFromFile(
        "getMarkingTypes.json"
    );
    res.json(markingTypes);
});

app.get("/api/getMarkingTypesCount", (req, res, next) => {
    const markingTypesCount = readParsedDataFromFile(
        "getMarkingTypesCount.json"
    );
    res.json(markingTypesCount);
});

app.post("/api/uploadDocument", uploadImg, (req, res, next) => {
    // TODO perhaps just check if the uploaded file is identical to the ones declared in Cypress?
    console.log(req.file)
    const WordExtractor = require("word-extractor");
    const extractor = new WordExtractor();
    const extracted = extractor.extract("/home/andi/playground/quill/mock-server/uploads/8d846ca09094610ec3bc7f455c66472b");

    extracted.then(function(doc) { console.log(doc.getBody()); });
    // textract.("/home/andi/playground/quill/mock-server/uploads/8d846ca09094610ec3bc7f455c66472b",{ preserveLineBreaks: true }, function( error, text ) {
    //     console.log(text)
    //     console.log(error)
    // })
    // TODO process the uploaded file here and accordingly set the response to the call
    res.json(["a", "b", "c", "d", "e"]);
});

function readParsedDataFromFile(filePath) {
    const quillDirectoryPath = path.dirname(__dirname);
    return JSON.parse(fs.readFileSync(`${quillDirectoryPath}/mock-server/data/${filePath}`, "utf-8"));
}

function fetchRealValuesFromServer() {
    fs.writeFileSync(
        "mock-server/data/data.json",
        JSON.stringify(["1", 2, null, "4"], null, 2),
        "utf-8"
    );
}

// fetchRealValuesFromServer();
