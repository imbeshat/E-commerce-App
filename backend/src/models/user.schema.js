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
	{ timestamps: true }
);

// Encrypt password using bcrypt before saving : Hooks
userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		return next();
	}
	this.password = await bcrypt.hash(this.password, 10); // 10 is the salt value
	next();
});

// Compare user password : Methods
userSchema.methods = {
	// Compare user password
	comparePassword: async function (enteredPassword) {
		return await bcrypt.compare(enteredPassword, this.password);
	},
};

export default mongoose.model("User", userSchema);
