import { Router } from "express";
const router = Router();

import {
  getAllTPOs,
  getTPO,
  createTPO,
  updateTPO,
  deleteTPO,
  updateStatus,
} from "../controllers/TPOController.js";
import { validateTPOParam } from "../middleware/validationMiddleware.js";
import upload from "../middleware/multerMiddleware.js";

router.patch("/updateStatus/:id", updateStatus);
router.route("/").get(getAllTPOs).post(upload.single("tpo_image"), createTPO);
router
  .route("/:id")
  .get(validateTPOParam, getTPO)
  .patch(upload.single("tpo_image"), validateTPOParam, updateTPO)
  .delete(validateTPOParam, deleteTPO);

export default router;
