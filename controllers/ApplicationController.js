import tbl_application from "../model/ApplicationModel.js";
import { StatusCodes } from "http-status-codes";
import tbl_company from "../model/CompanyModel.js";
import tbl_jobpost from "../model/JobModel.js";
import tbl_student from "../model/StudentModel.js";
import tbl_joblevel from "../model/JobLevelModel.js";
import tbl_college from "../model/CollegeModel.js";
import tbl_degree from "../model/Degree_Model.js";
import tbl_branch from "../model/BranchModel.js";
import tbl_tpo from "../model/TPOModel.js";
import { NotFoundError } from "../errors/customErrors.js";

export const getAllApplications = async (req, res) => {
  const applications = await tbl_application.find({
    student_id: req.user.userId,
  });
  const decision = await tbl_application.find({
    student_id: req.user.userId,
    student_decision: 1,
  });
  const jobs = await tbl_jobpost.find({});
  const company = await tbl_company.find({});
  res.status(StatusCodes.OK).json({ applications, company, jobs, decision });
};

export const getAllApply = async (req, res) => {
  const { id } = req.params;
  const applications = await tbl_application.find({ job_id: id });
  if (!applications) throw new NotFoundError(`No application with id : ${id}`);
  const student = await tbl_student.find({});
  const college = await tbl_college.find({});
  const degree = await tbl_degree.find({});
  const branch = await tbl_branch.find({});
  res
    .status(StatusCodes.OK)
    .json({ applications, student, college, degree, branch });
};

export const StudentAllApply = async (req, res) => {
  const { id } = req.params;

  try {
    if (req.user.role === "College") {
      const applications = await tbl_application.find({ job_id: id });
      if (!applications) {
        throw new NotFoundError(`No application with id : ${id}`);
      }
      const students = await tbl_student.find({
        college_id: req.user.userId,
      });
      res.status(StatusCodes.OK).json({ applications, students });
    } else if (req.user.role === "TPO") {
      const applications = await tbl_application.find({ job_id: id });
      if (!applications) {
        throw new NotFoundError(`No application with id : ${id}`);
      }
      const tpo = await tbl_tpo.findOne({ _id: req.user.userId });
      const students = await tbl_student.find({
        college_id: tpo.tpo_college_id,
        degree_id: tpo.tpo_degree,
      });
      res.status(StatusCodes.OK).json({ applications, students });
    } else {
      throw new Error("Invalid role");
    }
  } catch (error) {
    console.error("Error in StudentAllApply:", error.message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

export const createApplication = async (req, res) => {
  req.body.student_id = req.user.userId;
  req.body.job_id = req.params.job_id;
  const application = await tbl_application.create(req.body);
  res.status(StatusCodes.CREATED).json({ application });
};

export const getApplication = async (req, res) => {
  const { id } = req.params;
  const application = await tbl_application.findById(id);
  const joblevel = await tbl_joblevel
    .find({ job_id: application.job_id })
    .sort("createdAt");
  if (!application) throw new NotFoundError(`no application with id : ${id}`);
  res.status(StatusCodes.OK).json({ application, joblevel });
};

export const updateApplication = async (req, res) => {
  const { id } = req.params;
  const updatedApplication = await tbl_application.findByIdAndUpdate(
    id,
    req.body,
    {
      new: true,
    }
  );

  if (!updatedApplication)
    throw new NotFoundError(`no application with id : ${id}`);

  res
    .status(StatusCodes.OK)
    .json({ msg: "application modified", application: updatedApplication });
};

export const deleteApplication = async (req, res) => {
  const { id } = req.params;
  const removedApplication = await tbl_application.findByIdAndDelete(id);
  if (!removedApplication)
    throw new NotFoundError(`no application with id : ${id}`);

  res
    .status(StatusCodes.OK)
    .json({ msg: "application deleted", application: removedApplication });
};

export const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.params;

  const updatedApplication = await tbl_application.findByIdAndUpdate(
    id,
    { application_current_status: status },
    {
      new: true,
    }
  );

  if (!updatedApplication)
    throw new NotFoundError(`No Application with id: ${id}`);

  res.status(StatusCodes.OK).json({
    msg: "Application status modified",
    application: updatedApplication,
  });
};

export const updateDecision = async (req, res) => {
  const { id } = req.params;
  const { status } = req.params;

  const updatedApplication = await tbl_application.findByIdAndUpdate(
    id,
    { student_decision: status },
    {
      new: true,
    }
  );

  if (!updatedApplication)
    throw new NotFoundError(`No Application with id: ${id}`);

  res.status(StatusCodes.OK).json({
    msg: "Application status modified",
    application: updatedApplication,
  });
};
