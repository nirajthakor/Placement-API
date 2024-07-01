import tbl_branch from "../model/BranchModel.js";
import { StatusCodes } from "http-status-codes";
import { NotFoundError } from "../errors/customErrors.js";

export const getAllBranchs = async (req, res) => {
  const branchs = await tbl_branch.find({});
  res.status(StatusCodes.OK).json({ branchs });
};

export const branch = async (req, res) => {
  const { id } = req.params;
  const branch = await tbl_branch.find({ degree_id: id });
  res.status(StatusCodes.OK).json({ branch });
};

export const createBranch = async (req, res) => {
  req.body.college_id = req.user.userId;
  const branch = await tbl_branch.create(req.body);
  res.status(StatusCodes.CREATED).json({ branch });
};

export const getBranch = async (req, res) => {
  const { id } = req.params;
  const branch = await tbl_branch.find({ degree_id: id });
  if (!branch) throw new NotFoundError(`no branch with id : ${id}`);
  res.status(StatusCodes.OK).json({ branch });
};

export const update = async (req, res) => {
  const { branches } = req.body; // Extract branches array directly

  // Ensure branches array exists and is not empty
  if (!branches || !Array.isArray(branches) || branches.length === 0) {
    throw new Error("branches array is missing or empty");
  }

  // Array to store updated branches
  const updatedBranches = [];

  // Update each branch in the array or add new branch if branch_id is not available
  await Promise.all(
    branches.map(async (branch) => {
      const { branch_id, ...updateData } = branch; // Extract branch_id and other updates

      // If branch_id is available, update the existing branch
      if (branch_id) {
        const updatedBranch = await tbl_branch.findByIdAndUpdate(
          branch_id,
          updateData,
          {
            new: true,
          }
        );
        updatedBranches.push(updatedBranch);
      } else {
        // If branch_id is not available, add a new branch
        const newBranch = new tbl_branch(updateData);
        const savedBranch = await newBranch.save();
        updatedBranches.push(savedBranch);
      }
    })
  );

  res
    .status(StatusCodes.OK)
    .json({ msg: "Branches modified", branches: updatedBranches });
};

export const updateBranch = async (req, res) => {
  const { id } = req.params;
  const updatedBranch = await tbl_branch.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  if (!updatedBranch) throw new NotFoundError(`no branch with id : ${id}`);

  res
    .status(StatusCodes.OK)
    .json({ msg: "branch modified", branch: updatedBranch });
};

export const deleteBranch = async (req, res) => {
  const { id } = req.params;
  const removedBranch = await tbl_branch.findByIdAndDelete(id);
  if (!removedBranch) throw new NotFoundError(`no branch with id : ${id}`);

  res
    .status(StatusCodes.OK)
    .json({ msg: "branch deleted", branch: removedBranch });
};
