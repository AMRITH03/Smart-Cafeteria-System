import { useMutation } from "@tanstack/react-query";
import { StripeService, StripeSessionResponse } from "@/services/payment/StripeService";
import { toast } from "sonner";

export function useStripeCheckout() {
	return useMutation<StripeSessionResponse, Error, string>({
		mutationFn: (bookingId: string) => StripeService.createCheckoutSession(bookingId),
		onSuccess: () => {
			toast.success("Payment session created. Redirecting to checkout...");
		},
		onError: (error: unknown) => {
			console.error("Stripe Session Error:", error);
			toast.error("Failed to initialize payment. Please try again.");
		},
	});
}
