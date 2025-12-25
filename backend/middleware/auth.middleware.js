import jwt from "jsonwebtoken"
import { User } from "../models/user.models.js"

export const protect = async (req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Not authorized, Token Missing" })
    }

    const token = authHeader.split(" ")[1]

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.userId).select("-password")

        if (!user) return res.status(401).json({ message: "User not found" })

        // Add userType from JWT token to req.user
        req.user = {
            userId: user._id, // Add userId for consistency
            ...user.toObject(),
            userType: decoded.userType || 'user'
        }

        next()
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" })
    }
}