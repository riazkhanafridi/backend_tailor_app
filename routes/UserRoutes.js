import { Router } from "express";
import {  addUser, changePassword, deleteUser, getAllUsers, getUserById, login, registerAdmin, socialLogin, updateUser,  } from "../controllers/userController.js";
import auth from "../middlewares/Auth.js";
import { addUpdateUserSchema, loginSchema } from "../validations/index.js";
import validateBody from "../middlewares/Validator.js";







const router = Router();
router.post("/register-admin", registerAdmin);
router.post("/login",  validateBody(loginSchema), login); 
router.post("/social-login", socialLogin);
router.post("/update-password", auth, changePassword);

router.post(
  "/",

  validateBody(addUpdateUserSchema),
  addUser
);
router.get("/", getAllUsers);
router.get("/:id", auth, getUserById);
router.put("/:id", auth, validateBody(addUpdateUserSchema), updateUser);
router.delete("/:id", auth, deleteUser);




export default router;




