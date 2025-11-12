import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
    full_url: {
        type: String,
        required: true,
    },
    short_url: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    clicks: {
        type: Number,
        default: 0,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    expiresAt: {
        type: Date,
        index: {expires: 0}
    }
})

const shortUrl = mongoose.model("shortUrl", urlSchema)

export default shortUrl