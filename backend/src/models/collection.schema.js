import mongoose from "mongoose";

const collectionSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Please provide a name for the collection"],
			trim: true,
			maxLength: [100, "Collection name cannot exceed 100 characters"],
		},
	},
	{ timestamps: true }
);

export default momgoose.model("Collection", collectionSchema);
