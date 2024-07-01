import { Router } from "express";
const router = Router();

import {
  getCurrentUser,
  // getApplicationStats,
  updateUser,
} from "../controllers/userController.js";
import { validateUpdateUserInput } from "../middleware/validationMiddleware.js";
import { authorizePermissions } from "../middleware/authMiddleware.js";
import upload from "../middleware/multerMiddleware.js";

router.get("/current-user", getCurrentUser);
// router.get(
//   "/admin/app-stats",
//   authorizePermissions("admin"),
//   getApplicationStats
// );
router.patch(
  "/update-user",
  upload.fields([
    { name: "student_image", maxCount: 1 },
    { name: "student_cv", maxCount: 1 },
    { name: "student_last_marksheet", maxCount: 1 },
    { name: "university_logo", maxCount: 1 },
    { name: "college_logo", maxCount: 1 },
    { name: "tpo_image", maxCount: 1 },
    { name: "company_logo", maxCount: 1 },
  ]),
  updateUser
);
export default router;
