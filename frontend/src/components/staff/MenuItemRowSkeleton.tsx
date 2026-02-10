import { SkeletonBlock } from "@/components/ui/SkeletonBlock";

export function MenuItemRowSkeleton() {
	return (
		<div className="flex items-center gap-3 p-3 border rounded-xl animate-pulse">
			<SkeletonBlock className="h-5 w-5 rounded" />
			<SkeletonBlock className="h-10 w-10 rounded-lg flex-shrink-0" />
			<div className="flex-1 min-w-0">
				<SkeletonBlock className="h-4 w-28 mb-1" />
				<SkeletonBlock className="h-3 w-20" />
			</div>
			<SkeletonBlock className="h-8 w-20 rounded-lg" />
		</div>
	);
}
