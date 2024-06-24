import mongoose from "mongoose";
import { STATUS } from "../utils/constants.js";

const CollegeSchema = new mongoose.Schema(
  {
    college_university_id: String,
    college_code: String,
    college_name: String,
    college_email: String,
    college_logo: String,
    college_address: String,
    college_contact: String,
    college_website: String,
    college_status: {
      type: String,
      default: STATUS.ACTIVE,
    },
    college_password: String,
    role: {
      type: String,
      default: "College",
    },
  },
  { timestamps: true }
);
CollegeSchema.methods.toJSON = function () {
  var obj = this.toObject();
  delete obj.college_password;
  return obj;
};

export default mongoose.model("tbl_college", CollegeSchema);
