import { body, param, validationResult } from "express-validator";
import { JOB_TYPE } from "../utils/constants.js";
import mongoose from "mongoose";
import User from "../model/AdminModel.js";
import tbl_jobpost from "../model/JobModel.js";
import tbl_application from "../model/ApplicationModel.js";
import tbl_branch from "../model/BranchModel.js";
import tbl_college from "../model/CollegeModel.js";
import tbl_company from "../model/CompanyModel.js";
import tbl_degree from "../model/Degree_Model.js";
import tbl_jobcollege from "../model/JobCollegeModel.js";
import tbl_joblevel from "../model/JobLevelModel.js";
import tbl_student from "../model/StudentModel.js";
import tbl_tpo from "../model/TPOModel.js";
import tbl_university from "../model/UniversityMode.js";

import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
  UnauthorizedError,
} from "../errors/customErrors.js";

const withValidationErrors = (validateValues) => {
  return [
    validateValues,
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);
        if (errorMessages[0].startWith("no job")) {
          throw new NotFoundError(errorMessages);
        }
        if (errorMessages[0].startWith("not authorized")) {
          throw UnauthorizedError("not authorized to access this route");
        }
        throw new BadRequestError(errorMessages);
      }
      next();
    },
  ];
};

export const validateJobInput = withValidationErrors([
  body("job_title").notEmpty().withMessage("title is required"),
  body("job_position").notEmpty().withMessage("position is required"),
  body("job_reg_end_date").notEmpty().withMessage("job end date is required"),
  body("job_type")
    .isIn(Object.values(JOB_TYPE))
    .withMessage("invalid job type"),
]);

export const validateJobParam = withValidationErrors([
  param("id").custom(async (value, { req }) => {
    const isValidMongoId = mongoose.Types.ObjectId.isValid(value);
    if (!isValidMongoId) throw new BadRequestError("invalid MongoDB id");
    const job = await tbl_jobpost.findById(value);
    if (!job) throw new NotFoundError(`no job with id ${value}`);
    const isAdmin = req.user.role === "Student";
    const isOwner = req.user.userId === job.job_company_id.toString();
    if (!isAdmin && !isOwner)
      throw UnauthorizedError("not authorized to access this route");
  }),
]);

export const validateApplicationParam = withValidationErrors([
  param("id").custom(async (value) => {
    const isValidId = mongoose.Types.ObjectId.isValid(value);
    if (!isValidId) throw new BadRequestError("invalid MongoDB id");
    const application = await tbl_application.findById(value);
    if (!application)
      throw new NotFoundError(`no application with id : ${value}`);
  }),
]);

export const validateBranchParam = withValidationErrors([
  param("id").custom(async (value) => {
    const isValidId = mongoose.Types.ObjectId.isValid(value);
    if (!isValidId) throw new BadRequestError("invalid MongoDB id");
    const branch = await tbl_branch.findById(value);
    if (!branch) throw new NotFoundError(`no branch with id : ${value}`);
  }),
]);

export const validateCollegeParam = withValidationErrors([
  param("id").custom(async (value) => {
    const isValidId = mongoose.Types.ObjectId.isValid(value);
    if (!isValidId) throw new BadRequestError("invalid MongoDB id");
    const college = await tbl_college.findById(value);
    if (!college) throw new NotFoundError(`no college with id : ${value}`);
  }),
]);

export const validateCompanyParam = withValidationErrors([
  param("id").custom(async (value) => {
    const isValidId = mongoose.Types.ObjectId.isValid(value);
    if (!isValidId) throw new BadRequestError("invalid MongoDB id");
    const company = await tbl_company.findById(value);
    if (!company) throw new NotFoundError(`no company with id : ${value}`);
  }),
]);

export const validateDegreeParam = withValidationErrors([
  param("id").custom(async (value) => {
    const isValidId = mongoose.Types.ObjectId.isValid(value);
    if (!isValidId) throw new BadRequestError("invalid MongoDB id");
    const degree = await tbl_degree.findById(value);
    if (!degree) throw new NotFoundError(`no degree with id : ${value}`);
  }),
]);

