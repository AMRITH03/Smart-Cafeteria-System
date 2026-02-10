"use client";

import { StaffMealCategoryGrid } from "@/components/staff/StaffMealCategoryGrid";

export default function StaffDashboardPage() {
	return (
		<div className="min-h-[calc(100vh-6rem)] bg-gradient-to-b from-blue-600 via-blue-600 to-indigo-700">
			{/* Hero Section */}
			<div className="container mx-auto px-4 pt-8 pb-4 sm:px-6 sm:pt-10 sm:pb-6 lg:px-8 lg:pt-12 lg:pb-8">
				<div className="mb-2">
					<h1 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl xl:text-5xl">
						Staff Dashboard
					</h1>
					<p className="mt-2 text-sm text-white/80 sm:text-base lg:text-lg">
						Manage meal slots and service operations
					</p>
				</div>
			</div>

			{/* Meal Categories */}
			<StaffMealCategoryGrid />
		</div>
	);
}
