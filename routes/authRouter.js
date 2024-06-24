import { Router } from "express";
import { register } from "../controllers/authController.js";
import { validateRegisterInput } from "../middleware/validationMiddleware.js";
const router = Router();

router.post("/register", validateRegisterInput, register);

export default router;
