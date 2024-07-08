import tbl_college from "../model/CollegeModel.js";
import tbl_student from "../model/StudentModel.js";
import tbl_university from "../model/UniversityMode.js";
import tbl_company from "../model/CompanyModel.js";
import User from "../model/AdminModel.js";
import tbl_tpo from "../model/TPOModel.js";
import { StatusCodes } from "http-status-codes";
import { UnauthenticatedError } from "../errors/customErrors.js";
import { comparePassword } from "../utils/passwordUtils.js";
import { createJWT } from "../utils/tokenUtils.js";

export const AdminLogin = async (req, res) => {
  const user = await User.findOne({ admin_email: req.body.admin_email });
  if (!user) throw new UnauthenticatedError("invalid credentials");
  const isPasswordCorrect = await comparePassword(
    req.body.admin_password,
    user.admin_password
  );

  if (!isPasswordCorrect) throw new UnauthenticatedError("invalid credentials");
  const token = createJWT({ userId: user._id, role: "Admin" });
  const oneDay = 1000 * 60 * 60 * 24;

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === "production",
  });

  res.status(StatusCodes.CREATED).json({ msg: "admin logged in" });
};

export const UniversityLogin = async (req, res) => {
  const user = await tbl_university.findOne({
    university_email: req.body.university_email,
  });
  if (!user) throw new UnauthenticatedError("invalid credentials");
  const isPasswordCorrect = await comparePassword(
    req.body.university_password,
    user.university_password
  );

  if (!isPasswordCorrect) throw new UnauthenticatedError("invalid credentials");

  if (user.university_status !== "1")
    throw new UnauthenticatedError("You are not active. Please contact admin.");

  const token = createJWT({ userId: user._id, role: "University" });
  const oneDay = 1000 * 60 * 60 * 24;

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === "production",
  });

  res.status(StatusCodes.CREATED).json({ msg: "university logged in" });
};

export const CollegeLogin = async (req, res) => {
  const user = await tbl_college.findOne({
    college_email: req.body.college_email,
  });
  if (!user) throw new UnauthenticatedError("invalid credentials");
  const isPasswordCorrect = await comparePassword(
    req.body.college_password,
    user.college_password
  );

  if (!isPasswordCorrect) throw new UnauthenticatedError("invalid credentials");

  if (user.college_status !== "1")
    throw new UnauthenticatedError("You are not active. Please contact admin.");

  const token = createJWT({ userId: user._id, role: "College" });
  const oneDay = 1000 * 60 * 60 * 24;

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === "production",
  });

  res.status(StatusCodes.CREATED).json({ msg: "college logged in" });
};

export const TPOLogin = async (req, res) => {
  const user = await tbl_tpo.findOne({
    tpo_email: req.body.tpo_email,
  });
  if (!user) throw new UnauthenticatedError("invalid credentials");
  const isPasswordCorrect = await comparePassword(
    req.body.tpo_password,
    user.tpo_password
  );

  if (!isPasswordCorrect) throw new UnauthenticatedError("invalid credentials");

  if (user.tpo_status !== "1")
    throw new UnauthenticatedError(
      "You are not active. Please contact college."
    );

  const token = createJWT({ userId: user._id, role: "TPO" });
  const oneDay = 1000 * 60 * 60 * 24;

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === "production",
  });

  res.status(StatusCodes.CREATED).json({ msg: "tpo logged in" });
};

export const StudentLogin = async (req, res) => {
  const user = await tbl_student.findOne({
    student_email: req.body.student_email,
  });
  if (!user) throw new UnauthenticatedError("invalid credentials");
  const isPasswordCorrect = await comparePassword(
    req.body.student_password,
    user.student_password
  );

  if (!isPasswordCorrect) throw new UnauthenticatedError("invalid credentials");

  if (user.student_status !== "1")
    throw new UnauthenticatedError("You are not active. Please contact TPO.");

  const token = createJWT({ userId: user._id, role: "Student" });
  const oneDay = 1000 * 60 * 60 * 24;

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === "production",
  });

  res.status(StatusCodes.CREATED).json({ msg: "student logged in:", token });
};

export const CompanyLogin = async (req, res) => {
  const user = await tbl_company.findOne({
    company_email: req.body.company_email,
  });
  if (!user) throw new UnauthenticatedError("invalid credentials");
  const isPasswordCorrect = await comparePassword(
    req.body.company_password,
    user.company_password
  );

  if (!isPasswordCorrect) throw new UnauthenticatedError("invalid credentials");

  if (user.company_verified !== "1")
    throw new UnauthenticatedError("You are not active. Please contact admin.");

  if (user.company_verified === "2")
    throw new UnauthenticatedError("You are Rejected. Please contact admin.");

  const token = createJWT({ userId: user._id, role: "Company" });
  const oneDay = 1000 * 60 * 60 * 24;

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === "production",
  });

  res.status(StatusCodes.CREATED).json({ msg: "company logged in" });
};

export const logout = (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: "user logged out!" });
};
