import mongoose from "mongoose";
import { JOB_TYPE, STATUS } from "../utils/constants.js";

const JobSchema = new mongoose.Schema(
  {
    job_company_id: String,
    job_title: String,
    job_position: String,
    job_type: {
      type: String,
      enum: Object.values(JOB_TYPE),
      default: JOB_TYPE.FULL_TIME,
    },
    job_skills: String,
    job_reg_end_date: String,
    job_salary: String,
    job_exp: String,
    job_noofposition: String,
    job_desc: String,
    job_status: {
      type: String,
      default: STATUS.ACTIVE,
    },
  },
  { timestamps: true }
);

export default mongoose.model("tbl_jobpost", JobSchema);
