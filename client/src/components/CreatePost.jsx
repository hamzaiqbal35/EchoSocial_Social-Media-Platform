import { useState } from 'react';
import { postAPI } from '../services/api';
import LoadingSpinner from './LoadingSpinner';

const CreatePost = ({ onPostCreated }) => {
    const [content, setContent] = useState('');
    const [media, setMedia] = useState(null);
    const [mediaPreview, setMediaPreview] = useState('');
    const [mediaType, setMediaType] = useState(''); // 'image' or 'video'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleMediaChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 50 * 1024 * 1024) {
                setError('File size must be less than 50MB');
                return;
            }

            const fileType = file.type.startsWith('video/') ? 'video' : 'image';
            setMedia(file);
            setMediaType(fileType);
            setMediaPreview(URL.createObjectURL(file));
            setError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!content.trim()) {
            setError('Please write something');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('content', content);
            if (media) {
                formData.append('image', media); // Using 'image' key as backend expects file in this field or we can change backend to accept 'media'
            }

            const response = await postAPI.createPost(formData);
            setContent('');
            setMedia(null);
            setMediaPreview('');
            setMediaType('');
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

                {mediaPreview && (
                    <div className="mt-4 relative">
                        {mediaType === 'video' ? (
                            <video
                                src={mediaPreview}
                                controls
                                className="w-full rounded-lg max-h-96 object-cover"
                            />
                        ) : (
                            <img
                                src={mediaPreview}
                                alt="Preview"
                                className="w-full rounded-lg max-h-96 object-cover"
                            />
                        )}
                        <button
                            type="button"
                            onClick={() => {
                                setMedia(null);
                                setMediaPreview('');
                                setMediaType('');
                            }}
                            className="absolute top-2 right-2 bg-bg-primary bg-opacity-80 text-white rounded-full p-2 hover:bg-opacity-100 transition-all"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
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
                            disabled={loading || !content.trim()}
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
