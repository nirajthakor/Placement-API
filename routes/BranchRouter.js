import { Router } from "express";
const router = Router();

import {
  getAllBranchs,
  getBranch,
  createBranch,
  updateBranch,
  deleteBranch,
  branch,
  update,
} from "../controllers/BranchController.js";
import { validateBranchParam } from "../middleware/validationMiddleware.js";

router.get("/branch/:id", branch);
router.patch("/update", update);
router.route("/").get(getAllBranchs).post(createBranch);
router
  .route("/:id")
  .get(validateBranchParam, getBranch)
  .patch(validateBranchParam, updateBranch)
  .delete(validateBranchParam, deleteBranch);

export default router;
