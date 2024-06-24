import { Router } from "express";
const router = Router();

import {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  showStats,
  updateStatus,
  getJobs,
} from "../controllers/JobController.js";
import {
  validateJobParam,
  validateJobInput,
} from "../middleware/validationMiddleware.js";

router.get("/getJobs", getJobs);
router.get("/stats", showStats);
router.route("/").get(getAllJobs).post(validateJobInput, createJob);

router
  .route("/:id")
  .get(validateJobParam, getJob)
  .patch(validateJobParam, validateJobInput, updateJob)
  .delete(validateJobParam, deleteJob);

router.patch("/updateStatus/:id", updateStatus);

export default router;
