import { SkeletonBlock } from "@/components/ui/SkeletonBlock";

export function StaffMenuItemCardSkeleton() {
	return (
		<div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm animate-pulse">
			{/* Image placeholder */}
			<SkeletonBlock className="w-full h-40" />

			{/* Content */}
			<div className="p-4">
				<div className="flex items-start justify-between gap-2 mb-1">
					<SkeletonBlock className="h-5 w-32" />
					<SkeletonBlock className="h-5 w-12" />
				</div>
				<SkeletonBlock className="h-3 w-full mt-2" />
				<SkeletonBlock className="h-3 w-2/3 mt-1 mb-3" />

				{/* Actions */}
				<div className="flex gap-2">
					<SkeletonBlock className="flex-1 h-9 rounded-xl" />
					<SkeletonBlock className="h-9 w-9 rounded-xl" />
				</div>
			</div>
		</div>
	);
}
