import mongoose from "mongoose";
import AuthRoles from "../utils/authRoles.js";

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Please provide a name for the user"],
			trim: true,
			maxLength: [50, "User name cannot exceed 50 characters"],
		},
		email: {
			type: String,
			required: [true, "Please provide an email for the user"],
			trim: true,
		},
		password: {
			type: String,
			required: [true, "Please provide a password for the user"],
			minLength: [6, "Password must be at least 6 characters long"],
			select: false,
		},
		role: {
			type: String,
			enum: Object.values(AuthRoles),
			default: AuthRoles.USER,
		},
		forgotPasswordToken: String,
		forgotPasswordExpiry: Date,
	},
	{ timeseries: true }
);

export default mongoose.model("User", userSchema);
