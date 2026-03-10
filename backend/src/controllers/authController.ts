import type { Request, Response } from "express";
import { STATUS } from "../interfaces/status.types";
import {
	completeUserProfile,
	getUserById,
	getUserProfile,
	handleOAuthCallback,
	logOut,
	updateUserProfile,
} from "../services/authService";
import {
	completeProfileSchema,
	oauthCallbackSchema,
	updateProfileSchema,
} from "../validations/auth.schema";
import { logger } from "../config/logger";

export const testRoute = async (res: Response): Promise<void> => {
	res.send("Backend is running!");
};

/**
 * POST /api/auth/oauth/callback
 * Receives access_token + refresh_token from the frontend after Google OAuth redirect,
 * sets httpOnly cookies, and reports whether the public.users profile is complete.
 */
export const oauthCallback = async (req: Request, res: Response): Promise<void> => {
	try {
		const validatedData = oauthCallbackSchema.safeParse(req.body);

		if (!validatedData.success) {
			res.status(STATUS.BADREQUEST).json({ error: `Validation Error: ${validatedData.error}` });
			return;
		}

		const { access_token, refresh_token } = validatedData.data;
		const result = await handleOAuthCallback(access_token, refresh_token);

		if (!result.success) {
			res.status(result.statusCode).json({ success: false, error: result.error });
			return;
		}

		const isProduction = process.env.NODE_ENV === "production";

		res.cookie("access_token", access_token, {
			httpOnly: true,
			secure: isProduction,
			sameSite: isProduction ? "none" : "lax",
			maxAge: 60 * 60 * 1000,
		});

		res.cookie("refresh_token", refresh_token, {
			httpOnly: true,
			secure: isProduction,
			sameSite: isProduction ? "none" : "lax",
			maxAge: 30 * 24 * 60 * 60 * 1000,
		});

		logger.info("User login successful", {
			event: "auth_login",
			user_email: result.data?.email,
			status_code: result.statusCode,
			profile_complete: result.data?.profileComplete,
			user_role: result.data?.role,
			ip: req.ip || req.headers["x-forwarded-for"]?.toString(),
		});

		res.status(result.statusCode).json({
			success: true,
			data: result.data,
		});
	} catch (error) {
		logger.error("Login failed with error", {
			event: "auth_login_error",
			error: (error as Error).message,
			ip: req.ip || req.headers["x-forwarded-for"]?.toString(),
		});
		res.status(STATUS.SERVERERROR).json({ message: "Internal Server Error", error: error });
	}
};

/**
 * POST /api/auth/complete-profile
 * Creates the public.users record for an OAuth user who has not yet completed registration.
 */
export const completeProfile = async (req: Request, res: Response): Promise<void> => {
	try {
		const userId = req.user?.id;
		const email = req.user?.email;

		if (!userId || !email) {
			res.status(STATUS.UNAUTHORIZED).json({ error: "User not authenticated" });
			return;
		}

		const validatedData = completeProfileSchema.safeParse(req.body);

		if (!validatedData.success) {
			res.status(STATUS.BADREQUEST).json({ error: `Validation Error: ${validatedData.error}` });
			return;
		}

		const result = await completeUserProfile(userId, email, validatedData.data);

		if (!result.success) {
			res.status(result.statusCode).json({ success: false, error: result.error });
			return;
		}

		logger.info("Profile completed", {
			event: "auth_profile_complete",
			user_id: userId,
			user_email: email,
			status_code: result.statusCode,
			ip: req.ip || req.headers["x-forwarded-for"]?.toString(),
		});

		res.status(result.statusCode).json({
			success: true,
			message: "Profile completed successfully",
		});
	} catch (error) {
		logger.error("Profile completion failed", {
			event: "auth_profile_complete_error",
			error: (error as Error).message,
			ip: req.ip || req.headers["x-forwarded-for"]?.toString(),
		});
		res.status(STATUS.SERVERERROR).json({ message: "Internal Server Error", error: error });
	}
};

export const logoutUser = async (req: Request, res: Response) => {
	const isProduction = process.env.NODE_ENV === "production";
	res.clearCookie("access_token", {
		httpOnly: true,
		secure: isProduction,
		sameSite: isProduction ? "none" : "lax",
	});
	res.clearCookie("refresh_token", {
		httpOnly: true,
		secure: isProduction,
		sameSite: isProduction ? "none" : "lax",
	});

	const access_token = req.cookies.access_token;

	if (access_token) {
		const result = await logOut(access_token);
		if (!result.success) {
			logger.warn("Supabase SignOut failed", {
				event: "auth_logout_error",
				error: result.error,
				user_id: req.user?.id,
				user_email: req.user?.email,
				ip: req.ip || req.headers["x-forwarded-for"]?.toString(),
			});
		}
	}

	logger.info("User logged out", {
		event: "auth_logout",
		user_id: req.user?.id,
		user_email: req.user?.email,
		status_code: 200,
		ip: req.ip || req.headers["x-forwarded-for"]?.toString(),
	});

	return res.status(STATUS.SUCCESS).json({ message: "Logged out successfully" });
};

export const getProfile = async (req: Request, res: Response): Promise<void> => {
	try {
		const userId = req.user?.id;

		if (!userId) {
			res.status(STATUS.UNAUTHORIZED).json({ error: "User not authenticated" });
			return;
		}

		const result = await getUserProfile(userId);

		if (!result.success) {
			res.status(result.statusCode).json({ success: false, error: result.error });
			return;
		}

		res.status(result.statusCode).json({
			success: true,
			data: result.data,
		});
	} catch (error) {
		console.error("Get Profile Error:", error);
		res.status(STATUS.SERVERERROR).json({ message: "Internal Server Error", error: error });
	}
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
	try {
		const userId = req.user?.id;

		if (!userId) {
			res.status(STATUS.UNAUTHORIZED).json({ error: "User not authenticated" });
			return;
		}

		const validatedData = updateProfileSchema.safeParse(req.body);

		if (!validatedData.success) {
			res.status(STATUS.BADREQUEST).json({ error: `Validation Error: ${validatedData.error}` });
			return;
		}

		const result = await updateUserProfile(userId, validatedData.data);

		if (!result.success) {
			res.status(result.statusCode).json({ success: false, error: result.error });
			return;
		}

		res.status(result.statusCode).json({
			success: true,
			message: "Profile updated successfully",
			data: result.data,
		});
	} catch (error) {
		console.error("Update Profile Error:", error);
		res.status(STATUS.SERVERERROR).json({ message: "Internal Server Error", error: error });
	}
};

/**
 * GET /auth/user/:userId
 * Get basic user details by userId (for group member display in booking details)
 */
export const getUserByIdController = async (req: Request, res: Response): Promise<void> => {
	try {
		if (!req.user) {
			res.status(STATUS.UNAUTHORIZED).json({ error: "User not authenticated" });
			return;
		}

		const userId = req.params.userId as string;

		if (!userId) {
			res.status(STATUS.BADREQUEST).json({ error: "User ID is required" });
			return;
		}

		const result = await getUserById(userId);

		if (!result.success) {
			res.status(result.statusCode).json({ success: false, error: result.error });
			return;
		}

		res.status(result.statusCode).json({
			success: true,
			data: result.data,
		});
	} catch (error) {
		console.error("Get User By ID Error:", error);
		res.status(STATUS.SERVERERROR).json({ message: "Internal Server Error", error: error });
	}
};
