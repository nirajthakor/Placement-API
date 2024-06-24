import mongoose from "mongoose";
import { STATUS } from "../utils/constants.js";

const JobCollegeSchema = new mongoose.Schema(
  {
    job_id: String,
    job_university_id: String,
    job_college_id: String,
    job_degree_id: String,
    job_branch_id: String,
    job_college_status: {
      type: String,
      default: STATUS.ACTIVE,
    },
  },
  { timestamps: true }
);

export default mongoose.model("tbl_jobcollegepost", JobCollegeSchema);
