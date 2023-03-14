import express from "express";
import dotenv from "dotenv";
dotenv.config();
//const options = {
//  key: fs.readFileSync("/srv/www/keys/my-site-key.pem"),
//  cert: fs.readFileSync("/srv/www/keys/chain.pem"),
//};
const app = express();
const port = process.env.PORT;
let subject = "default_subject";
app.get("/content", (req, res) => {
    console.log("query: " + JSON.stringify(req.query));
    res.send({ subject: subject });
});
app.post("/content", (req, res) => {
    console.log("query: " + JSON.stringify(req.query));
    if (req.query.subject) {
        subject = req.query.subject;
        res.send({ subject: subject });
    }
    else {
        res.status(204).send("You didn't send me a subject!");
    }
});
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
//https.createServer(options, app).listen(8080);
