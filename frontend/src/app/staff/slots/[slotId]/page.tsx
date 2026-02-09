"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
	useSlotDetails,
	useServiceCounters,
	useActivateMealSlot,
	useCallNextToken,
	useMarkTokenServed,
	useCloseCounter,
	useReopenCounter,
	type ServingToken,
} from "@/hooks/staff/useStaffSlots";
import type { CounterResponse } from "@/services/staff/StaffService";
import {
	ArrowLeft,
	Play,
	CheckCircle2,
	Users,
	PhoneCall,
	ChevronRight,
	X,
	RotateCcw,
	UtensilsCrossed,
	Hash,
	UserCheck,
	Clock,
	ChefHat,
} from "lucide-react";

// ============================================
// Dumb Components
// ============================================

// Counter Tab Component
interface CounterTabProps {
	counter: CounterResponse;
	isSelected: boolean;
	onSelect: () => void;
}

function CounterTab({ counter, isSelected, onSelect }: CounterTabProps) {
	const isActive = counter.is_active;

	return (
		<button
			onClick={onSelect}
			disabled={!isActive}
			className={`flex-shrink-0 px-4 py-3 rounded-xl border-2 transition-all min-w-[140px] ${
				isSelected
					? "border-blue-500 bg-blue-50 shadow-md"
					: isActive
						? "border-gray-200 bg-white hover:border-blue-200 hover:bg-blue-50/50"
						: "border-gray-200 bg-gray-100 cursor-not-allowed opacity-60"
			}`}
		>
			<div className="text-center">
				<div className="flex items-center justify-center gap-2">
					<span className={`w-2 h-2 rounded-full ${isActive ? "bg-green-500" : "bg-gray-400"}`} />
					<span
						className={`font-semibold text-sm ${isSelected ? "text-blue-700" : "text-gray-900"}`}
					>
						{counter.counter_name}
					</span>
				</div>
				<p className="text-xs text-gray-500 mt-1">{counter.current_queue_length} in queue</p>
			</div>
		</button>
	);
}

// Serving Token Card Component
interface ServingTokenCardProps {
	token: ServingToken;
}

