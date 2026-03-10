import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ProfileService } from "../../services/profile/ProfileService";
import type { UserProfile, UpdateProfilePayload } from "../../types/profile/profile.types";
import { useAuthStore } from "@/stores/auth.store";

export function useProfile() {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const isHydrated = useAuthStore((state) => state.isHydrated);

	return useQuery<UserProfile>({
		queryKey: ["profile"],
		queryFn: ProfileService.getProfile,
		staleTime: 5 * 60 * 1000,
		enabled: isHydrated && isAuthenticated,
	});
}

export function useUpdateProfile() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: UpdateProfilePayload) => ProfileService.updateProfile(payload),
		onSuccess: () => {
			toast.success("Profile updated successfully!");
			queryClient.invalidateQueries({ queryKey: ["profile"] });
		},
		onError: () => {
			toast.error("Failed to update profile.");
		},
	});
}
