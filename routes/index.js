import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { existsSync } from "fs";
import AsyncWrapper from "../utils/asyncWrapper.js";
import ErrorHandler from "../utils/errorHandler.js";


import UserRoutes from "./UserRoutes.js";
import CustomerRoutes from "./CustomerRoutes.js";
import OrderRoutes from "./OrderRoutes.js"; 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();






// Health check endpoint to check server status
router.get("/health", (req, res) => {
  return res.status(200).json({ message: "Server is up and running" });
});


router.use("/user", UserRoutes);
router.use("/customer", CustomerRoutes);
router.use("/order", OrderRoutes);


router.get(
  "/file/:folderName/:fileName",
  AsyncWrapper(async (req, res, next) => {
    const { fileName,folderName } = req.params;
    if (!fileName) {
      return next(new ErrorHandler("File name is required", 400));
    }
    const filePath = path.join(__dirname, `../uploads/${folderName}/${fileName}`);
    console.log(filePath);
    if (!existsSync(filePath)) {
      console.log("File not found");
      return;
    }
    res.sendFile(filePath);
  })
);
export default router;