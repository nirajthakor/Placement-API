import mongoose from "mongoose";

const DegreeSchema = new mongoose.Schema(
  {
    college_id: String,
    degree_name: String,
    degree_code: String,
    degree_sem: String,
  },
  { timestamps: true }
);

export default mongoose.model("tbl_degree", DegreeSchema);
