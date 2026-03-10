import { apiGet } from "@/src/lib/api";
import { API_ROUTES } from "@/src/lib/routes";
import type { MyBookingsResponse } from "@/src/types/myBookings.types";

export const MyBookingsService = {
	/**
	 * Get all bookings for the authenticated user
	 * Protected endpoint - requires auth
	 */
	getMyBookings: (): Promise<MyBookingsResponse> =>
		apiGet<MyBookingsResponse>(API_ROUTES.BOOKINGS.MY_BOOKINGS),
};
