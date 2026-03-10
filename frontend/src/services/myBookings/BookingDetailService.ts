import { apiGet, apiPut, apiDelete } from "@/src/lib/api";
import { API_ROUTES } from "@/src/lib/routes";
import type {
	BookingDetailResponse,
	UpdateBookingPayload,
	UpdateBookingResponse,
	CancelBookingResponse,
	UserDetailResponse,
} from "@/src/types/myBookings.types";

export const BookingDetailService = {
	/**
	 * Get a single booking by ID
	 * Protected endpoint - requires auth
	 */
	getBookingById: (bookingId: number): Promise<BookingDetailResponse> =>
		apiGet<BookingDetailResponse>(`${API_ROUTES.BOOKINGS.BY_ID}/${bookingId}`),

	/**
	 * Update a booking (menu items and/or group members)
	 * Protected endpoint - requires auth
	 */
	updateBooking: (
		bookingId: number,
		payload: UpdateBookingPayload
	): Promise<UpdateBookingResponse> =>
		apiPut<UpdateBookingResponse>(`${API_ROUTES.BOOKINGS.BY_ID}/${bookingId}`, payload),

	/**
	 * Cancel a booking
	 * Protected endpoint - requires auth
	 */
	cancelBooking: (bookingId: number, _reason?: string): Promise<CancelBookingResponse> =>
		apiDelete<CancelBookingResponse>(`${API_ROUTES.BOOKINGS.BY_ID}/${bookingId}`),

	/**
	 * Get user details by userId (for group member display)
	 * Protected endpoint - requires auth
	 */
	getUserById: (userId: string): Promise<UserDetailResponse> =>
		apiGet<UserDetailResponse>(`${API_ROUTES.AUTH.USER_BY_ID}/${userId}`),
};
