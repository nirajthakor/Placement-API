import { Router } from "express";
const router = Router();

import {
  getAllColleges,
  getCollege,
  createCollege,
  updateCollege,
  deleteCollege,
  updateStatus,
} from "../controllers/CollegeController.js";
import { validateCollegeParam } from "../middleware/validationMiddleware.js";
import upload from "../middleware/multerMiddleware.js";

router.patch("/updateStatus/:id", updateStatus);
router
  .route("/")
  .get(getAllColleges)
  .post(upload.single("college_logo"), createCollege);
router
  .route("/:id")
  .get(validateCollegeParam, getCollege)
  .patch(upload.single("college_logo"), validateCollegeParam, updateCollege)
  .delete(validateCollegeParam, deleteCollege);

export default router;
