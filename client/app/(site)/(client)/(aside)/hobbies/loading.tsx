import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
    return (
        <section className="min-h-screen mt-5 w-full lg:container">
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
                <Skeleton className='leading-6 w-full h-10 bg-gray-300 dark:bg-secondary_dark'
                />
            </div>
            <div className='mt-6 min-h-full grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3'>
                {Array(12)
                    .fill(0)
                    .map((_, index) => (
                        <Skeleton key={index} className="col-span-1 p-4 relative w-full h-60 bg-gray-300 dark:bg-secondary_dark" />
                    ))}
            </div>
        </section>
    );
}

export default Loading;
