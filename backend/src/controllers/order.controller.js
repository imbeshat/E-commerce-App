import Product from "../models/product.schema.js";
import Order from "../models/order.schema.js";
import Coupon from "../models/coupon.schema.js";
import asyncHandler from "../service/asyncHandler.js";
import CustomError from "../utils/CustomError.js";
import razorpay from "../config/razorpay.config.js";

/**********************************************************
 * @GENEARATE_RAZORPAY_ID
 * @route https://localhost:5000/api/order/razorpay
 * @description Controller used for genrating razorpay Id
 * @description Creates a Razorpay Id which is used for placing order
 * @returns Order Object with "Razorpay order id generated successfully"
 *********************************************************/

export const generateRazorpayOrderId = asyncHandler(async (req, res) => {
	const { products, couponCode } = req.body;

	if (!products || products.length === 0) {
		throw new CustomError("No products found", 404);
	}

	let totalAmount = 0;
	let discountAmount = 0;

	let productPriceCalculation = await Promise.all(
		products.map(async (product) => {
			const { quantity, productId } = product;
			const productFromDB = await Product.findById(productId);

			if (!productFromDB) {
				throw new CustomError("Product not found", 404);
			}

			if (productFromDB.stock < quantity) {
				return res.status(400).json({
					message: "Product out of stock",
				});
			}
			totalAmount += productFromDB.price * quantity;
		})
	);

	await productPriceCalculation;

	// TODO: If coupon code is present check for discount
	if (couponCode) {
		const couponFromDB = await Coupon.findById({ code: couponCode });
	}

	const options = {
		amount: Math.round(totalAmount * 100),
		currency: "INR",
		receipt: `receipt_${new Date().getTime()}`,
	};

	const order = await razorpay.orders.create(options);

	if (!order) {
		throw new CustomError("Unable to generate order", 500);
	}

	res.status(200).json({
		success: true,
		message: "Razorpay order id generated successfully",
		order,
	});
});

// Add order in database and update product stock
export const generateOrder = asyncHandler(async (req, res) => {
	// complete by adding more fields
	const { transactionID, products, coupon } = req.body;
});

// Get only my orders
export const getMyOrders = asyncHandler(async (req, res) => {
	//
});

// Get all orders: ADMIN
export const getAllOrders = asyncHandler(async (req, res) => {
	//
});

// Update order status
export const updateOrderStatus = asyncHandler(async (req, res) => {
	//
});
