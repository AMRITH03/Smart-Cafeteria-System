"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import type { MyBookingStatus } from "@/src/types/myBookings.types";

const STATUS_OPTIONS: { value: MyBookingStatus | "all"; label: string }[] = [
	{ value: "all", label: "All Statuses" },
	{ value: "pending_payment", label: "Pending Payment" },
	{ value: "confirmed", label: "Confirmed" },
	{ value: "completed", label: "Completed" },
	{ value: "cancelled", label: "Cancelled" },
	{ value: "no_show", label: "No Show" },
];

const SLOT_OPTIONS = [
	{ value: "all", label: "All Slots" },
	{ value: "Breakfast", label: "Breakfast" },
	{ value: "Lunch", label: "Lunch" },
	{ value: "Snacks", label: "Snacks" },
	{ value: "Dinner", label: "Dinner" },
];

interface Props {
	searchQuery: string;
	onSearchChange: (query: string) => void;
	statusFilter: MyBookingStatus | "all";
	onStatusChange: (status: MyBookingStatus | "all") => void;
	slotFilter: string;
	onSlotChange: (slot: string) => void;
}

export function MyBookingSearchBar({
	searchQuery,
	onSearchChange,
	statusFilter,
	onStatusChange,
	slotFilter,
	onSlotChange,
}: Props) {
	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const filterRef = useRef<HTMLDivElement>(null);

	const activeFilterCount = useMemo(() => {
		let count = 0;
		if (statusFilter !== "all") count++;
		if (slotFilter !== "all") count++;
		return count;
	}, [statusFilter, slotFilter]);

	// Close filter dropdown on outside click
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
				setIsFilterOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleClearAll = () => {
		onSearchChange("");
		onStatusChange("all");
		onSlotChange("all");
	};

	const hasActiveFilters = searchQuery || statusFilter !== "all" || slotFilter !== "all";

	return (
		<div className="space-y-3">
			<div className="flex items-center gap-2">
				{/* Search input */}
				<div className="relative flex-1">
					<Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
					<input
						type="text"
						placeholder="Search by reference, amount, date, slot..."
						value={searchQuery}
						onChange={(e) => onSearchChange(e.target.value)}
						className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-10 text-sm font-medium text-gray-700 placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
					/>
					{searchQuery && (
						<button
							type="button"
							onClick={() => onSearchChange("")}
							className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
						>
							<X size={16} />
						</button>
					)}
				</div>

				{/* Filter button */}
				<div className="relative" ref={filterRef}>
					<button
						type="button"
						onClick={() => setIsFilterOpen(!isFilterOpen)}
						className={`relative flex items-center gap-1.5 rounded-xl border px-3 py-2.5 text-sm font-semibold transition-all ${
							isFilterOpen || activeFilterCount > 0
								? "border-blue-400 bg-blue-50 text-blue-600"
								: "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
						}`}
					>
						<SlidersHorizontal size={16} />
						<span className="hidden sm:inline">Filters</span>
						{activeFilterCount > 0 && (
							<span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
								{activeFilterCount}
							</span>
						)}
					</button>

					{/* Filter dropdown */}
					{isFilterOpen && (
						<div className="absolute right-0 top-full z-20 mt-2 w-64 rounded-xl border bg-white p-4 shadow-xl space-y-4">
							<div className="space-y-1.5">
								<label
									htmlFor="status-filter"
									className="text-xs font-bold text-gray-500 uppercase tracking-wider"
								>
									Status
								</label>
								<select
									id="status-filter"
									value={statusFilter}
									onChange={(e) => onStatusChange(e.target.value as MyBookingStatus | "all")}
									className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-100"
								>
									{STATUS_OPTIONS.map((opt) => (
										<option key={opt.value} value={opt.value}>
											{opt.label}
										</option>
									))}
								</select>
							</div>

							<div className="space-y-1.5">
								<label
									htmlFor="slot-filter"
									className="text-xs font-bold text-gray-500 uppercase tracking-wider"
								>
									Slot
								</label>
								<select
									id="slot-filter"
									value={slotFilter}
									onChange={(e) => onSlotChange(e.target.value)}
									className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-100"
								>
									{SLOT_OPTIONS.map((opt) => (
										<option key={opt.value} value={opt.value}>
											{opt.label}
										</option>
									))}
								</select>
							</div>

							{activeFilterCount > 0 && (
								<button
									type="button"
									onClick={() => {
										onStatusChange("all");
										onSlotChange("all");
									}}
									className="w-full rounded-lg border border-gray-200 py-1.5 text-xs font-bold text-gray-500 hover:bg-gray-50 transition-colors"
								>
									Clear Filters
								</button>
							)}
						</div>
					)}
				</div>
			</div>

			{/* Active filter chips */}
			{hasActiveFilters && (
				<div className="flex flex-wrap items-center gap-2">
					{searchQuery && (
						<span className="flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
							Search: &ldquo;{searchQuery}&rdquo;
							<button type="button" onClick={() => onSearchChange("")}>
								<X size={12} className="text-gray-400 hover:text-gray-600" />
							</button>
						</span>
					)}
					{statusFilter !== "all" && (
						<span className="flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600">
							{STATUS_OPTIONS.find((o) => o.value === statusFilter)?.label}
							<button type="button" onClick={() => onStatusChange("all")}>
								<X size={12} className="text-blue-400 hover:text-blue-600" />
							</button>
						</span>
					)}
					{slotFilter !== "all" && (
						<span className="flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-600">
							{slotFilter}
							<button type="button" onClick={() => onSlotChange("all")}>
								<X size={12} className="text-indigo-400 hover:text-indigo-600" />
							</button>
						</span>
					)}
					<button
						type="button"
						onClick={handleClearAll}
						className="text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors"
					>
						Clear all
					</button>
				</div>
			)}
		</div>
	);
}
