import { loginUser, registerUser } from "../services/auth.service.js";
import { generateAccessAndRefreshTokens } from "../services/generateAccessAndRefreshToken.service.js";
import { ApiError } from "../utils/apiErrorHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { cookieOptions } from "../config/config.js";
import { findUserByEmail, findUserByIdPublic, otpSetUp } from "../dao/user.dao.js";
import { createOTP } from "../utils/helper.js";
import { sendMail } from "../services/emailService.js";
import { sendVerificationEmail } from "../services/emailHelper.js";

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
    throw new ApiError(400, "Email and Password are required");
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
  if(!req.user){
    return res.status(200).json(
      new ApiResponse(
        200,
        {isAuthenticatedUser: false}, 
        "No authenticated user")
    )
  }

  return res.status(200).json(
      new ApiResponse(
      200,
      { 
        isAuthenticatedUser: true,
        user: req.user
       }, 
       "authenticated user"
      )
    );
});

export const verifyOtp = asyncHandler(async (req, res) => {
  const {email, otpString} = req.body
  if(!email || !otpString) {
    throw new ApiError(400, "Email and OTP required!")
  }

  const user = await findUserByEmail(email)
  if(!user){
    throw new ApiError(400, "Invalid or expired verification code.")
  }

  const VerificationResult = await user.checkOTP(otpString)
  if(!VerificationResult?.status){
    throw new ApiError(400, "Invalid or expired verification code")
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

  const GENERIC_RESPONSE = new ApiResponse(
    200,
    {},
    "If an account with this email exists,a code has been sent."
  )

  const user = await findUserByEmail(email)
  if(!user){
    return res.status(200).json(GENERIC_RESPONSE)
  }

  if(user.isVerified){
    return res.status(200).json(GENERIC_RESPONSE)
  }

  const COOLDOWN_SECOND = 60

  if(user.lastVerificationSentAt){
    const timeSinceLastOtp = new Date() - new Date(user.lastVerificationSentAt)
    const cooldownMs = COOLDOWN_SECOND * 1000

    if(timeSinceLastOtp < cooldownMs){
      throw new ApiError(429, "Please wait before requesting a new code.")
    }
  }
  const otp = await otpSetUp(user)

  // call nodemailer function
  try {
    await sendVerificationEmail(user.name, email, otp)

    return res.status(200).json(GENERIC_RESPONSE)
  } catch (error) {
    user.otpHash = undefined
    user.otpExpiresAt = undefined
    await user.save({validateBeforeSave: false})
    throw new ApiError(500, "Email could not sent. Please try again later.")
  }  
})

export const verifyEmail = asyncHandler(async(req, res) => {
  const {email} = req.body

  const user = await findUserByEmail(email)

  let otp

  try {
    if(user) {
      otp =  await otpSetUp(user, "reset_password")
      await sendVerificationEmail("user", email, otp)
    }

    return res.status(200).json(
    new ApiResponse(
      200,
      {},
      "If an account with this email exists,a code has been sent."
    )
  )
    
  } catch (error) {
    if(user && user.otpHash){
      await user.rollbackOTP()
    }
    console.log("OTP email failed:", error)
  throw new ApiError(500, "Email could not be sent. Please try again later.")
  }

})

export const OTPVerificationForPasswordChange = asyncHandler(async(req, res) => {
  const {email, otpString} = req.body

  if(!email || !otpString) {
    throw new ApiError(400, "Email and OTP required!")
  }

  const user = await findUserByEmail(email)
  if(!user){
    throw new ApiError(400, "Invalid or expired verification code.")
  }

  const VerificationResult = await user.checkOTP(otpString, "reset_password")

  if(!VerificationResult?.status){
    throw new ApiError(400, VerificationResult?.message)
  }

  user.passwordResetAllowed = true
  user.passwordResetExpiresAt = Date.now() + 5 * 60 * 1000
  await user.save()

  res.status(200).json(
    new ApiResponse(
      200,
      {},
      "OTP Verified. Proceed to set New Password"
    )
  )




  
})

export const OTPResendForPasswordChange = asyncHandler(async(req, res) => {

  const{email} = req.body
  if(!email){
    throw new ApiError(400, "Email is required")
  }

  const GENERIC_RESPONSE = new ApiResponse(
    200,
    {},
    "If an account with this email exists,a code has been sent."
  )

  const user = await findUserByEmail(email)
  if(!user){
    return res.status(200).json(GENERIC_RESPONSE)
  }

  const COOLDOWN_SECOND = 30

  if(user.lastVerificationSentAt){
    const timeSinceLastOtp = new Date() - new Date(user.lastVerificationSentAt)
    const cooldownMs = COOLDOWN_SECOND * 1000

    if(timeSinceLastOtp < cooldownMs){
      return res.status(200).json(GENERIC_RESPONSE)
    }
  }

  const otp = await otpSetUp(user, "reset_password" )

  try {
    await sendVerificationEmail("user", email, otp)

    return res.status(200).json(GENERIC_RESPONSE)
  } catch (error) {
    if(user && user.otpHash){
      await user.rollbackOTP()
    }
    console.log("OTP email failed:", error)
    return res.status(200).json(GENERIC_RESPONSE)  } 
})

export const setNewPassword = asyncHandler(async(req, res) => {
  const {email, password} = req.body

  if(!email || !password) {
    throw new ApiError(400, "Email and Password required!")
  }

  const user = await findUserByEmail(email)
  if(!user){
    throw new ApiError(400, "Unable to reset password")
  }

  if(!user.passwordResetAllowed || Date.now() > user.passwordResetExpiresAt){
    throw new ApiError(403, "OTP verification falied")
  }

user.password = password;
user.passwordResetAllowed = false;
user.passwordResetExpiresAt = undefined;
user.referenceToken = undefined;
await user.rollbackOTP()
await user.save();

res.status(200).json(
  new ApiResponse(
    200,
    {},
    "Password set Successfully"
  )
)

})

export const refreshAccessToken = asyncHandler(async(req, res) => {
  const refreshToken = req.cookies?.refreshToken

  if(!refreshToken){
    return res.status(401).json(new ApiResponse(401, {}, "Refresh token missing"))
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)

    const user = await findUserByIdPublic(decoded?.userId)

    if(!user){
      return res.status(401).json(new ApiResponse(401, {}, "Invalid refresh token"))
    }

      const accessToken =  await user.generateAccessToken()

      res.cookie("accessToken", accessToken, cookieOptions)
      return res.status(200).json(
        new ApiResponse(200, {}, "Access token refreshed successfully")
      )
  } catch (error) {
    return res.status(401).json(new ApiResponse(401, {}, "Refresh token expired"))
  }

})
