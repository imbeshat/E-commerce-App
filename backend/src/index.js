import mongoose from "mongoose";
import app from "./app.js";
import config from "./config/index.js";

// Create and run the method to connect to the database. We can use IIFE (Immediately Invoked Function Expression) to run the method.

(async () => {
	try {
		await mongoose.connect(config.MONGODB_URL);
		console.log("Database Connected!");

		// Error express might throw - to handle that error
		app.on("error", (error) => {
			console.error("ERROR: ", error);
			throw error;
		});

		const onListening = () => {
			console.log(`Listening on port ${config.PORT}`);
		};
		app.listen(config.PORT, onListening);
	} catch (error) {
		console.error("ERROR: ", error);
		throw error;
	}
})();
