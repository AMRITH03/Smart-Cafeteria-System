import { SkeletonBlock } from '@/components/ui/SkeletonBlock';

export function MealCategoryGridSkeleton() {
    return (
        <section className="py-16">
            <SkeletonBlock className="h-6 w-48 mx-auto mb-8" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div
                        key={index}
                        className="border rounded-xl p-6 text-center"
                    >
                        <SkeletonBlock className="h-10 w-10 mx-auto mb-3" />
                        <SkeletonBlock className="h-4 w-20 mx-auto" />
                    </div>
                ))}
            </div>
        </section>
    );
}
