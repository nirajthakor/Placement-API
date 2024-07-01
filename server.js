import "express-async-errors";
import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
const app = express();
import morgan from "morgan";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
// import cors from "cors";

//Router
import JobRouter from "./routes/JobRouter.js";
import StatsRouter from "./routes/DashboardRouter.js";
import UniversityRouter from "./routes/UniversityRouter.js";
import CompanyRouter from "./routes/CompanyRouter.js";
import ApplicationRouter from "./routes/ApplicationRouter.js";
import CollegeRouter from "./routes/CollegeRouter.js";
import BranchRouter from "./routes/BranchRouter.js";
import DegreeRouter from "./routes/DegreeRouter.js";
import JobLevelRouter from "./routes/JobLevelRouter.js";
import StudentRouter from "./routes/StudentRouter.js";
import TPORouter from "./routes/TPORouter.js";
import JobCollegeRouter from "./routes/JobCollegeRouter.js";
import authRouter from "./routes/authRouter.js";
import LoginRouter from "./routes/LoginRouter.js";
import userRouter from "./routes/userRouter.js";
import DropdownRouter from "./routes/DropdownRouter.js";

//public
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";

//middleware
import errorHandlerMiddleware from "./middleware/errorHandlerMiddleware.js";
import { authenticateUser } from "./middleware/authMiddleware.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.static(path.resolve(__dirname, "./public")));
app.use(cookieParser());
app.use(express.json());

// app.use(
//   cors({
//     origin: "http://localhost:3000", // Replace with your frontend URL
//   })
// );

app.get("/api/v1/test", (req, res) => {
  res.json({ message: "hello" });
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/v1/jobs", authenticateUser, JobRouter);
app.use("/api/v1/stats", authenticateUser, StatsRouter);
app.use("/api/v1/university", UniversityRouter);
app.use("/api/v1/dropdown", DropdownRouter);
app.use("/api/v1/company", CompanyRouter);
app.use("/api/v1/application", authenticateUser, ApplicationRouter);
app.use("/api/v1/college", authenticateUser, CollegeRouter);
app.use("/api/v1/branch", authenticateUser, BranchRouter);
app.use("/api/v1/degree", authenticateUser, DegreeRouter);
app.use("/api/v1/joblevel", authenticateUser, JobLevelRouter);
app.use("/api/v1/student", authenticateUser, StudentRouter);
app.use("/api/v1/tpo", authenticateUser, TPORouter);
app.use("/api/v1/jobcollege", authenticateUser, JobCollegeRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/login", LoginRouter);
app.use("/api/v1/logout", LoginRouter);
app.use("/api/v1/users", authenticateUser, userRouter);

app.use("*", (req, res) => {
  res.status(404).json({ msg: "not found" });
});

app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5100;

try {
  await mongoose.connect(process.env.MONGO_URL);
  app.listen(port, () => {
    console.log(`server running on PORT ${port}....`);
  });
} catch (error) {
  console.log(error);
  process.exit(1);
}
