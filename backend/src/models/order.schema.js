import mongoose from "mongoose";
import OrderStatus from "../utils/orderStatus.js";

const orderSchema = new mongoose.Schema(
	{
		product: {
			type: [
				{
					productId: {
						type: mongoose.Schema.Types.ObjectId,
						ref: "Product",
					},
					count: Number,
					price: Number,
				},
			],
			required: true,
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		address: {
			type: String,
			required: true,
		},
		phoneNumber: {
			type: Number,
			required: true,
		},
		amount: {
			type: Number,
			required: true,
		},
		coupon: String,
		transactionId: String,
		status: {
			type: String,
			// enum:["ORDERED", "SHIPPED", "DELIVERED", "CANCELLED"],
			// defaultValue: "ORDERED"

			// better way to do this is to use Object.values(OrderStatus)
			enum: Object.values(OrderStatus),
			default: OrderStatus.ORDERED,
		},
	},
	{ timestamps: true }
);

export default mongoose.model("Order", orderSchema);
