import { useState } from 'react';
import { postAPI } from '../services/api';
import LoadingSpinner from './LoadingSpinner';

const CreatePost = ({ onPostCreated }) => {
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
                setError('You can only upload up to 10 files');
                return;
            }

            files.forEach(file => {
                if (file.size > 50 * 1024 * 1024) {
                    setError(`File ${file.name} is too large (max 50MB)`);
                    hasError = true;
                    return;
                }
                newFiles.push(file);
                newPreviews.push({
                    url: URL.createObjectURL(file),
                    type: file.type.startsWith('video/') ? 'video' : 'image'
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
            setError('Please write something or add media');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('content', content);
            mediaFiles.forEach(file => {
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
            setError(err.response?.data?.message || 'Failed to create post');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card">
            <form onSubmit={handleSubmit}>
                <textarea
                    className="input textarea"
                    placeholder="What's on your mind?"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    maxLength={500}
                    disabled={loading}
                />

                {mediaPreviews.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 gap-2">
                        {mediaPreviews.map((media, index) => (
                            <div key={index} className="relative group">
                                {media.type === 'video' ? (
                                    <video
                                        src={media.url}
                                        className="w-full h-48 rounded-lg object-cover"
                                        controls
                                    />
                                ) : (
                                    <img
                                        src={media.url}
                                        alt={`Preview ${index + 1}`}
                                        className="w-full h-48 rounded-lg object-cover"
                                    />
                                )}
                                <button
                                    type="button"
                                    onClick={() => removeMedia(index)}
                                    className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {error && (
                    <div className="mt-3 text-error text-sm">{error}</div>
                )}

                <div className="flex items-center justify-between mt-4">
                    <label className="btn btn-ghost btn-sm cursor-pointer">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>Photo/Video</span>
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
                        <span className="text-sm text-text-muted">
                            {content.length}/500
                        </span>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading || (!content.trim() && mediaFiles.length === 0)}
                        >
                            {loading ? <LoadingSpinner size="sm" /> : 'Post'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CreatePost;
