import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth.store";
import { toast } from "react-hot-toast";
import type { LoginResponse } from "@/types/auth.types";

type LoginPayload = {
	email: string;
	password: string;
};

export function useLogin() {
	const router = useRouter();
	const setToken = useAuthStore((s) => s.setToken);

	return useMutation({
		mutationFn: (payload: LoginPayload) => AuthService.login(payload),

		onSuccess: (data: LoginResponse) => {
			if (data?.data?.accessToken) {
				setToken(data.data.accessToken);
			}

			toast.success("Login successful!");

			// Check for redirect param first
			const params = new URLSearchParams(window.location.search);
			const redirect = params.get("redirect");

			// If redirect param exists and it's not the home page, use it
			if (redirect && redirect !== "/") {
				router.push(redirect);
				return;
			}

			// Otherwise, redirect based on role
			const role = data?.data?.role;
			if (role === "staff") {
				router.push("/staff");
			} else {
				router.push("/");
			}
		},

		onError: (error: { response?: { data?: { message?: string } } }) => {
			const msg = error?.response?.data?.message || "Login failed";
			toast.error(msg);
			console.error("Login failed:", error);
		},
	});
}
