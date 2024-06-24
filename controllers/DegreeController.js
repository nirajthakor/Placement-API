import tbl_degree from "../model/Degree_Model.js";
import tbl_branch from "../model/BranchModel.js";
import { StatusCodes } from "http-status-codes";
import { NotFoundError } from "../errors/customErrors.js";

export const getAllDegrees = async (req, res) => {
  const degrees = await tbl_degree.find({});
  const branch = await tbl_branch.find({});
  res.status(StatusCodes.OK).json({ degrees, branch });
};

// create degree with multiple branch
export const createDegree = async (req, res) => {
  req.body.college_id = req.user.userId;
  const degree = await tbl_degree.create(req.body);
  const branchesData = req.body.branches.map((branch) => ({
    ...branch,
    degree_id: degree._id,
  }));
  const branches = await tbl_branch.insertMany(branchesData);
  res.status(StatusCodes.CREATED).json({ degree, branches });
};

export const getDegree = async (req, res) => {
  const { id } = req.params;
  const degree = await tbl_degree.findById(id);
  if (!degree) throw new NotFoundError(`no degree with id : ${id}`);
  res.status(StatusCodes.OK).json({ degree });
};

export const updateDegree = async (req, res) => {
  const { id } = req.params;

  const updatedDegree = await tbl_degree.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  if (!updatedDegree) throw new NotFoundError(`no degree with id : ${id}`);

  res
    .status(StatusCodes.OK)
    .json({ msg: "degree modified", degree: updatedDegree });
};

export const deleteDegree = async (req, res) => {
  const { id } = req.params;

  try {
    const removedDegree = await tbl_degree.findByIdAndDelete(id);
    if (!removedDegree) throw new NotFoundError(`No degree with id: ${id}`);

    // If degree was deleted, delete corresponding branches
    await tbl_branch.deleteMany({
      degree_id: removedDegree._id,
    });

    res.status(StatusCodes.OK).json({
      msg: "Degree and associated data deleted",
      degree: removedDegree,
    });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};
