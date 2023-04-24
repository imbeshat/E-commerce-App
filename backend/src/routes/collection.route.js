import { Router } from "express";
import { createCollection, updateCollection, deleteCollection, getCollections } from "../controllers/collection.controller.js";
import { authorize, isLoggedIn } from "../middlewares/auth.middleware";
import AuthRoles from "../utils/authRoles.js";

const router = Router();

// Create a collection
router.post("/", isLoggedIn, authorize(AuthRoles.ADMIN), createCollection);

// Update a collection
router.put("/:id", isLoggedIn, authorize(AuthRoles.ADMIN, AuthRoles.MODERATOR), updateCollection);

// Delete a collection
router.delete("/:id", isLoggedIn, authorize(AuthRoles.ADMIN, AuthRoles.MODERATOR), deleteCollection);

// Get all collections
router.get("/", getCollections);

export default router;
