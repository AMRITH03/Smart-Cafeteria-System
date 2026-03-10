import { useQuery } from "@tanstack/react-query";
import { MyBookingsService } from "@/src/services/myBookings/MyBookingsService";
import type { MyBooking } from "@/src/types/myBookings.types";

export function useMyBookings() {
	return useQuery<MyBooking[]>({
		queryKey: ["myBookings"],
		queryFn: async () => {
			const response = await MyBookingsService.getMyBookings();
			return response.data;
		},
		staleTime: 2 * 60 * 1000,
	});
}
