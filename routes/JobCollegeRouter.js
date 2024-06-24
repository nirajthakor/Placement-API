import { Router } from "express";
const router = Router();

import {
  getAllJobColleges,
  getJobCollege,
  updateJobCollege,
  deleteJobCollege,
} from "../controllers/JobCollegeController.js";
import { validateJobCollegeParam } from "../middleware/validationMiddleware.js";

router.route("/").get(getAllJobColleges);
router
  .route("/:id")
  .get(validateJobCollegeParam, getJobCollege)
  .patch(validateJobCollegeParam, updateJobCollege)
  .delete(validateJobCollegeParam, deleteJobCollege);

export default router;
