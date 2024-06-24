import { StatusCodes } from "http-status-codes";
import tbl_college from "../model/CollegeModel.js";
import tbl_student from "../model/StudentModel.js";
import tbl_university from "../model/UniversityMode.js";
import tbl_company from "../model/CompanyModel.js";
import User from "../model/AdminModel.js";
import tbl_tpo from "../model/TPOModel.js";

export const getCurrentUser = async (req, res) => {
  try {
    let user;
    switch (req.user.role) {
      case "Admin":
        user = await User.findOne({ _id: req.user.userId });
        break;
      case "University":
        user = await tbl_university.findOne({ _id: req.user.userId });
        break;
      case "College":
        user = await tbl_college.findOne({ _id: req.user.userId });
        break;
      case "Student":
        user = await tbl_student.findOne({ _id: req.user.userId });
        break;
      case "Company":
        user = await tbl_company.findOne({ _id: req.user.userId });
        break;
      case "TPO":
        user = await tbl_tpo.findOne({ _id: req.user.userId });
        break;
      default:
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: "Invalid role" });
    }

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "User not found" });
    }

    const userWithoutPassword = user.toJSON();
    res.status(StatusCodes.OK).json({ user: userWithoutPassword });
  } catch (error) {
    console.error("Error in getCurrentUser:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Server Error" });
  }
};

export const getApplicationStats = async (req, res) => {
  try {
    const college = await tbl_college.countDocuments();
    const student = await tbl_student.countDocuments();
    const university = await tbl_university.countDocuments();
    const company = await tbl_company.countDocuments();
    const tpo = await tbl_tpo.countDocuments();
    res
      .status(StatusCodes.OK)
      .json({ college, student, university, company, tpo });
  } catch (error) {
    console.error("Error in getApplicationStats:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Server Error" });
  }
};

export const updateUser = async (req, res) => {
  try {
    let updatedUser;

    switch (req.user.role) {
      case "Admin":
        const obj = { ...req.body };
        delete obj.admin_password;
        updatedUser = await User.findByIdAndUpdate(req.user.userId, obj);
        break;
      case "University":
        // Handle file uploads for university
        if (req.files) {
          if (req.files.university_logo) {
            req.body.university_logo = req.files.university_logo[0].filename;
          }
        }
        updatedUser = await tbl_university.findByIdAndUpdate(
          req.user.userId,
          req.body
        );
        break;
      case "College":
        // Handle file uploads for college
        if (req.files) {
          if (req.files.college_logo) {
            req.body.college_logo = req.files.college_logo[0].filename;
          }
        }
        updatedUser = await tbl_college.findByIdAndUpdate(
          req.user.userId,
          req.body
        );
        break;
      case "Student":
        // Handle file uploads for student
        if (req.files) {
          if (req.files.student_image) {
            req.body.student_image = req.files.student_image[0].filename;
          }
          if (req.files.student_cv) {
            req.body.student_cv = req.files.student_cv[0].filename;
          }
          if (req.files.student_last_marksheet) {
            req.body.student_last_marksheet =
              req.files.student_last_marksheet[0].filename;
          }
        }
        updatedUser = await tbl_student.findByIdAndUpdate(
          req.user.userId,
          req.body
        );
        break;
      case "Company":
        // Handle file uploads for Company
        if (req.files) {
          if (req.files.company_logo) {
            req.body.company_logo = req.files.company_logo[0].filename;
          }
        }
        updatedUser = await tbl_company.findByIdAndUpdate(
          req.user.userId,
          req.body
        );
        break;
      case "TPO":
        // Handle file uploads for TPO
        if (req.files) {
          if (req.files.tpo_image) {
            req.body.tpo_image = req.files.tpo_image[0].filename;
          }
        }
        updatedUser = await tbl_tpo.findByIdAndUpdate(
          req.user.userId,
          req.body
        );
        break;
      default:
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: "Invalid role" });
    }

    if (!updatedUser) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "User not found" });
    }

    res.status(StatusCodes.OK).json({ msg: "User updated successfully" });
  } catch (error) {
    console.error("Error in updateUser:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Server Error" });
  }
};
