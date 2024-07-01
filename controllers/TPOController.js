import tbl_tpo from "../model/TPOModel.js";
import tbl_degree from "../model/Degree_Model.js";
import { StatusCodes } from "http-status-codes";
import { NotFoundError } from "../errors/customErrors.js";
import { hashPassword } from "../utils/passwordUtils.js";

export const getAllTPOs = async (req, res) => {
  const tpos = await tbl_tpo.find({ tpo_college_id: req.user.userId });
  const degree = await tbl_degree.find({ college_id: req.user.userId });
  res.status(StatusCodes.OK).json({ tpos, degree });
};

export const createTPO = async (req, res) => {
  req.body.tpo_college_id = req.user.userId;
  const hashedPassword = await hashPassword(req.body.tpo_password);
  req.body.tpo_password = hashedPassword;

  if (req.file) {
    req.body.tpo_image = req.file.filename;
  }

  const tpo = await tbl_tpo.create(req.body);
  res.status(StatusCodes.CREATED).json({ msg: "tpo created" });
};

export const getTPO = async (req, res) => {
  const { id } = req.params;
  const tpo = await tbl_tpo.findById(id);
  if (!tpo) throw new NotFoundError(`no tpo with id : ${id}`);
  res.status(StatusCodes.OK).json({ tpo });
};

export const updateTPO = async (req, res) => {
  const { id } = req.params;

  if (req.file) {
    req.body.tpo_image = req.file.filename;
  }

  const updatedTPO = await tbl_tpo.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  if (!updatedTPO) throw new NotFoundError(`no tpo with id : ${id}`);

  res.status(StatusCodes.OK).json({ msg: "tpo modified", tpo: updatedTPO });
};

export const deleteTPO = async (req, res) => {
  const { id } = req.params;
  const removedTPO = await tbl_tpo.findByIdAndDelete(id);
  if (!removedTPO) throw new NotFoundError(`no tpo with id : ${id}`);

  res.status(StatusCodes.OK).json({ msg: "tpo deleted", tpo: removedTPO });
};

export const updateStatus = async (req, res) => {
  const { id } = req.params;

  const TPO = await tbl_tpo.findById(id);
  let newStatus;
  if (TPO.tpo_status === "1") {
    newStatus = 0;
  } else if (TPO.tpo_status === "0") {
    newStatus = 1;
  } else {
    throw new Error("Invalid TPO status");
  }

  const updatedTPO = await tbl_tpo.findByIdAndUpdate(
    id,
    { tpo_status: newStatus },
    {
      new: true,
    }
  );

  if (!updatedTPO) throw new NotFoundError(`No TPO with id: ${id}`);

  res
    .status(StatusCodes.OK)
    .json({ msg: "TPO status modified", TPO: updatedTPO });
};
