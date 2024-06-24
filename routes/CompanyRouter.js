import { Router } from "express";
const router = Router();

import {
  getAllCompanys,
  getCompany,
  createCompany,
  updateCompany,
  deleteCompany,
  updateStatus,
} from "../controllers/CompanyController.js";
import { validateCompanyParam } from "../middleware/validationMiddleware.js";
import upload from "../middleware/multerMiddleware.js";

router.patch("/updateStatus/:id/:status", updateStatus);
router
  .route("/")
  .get(getAllCompanys)
  .post(upload.single("company_logo"), createCompany);
router
  .route("/:id")
  .get(validateCompanyParam, getCompany)
  .patch(upload.single("company_logo"), validateCompanyParam, updateCompany)
  .delete(validateCompanyParam, deleteCompany);

export default router;
