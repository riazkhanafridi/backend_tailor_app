import express from "express";


import UserRoutes from "./UserRoutes.js";
import CustomerRoutes from "./CustomerRoutes.js";
import OrderRoutes from "./OrderRoutes.js"; 


const router = express.Router();




// Health check endpoint to check server status
router.get("/health", (req, res) => {
  return res.status(200).json({ message: "Server is up and running" });
});


router.use("/user", UserRoutes);
router.use("/customer", CustomerRoutes);
router.use("/order", OrderRoutes);



export default router;