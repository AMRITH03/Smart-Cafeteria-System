import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { BookingDetailService } from "@/src/services/myBookings/BookingDetailService";
import type { MyBooking, UpdateBookingPayload } from "@/src/types/myBookings.types";

/**
 * Hook to fetch a single booking by ID
 */
export function useBookingDetail(bookingId: number) {
	return useQuery<MyBooking>({
		queryKey: ["bookingDetail", bookingId],
		queryFn: async () => {
			const response = await BookingDetailService.getBookingById(bookingId);
			return response.data;
		},
		enabled: bookingId > 0,
		staleTime: 1 * 60 * 1000,
	});
}

/**
 * Hook to update a booking (menu items / group members)
 */
export function useUpdateBooking(bookingId: number) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: UpdateBookingPayload) =>
			BookingDetailService.updateBooking(bookingId, payload),
		onSuccess: () => {
			toast.success("Booking updated successfully!");
			queryClient.invalidateQueries({ queryKey: ["bookingDetail", bookingId] });
			queryClient.invalidateQueries({ queryKey: ["myBookings"] });
		},
		onError: () => {
			toast.error("Failed to update booking.");
		},
	});
}

/**
 * Hook to cancel a booking
 */
export function useCancelBooking(bookingId: number) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (reason?: string) => BookingDetailService.cancelBooking(bookingId, reason),
		onSuccess: () => {
			toast.success("Booking cancelled successfully.");
			queryClient.invalidateQueries({ queryKey: ["bookingDetail", bookingId] });
			queryClient.invalidateQueries({ queryKey: ["myBookings"] });
		},
		onError: () => {
			toast.error("Failed to cancel booking.");
		},
	});
}

/**
 * Hook to fetch user details by userId
 */
export function useUserDetail(userId: string | undefined) {
	return useQuery({
		queryKey: ["userDetail", userId],
		queryFn: async () => {
			const response = await BookingDetailService.getUserById(userId!);
			return response.data;
		},
		enabled: !!userId,
		staleTime: 10 * 60 * 1000,
	});
}

/**
 * Hook to fetch multiple user details for group members
 */
export function useGroupMemberDetails(memberIds: string[]) {
	return useQuery({
		queryKey: ["groupMemberDetails", ...memberIds],
		queryFn: async () => {
			const results = await Promise.all(
				memberIds.map((id) => BookingDetailService.getUserById(id))
			);
			return results.map((r) => r.data);
		},
		enabled: memberIds.length > 0,
		staleTime: 10 * 60 * 1000,
	});
}
