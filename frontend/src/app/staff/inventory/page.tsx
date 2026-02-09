"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useIngredients, useStockAlerts } from "@/hooks/staff/useInventory";
import type { Ingredient } from "@/services/staff/InventoryService";
import {
	ArrowLeft,
	Package,
	Search,
	AlertTriangle,
	CheckCircle2,
	XCircle,
	TrendingDown,
	Plus,
	RefreshCw,
	ChevronDown,
	ChevronUp,
} from "lucide-react";

// Mock data for development (remove when backend is ready)
const MOCK_INGREDIENTS: Ingredient[] = [
	{
		ingredient_id: 1,
		ingredient_name: "Rice (Basmati)",
		unit_of_measurement: "kg",
		current_quantity: 150,
		minimum_threshold: 50,
		unit_cost: 65,
		supplier: "Metro Wholesale",
		last_restocked: "2026-02-08T10:00:00Z",
		created_at: "2026-01-01T00:00:00Z",
		updated_at: "2026-02-08T10:00:00Z",
	},
	{
		ingredient_id: 2,
		ingredient_name: "Cooking Oil",
		unit_of_measurement: "L",
		current_quantity: 25,
		minimum_threshold: 30,
		unit_cost: 120,
		supplier: "Fortune Foods",
		last_restocked: "2026-02-05T10:00:00Z",
		created_at: "2026-01-01T00:00:00Z",
		updated_at: "2026-02-05T10:00:00Z",
	},
	{
		ingredient_id: 3,
		ingredient_name: "Onions",
		unit_of_measurement: "kg",
		current_quantity: 80,
		minimum_threshold: 40,
		unit_cost: 35,
		supplier: "Local Vendor",
		last_restocked: "2026-02-09T06:00:00Z",
		created_at: "2026-01-01T00:00:00Z",
		updated_at: "2026-02-09T06:00:00Z",
	},
	{
		ingredient_id: 4,
		ingredient_name: "Chicken",
		unit_of_measurement: "kg",
		current_quantity: 5,
		minimum_threshold: 20,
		unit_cost: 180,
		supplier: "Fresh Meat Co.",
		last_restocked: "2026-02-07T08:00:00Z",
		created_at: "2026-01-01T00:00:00Z",
		updated_at: "2026-02-07T08:00:00Z",
	},
	{
		ingredient_id: 5,
		ingredient_name: "Tomatoes",
		unit_of_measurement: "kg",
		current_quantity: 45,
		minimum_threshold: 25,
		unit_cost: 40,
		supplier: "Local Vendor",
		last_restocked: "2026-02-09T06:00:00Z",
		created_at: "2026-01-01T00:00:00Z",
		updated_at: "2026-02-09T06:00:00Z",
	},
	{
		ingredient_id: 6,
		ingredient_name: "Salt",
		unit_of_measurement: "kg",
		current_quantity: 30,
		minimum_threshold: 10,
		unit_cost: 20,
		supplier: "Tata Salt",
		last_restocked: "2026-01-20T10:00:00Z",
		created_at: "2026-01-01T00:00:00Z",
		updated_at: "2026-01-20T10:00:00Z",
	},
	{
		ingredient_id: 7,
		ingredient_name: "Milk",
		unit_of_measurement: "L",
		current_quantity: 0,
		minimum_threshold: 50,
		unit_cost: 55,
		supplier: "Amul Dairy",
		last_restocked: "2026-02-08T06:00:00Z",
		created_at: "2026-01-01T00:00:00Z",
		updated_at: "2026-02-08T06:00:00Z",
	},
	{
		ingredient_id: 8,
		ingredient_name: "Wheat Flour",
		unit_of_measurement: "kg",
		current_quantity: 200,
		minimum_threshold: 75,
		unit_cost: 45,
		supplier: "Aashirvaad",
		last_restocked: "2026-02-06T10:00:00Z",
		created_at: "2026-01-01T00:00:00Z",
		updated_at: "2026-02-06T10:00:00Z",
	},
];

// Stock status helper
const getStockStatus = (current: number, threshold: number) => {
	if (current === 0)
		return { status: "out_of_stock", label: "Out of Stock", color: "text-red-600 bg-red-50" };
	if (current <= threshold)
		return { status: "low_stock", label: "Low Stock", color: "text-amber-600 bg-amber-50" };
	return { status: "in_stock", label: "In Stock", color: "text-emerald-600 bg-emerald-50" };
};

// Format date helper
const formatDate = (dateString: string | null) => {
	if (!dateString) return "—";
	return new Date(dateString).toLocaleDateString("en-IN", {
		day: "numeric",
		month: "short",
		year: "numeric",
	});
};

