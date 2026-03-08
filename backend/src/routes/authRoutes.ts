import { Router } from "express";
import {
	completeProfile,
	getProfile,
	getUserByIdController,
	logoutUser,
	oauthCallback,
	testRoute,
	updateProfile,
} from "../controllers/authController";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

router.get("/test", testRoute);
router.post("/oauth/callback", oauthCallback);
router.post("/complete-profile", requireAuth, completeProfile);
router.post("/signOut", requireAuth, logoutUser);
router.get("/profile", requireAuth, getProfile);
router.put("/profile", requireAuth, updateProfile);
router.get("/user/:userId", requireAuth, getUserByIdController);

export default router;
