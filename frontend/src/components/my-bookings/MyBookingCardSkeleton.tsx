import { SkeletonBlock } from "@/components/ui/SkeletonBlock";

export function MyBookingCardSkeleton() {
	return (
		<div className="flex items-stretch rounded-2xl border bg-white shadow-sm overflow-hidden animate-pulse">
			{/* Left content */}
			<div className="flex-1 p-4 sm:p-5 space-y-2.5">
				{/* Row 1 */}
				<div className="flex items-center justify-between gap-3">
					<SkeletonBlock className="h-5 w-40" />
					<SkeletonBlock className="h-5 w-24 rounded-full" />
				</div>
				{/* Row 2 */}
				<div className="flex flex-wrap gap-4">
					<SkeletonBlock className="h-4 w-16" />
					<SkeletonBlock className="h-4 w-28" />
					<SkeletonBlock className="h-4 w-20" />
					<SkeletonBlock className="h-4 w-20" />
					<SkeletonBlock className="h-4 w-16" />
				</div>
			</div>
			{/* Right button area */}
			<div className="flex items-center px-3 sm:px-4 border-l bg-gray-50/60">
				<SkeletonBlock className="h-10 w-28 rounded-xl" />
			</div>
		</div>
	);
}
