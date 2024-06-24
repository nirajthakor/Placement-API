import mongoose from "mongoose";

const BranchSchema = new mongoose.Schema(
  {
    degree_id: String,
    college_id: String,
    branch_code: String,
    branch_name: String,
  },
  { timestamps: true }
);

export default mongoose.model("tbl_branch", BranchSchema);
