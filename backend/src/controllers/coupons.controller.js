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
export const createCoupon = asyncHandler(async (req, res) => {
	// Get coupon code and discount from the request body
	const { code, discount } = req.body;

	if (!code || !discount) {
		throw new CustomError("Please provide all the required fields", 400);
	}

	// Check if a coupon with the given code already exists
	const existingCoupon = await Coupon.findOne({ code });
	if (existingCoupon) {
		throw new CustomError("A coupon with the provided code already exists", 400);
	}

	// Create a new coupon with the provided data
	const coupon = await Coupon.create({
		code,
		discount,
	});

	// Return the created coupon with a success message
	res.status(200).json({
		success: true,
		message: "Coupon created successfully",
		coupon,
	});
});

// Update a coupon
export const updateCoupon = asyncHandler(async (req, res) => {
	const { id: couponId } = req.params;
	const { action } = req.body;

	// action is boolean or not
	if (typeof action !== "boolean") {
		throw new CustomError("Action must be a boolean value", 400);
	}

	const coupon = await Coupon.findByIdAndUpdate(
		couponId,
		{
			active: action,
		},
		{
			new: true,
			runValidators: true,
		}
	);

	if (!coupon) {
		throw new CustomError("No coupon found", 404);
	}

	res.status(200).json({
		success: true,
		message: "Coupon updated successfully",
		coupon,
	});
});

// Delete a coupon
export const deleteCoupon = asyncHandler(async (req, res) => {
	const { id: couponId } = req.params;
	const coupon = await Coupon.findByIdAndDelete(couponId);

	if (!coupon) {
		throw new CustomError("No coupon found", 404);
	}

	res.status(200).json({
		success: true,
		message: "Coupon deleted successfully",
	});
});

// Get all coupons
export const getAllCoupons = asyncHandler(async (_req, res) => {
	const coupons = await Coupon.find({});

	if (!coupons) {
		throw new CustomError("No coupons found", 400);
	}

	res.status(200).json({
		success: true,
		coupons,
	});
});
