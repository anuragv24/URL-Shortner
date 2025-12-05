import { nanoid } from "nanoid"
import crypto from "crypto";

export const generateNanoid = (length) => {
    return nanoid(length)
}

export const createOTP =  () => {
    return crypto.randomInt(100000, 1000000).toString()
}

