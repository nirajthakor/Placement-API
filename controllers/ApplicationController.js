import tbl_application from "../model/ApplicationModel.js";
import { StatusCodes } from "http-status-codes";
import tbl_company from "../model/CompanyModel.js";
import tbl_jobpost from "../model/JobModel.js";
import tbl_student from "../model/StudentModel.js";
import tbl_joblevel from "../model/JobLevelModel.js";
import { NotFoundError } from "../errors/customErrors.js";

export const getAllApplications = async (req, res) => {
  const applications = await tbl_application.find({});
  const company = await tbl_company.find({});
  const jobs = await tbl_jobpost.find({});
  res.status(StatusCodes.OK).json({ applications, company, jobs });
};

export const getAllApply = async (req, res) => {
  const { id } = req.params;
  const applications = await tbl_application.findOne({ job_id: id });
  if (!applications) throw new NotFoundError(`No application with id : ${id}`);
  const student = await tbl_student.find({
    _id: applications.student_id,
  });
  res.status(StatusCodes.OK).json({ applications, student });
};

export const StudentAllApply = async (req, res) => {
  const { id } = req.params;
  const applications = await tbl_application.findOne({ job_id: id });
  const student = await tbl_student.find({
    // college_id: req.user.userId,
  });
  res.status(StatusCodes.OK).json({ applications, student });
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
