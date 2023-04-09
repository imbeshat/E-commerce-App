import mongoose from "mongoose";
import app from "./app.js";

// Create and run the method to connect to the database. We can use IIFE (Immediately Invoked Function Expression) to run the method.

(async () => {
	try {
		await mongoose.connect("mongodb://127.0.0.1:27017/ecommerce");
		console.log("Database Connected!");

		// Error express might throw - to handle that error
		app.on("error", (error) => {
			console.error("ERROR: ", error);
			throw error;
		});

		const onListening = () => {
			console.log("Listening on port 5000");
		};
		app.listen(5000, onListening);
	} catch (error) {
		console.error("ERROR: ", error);
		throw error;
	}
})();