function ServingTokenCard({ token }: ServingTokenCardProps) {
	return (
		<div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200 p-6 shadow-lg">
			{/* Token Header */}
			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center gap-3">
					<div className="w-12 h-12 bg-green-500 text-white rounded-xl flex items-center justify-center">
						<ChefHat size={24} />
					</div>
					<div>
						<h3 className="text-2xl font-bold text-green-800">{token.token_number}</h3>
						<p className="text-sm text-green-600">Now Serving</p>
					</div>
				</div>
				<span className="px-3 py-1.5 bg-green-500 text-white text-sm font-semibold rounded-full">
					{token.token_status.toUpperCase()}
				</span>
			</div>

			{/* Token Details */}
			<div className="grid grid-cols-2 gap-4 mb-4">
				<div className="flex items-center gap-2 text-gray-700">
					<Hash size={16} className="text-gray-400" />
					<span className="text-sm">Ref: {token.booking_reference}</span>
				</div>
				<div className="flex items-center gap-2 text-gray-700">
					<UserCheck size={16} className="text-gray-400" />
					<span className="text-sm">Group Size: {token.group_size}</span>
				</div>
			</div>

			{/* Meal Items */}
			{token.meal_items && token.meal_items.length > 0 && (
				<div className="mt-4 pt-4 border-t border-green-200">
					<h4 className="text-sm font-semibold text-green-800 mb-3 flex items-center gap-2">
						<UtensilsCrossed size={16} />
						Meal Items
					</h4>
					<div className="space-y-2">
						{token.meal_items.map((item, index) => (
							<div
								key={index}
								className="flex items-center justify-between bg-white/60 rounded-lg px-3 py-2"
							>
								<span className="text-gray-800">{item.item_name}</span>
								<span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-sm font-medium">
									x{item.quantity}
								</span>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}

// Skeleton Components
function CounterTabsSkeleton() {
	return (
		<div className="flex gap-3 overflow-hidden">
			{Array.from({ length: 4 }).map((_, i) => (
				<div
					key={i}
					className="flex-shrink-0 w-[140px] h-[70px] rounded-xl bg-gray-200 animate-pulse"
				/>
			))}
		</div>
	);
}

function ServingTokenSkeleton() {
	return (
		<div className="bg-gray-100 rounded-2xl border p-6 animate-pulse">
			<div className="flex items-center gap-3 mb-4">
				<div className="w-12 h-12 bg-gray-300 rounded-xl" />
				<div>
					<div className="h-7 w-40 bg-gray-300 rounded mb-1" />
					<div className="h-4 w-24 bg-gray-200 rounded" />
				</div>
			</div>
			<div className="grid grid-cols-2 gap-4">
				<div className="h-5 bg-gray-200 rounded" />
				<div className="h-5 bg-gray-200 rounded" />
			</div>
		</div>
	);
}

// ============================================
// Main Page Component
// ============================================

export default function StaffSlotDetailPage() {
	const params = useParams();
	const router = useRouter();
	const slotId = params.slotId as string;

	const [selectedCounterId, setSelectedCounterId] = useState<number | null>(null);
	const [showAllCounters, setShowAllCounters] = useState(false);
	const [currentServingToken, setCurrentServingToken] = useState<ServingToken | null>(null);

	// Hooks
	const { data: slotData, isLoading: slotLoading } = useSlotDetails(slotId);
	const { data: countersData, isLoading: countersLoading } = useServiceCounters();

	const activateMealSlotMutation = useActivateMealSlot();
	const callNextTokenMutation = useCallNextToken();
	const markServedMutation = useMarkTokenServed();
	const closeCounterMutation = useCloseCounter();
	const reopenCounterMutation = useReopenCounter();

	const slot = slotData?.data;
	const counters = countersData?.data || [];
	const visibleCounters = showAllCounters ? counters : counters.slice(0, 5);
	const hasMoreCounters = counters.length > 5;

	const selectedCounter = counters.find((c) => c.counter_id === selectedCounterId);
	const isSlotActive = slot?.is_active ?? false;

	// Handlers
	const handleActivateSlot = () => {
		activateMealSlotMutation.mutate(slotId);
	};

	const handleCallNextToken = () => {
		if (!selectedCounterId) return;

		callNextTokenMutation.mutate(String(selectedCounterId), {
			onSuccess: (data) => {
				if (data.data) {
					setCurrentServingToken(data.data);
				} else {
					setCurrentServingToken(null);
				}
			},
		});
	};

	const handleMarkServed = () => {
		if (!currentServingToken) return;

		markServedMutation.mutate(String(currentServingToken.token_id), {
			onSuccess: () => {
				setCurrentServingToken(null);
			},
		});
	};

	const handleCloseCounter = () => {
		if (!selectedCounterId) return;
		closeCounterMutation.mutate(String(selectedCounterId), {
			onSuccess: () => {
				setCurrentServingToken(null);
			},
		});
	};

	const handleReopenCounter = () => {
		if (!selectedCounterId) return;
		reopenCounterMutation.mutate(String(selectedCounterId));
	};

	return (
		<div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 max-w-4xl">
			{/* Header */}
			<div className="flex items-center justify-between mb-8">
				<div className="flex items-center gap-4">
					<button
						onClick={() => router.back()}
						className="p-2 hover:bg-gray-100 rounded-full transition-colors"
					>
						<ArrowLeft size={24} />
					</button>
					<div>
						<h1 className="text-2xl font-bold text-gray-900">
							{slotLoading ? "Loading..." : slot?.slot_name || "Slot Management"}
						</h1>
						<p className="text-gray-500">Manage tokens and service counters</p>
					</div>
				</div>

				{/* Activate Slot Button */}
				<button
					onClick={handleActivateSlot}
					disabled={isSlotActive || activateMealSlotMutation.isPending || slotLoading}
					className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all shadow-lg ${
						isSlotActive
							? "bg-gray-300 text-gray-600 cursor-not-allowed shadow-none"
							: "bg-green-600 text-white hover:bg-green-700 shadow-green-500/25"
					}`}
				>
					{activateMealSlotMutation.isPending ? (
						<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
					) : (
						<Play size={20} />
					)}
					<span className="hidden sm:inline">
						{isSlotActive ? "Slot Activated" : "Activate Slot"}
					</span>
				</button>
			</div>

			{/* Counter Tabs Section */}
			<section className="mb-8">
				<h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
					<Users size={20} className="text-blue-600" />
					Service Counters
				</h2>

				{countersLoading ? (
					<CounterTabsSkeleton />
				) : counters.length === 0 ? (
					<div className="text-center py-8 bg-white rounded-xl border">
						<p className="text-gray-500">No service counters available</p>
					</div>
				) : (
					<div className="flex items-center gap-3">
						<div className="flex gap-3 overflow-x-auto pb-2">
							{visibleCounters.map((counter) => (
								<CounterTab
									key={counter.counter_id}
									counter={counter}
									isSelected={selectedCounterId === counter.counter_id}
									onSelect={() => setSelectedCounterId(counter.counter_id)}
								/>
							))}
						</div>

						{/* More Counters Button */}
						{hasMoreCounters && (
							<button
								onClick={() => setShowAllCounters(!showAllCounters)}
								className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
								title={showAllCounters ? "Show less" : "Show more counters"}
							>
								<ChevronRight
									size={20}
									className={`transition-transform ${showAllCounters ? "rotate-180" : ""}`}
								/>
							</button>
						)}
					</div>
				)}
			</section>

			{/* Token Serving Section - Only show when counter is selected */}
			{selectedCounterId && (
				<section className="mb-8">
					{/* Action Buttons Row */}
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
							<Clock size={20} className="text-blue-600" />
							{selectedCounter?.counter_name} - Token Service
						</h2>

						{/* Counter Control Buttons */}
						<div className="flex gap-2">
							{selectedCounter?.is_active ? (
								<button
									onClick={handleCloseCounter}
									disabled={closeCounterMutation.isPending}
									className="flex items-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition-colors disabled:opacity-50"
								>
									{closeCounterMutation.isPending ? (
										<div className="w-4 h-4 border-2 border-red-700 border-t-transparent rounded-full animate-spin" />
									) : (
										<X size={16} />
									)}
									<span className="hidden sm:inline">Close Counter</span>
								</button>
							) : (
								<button
									onClick={handleReopenCounter}
									disabled={reopenCounterMutation.isPending}
									className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg font-medium hover:bg-green-200 transition-colors disabled:opacity-50"
								>
									{reopenCounterMutation.isPending ? (
										<div className="w-4 h-4 border-2 border-green-700 border-t-transparent rounded-full animate-spin" />
									) : (
										<RotateCcw size={16} />
									)}
									<span className="hidden sm:inline">Reopen Counter</span>
								</button>
							)}
						</div>
					</div>

					{/* Main Action Button */}
					{selectedCounter?.is_active && (
						<div className="mb-6">
							{currentServingToken ? (
								<button
									onClick={handleMarkServed}
									disabled={markServedMutation.isPending}
									className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 transition-colors shadow-lg shadow-green-500/25 disabled:opacity-50"
								>
									{markServedMutation.isPending ? (
										<div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
									) : (
										<CheckCircle2 size={24} />
									)}
									Mark as Served
								</button>
							) : (
								<button
									onClick={handleCallNextToken}
									disabled={callNextTokenMutation.isPending}
									className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/25 disabled:opacity-50"
								>
									{callNextTokenMutation.isPending ? (
										<div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
									) : (
										<PhoneCall size={24} />
									)}
									Call Next Token
								</button>
							)}
						</div>
					)}

					{/* Currently Serving Token Display */}
					{callNextTokenMutation.isPending ? (
						<ServingTokenSkeleton />
					) : currentServingToken ? (
						<ServingTokenCard token={currentServingToken} />
					) : (
						<div className="text-center py-12 bg-white rounded-xl border">
							<div className="text-gray-300 mb-4">
								<PhoneCall size={48} className="mx-auto" />
							</div>
							<h3 className="text-lg font-semibold text-gray-900 mb-2">No token being served</h3>
							<p className="text-gray-500">Click "Call Next Token" to start serving</p>
						</div>
					)}
				</section>
			)}

			{/* Prompt to select counter */}
			{!selectedCounterId && !countersLoading && counters.length > 0 && (
				<div className="text-center py-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-dashed border-blue-200">
					<div className="text-blue-300 mb-4">
						<Users size={48} className="mx-auto" />
					</div>
					<h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Counter</h3>
					<p className="text-gray-500">Choose a service counter above to manage tokens</p>
				</div>
			)}
		</div>
	);
}
