import Product from "../models/product.schema.js";
import asyncHandler from "../service/asyncHandler.js";
import CustomError from "../utils/CustomError.js";
import formidable from "formidable";
import { s3FileUpload, s3FileDelete } from "../service/imageUpload.js";
import Mongoose from "mongoose";
import config from "../config/index.js";
import fs from "fs";

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

		// if any fiels is empty throw an error
		if (!fields.name || !fields.description || !fields.price || !fields.collectionId) {
			throw new CustomError("All fields are required", 400);
		}

		// resolve all the promises which we receive while uploading the image to the s3 bucket
		let imgArrayResponse = await Promise.all(
			Object.keys(files).map(async (file, index) => {
				const element = files[fileKey];
				console.log(element);
				const data = fs.readFileSync(element.filepath);

				// upload the image to the s3 bucket
				const upload = await s3FileUpload({
					bucketName: config.S3_BUCKET_NAME,
					key: `products/${productId}/photo_${index + 1}.png`,
					body: data,
					contentType: element.mimetype,
				});
				console.log(upload);
				return {
					secure_url: upload.Location,
				};
			})
		);

		// store in another variable
		let imgArray = imgArrayResponse;

		// send it to the database
		const product = await Product.create({
			_id: productId,
			photos: imgArray,
			...fields,
		});

		// send the response
		if (!product) {
			throw new CustomError("Product failed to be created", 400);
		}
		res.status(200).json({
			success: true,
			product,
		});
	});
});

// Get all products
export const getAllProducts = asyncHandler(async (req, res) => {
	const products = await Product.find({});

	if (!products) {
		throw new CustomError("No products found", 404);
	}

	res.status(200).json({
		success: true,
		products,
	});
});

// Get a single product
export const getSingleProduct = asyncHandler(async (req, res) => {
	const { id: productId } = req.params;
	const product = await Product.findById(productId);

	if (!product) {
		throw new CustomError("No product found", 404);
	}

	res.status(200).json({
		success: true,
		product,
	});
});

// Get all products by collection id
export const getProductByCollectionId = asyncHandler(async (req, res) => {
	const { id: collectionId } = req.params;
	const products = await Product.find({ collectionId });

	if (!products) {
		throw new CustomError("No products found", 404);
	}

	res.status(200).json({
		success: true,
		products,
	});
});

// Delete a product
export const deleteProduct = asyncHandler(async (req, res) => {
	const { id: productId } = req.params;

	const product = await Product.findById(productId);

	if (!product) {
		throw new CustomError("No product found", 404);
	}

	// delete all the images and product from the s3 bucket

	// Steps to delete photos:
	// 1. Resolve the promise
	// 2. loop through the photos array
	// 3. get the key of the image
	// 4. delete the image from the s3 bucket

	const deletePhotos = Promise.all(
		product.photos.map(async (elem, index) => {
			await s3FileDelete({
				bucketName: config.S3_BUCKET_NAME,
				key: `products/${product._id.toString()}/photo_${index + 1}.png`,
			});
		})
	);

	await deletePhotos;
	await product.remove();

	res.status(200).json({
		success: true,
		message: "Product deleted successfully",
	});
});

// Update a product
export const updateProduct = asyncHandler(async (req, res) => {
	const { id: productId } = req.params;

	let product = await Product.findById(productId);

	if (!product) {
		throw new CustomError("No product found", 404);
	}

	const form = formidable({ multiples: true, keepExtensions: true });
	form.parse(req, async (err, fields, files) => {
		if (err) {
			throw new CustomError(err.message || "Something went wrong", 500);
		}

		// if any fiels is empty throw an error
		if (!fields.name || !fields.description || !fields.price || !fields.collectionId) {
			throw new CustomError("All fields are required", 400);
		}

		// delete the existing photos from the s3 bucket
		const deletePhotos = Promise.all(
			product.photos.map(async (elem, index) => {
				await s3FileDelete({
					bucketName: config.S3_BUCKET_NAME,
					key: `products/${product._id.toString()}/photo_${index + 1}.png`,
				});
			})
		);
		await deletePhotos;

		// upload the new photos to the s3 bucket
		let imgArrayResponse = await Promise.all(
			Object.keys(files).map(async (fileKey, index) => {
				const element = files[fileKey];
				const data = fs.readFileSync(element.filepath);

				// upload the image to the s3 bucket
				const upload = await s3FileUpload({
					bucketName: config.S3_BUCKET_NAME,
					key: `products/${productId}/photo_${index + 1}.png`,
					body: data,
					contentType: element.mimetype,
				});
				return {
					secure_url: upload.Location,
				};
			})
		);

		// update the product and photo in the database
		product = await Product.findByIdAndUpdate(
			productId,
			{
				photos: imgArrayResponse,
				...fields,
			},
			{ new: true }
		);

		res.status(200).json({
			success: true,
			product,
		});
	});
});
