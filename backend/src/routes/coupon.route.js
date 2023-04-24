import { Router } from "express";
import { createCoupon, deleteCoupon, getAllCoupons, updateCoupon } from "../controllers/coupons.controller.js";
import { isLoggedIn, authorize } from "../middlewares/auth.middleware";
import AuthRoles from "../utils/authRoles";

const router = Router();

// Create a coupon
router.post("/", isLoggedIn, authorize(AuthRoles.ADMIN), createCoupon);

// Delete a coupon
router.delete("/:id", isLoggedIn, authorize(AuthRoles.ADMIN, AuthRoles.MODERATOR), deleteCoupon);

// Update a coupon
router.put("/:id", isLoggedIn, authorize(AuthRoles.ADMIN, AuthRoles.MODERATOR), updateCoupon);

// Get all coupons
router.get("/", isLoggedIn, authorize(AuthRoles.ADMIN, AuthRoles.MODERATOR), getAllCoupons);

export default router;
