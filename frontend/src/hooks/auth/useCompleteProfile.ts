import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AuthService } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth.store";
import type { CompleteProfilePayload } from "@/types/auth.types";

export function useCompleteProfile() {
	const router = useRouter();
	const setAuthenticated = useAuthStore((s) => s.setAuthenticated);

	return useMutation({
		mutationFn: (payload: CompleteProfilePayload) => AuthService.completeProfile(payload),

		onSuccess: () => {
			setAuthenticated(true);
			toast.success("Profile completed! Welcome aboard.");
			router.replace("/");
		},

		onError: () => {
			toast.error("Failed to complete profile. Please try again.");
		},
	});
}
