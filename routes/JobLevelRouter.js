import { Router } from "express";
const router = Router();

import {
  getAllJobLevels,
  getJobLevel,
  updateJobLevel,
  deleteJobLevel,
} from "../controllers/JobLevelController.js";
import { validateJobLevelParam } from "../middleware/validationMiddleware.js";

router.route("/").get(getAllJobLevels);
router
  .route("/:id")
  .get(validateJobLevelParam, getJobLevel)
  .patch(validateJobLevelParam, updateJobLevel)
  .delete(validateJobLevelParam, deleteJobLevel);

export default router;
