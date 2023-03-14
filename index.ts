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

if (!(process.env.PORT && process.env.CLIENT_ORIGIN_URL)) {
  throw new Error(
    "Missing required environment variables. Check docs for more info."
  );
}

const PORT = parseInt(process.env.PORT, 10);
//let CLIENT_ORIGIN_URL;

/*
if (process.env.NODE_ENV === 'production') {
  CLIENT_ORIGIN_URL = process.env.CLIENT_ORIGIN_URL;
} else {
  CLIENT_ORIGIN_URL = process.env.CLIENT_ORIGIN_DEV_URL;
}
*/

//const allowedOrigins = [CLIENT_ORIGIN_URL];

//console.log(CLIENT_ORIGIN_URL);

const app: Express = express();
const port: number = process.env.PORT;
let subject: string = "default_subject";

app.use(express.json());

app.set("json spaces", 2);

app.use((req, res, next) => {
  res.contentType("application/json; charset=utf-8");
  next();
});

app.use(nocache());

/*
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `The CORS policy for this site (${origin}) does not allow access from the specified Origin.`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    //methods: ["GET", "POST"],
    allowedHeaders: ["Authorization", "Content-Type"],
    //maxAge: 86400,
  })
);
*/

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
