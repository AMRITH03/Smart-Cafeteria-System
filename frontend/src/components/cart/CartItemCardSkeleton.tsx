import { SkeletonBlock } from "../ui/SkeletonBlock";

export function CartItemCardSkeleton() {
	return (
		<div className="flex items-center gap-4 rounded-2xl border bg-white p-4 shadow-sm">
			{/* Image Skeleton */}
			<div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-gray-50">
				<SkeletonBlock className="h-full w-full" />
			</div>

			{/* Content Skeleton */}
			<div className="flex flex-1 flex-col gap-2">
				<div className="flex items-start justify-between">
					<div className="space-y-2">
						<SkeletonBlock className="h-5 w-32" />
						<SkeletonBlock className="h-3 w-20" />

						{/* Nutrition Info Skeletons */}
						<div className="mt-2 flex flex-wrap gap-2">
							<SkeletonBlock className="h-4 w-12 rounded-full" />
							<SkeletonBlock className="h-4 w-12 rounded-full" />
							<SkeletonBlock className="h-4 w-12 rounded-full" />
						</div>
					</div>

					<SkeletonBlock className="h-5 w-5 rounded-md" />
				</div>

				{/* Price + Quantity Controls Skeleton */}
				<div className="mt-2 flex items-center justify-between">
					<SkeletonBlock className="h-6 w-16" />
					<SkeletonBlock className="h-8 w-24 rounded-lg" />
				</div>
			</div>
		</div>
	);
}
