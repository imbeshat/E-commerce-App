import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./routes/index.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

app.use("/api/v1", routes);

app.get("/", (_req, res) => {
	// _req means that we don't use the req parameter
	res.send("Hello World!");
});

// handling wild card routes
app.all("*", (_req, res) => {
	res.status(404).json({
		success: false,
		message: "Page not found",
	});
});

export default app;
