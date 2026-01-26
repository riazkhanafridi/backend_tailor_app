import { Router } from "express";
import { addCustomer, deleteCustomer, getAllCustomers, getCustomerById, updateCustomer, updateProfile } from "../controllers/CustomerController.js";
import{upload}  from "../middlewares/upload.js";
import auth from "../middlewares/Auth.js";







const router = Router();

router.post("/",  auth, upload.single("image"), addCustomer);
router.put("/:id", auth, upload.single("image"), updateProfile); 
router.get("/",auth, getAllCustomers);
router.get("/:id", auth, getCustomerById);
router.put("/:id", auth, upload.single("image"), updateCustomer);
router.delete("/:id", auth, deleteCustomer);





export default router;




