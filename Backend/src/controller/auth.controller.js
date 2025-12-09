import { loginUser, registerUser } from "../services/auth.service.js";
import { generateAccessAndRefreshTokens } from "../services/generateAccessAndRefreshToken.service.js";
import { ApiError } from "../utils/apiErrorHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { cookieOptions } from "../config/config.js";
import { findUserByEmail, findUserByIdPublic } from "../dao/user.dao.js";
import { createOTP } from "../utils/helper.js";
import { sendMail } from "../services/emailService.js";

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (
    Array.of(name, email, password).some(
      (field) => !field || field.trim() === ""
    )
  )
    throw new ApiError(400, "All fields are required!");

  // const user = await registerUser(name, email, password);

  // const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)

  // res
  //   .status(201)
  //   .cookie("accessToken", accessToken, cookieOptions)
  //   .cookie("refreshToken", refreshToken, cookieOptions)
  //   .json(
  //     new ApiResponse(
  //       201, 
  //       { user: user }, 
  //       "User registered  and logged in successfully"));

  const isUserRegistered = await registerUser(name, email, password)

  if(isUserRegistered) {
    res
    .status(201)
    .json(
      new ApiResponse(
        201,
        {},
        "Registered. OTP sent to your email"
      )
    )
  }
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

export const verifyOtp = asyncHandler(async (req, res) => {
  const {email, otpString} = req.body
  if(!email || !otpString) {
    throw new ApiError(400, "Email and OTP required!")
  }

  const user = await findUserByEmail(email)
  if(!user){
    throw new ApiError(400, "User not found")
  }

  const VerificationResult = await user.checkOTP(otpString)
  if(!VerificationResult?.status){
    throw new ApiError(400, VerificationResult?.message)
  }

  const registeredUser = await findUserByIdPublic(user?._id)
  if(!registeredUser){
    throw new ApiError(400, "Something went wrong")
  }

  const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)

  res
    .status(201)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        201, 
        { user: registeredUser }, 
        "User registered  and logged in successfully"))
})

export const resendOtp = asyncHandler(async (req, res) => {
  const{email} = req.body
  if(!email){
    throw new ApiError(400, "Email is required")
  }

  const user = await findUserByEmail(email)
  if(!user){
    throw new ApiError(404, "User not found")
  }

  if(user.isVerified){
    throw new ApiError(400, "Email is already verified. You can login")
  }

  const COOLDOWN_SECOND = 60

  if(user.lastVerificationSentAt){
    const timeSinceLastOtp = new Date() - new Date(user.lastVerificationSentAt)
    const cooldownMs = COOLDOWN_SECOND * 1000

    if(timeSinceLastOtp < cooldownMs){
      const secondsRemaining = Math.ceil((cooldownMs - timeSinceLastOtp) / 1000)
      throw new ApiError(429,  `Please wait ${secondsRemaining} seconds before resending`)
    }
  }

  const otp = createOTP()
  await user.setOTP(otp)
  console.log(otp)

  // call nodemailer function
  try {
    const message = `Your new verificatioin code is:${otp}. This code expires in 10 minutes.`
    await sendMail({
      to:email,
      subject: "Your New Verification Code.",
      text: message,
      html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Hello ${user.name},</h2>
            <p>You requested a new verification code:</p>
            <h1 style="color: #4F46E5; letter-spacing: 5px;">${otp}</h1>
            <p>This code expires in 10 minutes.</p>
            <p>If you didn't request this, please ignore this email.</p>
            <br>
            <p>Thanks,<br>${process.env.APP_NAME}</p>
          </div>
      `
    })

    return res.status(200).json(
      new ApiResponse(
        200,
        {},
        "Verification code sent successfully"
      )
    )
  } catch (error) {
    user.otpHash = undefined
    user.otpExpiresAt = undefined
    await user.save({validateBeforeSave: false})
    throw new ApiError(500, "Email could not sent. Please try again later.")
  }  
})
