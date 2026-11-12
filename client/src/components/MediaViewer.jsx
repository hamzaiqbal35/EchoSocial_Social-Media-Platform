import { useEffect } from 'react';

const MediaViewer = ({ isOpen, onClose, mediaUrl, mediaType }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            const handleKeyDown = (e) => {
                if (e.key === 'Escape') onClose();
            };
            window.addEventListener('keydown', handleKeyDown);
            return () => {
                document.body.style.overflow = 'unset';
                window.removeEventListener('keydown', handleKeyDown);
            };
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen, onClose]);

    if (!isOpen || !mediaUrl) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 animate-fade-in p-4 select-none"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            {/* Top Close Button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-50 p-2 rounded-full bg-white/10 hover:bg-white/20"
                aria-label="Close viewer"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            <div
                className="w-full h-full flex items-center justify-center max-w-5xl max-h-[85vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {mediaType === 'video' ? (
                    <video
                        src={mediaUrl}
                        controls
                        autoPlay
                        className="max-w-full max-h-full object-contain rounded-lg shadow-2xl border border-white/10"
                    />
                ) : (
                    <img
                        src={mediaUrl}
                        alt="High resolution view"
                        className="max-w-full max-h-full object-contain rounded-lg shadow-2xl border border-white/10"
                    />
                )}
            </div>
        </div>
    );
};

export default MediaViewer;
