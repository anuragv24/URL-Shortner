import mongoose from "mongoose";
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    referenceToken: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false
    },

    otpHash: {
        type: String
    },
    otpExpiresAt: {
        type: Date
    },

    otpFailedAttempts: {
        type: Number,
        default : 0
    },
    lastVerificationSentAt: {
        type: Date
    },

    passwordResetTokenHash: {
        type: String
    },
    passwordResetExpiresAt: {
        type: Date
    }

}, {timestamps: true})

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next()

    this.password = await bcrypt.hash(this.password, 10)
    next()
} )

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.setOTP = async function(plainOTP, ttlMinutes = 10){
    const saltRounds = 10;
    this.otpHash = await bcrypt.hash(plainOTP, saltRounds)
    this.otpExpiresAt = Date.now() + ttlMinutes*60*1000
    this.lastVerificationSentAt = new Date()
    this.otpFailedAttempts = 0
    await this.save()
}

userSchema.methods.checkOTP = async function(plainOTP){
    if(!this.otpHash || !this.otpExpiresAt) 
        return { status: false, message: "OTP not found" }

    if(Date.now() > this.otpExpiresAt) {
        this.otpHash = undefined
        this.otpExpiresAt = undefined
        await this.save()
        return { status: false, message: "OTP has expired" }
    }

    const MAX_ATTEMPTS = 3

    if(this.otpFailedAttempts >= MAX_ATTEMPTS){
        this.otpHash = undefined
        this.otpExpiresAt = undefined
        await this.save()
        return {
            status: false,
            message: "Too many failed attempts. Your code has been invalidated"
        }
    }

    const ok = await bcrypt.compare(plainOTP, this.otpHash)
    if(!ok){
        this.otpFailedAttempts = (this.otpFailedAttempts || 0) + 1
        await this.save()

        const attemptsLeft = MAX_ATTEMPTS - this.otpFailedAttempts;
        return { status: false, message: `Incorrect OTP. You have ${attemptsLeft} attempts left.` }
    }
    
    //success
    this.otpHash = undefined
    this.otpExpiresAt = undefined
    this.otpFailedAttempts = 0
    this.isVerified = true
    await this.save()
    return { status: true, message: "Verification successful" }
}



userSchema.methods.generateAccessToken= function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    )
}

userSchema.index(
    {createdAt: 1},
    {
        expireAfterSeconds: 60*60*24*7,
        partialFilterExpression: {isVerified: false}
    }
)




const User = mongoose.model("User", userSchema)

export default User