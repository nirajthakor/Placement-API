import { Router } from "express";
const router = Router();

import {
  getAllStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  updateStatus,
} from "../controllers/StudentController.js";
import { validateStudentParam } from "../middleware/validationMiddleware.js";

router.patch("/updateStatus/:id/:status", updateStatus);
router.route("/").get(getAllStudents).post(createStudent);
router
  .route("/:id")
  .get(validateStudentParam, getStudent)
  .patch(validateStudentParam, updateStudent)
  .delete(validateStudentParam, deleteStudent);

export default router;
