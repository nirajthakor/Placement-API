import { Router } from "express";
const router = Router();

import {
  getAllApplications,
  getApplication,
  createApplication,
  updateApplication,
  deleteApplication,
  getAllApply,
  StudentAllApply,
  updateStatus,
  updateDecision,
} from "../controllers/ApplicationController.js";
import { validateApplicationParam } from "../middleware/validationMiddleware.js";

router.patch("/updateStatus/:id/:status", updateStatus);
router.patch("/updateDecision/:id/:status", updateDecision);
router.get("/getAllApply/:id", getAllApply);
router.get("/StudentAllApply/:id", StudentAllApply);
router.post("/:job_id", createApplication);
router.route("/").get(getAllApplications).post(createApplication);
router
  .route("/:id")
  .get(validateApplicationParam, getApplication)
  .patch(validateApplicationParam, updateApplication)
  .delete(validateApplicationParam, deleteApplication);

export default router;
