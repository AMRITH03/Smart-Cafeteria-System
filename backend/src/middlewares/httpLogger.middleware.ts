import type { Request, Response, NextFunction } from "express";
import { logger } from "../config/logger";

/**
 * Express middleware that logs every HTTP request/response to winston (→ Loki).
 * Captures method, path, status code, duration, and optionally the authenticated user.
 */
export function httpLoggerMiddleware(req: Request, res: Response, next: NextFunction): void {
	// Skip health / metrics endpoints to reduce noise
	if (req.path === "/metrics" || req.path === "/healthz") {
		next();
		return;
	}

	const start = Date.now();

	res.on("finish", () => {
		const duration = Date.now() - start;
		const statusCode = res.statusCode;

		const logData = {
			event: "http_request",
			method: req.method,
			path: req.originalUrl || req.path,
			route: req.route?.path,
			status_code: statusCode,
			duration_ms: duration,
			ip: req.ip || req.headers["x-forwarded-for"]?.toString(),
			user_agent: req.headers["user-agent"],
			user_id: req.user?.id,
			user_email: req.user?.email,
			user_role: req.user?.role,
		};

		if (statusCode >= 500) {
			logger.error("HTTP request completed", logData);
		} else if (statusCode >= 400) {
			logger.warn("HTTP request completed", logData);
		} else {
			logger.info("HTTP request completed", logData);
		}
	});

	next();
}
