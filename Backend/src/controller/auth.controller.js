import { loginUser, registerUser } from "../services/auth.service.js";
import { generateAccessAndRefreshTokens } from "../services/generateAccessAndRefreshToken.service.js";
import { ApiError } from "../utils/apiErrorHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { cookieOptions } from "../config/config.js";

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (
    Array.of(name, email, password).some(
      (field) => !field || field.trim() === ""
    )
  )
    throw new ApiError(400, "All fields are required!");

  const user = await registerUser(name, email, password);

  const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)

  res
    .status(201)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        201, 
        { user: user }, 
        "User registered  and logged in successfully"));
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, "email and password required");
  }

  const loggedInUser = await loginUser(email, password);
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    loggedInUser._id
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser },
        "user logged in successfully"
      )
    );
});

export const logout = asyncHandler(async (req, res) => {
  console.log("inside logout")
  res
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions);
  res.status(200).json(new ApiResponse(200, {}, "Logout success"));
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  res
    .status(200)
    .json(
      new ApiResponse(200, 
      { user: req.user }
      , "authenticated user")
    );
});
