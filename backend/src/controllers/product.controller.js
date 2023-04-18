import Product from "../models/product.schema.js";
import asyncHandler from "../service/asyncHandler.js";
import CustomError from "../utils/CustomError.js";
import formidable from "formidable";
import { s3FileUpload, s3FileDelete } from "../service/imageUpload.js";
import Mongoose from "mongoose";
import config from "../config/index.js";

/**********************************************************
 * @ADD_PRODUCT
 * @route https://localhost:5000/api/product
 * @description Controller used for creating a new product
 * @description Only admin can create the coupon
 * @descriptio Uses AWS S3 Bucket for image upload
 * @returns Product Object
 *********************************************************/

// Add a new product
export const addProduct = asyncHandler(async (req, res) => {
	const form = formidable({ multiples: true, keepExtensions: true });

	form.parse(req, async (err, fields, files) => {
		if (err) {
			throw new CustomError(err.message || "Something went wrong", 500);
		}

		// Create a product id for the product and save it in the database and extract the details
		let productId = new Mongoose.Types.ObjectId().toHexString();
		console.log(fields, files);
	});
});
