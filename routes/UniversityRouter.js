import { Router } from "express";
const router = Router();

import {
  getAlluniversitys,
  createuniversity,
  getuniversity,
  updateuniversity,
  deleteuniversity,
  updateStatus,
} from "../controllers/UniversityController.js";
import { validateUniversityParam } from "../middleware/validationMiddleware.js";
import upload from "../middleware/multerMiddleware.js";

router.patch("/updateStatus/:id", updateStatus);
router
  .route("/")
  .get(getAlluniversitys)
  .post(upload.single("university_logo"), createuniversity);
router
  .route("/:id")
  .get(validateUniversityParam, getuniversity)
  .patch(
    upload.single("university_logo"),
    validateUniversityParam,
    updateuniversity
  )
  .delete(validateUniversityParam, deleteuniversity);

export default router;
