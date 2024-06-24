import mongoose from "mongoose";
import { STATUS } from "../utils/constants.js";

const StudentSchema = new mongoose.Schema(
  {
    college_id: String,
    university_id: String,
    degree_id: String,
    branch_id: String,
    student_enrollment: String,
    student_name: String,
    student_image: String,
    student_email: String,
    student_contact: String,
    student_current_sem: String,
    student_total_backlog: String,
    student_cv: String,
    student_last_marksheet: String,
    student_skills: String,
    student_status: {
      type: String,
      default: STATUS.DEACTIVE,
    },
    student_password: String,
    role: {
      type: String,
      default: "Student",
    },
  },
  { timestamps: true }
);

StudentSchema.methods.toJSON = function () {
  var obj = this.toObject();
  delete obj.student_password;
  return obj;
};

export default mongoose.model("tbl_student", StudentSchema);
