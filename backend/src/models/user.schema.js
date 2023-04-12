import mongoose from "mongoose";
import AuthRoles from "../utils/authRoles.js";
import JWT from "jsonwebtoken";
import config from "../config/index.js";
import crypto from "crypto";

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

	// Generate JWT token
	getJWTtoken: function () {
		JWT.sign(
			{
				_id: this._id,
			},
			config.JWT_SECRET,
			{ expiresIn: config.JWT_EXPIRY }
		);
	},
	// Generate forgot password token
	getForgotPasswordToken: function () {
		const resetToken = crypto.randomBytes(20).toString("hex");
		// To encrypt the token generated by crypto
		this.forgotPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

		// Set token expiry time
		this.forgotPasswordExpiry = Date.now() + 10 * 60 * 1000;
		return resetToken;
	},
};

export default mongoose.model("User", userSchema);
