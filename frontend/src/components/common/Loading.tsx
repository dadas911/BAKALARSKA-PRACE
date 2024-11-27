const Loading: React.FC = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-white">
            <div className="text-center">
                <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <h2 className="mt-4 text-2xl font-semibold text-neutral-700">
                    Načítání...
                </h2>
            </div>
        </div>
    );
};

export default Loading;
