"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const isHydrated = useAuthStore((state) => state.isHydrated);

	useEffect(() => {
		if (!isHydrated) return;
		if (!isAuthenticated) {
			router.replace("/login");
		}
	}, [isHydrated, isAuthenticated, router]);

	if (!isHydrated || !isAuthenticated) {
		return null;
	}

	return <>{children}</>;
}
