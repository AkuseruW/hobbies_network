const Loading = () => {
    return (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array(12)
                .fill(0)
                .map((_, index) => {
                    return (
                        <div key={index} className="w-full mb-5 ">
                            <div className="w-full h-64 rounded-lg animate-pulse bg-gray-600"></div>
                            <p className="w-30 h-2 mt-4 rounded-lg animate-pulse bg-gray-600"></p>
                        </div>
                    )
                })}
        </div>
    );
}

export default Loading