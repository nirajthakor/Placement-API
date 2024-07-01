import tbl_student from "../model/StudentModel.js";
import tbl_application from "../model/ApplicationModel.js";
import tbl_degree from "../model/Degree_Model.js";
import tbl_branch from "../model/BranchModel.js";
import tbl_tpo from "../model/TPOModel.js";
import { StatusCodes } from "http-status-codes";
import { NotFoundError } from "../errors/customErrors.js";
import { hashPassword } from "../utils/passwordUtils.js";

export const getAllStudents = async (req, res) => {
  if (req.user.role === "TPO") {
    const tpo = await tbl_tpo.findById(req.user.userId);
    const students = await tbl_student.find({
      college_id: tpo.tpo_college_id,
      degree_id: tpo.tpo_degree,
    });
    const degree = await tbl_degree.find({ college_id: tpo.tpo_college_id });
    const branch = await tbl_branch.find({ college_id: tpo.tpo_college_id });
    res.status(StatusCodes.OK).json({ students, degree, branch });
  }
  if (req.user.role === "College") {
    const students = await tbl_student.find({ college_id: req.user.userId });
    const degree = await tbl_degree.find({ college_id: req.user.userId });
    const branch = await tbl_branch.find({ college_id: req.user.userId });
    res.status(StatusCodes.OK).json({ students, degree, branch });
  }
  if (req.user.role === "University") {
    const students = await tbl_student.find({ university_id: req.user.userId });
    const degree = await tbl_degree.find({});
    const branch = await tbl_branch.find({});
    res.status(StatusCodes.OK).json({ students, degree, branch });
  }
};

export const createStudent = async (req, res) => {
  const hashedPassword = await hashPassword(req.body.student_password);
  req.body.student_password = hashedPassword;

  const student = await tbl_student.create(req.body);
  res.status(StatusCodes.CREATED).json({ msg: "student created" });
};

export const getStudent = async (req, res) => {
  const { id } = req.params;
  const student = await tbl_student.findById(id);
  if (!student) throw new NotFoundError(`no student with id : ${id}`);
  res.status(StatusCodes.OK).json({ student });
};

export const updateStudent = async (req, res) => {
  const { id } = req.params;

  const updatedStudent = await tbl_student.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  if (!updatedStudent) throw new NotFoundError(`no student with id : ${id}`);

  res
    .status(StatusCodes.OK)
    .json({ msg: "student modified", student: updatedStudent });
};

export const deleteStudent = async (req, res) => {
  const { id } = req.params;

  try {
    const removedStudent = await tbl_student.findByIdAndDelete(id);
    if (!removedStudent) throw new NotFoundError(`no student with id : ${id}`);

    // If student are deleted, delete corresponding table
    await tbl_application.deleteMany({
      student_id: removedStudent._id,
    });

    res.status(StatusCodes.OK).json({
      msg: "Student and associated data deleted",
      student: removedStudent,
    });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

export const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.params;

  const updatedStudent = await tbl_student.findByIdAndUpdate(
    id,
    { student_status: status },
    {
      new: true,
    }
  );

  if (!updatedStudent) throw new NotFoundError(`No student with id: ${id}`);

  res
    .status(StatusCodes.OK)
    .json({ msg: "Student status modified", student: updatedStudent });
};
