import { useEffect } from 'react';

const MediaViewer = ({ isOpen, onClose, mediaUrl, mediaType }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen || !mediaUrl) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 backdrop-blur-sm animate-fade-in"
            onClick={onClose}
        >
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-50 p-2 bg-black bg-opacity-50 rounded-full"
            >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            <div className="w-full h-full flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
                {mediaType === 'video' ? (
                    <video
                        src={mediaUrl}
                        controls
                        autoPlay
                        className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                    />
                ) : (
                    <img
                        src={mediaUrl}
                        alt="Full screen"
                        className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                    />
                )}
            </div>
        </div>
    );
};

export default MediaViewer;
