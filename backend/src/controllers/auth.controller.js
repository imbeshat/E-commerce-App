import asyncHandler from "../service/asyncHandler";
import CustomError from "../service/CustomError";
import User from "../models/user.schema.js";
import mailHelper from "../utils/mailHelper.js";

export const cookieOptions = {
	expires: new Date(Date.now() + 3 * 30 * 24 * 60 * 60 * 1000),
	httpOnly: true,
};

/******************************************************
 * @SIGNUP
 * @route http://localhost:5000/api/auth/signup
 * @description User signUp Controller for creating new user
 * @returns User Object
 ******************************************************/

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

/*********************************************************
 * @LOGIN
 * @route http://localhost:5000/api/auth/login
 * @description User Login Controller for signing in the user
 * @returns User Object
 *********************************************************/

// login a user
export const login = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	// check if user already exists i.e all validations
	if (!email || !password) {
		throw new CustomError("Please enter all fields", 400);
	}

	const user = User.findOne({ email }).select("+password");

	//check if no user exists
	if (!user) {
		throw new CustomError("Invalid Credentials", 400);
	}

	// check if password matches
	const isPasswordMatched = await user.comparePassword(password);

	// if password does match
	if (isPasswordMatched) {
		const token = user.getJWTtoken();
		user.password = undefined;

		// store this token in user's cookie
		res.cookie("token", token, cookieOptions); //this is an httpOnly cookie so it cannot be accessed by the user i.e. it is read only

		// send back a response to the user
		return res.status(200).json({
			success: true,
			token,
			user,
		});
	} else {
		throw new CustomError("Incorrect Password", 400);
	}
});

/**********************************************************
 * @LOGOUT
 * @route http://localhost:5000/api/auth/logout
 * @description User Logout Controller for logging out the user
 * @description Removes token from cookies
 * @returns Success Message with "Logged Out"
 **********************************************************/

// logout a user
export const logout = asyncHandler(async (req, res) => {
	res.cookie("token", null, {
		expires: new Date(Date.now()),
		httpOnly: true,
	});

	res.status(200).json({
		success: true,
		message: "Logged out",
	});
});

/**********************************************************
 * @GET_PROFILE
 * @route http://localhost:5000/api/auth/profile
 * @description check token in cookies, if present then returns user details
 * @returns Logged In User Details
 **********************************************************/

// Get profile of a user
export const getProfile = asyncHandler(async (req, res) => {
	const { user } = req;

	if (!user) {
		throw new CustomError("User not found", 401);
	}

	res.status(200).json({
		success: true,
		user,
	});
});

// forgot password
export const forgotPassword = asyncHandler(async (req, res) => {
	const { email } = req.body;

	if (!email) {
		throw new CustomError("Email not found", 404);
	}

	const user = await User.findOne({ email });

	if (!user) {
		throw new CustomError("User not found", 404);
	}

	const resetToken = user.generateForgotPasswordToken();
	await user.save({ validateBeforeSave: false });

	const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/auth/password/reset/${resetToken}`;

	const message = `Your password reset token is as follow: \n\n ${resetUrl} \n\n If you have not requested this email, then ignore it.`;

	try {
		await mailHelper.sendEmail({
			email: user.email,
			subject: "Password Reset Token",
			message,
		});
	} catch (error) {
		user.forgotPasswordToken = undefined;
		user.forgotPasswordExpire = undefined;
		await user.save({ validateBeforeSave: false });
		throw new CustomError(error.message || "Email could not be sent", 500);
	}
});

// reset password
export const resetPassword = asyncHandler(async (req, res) => {
	const { token: resetToken } = req.params;
	const { password, confirmPassword } = req.body;
	const resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

	if (password !== confirmPassword) {
		throw new CustomError("Password do not match", 400);
	}

	const user = await User.findOne({
		forgotPasswordToken: resetPasswordToken,
		forgotPasswordExpiry: { $gt: Date.now() },
	});

	if (!user) {
		throw new CustomError("Password reset token is Invalid", 400);
	}

	user.password = password;
	user.forgotPasswordToken = undefined;
	user.forgotPasswordExpiry = undefined;

	await user.save();

	//Below is the Optional code
	const token = user.getJWTtoken();
	res.cookie("token", token, cookieOptions);

	res.status(200).json({
		success: true,
		token,
		user,
	});
});
