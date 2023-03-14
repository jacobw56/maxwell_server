import https from "https";
import fs from "fs";
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

interface Subject {
  subject: string;
}

//const options = {
//  key: fs.readFileSync("/srv/www/keys/my-site-key.pem"),
//  cert: fs.readFileSync("/srv/www/keys/chain.pem"),
//};

const app: Express = express();
const port: number = process.env.PORT;
let subject: string = "default_subject";

app.get("/content", (req: Request<{}, {}, {}, Subject>, res: Response) => {
  console.log("query: " + JSON.stringify(req.query));
  res.send({ subject: subject });
});

app.post("/content", (req: Request<{}, {}, {}, Subject>, res: Response) => {
  console.log("query: " + JSON.stringify(req.query));
  if (req.query.subject) {
    subject = req.query.subject;
    res.send({ subject: subject });
  } else {
    res.status(204).send("You didn't send me a subject!");
  }
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

//https.createServer(options, app).listen(8080);
