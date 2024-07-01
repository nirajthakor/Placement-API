import { Router } from "express";
const router = Router();

import {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  updateStatus,
  getJobs,
  getAllJobsClg,
} from "../controllers/JobController.js";
import {
  validateJobParam,
  validateJobInput,
} from "../middleware/validationMiddleware.js";

router.get("/getJobs", getJobs);
router.get("/getAllJobsClg", getAllJobsClg);
router.route("/").get(getAllJobs).post(validateJobInput, createJob);

router
  .route("/:id")
  .get(validateJobParam, getJob)
  .patch(validateJobParam, validateJobInput, updateJob)
  .delete(validateJobParam, deleteJob);

router.patch("/updateStatus/:id", updateStatus);

export default router;
