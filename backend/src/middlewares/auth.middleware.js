import User from "../models/user.schema.js";
import JWT from "jsonwebtoken";
import asyncHandler from "../service/asyncHandler.js";
import config from "../config/index.js";
import CustomError from "../utils/CustomeError.js";

export const isLoggedIn = asyncHandler(async (req, res, next) => {
	let token;

	// Check if token is present in cookies or headers
	if (req.cookies.token || (req.headers.authorization && req.headers.authorization.startsWith("Bearer"))) {
		token = req.cookies.token || req.headers.authorization.split(" ")[1];
	}

	// If token is not present
	if (!token) {
		throw new CustomError("Not authorized to access this resource", 401);
	}

	// Verify token
	try {
		const decodedJwtPayload = JWT.verify(token, config.JWT_SECRET);
		req.user = await User.findById(decodedJwtPayload._id, "name email role");
		next();
	} catch (error) {
		throw new CustomError("Not authorized to access this resource", 401);
	}
});

// For checking authorization of user
export const authorize = (...requiredRoles) =>
	asyncHandler(async (req, res, next) => {
		if (!requiredRoles.includes(req.user.role)) {
			throw new CustomError("Not authorized to access this resource", 403);
		}
		next();
	});
