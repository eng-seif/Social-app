import { Card, Skeleton } from "@heroui/react";

export default function SkeletonComponent() {
    return (
        // Using your exact PostCard container styles
        <Card className="bg-[#15202B] rounded-2xl p-4 shadow-sm border border-gray-800/50 w-full mb-6" shadow="none">
            
            
            <div className="flex gap-3 items-center mb-4">
                <Skeleton className="rounded-full w-10 h-10">
                    <div className="w-10 h-10 rounded-full bg-[#1C2732]" />
                </Skeleton>
                <div className="flex flex-col gap-2">
                    <Skeleton className="w-32 rounded-lg">
                        <div className="h-3 w-32 rounded-lg bg-[#1C2732]" />
                    </Skeleton>
                    <Skeleton className="w-20 rounded-lg">
                        <div className="h-2 w-20 rounded-lg bg-[#1C2732]" />
                    </Skeleton>
                </div>
            </div>

            
            <div className="space-y-3 mb-4">
                <Skeleton className="w-full rounded-lg">
                    <div className="h-3 w-full rounded-lg bg-[#1C2732]" />
                </Skeleton>
                <Skeleton className="w-4/5 rounded-lg">
                    <div className="h-3 w-4/5 rounded-lg bg-[#1C2732]" />
                </Skeleton>
                <Skeleton className="w-2/5 rounded-lg">
                    <div className="h-3 w-2/5 rounded-lg bg-[#1C2732]" />
                </Skeleton>
            </div>

            
            <Skeleton className="w-full rounded-xl mb-4">
                <div className="w-full h-64 sm:h-80 md:h-[400px] rounded-xl bg-[#1C2732]" />
            </Skeleton>

            
            <div className="flex justify-between items-center mb-4 px-2">
                <Skeleton className="w-16 rounded-lg">
                    <div className="h-3 w-16 rounded-lg bg-[#1C2732]" />
                </Skeleton>
                <Skeleton className="w-24 rounded-lg">
                    <div className="h-3 w-24 rounded-lg bg-[#1C2732]" />
                </Skeleton>
            </div>

            
            <div className="flex items-center justify-between border-t border-gray-800/50 pt-3 gap-2">
                <Skeleton className="flex-1 rounded-xl">
                    <div className="h-9 w-full rounded-xl bg-[#1C2732]" />
                </Skeleton>
                <Skeleton className="flex-1 rounded-xl">
                    <div className="h-9 w-full rounded-xl bg-[#1C2732]" />
                </Skeleton>
                <Skeleton className="flex-1 rounded-xl">
                    <div className="h-9 w-full rounded-xl bg-[#1C2732]" />
                </Skeleton>
            </div>

        </Card>
    );
}