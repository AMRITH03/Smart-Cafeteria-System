import { useProfile } from "./profile/useProfile";

/**
 * Hook to get user role from profile
 * Returns role information and helper flags for role-based UI
 */
export function useRole() {
	const { data: profile, isLoading, error } = useProfile();

	const role = profile?.role ?? null;
	const isStaff = role === "staff";
	const isUser = role === "user";

	return {
		role,
		isStaff,
		isUser,
		isLoading,
		error,
	};
}
