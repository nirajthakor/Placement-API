import tbl_jobcollegepost from "../model/JobCollegeModel.js";
import { StatusCodes } from "http-status-codes";
import { NotFoundError } from "../errors/customErrors.js";

export const getAllJobColleges = async (req, res) => {
  const jobcolleges = await tbl_jobcollegepost.find({});
  res.status(StatusCodes.OK).json({ jobcolleges });
};

export const getJobCollege = async (req, res) => {
  const { id } = req.params;
  const jobcollege = await tbl_jobcollegepost.findById(id);
  if (!jobcollege) throw new NotFoundError(`no jobcollege with id : ${id}`);
  res.status(StatusCodes.OK).json({ jobcollege });
};

export const updateJobCollege = async (req, res) => {
  const { id } = req.params;

  const updatedJobCollege = await tbl_jobcollegepost.findByIdAndUpdate(
    id,
    req.body,
    {
      new: true,
    }
  );

  if (!updatedJobCollege)
    throw new NotFoundError(`no jobcollege with id : ${id}`);

  res
    .status(StatusCodes.OK)
    .json({ msg: "jobcollege modified", jobcollege: updatedJobCollege });
};

export const deleteJobCollege = async (req, res) => {
  const { id } = req.params;
  const removedJobCollege = await tbl_jobcollegepost.findByIdAndDelete(id);
  if (!removedJobCollege)
    throw new NotFoundError(`no jobcollege with id : ${id}`);

  res
    .status(StatusCodes.OK)
    .json({ msg: "jobcollege deleted", jobcollege: removedJobCollege });
};
