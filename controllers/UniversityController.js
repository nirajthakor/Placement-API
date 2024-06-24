import tbl_university from "../model/UniversityMode.js";
import tbl_college from "../model/CollegeModel.js";
import tbl_student from "../model/StudentModel.js";
import tbl_degree from "../model/Degree_Model.js";
import tbl_branch from "../model/BranchModel.js";
import tbl_tpo from "../model/TPOModel.js";
import tbl_application from "../model/ApplicationModel.js";
import tbl_jobcollegepost from "../model/JobCollegeModel.js";
import { StatusCodes } from "http-status-codes";
import { NotFoundError } from "../errors/customErrors.js";
import { hashPassword } from "../utils/passwordUtils.js";

export const getAlluniversitys = async (req, res) => {
  const universitys = await tbl_university.find({});
  res.status(StatusCodes.OK).json({ universitys });
};

export const createuniversity = async (req, res) => {
  const hashedPassword = await hashPassword(req.body.university_password);
  req.body.university_password = hashedPassword;

  if (req.file) {
    req.body.university_logo = req.file.filename;
  }

  const university = await tbl_university.create(req.body);
  res.status(StatusCodes.CREATED).json({ msg: "university created" });
};

export const getuniversity = async (req, res) => {
  const { id } = req.params;
  const university = await tbl_university.findById(id);
  if (!university) throw new NotFoundError(`no university with id : ${id}`);
  res.status(StatusCodes.OK).json({ university });
};

export const updateuniversity = async (req, res) => {
  const { id } = req.params;

  if (req.file) {
    req.body.university_logo = req.file.filename;
  }

  const updateduniversity = await tbl_university.findByIdAndUpdate(
    id,
    req.body,
    {
      new: true,
    }
  );

  if (!updateduniversity)
    throw new NotFoundError(`no university with id : ${id}`);

  res
    .status(StatusCodes.OK)
    .json({ msg: "university modified", university: updateduniversity });
};

export const deleteuniversity = async (req, res) => {
  const { id } = req.params;

  try {
    // Delete university
    const removedUniversity = await tbl_university.findByIdAndDelete(id);
    if (!removedUniversity) {
      throw new NotFoundError(`No university with id: ${id}`);
    }

    // Delete related job college posts
    // ---->await tbl_jobcollegepost.deleteMany({ university_id: id });

    // Delete colleges
    const removedColleges = await tbl_college.deleteMany({ university_id: id });
    // If colleges are deleted, delete corresponding table
    await tbl_degree.deleteMany({
      college_id: removedColleges._id,
    });
    await tbl_branch.deleteMany({
      college_id: removedColleges._id,
    });
    await tbl_tpo.deleteMany({
      college_id: removedColleges._id,
    });

    // Delete related student records
    const removedStudent = await tbl_student.deleteMany({ university_id: id });
    // If student are deleted, delete corresponding table
    await tbl_application.deleteMany({
      student_id: removedStudent._id,
    });

    res.status(StatusCodes.OK).json({
      msg: "University and associated data deleted",
      university: removedUniversity,
    });
  } catch (error) {
    // Handle any errors
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

export const updateStatus = async (req, res) => {
  const { id } = req.params;

  const university = await tbl_university.findById(id);
  let newStatus;
  if (university.university_status === "1") {
    newStatus = 0;
  } else if (university.university_status === "0") {
    newStatus = 1;
  } else {
    throw new Error("Invalid university status");
  }

  const updatedUniversity = await tbl_university.findByIdAndUpdate(
    id,
    { university_status: newStatus },
    {
      new: true,
    }
  );

  if (!updatedUniversity)
    throw new NotFoundError(`No university with id: ${id}`);

  res
    .status(StatusCodes.OK)
    .json({ msg: "University status modified", university: updatedUniversity });
};
