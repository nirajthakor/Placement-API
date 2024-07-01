import tbl_college from "../model/CollegeModel.js";
import tbl_student from "../model/StudentModel.js";
import tbl_degree from "../model/Degree_Model.js";
import tbl_branch from "../model/BranchModel.js";
import tbl_tpo from "../model/TPOModel.js";
import tbl_application from "../model/ApplicationModel.js";
import { StatusCodes } from "http-status-codes";
import { NotFoundError } from "../errors/customErrors.js";
import { hashPassword } from "../utils/passwordUtils.js";

export const getAllColleges = async (req, res) => {
  if (req.user.role === "University") {
    const colleges = await tbl_college.find({
      college_university_id: req.user.userId,
    });
    res.status(StatusCodes.OK).json({ colleges });
  } else {
    const colleges = await tbl_college.find({});
    res.status(StatusCodes.OK).json({ colleges });
  }
};

export const createCollege = async (req, res) => {
  // req.body.college_university_id = req.user.userId;
  const hashedPassword = await hashPassword(req.body.college_password);
  req.body.college_password = hashedPassword;

  if (req.file) {
    req.body.college_logo = req.file.filename;
  }

  const college = await tbl_college.create(req.body);
  res.status(StatusCodes.CREATED).json({ msg: "college created" });
};

export const getCollege = async (req, res) => {
  const { id } = req.params;
  const college = await tbl_college.findById(id);
  if (!college) throw new NotFoundError(`no College with id : ${id}`);
  res.status(StatusCodes.OK).json({ college });
};

export const updateCollege = async (req, res) => {
  const { id } = req.params;

  if (req.file) {
    req.body.college_logo = req.file.filename;
  }

  const updatedCollege = await tbl_college.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  if (!updatedCollege) throw new NotFoundError(`no College with id : ${id}`);

  res
    .status(StatusCodes.OK)
    .json({ msg: "College modified", college: updatedCollege });
};

export const deleteCollege = async (req, res) => {
  const { id } = req.params;

  try {
    const removedCollege = await tbl_college.findByIdAndDelete(id);
    if (!removedCollege) {
      throw new NotFoundError(`no College with id : ${id}`);
    }

    await tbl_degree.deleteMany({
      college_id: id,
    });
    await tbl_branch.deleteMany({
      college_id: id,
    });
    await tbl_tpo.deleteMany({
      college_id: id,
    });

    // Delete related student records
    const removedStudent = await tbl_student.deleteMany({
      college_id: id,
    });
    // If student are deleted, delete corresponding table
    await tbl_application.deleteMany({
      student_id: removedStudent._id,
    });

    res.status(StatusCodes.OK).json({
      msg: "College and associated data deleted",
      college: removedCollege,
    });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

export const updateStatus = async (req, res) => {
  const { id } = req.params;

  const college = await tbl_college.findById(id);
  let newStatus;
  if (college.college_status === "1") {
    newStatus = 0;
  } else if (college.college_status === "0") {
    newStatus = 1;
  } else {
    throw new Error("Invalid college status");
  }

  const updatedCollege = await tbl_college.findByIdAndUpdate(
    id,
    { college_status: newStatus },
    {
      new: true,
    }
  );

  if (!updatedCollege) throw new NotFoundError(`No college with id: ${id}`);

  res
    .status(StatusCodes.OK)
    .json({ msg: "College status modified", college: updatedCollege });
};
