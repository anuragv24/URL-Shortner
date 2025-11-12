import jwt from "jsonwebtoken"
import { findUserByIdPublic } from "../dao/user.dao.js";

export const attachUser = async (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) return next();
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await findUserByIdPublic(decoded?._id);
    if (!user) next();
    req.user = user;
    next();
  } catch(error) {
    next()
  }
};