export const validateJobCollegeParam = withValidationErrors([
  param("id").custom(async (value) => {
    const isValidId = mongoose.Types.ObjectId.isValid(value);
    if (!isValidId) throw new BadRequestError("invalid MongoDB id");
    const jobcollege = await tbl_jobcollege.findById(value);
    if (!jobcollege)
      throw new NotFoundError(`no job college with id : ${value}`);
  }),
]);

export const validateJobLevelParam = withValidationErrors([
  param("id").custom(async (value) => {
    const isValidId = mongoose.Types.ObjectId.isValid(value);
    if (!isValidId) throw new BadRequestError("invalid MongoDB id");
    const joblevel = await tbl_joblevel.findById(value);
    if (!joblevel) throw new NotFoundError(`no job level with id : ${value}`);
  }),
]);

export const validateStudentParam = withValidationErrors([
  param("id").custom(async (value) => {
    const isValidId = mongoose.Types.ObjectId.isValid(value);
    if (!isValidId) throw new BadRequestError("invalid MongoDB id");
    const student = await tbl_student.findById(value);
    if (!student) throw new NotFoundError(`no student with id : ${value}`);
  }),
]);

export const validateTPOParam = withValidationErrors([
  param("id").custom(async (value) => {
    const isValidId = mongoose.Types.ObjectId.isValid(value);
    if (!isValidId) throw new BadRequestError("invalid MongoDB id");
    const tpo = await tbl_tpo.findById(value);
    if (!tpo) throw new NotFoundError(`no tpo with id : ${value}`);
  }),
]);

export const validateUniversityParam = withValidationErrors([
  param("id").custom(async (value) => {
    const isValidId = mongoose.Types.ObjectId.isValid(value);
    if (!isValidId) throw new BadRequestError("invalid MongoDB id");
    const university = await tbl_university.findById(value);
    if (!university)
      throw new NotFoundError(`no university with id : ${value}`);
  }),
]);

export const validateRegisterInput = withValidationErrors([
  body("admin_name").notEmpty().withMessage("name is required"),
  body("admin_email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email format")
    .custom(async (admin_email) => {
      const user = await User.findOne({ admin_email });
      if (user) {
        throw new BadRequestError("email already exists");
      }
    }),
  body("admin_password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 8 })
    .withMessage("password must be at least 8 characters long"),
]);

export const validateLoginInput = withValidationErrors([
  body("admin_email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email format"),
  body("admin_password").notEmpty().withMessage("password is required"),
]);

export const validateLoginInputcollege = withValidationErrors([
  body("college_email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email format"),
  body("college_password").notEmpty().withMessage("password is required"),
]);

export const validateLoginInputcompany = withValidationErrors([
  body("company_email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email format"),
  body("company_password").notEmpty().withMessage("password is required"),
]);

export const validateLoginInputstudent = withValidationErrors([
  body("student_email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email format")
    .custom(async (student_email, { req }) => {
      const student = await tbl_student.findOne({ student_email });
      if (!student) {
        throw new BadRequestError("Student not found.");
      }
    }),
  body("student_password").notEmpty().withMessage("password is required"),
]);

export const validateLoginInputtpo = withValidationErrors([
  body("tpo_email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email format"),
  body("tpo_password").notEmpty().withMessage("password is required"),
]);

export const validateLoginInputuniversity = withValidationErrors([
  body("university_email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email format"),
  body("university_password").notEmpty().withMessage("password is required"),
]);

export const validateUpdateUserInput = withValidationErrors([
  body("admin_name").notEmpty().withMessage("name is required"),
  body("admin_email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email format")
    .custom(async (admin_email, { req }) => {
      const user = await User.findOne({ admin_email });
      if (user && user._id.toString() !== req.user.userId) {
        throw new BadRequestError("email already exists");
      }
    }),
]);
