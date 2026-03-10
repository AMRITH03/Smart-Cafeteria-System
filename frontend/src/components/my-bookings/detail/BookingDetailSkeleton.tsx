import { SkeletonBlock } from "@/components/ui/SkeletonBlock";

export function BookingDetailSkeleton() {
	return (
		<div className="space-y-5 animate-pulse">
			{/* Status Header */}
			<div className="rounded-2xl border bg-white p-6 shadow-sm space-y-4">
				<div className="flex items-center justify-between">
					<SkeletonBlock className="h-8 w-48" />
					<SkeletonBlock className="h-10 w-32 rounded-xl" />
				</div>
				<SkeletonBlock className="h-6 w-32 rounded-full" />
			</div>

			{/* Info Section */}
			<div className="rounded-2xl border bg-white p-6 shadow-sm space-y-4">
				<SkeletonBlock className="h-6 w-40" />
				<div className="grid grid-cols-2 gap-4">
					<SkeletonBlock className="h-5 w-full" />
					<SkeletonBlock className="h-5 w-full" />
					<SkeletonBlock className="h-5 w-full" />
					<SkeletonBlock className="h-5 w-full" />
				</div>
			</div>

			{/* Menu Section */}
			<div className="rounded-2xl border bg-white p-6 shadow-sm space-y-4">
				<div className="flex justify-between">
					<SkeletonBlock className="h-6 w-32" />
					<SkeletonBlock className="h-8 w-20 rounded-lg" />
				</div>
				{Array.from({ length: 3 }).map((_, i) => (
					<div key={i} className="flex items-center gap-4">
						<SkeletonBlock className="h-14 w-14 rounded-xl" />
						<div className="flex-1 space-y-2">
							<SkeletonBlock className="h-4 w-40" />
							<SkeletonBlock className="h-3 w-24" />
						</div>
						<SkeletonBlock className="h-5 w-16" />
					</div>
				))}
			</div>

			{/* Group Members Section */}
			<div className="rounded-2xl border bg-white p-6 shadow-sm space-y-4">
				<SkeletonBlock className="h-6 w-40" />
				{Array.from({ length: 2 }).map((_, i) => (
					<div key={i} className="flex items-center gap-3">
						<SkeletonBlock className="h-10 w-10 rounded-full" />
						<div className="flex-1 space-y-2">
							<SkeletonBlock className="h-4 w-32" />
							<SkeletonBlock className="h-3 w-48" />
						</div>
					</div>
				))}
			</div>

			{/* Payment Section */}
			<div className="rounded-2xl border bg-white p-6 shadow-sm space-y-3">
				<SkeletonBlock className="h-6 w-40" />
				<SkeletonBlock className="h-5 w-full" />
				<SkeletonBlock className="h-5 w-full" />
				<SkeletonBlock className="h-8 w-32" />
			</div>
		</div>
	);
}
