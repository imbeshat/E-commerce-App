import { Router } from "express";
import { isLoggedIn } from "../middlewares/auth.middleware";

const router = Router();

//sign up route
router.post("/signup", signUp);

//loginin route
router.post("/login", login);

//logout route
router.post("/logout", logout);

//get user profile route
router.get("/profile", isLoggedIn, getUser);

export default router;
