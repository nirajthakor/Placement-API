import tbl_student from "../model/StudentModel.js";
import tbl_application from "../model/ApplicationModel.js";
import { StatusCodes } from "http-status-codes";
import { NotFoundError } from "../errors/customErrors.js";
import { hashPassword } from "../utils/passwordUtils.js";

export const getAllStudents = async (req, res) => {
  const students = await tbl_student.find({});
  res.status(StatusCodes.OK).json({ students });
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
