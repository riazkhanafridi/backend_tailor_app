import express from "express";
import dotenv from "dotenv";
dotenv.config(); 
import dbInit from "./config/dbInit.js";
import router from "./routes/index.js";
import cors from "cors";
import envVariables from "./config/Constants.js";
// import ErrorMiddleware from "./middlewares/Error.js";

// import { makeRequiredDirectories } from "./utils/fileHandler.js";
import dbConnection from "./config/dbConnect.js"; 
 

// Create an Express app
const app = express();
const { appPort } = envVariables;
// const appPort = process.env.APP_PORT || 8000;

// makeRequiredDirectories();
const allowedUrls = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "https://admin.ahmedcafes.com",
  "https://cashier.ahmedcafes.com",
  "https://kitchen.ahmedcafes.com",
];

const corsOption = {
  origin: allowedUrls,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
};

app.use(cors(corsOption));
// Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1", router);



// app.use(ErrorMiddleware);
app.listen(appPort, async () => {
  console.log(`Listening to port ${appPort}`);
  await dbConnection();
//   dbConnection().then(async () => {
//      await dbInit();
//   });
});  
