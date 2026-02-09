"use client";

import { StaffMealCategoryGrid } from "@/components/staff/StaffMealCategoryGrid";

export default function StaffDashboardPage() {
	return (
		<div className="min-h-screen bg-gradient-to-b from-blue-600 to-blue-700">
			{/* Hero Section */}
			<div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
				<div className="text-center mb-12">
					<h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">Staff Dashboard</h1>
					<p className="mt-4 text-lg text-white/80">Manage meal slots and service operations</p>
				</div>
			</div>

			{/* Meal Categories */}
			<StaffMealCategoryGrid />
		</div>
	);
}
