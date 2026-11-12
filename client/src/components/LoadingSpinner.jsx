const LoadingSpinner = ({ size = 'md', className = '' }) => {
    const sizeMap = {
        xs: 'w-3.5 h-3.5 border-[1.5px]',
        sm: 'w-4 h-4 border-2',
        md: 'w-6 h-6 border-2',
        lg: 'w-8 h-8 border-2',
        xl: 'w-10 h-10 border-[2.5px]',
    };

    return (
        <div className={`flex items-center justify-center ${className}`} role="status" aria-label="Loading">
            <div
                className={`${sizeMap[size] || sizeMap.md} border-border border-t-text-primary rounded-full animate-spin`}
            ></div>
        </div>
    );
};

export default LoadingSpinner;
