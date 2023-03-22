import https from "https";
import fs from "fs";
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import nocache from "nocache";

// Get what we need from .env
dotenv.config();
if (!(process.env.PORT && process.env.CLIENT_ORIGIN_URL)) {
  throw new Error(
    "Missing required environment variables. Check docs for more info."
  );
}

// Set type for global subject state (should eventually be db instead)
interface Subject {
  subject: string;
}

// TLS keys/chain
//const options = {
//  key: fs.readFileSync("/srv/www/keys/my-site-key.pem"),
//  cert: fs.readFileSync("/srv/www/keys/chain.pem"),
//};

// Get the origin URL based on the env type
let CLIENT_ORIGIN_URL;
if (process.env.NODE_ENV === "production") {
  CLIENT_ORIGIN_URL = process.env.CLIENT_ORIGIN_URL;
} else {
  CLIENT_ORIGIN_URL = process.env.CLIENT_ORIGIN_DEV_URL;
}

// Globals
const app: Express = express();
const port: number = process.env.PORT;
let subject: string = "default_subject";

// Make output readable
app.use(express.json());
app.set("json spaces", 2);
app.use((req, res, next) => {
  res.contentType("application/json; charset=utf-8");
  next();
});

// Disable client-side caching
app.use(nocache());

// Set CORS policy
const allowedOrigins = [CLIENT_ORIGIN_URL];
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
    methods: ["GET", "POST"],
    allowedHeaders: ["Authorization", "Content-Type"],
    maxAge: 86400,
  })
);

// Content endpoint allows get and post
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
    res.status(204).send("You didn't send me a subject!"); // Set 204 for processing convenience
  }
});

// Replace with https
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

//https.createServer(options, app).listen(8080);
