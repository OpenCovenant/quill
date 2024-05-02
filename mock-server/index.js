const express = require("express");
const cors = require("cors");
const fs = require("fs");
const multer = require("multer");
const path = require('path');

const app = express();

const uploadFile = multer({ dest: "uploads/" }).single('uploadFile');


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
        console.log(`no data in the mock server for "${req.body}"`);
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

app.get("/api/getMarkingDetails/:markingDetailsID", (req, res, next) => {
    const markingDetails = readParsedDataFromFile("getMarkingDetails.json");

    const filteredMarkingDetails = markingDetails.filter((mD) => mD.markingDetailsID === req.params.markingDetailsID);

    if (filteredMarkingDetails.length === 0) {
        console.log("no data in the mock server for this payload");
        res.sendStatus(404).end();
        return;
    }

    if (filteredMarkingDetails.length > 1) {
        console.log(
            "more than one data with this payload in the mock server was found, returning one of them"
        );
        res.json(filteredMarkingDetails[0]["page"]);
        return;
    }

    // TODO write a script to fetch the responses for a list of requests from an actual server
    if (req.params.markingDetailsID === filteredMarkingDetails[0]["markingDetailsID"]) {
        res.json({marking_details_html: filteredMarkingDetails[0]["page"]});
    }
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

app.post("/api/uploadDocument", uploadFile, (req, res, next) => {
    const parsedUploadDocumentDataFile = readParsedDataFromFile(
        "uploadDocument.json"
    );

    const foundDocumentData = parsedUploadDocumentDataFile
        .filter(o => equalsByBuffer(o["filePath"], `mock-server/${req.file.path}`));

    if (foundDocumentData.length === 0) {
        res.sendStatus(404).end();
        return;
    }

    if (foundDocumentData.length > 1) {
        console.log('note to developers that there is a duplicated file');
    }

    const firstFoundFileResponse = foundDocumentData[0]["response"];

    res.json(firstFoundFileResponse);
});

function readParsedDataFromFile(filePath) { // TODO rename to readParsedFileFromRelativePath ?
    const quillDirectoryPath = path.dirname(__dirname);
    return JSON.parse(fs.readFileSync(`${quillDirectoryPath}/mock-server/data/${filePath}`, "utf-8"));
}

function equalsByBuffer(filePath1, filePath2) {
    const quillDirectoryPath = path.dirname(__dirname);
    return fs.readFileSync(`${quillDirectoryPath}/${filePath1}`)
        .equals(fs.readFileSync(`${quillDirectoryPath}/${filePath2}`))
}

// function readParsedFileFromAbsolutePath(filePath) {
//     return JSON.parse(fs.readFileSync(filePath, "utf-8"));
// }
//
// function fetchRealValuesFromServer() {
//     fs.writeFileSync(
//         "mock-server/data/data.json",
//         JSON.stringify(["1", 2, null, "4"], null, 2),
//         "utf-8"
//     );
// }

// fetchRealValuesFromServer();
