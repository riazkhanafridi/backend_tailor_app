import { Router } from "express";

import { addOrder, deleteOrder, getAllOrders, getOrderById, updateOrder, updateOrderStatus } from "../controllers/orderController.js";
import auth from "../middlewares/Auth.js";
import roleAuthorization from "../middlewares/RoleAuthorization.js";
import validateBody from "../middlewares/Validator.js";
import {  addUpdateOrderSchema } from "../validations/index.js";
import { USER_ROLES } from "../config/Constants.js";








const router = Router();

router.post("/", auth, validateBody(addUpdateOrderSchema), addOrder);
router.get("/", auth, getAllOrders);
router.get("/:id", auth, getOrderById);
router.put(
  "/status/:id",
  auth,
  roleAuthorization([USER_ROLES.admin, ]),
  updateOrderStatus
);
router.put("/:id", auth, validateBody(addUpdateOrderSchema), updateOrder);
router.delete("/:id", auth, deleteOrder);




export default router;




