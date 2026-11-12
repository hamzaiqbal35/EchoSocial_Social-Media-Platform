import { useState } from 'react';
import { postAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import Avatar from './Avatar';
import LoadingSpinner from './LoadingSpinner';

const CreatePost = ({ onPostCreated }) => {
    const { user } = useAuth();
    const [content, setContent] = useState('');
    const [mediaFiles, setMediaFiles] = useState([]);
    const [mediaPreviews, setMediaPreviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleMediaChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            const newFiles = [];
            const newPreviews = [];
            let hasError = false;

            if (mediaFiles.length + files.length > 10) {
                setError('You can upload up to 10 files maximum');
                return;
            }

            files.forEach((file) => {
                if (file.size > 50 * 1024 * 1024) {
                    setError(`File "${file.name}" exceeds the 50MB limit`);
                    hasError = true;
                    return;
                }
                newFiles.push(file);
                newPreviews.push({
                    url: URL.createObjectURL(file),
                    type: file.type.startsWith('video/') ? 'video' : 'image',
                    name: file.name
                });
            });

            if (!hasError) {
                setMediaFiles([...mediaFiles, ...newFiles]);
                setMediaPreviews([...mediaPreviews, ...newPreviews]);
                setError('');
            }
        }
    };

    const removeMedia = (index) => {
        const newFiles = [...mediaFiles];
        const newPreviews = [...mediaPreviews];

        URL.revokeObjectURL(newPreviews[index].url);

        newFiles.splice(index, 1);
        newPreviews.splice(index, 1);

        setMediaFiles(newFiles);
        setMediaPreviews(newPreviews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!content.trim() && mediaFiles.length === 0) {
            setError('Please enter text or attach media before publishing');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('content', content);
            mediaFiles.forEach((file) => {
                formData.append('media', file);
            });

            const response = await postAPI.createPost(formData);
            setContent('');
            setMediaFiles([]);
            setMediaPreviews([]);
            if (onPostCreated) {
                onPostCreated(response.data);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create post. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card p-4 transition-all">
            <form onSubmit={handleSubmit}>
                <div className="flex gap-3">
                    <Avatar src={user?.avatar} alt={user?.username} size="md" />

                    <div className="flex-1">
                        <textarea
                            className="w-full bg-transparent border-0 text-xs sm:text-sm text-text-primary placeholder-text-muted resize-none focus:outline-none focus:ring-0 p-1 min-h-[64px]"
                            placeholder="What's happening?"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            maxLength={500}
                            disabled={loading}
                            rows={3}
                        />

                        {/* Media Previews Grid */}
                        {mediaPreviews.length > 0 && (
                            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {mediaPreviews.map((media, index) => (
                                    <div key={index} className="relative group rounded-lg overflow-hidden border border-border bg-bg-tertiary aspect-video">
                                        {media.type === 'video' ? (
                                            <video
                                                src={media.url}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <img
                                                src={media.url}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => removeMedia(index)}
                                            className="absolute top-1.5 right-1.5 bg-black/70 hover:bg-black text-white rounded-full p-1 transition-all opacity-90 group-hover:opacity-100"
                                            title="Remove media"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                        {media.type === 'video' && (
                                            <div className="absolute bottom-1.5 left-1.5 bg-black/70 text-[10px] text-white px-1.5 py-0.5 rounded font-mono">
                                                VIDEO
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {error && (
                            <div className="mt-2 text-xs text-error font-medium flex items-center gap-1.5">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Bottom Toolbar */}
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                            <label className="btn btn-ghost btn-sm text-text-muted hover:text-text-primary cursor-pointer px-2 py-1">
                                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="text-xs">Attach Media</span>
                                <input
                                    type="file"
                                    accept="image/*,video/*"
                                    onChange={handleMediaChange}
                                    className="hidden"
                                    multiple
                                    disabled={loading}
                                />
                            </label>

                            <div className="flex items-center gap-3">
                                {content.length > 0 && (
                                    <span className="text-[11px] font-mono text-text-muted tabular-nums">
                                        {content.length}/500
                                    </span>
                                )}
                                <button
                                    type="submit"
                                    className="btn btn-primary btn-sm"
                                    disabled={loading || (!content.trim() && mediaFiles.length === 0)}
                                >
                                    {loading ? <LoadingSpinner size="xs" /> : 'Publish'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CreatePost;
