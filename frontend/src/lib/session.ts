import type { QueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth.store";
import { useBookingStore } from "@/stores/booking.store";
import { useCartStore } from "@/stores/cart.store";
import { useStaffStore } from "@/stores/staffStore";

const PERSISTED_STORE_KEYS = ["auth-store", "booking-store", "cart-store"];

export function resetClientSession(queryClient?: QueryClient): void {
	useAuthStore.getState().logout();
	useCartStore.getState().clearCart();
	useBookingStore.getState().resetBooking();
	useStaffStore.getState().resetStaffState();

	if (typeof window !== "undefined") {
		for (const key of PERSISTED_STORE_KEYS) {
			window.localStorage.removeItem(key);
		}
		window.localStorage.removeItem("authUser");
		window.sessionStorage.removeItem("authUser");
	}

	if (queryClient) {
		queryClient.clear();
	}
}
