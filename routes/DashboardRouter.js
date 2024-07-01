import { Router } from "express";
const router = Router();

import { showStats } from "../controllers/DashboardController.js";

router.get("/", showStats);

export default router;
