import dotenv from "dotenv";

dotenv.config();

const config = {
	PORT: process.env.PORT || 5000,
	MONGODB_URL: process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/ecommerce",
	JWT_SECRET: process.env.JWT_SECRET || "yorsecret",
	JWT_EXPIRY: process.env.JWT_EXPIRY || "30d",
	S3_ACCESS_KEY: process.env.S3_ACCESS_KEY,
	S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY,
	S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
	S3_REGION: process.env.S3_REGION,
};

export default config;
