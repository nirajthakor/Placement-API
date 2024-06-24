import { Router } from "express";
const router = Router();

import {
  getAllDegrees,
  getDegree,
  createDegree,
  updateDegree,
  deleteDegree,
} from "../controllers/DegreeController.js";
import { validateDegreeParam } from "../middleware/validationMiddleware.js";

router.route("/").get(getAllDegrees).post(createDegree);
router
  .route("/:id")
  .get(validateDegreeParam, getDegree)
  .patch(validateDegreeParam, updateDegree)
  .delete(validateDegreeParam, deleteDegree);

export default router;
