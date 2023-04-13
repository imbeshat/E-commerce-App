import asyncHandler from "../service/asyncHandler";
import CustomError from "../service/CustomError";
import User from "../models/user.schema.js";

export const cookieOptions = {
	expires: new Date(Date.now() + 3 * 30 * 24 * 60 * 60 * 1000),
	httpOnly: true,
};

// sign up a new user
export default signUp = asyncHandler(async (req, res) => {
	// get data from user
	const { name, email, password } = req.body;

	// check if user already exists i.e all validations
	if (!name || !email || !password) {
		// throw new Error("Error"); - we are using custom error. This is default error
		throw new CustomError("Please enter all fields", 400);
	}

	// add user to database

	// check if user already exists
	const existingUser = await User.findOne({ email });

	if (existingUser) {
		throw new CustomError("User already exists", 400);
	}

	// create new user
	const user = await User.create({
		name,
		email,
		password,
	});

	const token = user.getJWTtoken();

	// safety check
	user.password = password;

	// store this token in user's cookie
	res.cookie("token", token, cookieOptions); //this is an httpOnly cookie so it cannot be accessed by the user i.e. it is read only

	// send back a response to the user
	res.status(200).json({
		success: true,
		token,
		user,
	});
});
