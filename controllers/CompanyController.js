import tbl_company from "../model/CompanyModel.js";
import tbl_job from "../model/JobModel.js";
import tbl_jobcollege from "../model/JobCollegeModel.js";
import tbl_joblevel from "../model/JobLevelModel.js";
import tbl_application from "../model/ApplicationModel.js";
import { StatusCodes } from "http-status-codes";
import { NotFoundError } from "../errors/customErrors.js";
import { hashPassword } from "../utils/passwordUtils.js";

export const getAllCompanys = async (req, res) => {
  const companys = await tbl_company.find({});
  res.status(StatusCodes.OK).json({ companys });
};

export const createCompany = async (req, res) => {
  const hashedPassword = await hashPassword(req.body.company_password);
  req.body.company_password = hashedPassword;

  if (req.file) {
    req.body.company_logo = req.file.filename;
  }

  const company = await tbl_company.create(req.body);
  res.status(StatusCodes.CREATED).json({ msg: "company created" });
};

export const getCompany = async (req, res) => {
  const { id } = req.params;
  const company = await tbl_company.findById(id);
  if (!company) throw new NotFoundError(`no company with id : ${id}`);
  res.status(StatusCodes.OK).json({ company });
};

export const updateCompany = async (req, res) => {
  const { id } = req.params;

  if (req.file) {
    req.body.company_logo = req.file.filename;
  }
  const updatedCompany = await tbl_company.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  if (!updatedCompany) throw new NotFoundError(`no company with id : ${id}`);

  res
    .status(StatusCodes.OK)
    .json({ msg: "company modified", company: updatedCompany });
};

export const deleteCompany = async (req, res) => {
  const { id } = req.params;

  try {
    const removedCompany = await tbl_company.findByIdAndDelete(id);
    if (!removedCompany) throw new NotFoundError(`no company with id : ${id}`);

    const removedJob = await tbl_job.deleteMany({
      job_company_id: id,
    });
    // If job are deleted, delete corresponding table
    await tbl_jobcollege.deleteMany({
      job_id: removedJob._id,
    });
    await tbl_joblevel.deleteMany({
      job_id: removedJob._id,
    });
    await tbl_application.deleteMany({
      job_id: removedJob._id,
    });

    res.status(StatusCodes.OK).json({
      msg: "Company and associated data deleted",
      company: removedCompany,
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

  const updatedCompany = await tbl_company.findByIdAndUpdate(
    id,
    { company_verified: status },
    {
      new: true,
    }
  );

  if (!updatedCompany) throw new NotFoundError(`No company with id: ${id}`);

  res
    .status(StatusCodes.OK)
    .json({ msg: "Company status modified", company: updatedCompany });
};
