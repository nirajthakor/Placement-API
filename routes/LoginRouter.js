import { Router } from "express";
const router = Router();

import {
  AdminLogin,
  UniversityLogin,
  CollegeLogin,
  TPOLogin,
  StudentLogin,
  CompanyLogin,
  logout,
} from "../controllers/LoginController.js";
import {
  validateLoginInput,
  validateLoginInputcompany,
  validateLoginInputcollege,
  validateLoginInputstudent,
  validateLoginInputtpo,
  validateLoginInputuniversity,
} from "../middleware/validationMiddleware.js";

router
  .post("/AdminLogin", validateLoginInput, AdminLogin)
  .post("/UniversityLogin", validateLoginInputuniversity, UniversityLogin)
  .post("/CollegeLogin", validateLoginInputcollege, CollegeLogin)
  .post("/TPOLogin", validateLoginInputtpo, TPOLogin)
  .post("/StudentLogin", validateLoginInputstudent, StudentLogin)
  .post("/CompanyLogin", validateLoginInputcompany, CompanyLogin);
router.post("/Logout", logout);

export default router;
