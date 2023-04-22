import Coupon from "../models/coupon.schema.js";
import asyncHandler from "../service/asyncHandler.js";
import CustomError from "../utils/CustomError.js";

/**********************************************************
 * @CREATE_COUPON
 * @route https://localhost:5000/api/coupon
 * @description Controller used for creating a new coupon
 * @description Only admin and Moderator can create the coupon
 * @returns Coupon Object with success message "Coupon Created SuccessFully"
 *********************************************************/

// Create a new coupon
export const createCoupon = asyncHandler(async (req, res, next) => {
	// Check if the user is admin or moderator
	if (req.user.role !== "ADMIN" && req.user.role !== "MODERATOR") {
		throw new CustomError("Only admin and moderator can create a coupon", 401);
	}

	// Get coupon code and discount from the request body
	const { code, discount, active } = req.body;

	// Check if a coupon with the given code already exists
	const existingCoupon = await Coupon.findOne({ code });
	if (existingCoupon) {
		throw new CustomError("A coupon with the provided code already exists", 400);
	}

	// Create a new coupon with the provided data
	const newCoupon = new Coupon({ code, discount, active });

	// Save the new coupon to the database
	const savedCoupon = await newCoupon.save();

	// Return the saved coupon with a success message
	res.status(201).json({
		success: true,
		message: "Coupon created successfully",
		coupon: savedCoupon,
	});
});