// Sort types
type SortField = "ingredient_name" | "current_quantity" | "last_restocked";
type SortOrder = "asc" | "desc";

// Table Row Component (Dumb)
interface InventoryRowProps {
	ingredient: Ingredient;
	onRestock: (id: number) => void;
}

function InventoryRow({ ingredient, onRestock }: InventoryRowProps) {
	const stockStatus = getStockStatus(ingredient.current_quantity, ingredient.minimum_threshold);
	const stockPercent = Math.min(
		(ingredient.current_quantity / ingredient.minimum_threshold) * 100,
		200
	);

	return (
		<tr className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
			{/* Name & Supplier */}
			<td className="px-4 py-4 sm:px-6">
				<div className="flex items-center gap-3">
					<div className="hidden sm:flex w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 items-center justify-center text-white font-bold text-sm shrink-0">
						{ingredient.ingredient_name.charAt(0)}
					</div>
					<div className="min-w-0">
						<p className="font-semibold text-gray-900 truncate">{ingredient.ingredient_name}</p>
						<p className="text-sm text-gray-500 truncate">{ingredient.supplier || "No supplier"}</p>
					</div>
				</div>
			</td>

			{/* Current Stock */}
			<td className="px-4 py-4 sm:px-6">
				<div className="space-y-1">
					<div className="flex items-baseline gap-1">
						<span className="font-bold text-gray-900 text-lg">{ingredient.current_quantity}</span>
						<span className="text-gray-500 text-sm">{ingredient.unit_of_measurement}</span>
					</div>
					{/* Mini progress bar */}
					<div className="w-full max-w-[100px] h-1.5 bg-gray-100 rounded-full overflow-hidden">
						<div
							className={`h-full rounded-full transition-all ${
								stockPercent < 50
									? "bg-red-500"
									: stockPercent < 100
										? "bg-amber-500"
										: "bg-emerald-500"
							}`}
							style={{ width: `${Math.min(stockPercent, 100)}%` }}
						/>
					</div>
				</div>
			</td>

			{/* Threshold (hidden on mobile) */}
			<td className="hidden md:table-cell px-4 py-4 sm:px-6">
				<span className="text-gray-600">
					{ingredient.minimum_threshold} {ingredient.unit_of_measurement}
				</span>
			</td>

			{/* Unit Cost (hidden on mobile) */}
			<td className="hidden lg:table-cell px-4 py-4 sm:px-6">
				<span className="text-gray-900 font-medium">
					{ingredient.unit_cost ? `₹${ingredient.unit_cost}` : "—"}
				</span>
			</td>

			{/* Last Restocked (hidden on small screens) */}
			<td className="hidden xl:table-cell px-4 py-4 sm:px-6">
				<span className="text-gray-600 text-sm">{formatDate(ingredient.last_restocked)}</span>
			</td>

			{/* Status */}
			<td className="px-4 py-4 sm:px-6">
				<span
					className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${stockStatus.color}`}
				>
					{stockStatus.status === "out_of_stock" && <XCircle size={12} />}
					{stockStatus.status === "low_stock" && <AlertTriangle size={12} />}
					{stockStatus.status === "in_stock" && <CheckCircle2 size={12} />}
					<span className="hidden sm:inline">{stockStatus.label}</span>
				</span>
			</td>

			{/* Actions */}
			<td className="px-4 py-4 sm:px-6">
				<button
					onClick={() => onRestock(ingredient.ingredient_id)}
					className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
				>
					<RefreshCw size={14} />
					<span className="hidden sm:inline">Restock</span>
				</button>
			</td>
		</tr>
	);
}

// Skeleton Row
function InventoryRowSkeleton() {
	return (
		<tr className="border-b border-gray-100 animate-pulse">
			<td className="px-4 py-4 sm:px-6">
				<div className="flex items-center gap-3">
					<div className="hidden sm:block w-10 h-10 rounded-lg bg-gray-200" />
					<div className="space-y-2">
						<div className="h-4 bg-gray-200 rounded w-32" />
						<div className="h-3 bg-gray-100 rounded w-24" />
					</div>
				</div>
			</td>
			<td className="px-4 py-4 sm:px-6">
				<div className="h-5 bg-gray-200 rounded w-16" />
			</td>
			<td className="hidden md:table-cell px-4 py-4 sm:px-6">
				<div className="h-4 bg-gray-100 rounded w-12" />
			</td>
			<td className="hidden lg:table-cell px-4 py-4 sm:px-6">
				<div className="h-4 bg-gray-100 rounded w-14" />
			</td>
			<td className="hidden xl:table-cell px-4 py-4 sm:px-6">
				<div className="h-4 bg-gray-100 rounded w-20" />
			</td>
			<td className="px-4 py-4 sm:px-6">
				<div className="h-6 bg-gray-200 rounded-full w-20" />
			</td>
			<td className="px-4 py-4 sm:px-6">
				<div className="h-8 bg-gray-200 rounded-lg w-20" />
			</td>
		</tr>
	);
}

// Stats Card Component
interface StatsCardProps {
	label: string;
	value: number;
	icon: React.ReactNode;
	color: string;
}

function StatsCard({ label, value, icon, color }: StatsCardProps) {
	return (
		<div className={`p-4 sm:p-5 rounded-xl border ${color}`}>
			<div className="flex items-center justify-between">
				<div>
					<p className="text-sm font-medium opacity-80">{label}</p>
					<p className="text-2xl sm:text-3xl font-bold mt-1">{value}</p>
				</div>
				<div className="p-3 rounded-lg bg-white/20">{icon}</div>
			</div>
		</div>
	);
}

// Main Inventory Page Component
export default function InventoryPage() {
	const router = useRouter();
	const [searchQuery, setSearchQuery] = useState("");
	const [showLowStockOnly, setShowLowStockOnly] = useState(false);
	const [sortField, setSortField] = useState<SortField>("ingredient_name");
	const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

	// Use real data when backend is ready, mock for now
	const { data, isLoading, isError } = useIngredients(searchQuery, showLowStockOnly);
	const ingredients = data?.data || MOCK_INGREDIENTS;

	// Calculate stats
	const stats = useMemo(() => {
		const total = ingredients.length;
		const outOfStock = ingredients.filter((i) => i.current_quantity === 0).length;
		const lowStock = ingredients.filter(
			(i) => i.current_quantity > 0 && i.current_quantity <= i.minimum_threshold
		).length;
		const inStock = total - outOfStock - lowStock;
		return { total, outOfStock, lowStock, inStock };
	}, [ingredients]);

	// Filter and sort
	const filteredIngredients = useMemo(() => {
		let filtered = [...ingredients];

		// Search filter
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(
				(i) =>
					i.ingredient_name.toLowerCase().includes(query) ||
					i.supplier?.toLowerCase().includes(query)
			);
		}

		// Low stock filter
		if (showLowStockOnly) {
			filtered = filtered.filter((i) => i.current_quantity <= i.minimum_threshold);
		}

		// Sort
		filtered.sort((a, b) => {
			let comparison = 0;
			if (sortField === "ingredient_name") {
				comparison = a.ingredient_name.localeCompare(b.ingredient_name);
			} else if (sortField === "current_quantity") {
				comparison = a.current_quantity - b.current_quantity;
			} else if (sortField === "last_restocked") {
				comparison =
					new Date(a.last_restocked || 0).getTime() - new Date(b.last_restocked || 0).getTime();
			}
			return sortOrder === "asc" ? comparison : -comparison;
		});

		return filtered;
	}, [ingredients, searchQuery, showLowStockOnly, sortField, sortOrder]);

	const handleSort = (field: SortField) => {
		if (sortField === field) {
			setSortOrder(sortOrder === "asc" ? "desc" : "asc");
		} else {
			setSortField(field);
			setSortOrder("asc");
		}
	};

	const handleRestock = (id: number) => {
		// TODO: Open restock modal
		console.log("Restock ingredient:", id);
	};

	const SortIcon = ({ field }: { field: SortField }) => {
		if (sortField !== field) return <ChevronDown size={14} className="opacity-30" />;
		return sortOrder === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
	};

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
				<div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
					<div className="flex items-center gap-4 mb-6">
						<button
							onClick={() => router.push("/staff")}
							className="p-2 hover:bg-white/10 rounded-full transition-colors"
						>
							<ArrowLeft size={24} />
						</button>
						<div>
							<h1 className="text-2xl sm:text-3xl font-bold">Inventory Management</h1>
							<p className="text-white/80 text-sm sm:text-base">
								Track and manage ingredient stock levels
							</p>
						</div>
					</div>

					{/* Stats Cards */}
					<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
						<StatsCard
							label="Total Items"
							value={stats.total}
							icon={<Package size={24} />}
							color="bg-white/10 text-white border-white/20"
						/>
						<StatsCard
							label="In Stock"
							value={stats.inStock}
							icon={<CheckCircle2 size={24} />}
							color="bg-emerald-500/20 text-white border-emerald-400/30"
						/>
						<StatsCard
							label="Low Stock"
							value={stats.lowStock}
							icon={<TrendingDown size={24} />}
							color="bg-amber-500/20 text-white border-amber-400/30"
						/>
						<StatsCard
							label="Out of Stock"
							value={stats.outOfStock}
							icon={<XCircle size={24} />}
							color="bg-red-500/20 text-white border-red-400/30"
						/>
					</div>
				</div>
			</div>

			{/* Content */}
			<div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
				{/* Search & Filters */}
				<div className="flex flex-col sm:flex-row gap-4 mb-6">
					{/* Search */}
					<div className="relative flex-1">
						<Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
						<input
							type="text"
							placeholder="Search ingredients or suppliers..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
						/>
					</div>

					{/* Low Stock Filter */}
					<button
						onClick={() => setShowLowStockOnly(!showLowStockOnly)}
						className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-medium transition-all shrink-0 ${
							showLowStockOnly
								? "bg-amber-50 border-amber-200 text-amber-700"
								: "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
						}`}
					>
						<AlertTriangle size={18} />
						<span className="hidden sm:inline">Low Stock Only</span>
						<span className="sm:hidden">Low Stock</span>
					</button>

					{/* Add Item Button */}
					<button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/25 shrink-0">
						<Plus size={18} />
						<span className="hidden sm:inline">Add Ingredient</span>
						<span className="sm:hidden">Add</span>
					</button>
				</div>

				{/* Table */}
				<div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
					<div className="overflow-x-auto">
						<table className="w-full min-w-[600px]">
							<thead>
								<tr className="bg-gray-50 border-b border-gray-100">
									<th className="px-4 py-3 sm:px-6 text-left">
										<button
											onClick={() => handleSort("ingredient_name")}
											className="flex items-center gap-1 font-semibold text-gray-600 text-sm uppercase tracking-wide hover:text-gray-900"
										>
											Ingredient
											<SortIcon field="ingredient_name" />
										</button>
									</th>
									<th className="px-4 py-3 sm:px-6 text-left">
										<button
											onClick={() => handleSort("current_quantity")}
											className="flex items-center gap-1 font-semibold text-gray-600 text-sm uppercase tracking-wide hover:text-gray-900"
										>
											Stock
											<SortIcon field="current_quantity" />
										</button>
									</th>
									<th className="hidden md:table-cell px-4 py-3 sm:px-6 text-left">
										<span className="font-semibold text-gray-600 text-sm uppercase tracking-wide">
											Threshold
										</span>
									</th>
									<th className="hidden lg:table-cell px-4 py-3 sm:px-6 text-left">
										<span className="font-semibold text-gray-600 text-sm uppercase tracking-wide">
											Unit Cost
										</span>
									</th>
									<th className="hidden xl:table-cell px-4 py-3 sm:px-6 text-left">
										<button
											onClick={() => handleSort("last_restocked")}
											className="flex items-center gap-1 font-semibold text-gray-600 text-sm uppercase tracking-wide hover:text-gray-900"
										>
											Last Restocked
											<SortIcon field="last_restocked" />
										</button>
									</th>
									<th className="px-4 py-3 sm:px-6 text-left">
										<span className="font-semibold text-gray-600 text-sm uppercase tracking-wide">
											Status
										</span>
									</th>
									<th className="px-4 py-3 sm:px-6 text-left">
										<span className="font-semibold text-gray-600 text-sm uppercase tracking-wide">
											Actions
										</span>
									</th>
								</tr>
							</thead>
							<tbody>
								{isLoading ? (
									Array.from({ length: 5 }).map((_, i) => <InventoryRowSkeleton key={i} />)
								) : filteredIngredients.length === 0 ? (
									<tr>
										<td colSpan={7} className="px-6 py-12 text-center">
											<Package size={48} className="mx-auto text-gray-300 mb-4" />
											<p className="text-gray-500 font-medium">No ingredients found</p>
											<p className="text-gray-400 text-sm">
												{searchQuery
													? "Try a different search term"
													: "Add your first ingredient to get started"}
											</p>
										</td>
									</tr>
								) : (
									filteredIngredients.map((ingredient) => (
										<InventoryRow
											key={ingredient.ingredient_id}
											ingredient={ingredient}
											onRestock={handleRestock}
										/>
									))
								)}
							</tbody>
						</table>
					</div>

					{/* Table Footer */}
					{filteredIngredients.length > 0 && (
						<div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
							<p className="text-sm text-gray-500">
								Showing{" "}
								<span className="font-medium text-gray-900">{filteredIngredients.length}</span> of{" "}
								<span className="font-medium text-gray-900">{ingredients.length}</span> ingredients
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
