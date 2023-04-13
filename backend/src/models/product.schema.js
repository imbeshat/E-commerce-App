import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Please enter product name"],
			trim: true,
			maxLength: [100, "Product name cannot exceed 100 characters"],
		},
		price: {
			type: Number,
			required: [true, "Please enter product price"],
			maxLength: [5, "Product name cannot exceed 5 characters"],
		},
		description: {
			type: String,
			required: [true, "Please enter product description"],
		},
		photos: [
			{
				secure_url: {
					type: String,
					required: true,
				},
			},
		],
		stock: {
			type: Number,
			default: 0,
		},
		sold: {
			type: Number,
			default: 0,
		},
		collectionId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Collection",
		},
	},
	{ timestamps: true }
);

export default mongoose.model("Product", productSchema);
