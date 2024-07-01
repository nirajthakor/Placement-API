import tbl_jobpost from "../model/JobModel.js";
import tbl_jobcollegepost from "../model/JobCollegeModel.js";
import tbl_joblevel from "../model/JobLevelModel.js";
import tbl_company from "../model/CompanyModel.js";
import tbl_application from "../model/ApplicationModel.js";
import tbl_college from "../model/CollegeModel.js";
import tbl_degree from "../model/Degree_Model.js";
import tbl_branch from "../model/BranchModel.js";
import { StatusCodes } from "http-status-codes";
import { NotFoundError } from "../errors/customErrors.js";

export const getAllJobs = async (req, res) => {
  const jobs = await tbl_jobpost.find({ job_company_id: req.user.userId });
  const jobcollege = await tbl_jobcollegepost.find({});
  const joblevel = await tbl_joblevel.find({});
  const company = await tbl_company.find({});
  const college = await tbl_college.find({});
  const degree = await tbl_degree.find({});
  const branch = await tbl_branch.find({});
  res
    .status(StatusCodes.OK)
    .json({ jobs, jobcollege, joblevel, company, college, degree, branch });
};

export const getAllJobsClg = async (req, res) => {
  const jobCollege = await tbl_jobcollegepost.find({
    job_college_id: req.user.userId,
  });
  const jobs = await tbl_jobpost.find({});
  const company = await tbl_company.find({});
  res.status(StatusCodes.OK).json({
    jobCollege,
    jobs,
    company,
  });
};

export const getJobs = async (req, res) => {
  const { search, job_type, sort } = req.query;
  const queryObject = {};

  if (search) {
    queryObject.$or = [
      { job_position: { $regex: search, $options: "i" } },
      { job_title: { $regex: search, $options: "i" } },
    ];
  }
  if (job_type && job_type !== "all") {
    queryObject.job_type = job_type;
  }
  const sortOptions = {
    newest: "-createdAt",
    oldest: "createdAt",
    "a-z": "position",
    "z-a": "-position",
  };
  const sortKey = sortOptions[sort] || sortOptions.newest;

  //setup pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const jobs = await tbl_jobpost
    .find(queryObject)
    .sort(sortKey)
    .skip(skip)
    .limit(limit);

  const company = await tbl_company.find({ job_company_id: jobs._id });

  const totalJobs = await tbl_jobpost.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalJobs / limit);
  res
    .status(StatusCodes.OK)
    .json({ totalJobs, numOfPages, currentPage: page, jobs, company });
};

export const createJob = async (req, res) => {
  req.body.job_company_id = req.user.userId;
  const job = await tbl_jobpost.create(req.body);

  req.body.job_id = job._id;
  const jobcollege = await tbl_jobcollegepost.create(req.body);

  // const collegeData = req.body.jobcollege.map((college) => ({
  //   ...college,
  //   job_id: job._id,
  // }));
  // const jobcollege = await tbl_jobcollegepost.insertMany(collegeData);

  const levelData = req.body.joblevel.map((level) => ({
    ...level,
    job_id: job._id,
  }));
  const joblevel = await tbl_joblevel.insertMany(levelData);

  res.status(StatusCodes.CREATED).json({ job, jobcollege, joblevel });
};

export const getJob = async (req, res) => {
  const { id } = req.params;
  const job = await tbl_jobpost.findById(id);
  const company = await tbl_company.findById(job.job_company_id);

  if (!job) throw new NotFoundError(`no job with id : ${id}`);
  res.status(StatusCodes.OK).json({ job, company });
};

export const updateJob = async (req, res) => {
  const { id } = req.params;

  const updatedJob = await tbl_jobpost.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  if (!updatedJob) throw new NotFoundError(`no job with id : ${id}`);

  res.status(StatusCodes.OK).json({ msg: "job modified", job: updatedJob });
};

export const deleteJob = async (req, res) => {
  const { id } = req.params;

  try {
    const removedJob = await tbl_jobpost.findByIdAndDelete(id);
    if (!removedJob) throw new NotFoundError(`no job with id : ${id}`);

    // If job are deleted, delete corresponding table
    await tbl_jobcollegepost.deleteMany({
      job_id: removedJob._id,
    });
    await tbl_joblevel.deleteMany({
      job_id: removedJob._id,
    });
    await tbl_application.deleteMany({
      job_id: removedJob._id,
    });

    res.status(StatusCodes.OK).json({
      msg: "Job and associated data deleted",
      job: removedJob,
    });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

export const updateStatus = async (req, res) => {
  const { id } = req.params;

  const job = await tbl_jobpost.findById(id);
  let newStatus;
  if (job.job_status === "1") {
    newStatus = 0;
  } else if (job.job_status === "0") {
    newStatus = 1;
  } else {
    throw new Error("Invalid job status");
  }

  const updatedJob = await tbl_jobpost.findByIdAndUpdate(
    id,
    { job_status: newStatus },
    {
      new: true,
    }
  );

  if (!updatedJob) throw new NotFoundError(`No job with id: ${id}`);

  res
    .status(StatusCodes.OK)
    .json({ msg: "Job status modified", job: updatedJob });
};
