import { Router } from "express";
import { addCustomer, deleteCustomer, getAllCustomers, getCustomerById, updateCustomer } from "../controllers/CustomerController.js";
import { addOrder, deleteOrder, getAllOrders, getOrderById, updateOrder } from "../controllers/orderController.js";
import auth from "../middlewares/Auth.js";








const router = Router();

router.post("/", auth, addOrder);
router.get("/", auth, getAllOrders);
router.get("/:id", auth, getOrderById);
router.put("/:id", auth, updateOrder);
router.delete("/:id", auth, deleteOrder);




export default router;




