const express = require("express");
const cors = require("cors");
const fs = require("fs");
const multer = require("multer");
const app = express();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const uploadImg = multer({ dest: "uploads/" }).single('uploadFile');



app.use(cors());
// app.use(express.urlencoded());
app.use(express.text());

app.listen(3000, () => {
    console.log("The mock-server is currently running on port 3000 ...");
});

app.get("/url", (req, res, next) => {
    res.json(["a", "b", "c", "d", "e"]);
});

app.get("/api/ping", (req, res, next) => {});

app.post("/api/generateMarkings", (req, res, next) => {
    const markings = readParsedDataFromFile("generateMarkings.json");
    console.log(markings);
    const filteredMarkings = markings.filter((mFP) => mFP.request === req.body);
    console.log(filteredMarkings);

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

    // console.log(filteredMarkingsForParagraphs)
    // TODO write a script to fetch the responses for a list of requests from an actual server
    if (req.body === filteredMarkings[0]["request"]) {
        //     console.log('the payload matches the string');
        //     const response = fs.readFileSync('mock-server/data/data.json');
        res.json(filteredMarkings[0]["response"]);
    }
    // console.log(req)
    // console.log(req)
    // console.log(req.body)
    // console.log(req.params)
    // console.log(JSON.stringify(req.body))
    // res.json(["a", "b", "c", "d", "e"]);
});

app.post("/api/generateMarkingsForParagraphs", (req, res, next) => {
    const markingsForParagraphs = readParsedDataFromFile(
        "generateMarkingsForParagraphs.json"
    );
    console.log(markingsForParagraphs);
    const filteredMarkingsForParagraphs = markingsForParagraphs.filter(
        (mFP) => mFP.request === req.body
    );
    console.log(filteredMarkingsForParagraphs);

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

    // console.log(filteredMarkingsForParagraphs)
    // TODO write a script to fetch the responses for a list of requests from an actual server
    if (req.body === filteredMarkingsForParagraphs[0]["request"]) {
        //     console.log('the payload matches the string');
        //     const response = fs.readFileSync('mock-server/data/data.json');
        res.json(filteredMarkingsForParagraphs[0]["response"]);
    }
    // console.log(req)
    // console.log(req)
    // console.log(req.body)
    // console.log(req.params)
    // console.log(JSON.stringify(req.body))
    // res.json(["a", "b", "c", "d", "e"]);
});

app.post("/api/getMarkingDetails/:marking_details_id", (req, res, next) => {
    const markingDetailsID = req.body;
    res.json(["a", "b", "c", "d", "e"]);
});

app.get("/api/getMarkingTypes", (req, res, next) => {
    res.json(["a", "b", "c", "d", "e"]);
});

app.get("/api/getMarkingTypesCount", (req, res, next) => {
    res.json(["a", "b", "c", "d", "e"]);
});

app.post("/api/uploadDocument", uploadImg, (req, res, next) => {
    // TODO perhaps just check if the uploaded file is identical to the ones declared in Cypress?
    // console.log(req)
    console.log(req.file)
    console.log(req.files)
    console.log(req.body)
    console.log(req.formData)
    console.log(req.uploadFile)
    res.json(["a", "b", "c", "d", "e"]);
});

function readParsedDataFromFile(filePath) {
    return JSON.parse(fs.readFileSync("mock-server/data/" + filePath, "utf-8"));
}

function fetchRealValuesFromServer() {
    fs.writeFileSync(
        "mock-server/data/data.json",
        JSON.stringify(["1", 2, null, "4"], null, 2),
        "utf-8"
    );
}

// fetchRealValuesFromServer();
