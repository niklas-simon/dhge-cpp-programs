import express from 'express';
import Kusche from './kusche.mjs';

const app = express();
app.use(express.static("../client/dist/client"));

app.get("/api/**", async (req, res) => {
    console.log(req.url);
    res.send(await Kusche.load(req.url.replace("/api/", "")));
})

app.listen(80, () => {
    console.log("I'm running I'm running I'm running...");
})