import tbl_university from "../model/UniversityMode.js";
import tbl_college from "../model/CollegeModel.js";
import tbl_degree from "../model/Degree_Model.js";
import tbl_branch from "../model/BranchModel.js";
import { StatusCodes } from "http-status-codes";

export const getAlluniversitys = async (req, res) => {
  const universities = await tbl_university.find({});
  res.status(StatusCodes.OK).json({ universities });
};

// Endpoint to fetch colleges by university_id
export const getCollegesByUniversityId = async (req, res) => {
  const { university_id } = req.params;
  try {
    // Find colleges by university_id
    const colleges = await tbl_college.find({
      college_university_id: university_id,
    });

    // Return response with colleges
    res.status(StatusCodes.OK).json({ colleges });
  } catch (error) {
    // Handle errors
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

// Endpoint to fetch degrees by college_id
export const getDegreesByCollegeId = async (req, res) => {
  const { college_id } = req.params;

  try {
    // Find degrees by college_id
    const degrees = await tbl_degree.find({ college_id: college_id });

    // Return response with degrees
    res.status(StatusCodes.OK).json({ degrees });
  } catch (error) {
    // Handle errors
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

// Endpoint to fetch branches by degree_id
export const getBranchesByDegreeId = async (req, res) => {
  const { degree_id } = req.params;

  try {
    // Find branches by degree_id
    const branches = await tbl_branch.find({ degree_id: degree_id });

    // Return response with branches
    res.status(StatusCodes.OK).json({ branches });
  } catch (error) {
    // Handle errors
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};
