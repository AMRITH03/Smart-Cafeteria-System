"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";
import { MyBookingList } from "@/components/my-bookings/MyBookingList";
import { ArrowLeft, BookCheck } from "lucide-react";

export default function MyBookingsPage() {
	const router = useRouter();
	const { token, isHydrated } = useAuthStore();

	// Redirect guest users
	useEffect(() => {
		if (isHydrated && !token) {
			router.push("/login?redirect=/my-bookings");
		}
	}, [isHydrated, token, router]);

	return (
		<div className="mx-auto w-full max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl p-4 space-y-6">
			{/* Header */}
			<div className="flex items-center gap-4 mb-2">
				<button
					onClick={() => router.back()}
					className="p-2 hover:bg-gray-100 rounded-full transition-colors"
				>
					<ArrowLeft size={20} />
				</button>
				<div className="flex items-center gap-3">
					<div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
						<BookCheck size={22} />
					</div>
					<h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
				</div>
			</div>

			{/* Bookings List */}
			<MyBookingList />
		</div>
	);
}
