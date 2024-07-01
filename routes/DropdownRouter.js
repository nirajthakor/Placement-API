import { Router } from "express";
const router = Router();

import {
  getAlluniversitys,
  getBranchesByDegreeId,
  getCollegesByUniversityId,
  getDegreesByCollegeId,
} from "../controllers/DropdownController.js";

router.get("/universities", getAlluniversitys);
router.get("/college/:university_id", getCollegesByUniversityId);
router.get("/degree/:college_id", getDegreesByCollegeId);
router.get("/branch/:degree_id", getBranchesByDegreeId);

export default router;
