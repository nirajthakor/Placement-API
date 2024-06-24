import { StatusCodes } from "http-status-codes";
import User from "../model/AdminModel.js";
import { hashPassword } from "../utils/passwordUtils.js";

export const register = async (req, res) => {
  const hashedPassword = await hashPassword(req.body.admin_password);
  req.body.admin_password = hashedPassword;

  const user = await User.create(req.body);
  res.status(StatusCodes.CREATED).json({ msg: "user created" });
};
