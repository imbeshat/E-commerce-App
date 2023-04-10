import dotenv from "dotenv";

dotenv.config();

const config = {
	PORT: process.env.PORT || 5000,
	MONGODB_URL: process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/ecommerce",
};

export default config;
