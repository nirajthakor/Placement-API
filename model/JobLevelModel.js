import mongoose from "mongoose";
import { STATUS } from "../utils/constants.js";

const JobLevelSchema = new mongoose.Schema(
  {
    job_id: String,
    level_type: String,
    level_name: String,
    level_status: {
      type: String,
      default: STATUS.ACTIVE,
    },
  },
  { timestamps: true }
);

export default mongoose.model("tbl_joblevel", JobLevelSchema);
