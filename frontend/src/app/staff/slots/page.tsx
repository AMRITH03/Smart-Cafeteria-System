"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { StaffSlotList } from "@/components/staff/StaffSlotList";
import { ArrowLeft, Plus } from "lucide-react";

function StaffSlotsPageContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const mealType = searchParams.get("type") || "breakfast";

	const getMealTypeLabel = (type: string) => {
		const labels: Record<string, string> = {
			breakfast: "Breakfast",
			lunch: "Lunch",
			dinner: "Dinner",
			snack: "Snack",
			snacks: "Snacks",
		};
		return labels[type.toLowerCase()] || type;
	};

	return (
		<div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
			{/* Header */}
			<div className="flex items-center justify-between mb-8">
				<div className="flex items-center gap-4">
					<button
						onClick={() => router.push("/staff")}
						className="p-2 hover:bg-gray-100 rounded-full transition-colors"
					>
						<ArrowLeft size={24} />
					</button>
					<div>
						<h1 className="text-2xl font-bold text-gray-900">{getMealTypeLabel(mealType)} Slots</h1>
						<p className="text-gray-500">Manage meal slots and view bookings</p>
					</div>
				</div>

				{/* Create Slot Button */}
				<button
					onClick={() => {
						// TODO: Open create slot modal
						console.log("Create slot modal");
					}}
					className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/25"
				>
					<Plus size={20} />
					<span className="hidden sm:inline">Create Slot</span>
				</button>
			</div>

			{/* Slot List */}
			<StaffSlotList mealType={mealType} />
		</div>
	);
}

export default function StaffSlotsPage() {
	return (
		<Suspense
			fallback={
				<div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
					<div className="animate-pulse">
						<div className="h-10 bg-gray-200 rounded w-64 mb-8" />
						<div className="grid gap-4">
							{Array.from({ length: 3 }).map((_, i) => (
								<div key={i} className="h-32 bg-gray-200 rounded-xl" />
							))}
						</div>
					</div>
				</div>
			}
		>
			<StaffSlotsPageContent />
		</Suspense>
	);
}
