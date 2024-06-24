import tbl_joblevel from "../model/JobLevelModel.js";
import { StatusCodes } from "http-status-codes";
import { NotFoundError } from "../errors/customErrors.js";

export const getAllJobLevels = async (req, res) => {
  const joblevels = await tbl_joblevel.find({});
  res.status(StatusCodes.OK).json({ joblevels });
};

export const getJobLevel = async (req, res) => {
  const { id } = req.params;
  const joblevel = await tbl_joblevel.findById(id);
  if (!joblevel) throw new NotFoundError(`no joblevel with id : ${id}`);
  res.status(StatusCodes.OK).json({ joblevel });
};

export const updateJobLevel = async (req, res) => {
  const { id } = req.params;

  const updatedJobLevel = await tbl_joblevel.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  if (!updatedJobLevel) throw new NotFoundError(`no joblevel with id : ${id}`);

  res
    .status(StatusCodes.OK)
    .json({ msg: "JobLevel modified", joblevel: updatedJobLevel });
};

export const deleteJobLevel = async (req, res) => {
  const { id } = req.params;
  const removedJobLevel = await tbl_joblevel.findByIdAndDelete(id);
  if (!removedJobLevel) throw new NotFoundError(`no joblevel with id : ${id}`);

  res
    .status(StatusCodes.OK)
    .json({ msg: "joblevel deleted", joblevel: removedJobLevel });
};
