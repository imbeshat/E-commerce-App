import { Router } from "express";
import { generateOrder, generateRazorpayOrderId, getAllOrders, getMyOrders, updateOrderStatus } from "../controllers/order.controller.js";
import { isLoggedIn, authorize } from "../middlewares/auth.middleware";
import AuthRoles from "../utils/authRoles";

const router = Router();

export default router;
