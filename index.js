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

// Root route for testing
app.get("/", (req, res) => {
  res.json({ 
    message: "Tailor API is running!",
    status: "success",
    timestamp: new Date().toISOString()
  });
});

app.use("/api/v1", router);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: "Something went wrong!",
    message: err.message 
  });
});

// app.use(ErrorMiddleware);

// Database connection wrapper for Vercel
let isDbConnected = false;
async function ensureDbConnection() {
  if (!isDbConnected) {
    await dbConnection();
    isDbConnected = true;
  }
}

// Initialize DB connection (for serverless)
ensureDbConnection().catch(err => {
  console.error("Database connection failed:", err);
});

// Export for Vercel (ES6 style)
export default app;

// Local development only
if (process.env.NODE_ENV !== 'production') {
  const PORT = appPort || process.env.PORT || 8000;
  app.listen(PORT, async () => {
    console.log(`Listening to port ${PORT}`);
    await dbConnection();
    // await dbInit();
  });
}