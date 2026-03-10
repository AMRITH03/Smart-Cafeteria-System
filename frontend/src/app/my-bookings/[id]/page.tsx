"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";
import { BookingDetailView } from "@/src/components/my-bookings/detail/BookingDetailView";
import { ArrowLeft } from "lucide-react";

export default function BookingDetailPage() {
	const router = useRouter();
	const params = useParams();
	const { token, isHydrated } = useAuthStore();

	const bookingId = Number(params.id);

	useEffect(() => {
		if (isHydrated && !token) {
			router.push(`/login?redirect=/my-bookings/${bookingId}`);
		}
	}, [isHydrated, token, router, bookingId]);

	if (!bookingId || Number.isNaN(bookingId)) {
		return <div className="p-8 text-center text-red-500">Invalid booking ID.</div>;
	}

	return (
		<div className="mx-auto w-full max-w-3xl p-4 space-y-6 pb-20">
			{/* Header */}
			<div className="flex items-center gap-4">
				<button
					onClick={() => router.push("/my-bookings")}
					className="p-2 hover:bg-gray-100 rounded-full transition-colors"
				>
					<ArrowLeft size={20} />
				</button>
				<h1 className="text-2xl font-bold text-gray-900">Booking Details</h1>
			</div>

			<BookingDetailView bookingId={bookingId} />
		</div>
	);
}
