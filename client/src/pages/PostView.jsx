import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { postAPI } from '../services/api';
import PostCard from '../components/PostCard';
import LoadingSpinner from '../components/LoadingSpinner';

const PostView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await postAPI.getPost(id);
                setPost(response.data);
            } catch (err) {
                console.error('Failed to fetch post:', err);
                setError('Post not found or has been deleted.');
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    const handleDelete = () => {
        navigate('/');
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
                <LoadingSpinner size="lg" />
                <span className="text-xs text-text-muted">Loading post...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-md mx-auto py-16 px-4 text-center">
                <div className="card p-8">
                    <div className="w-12 h-12 rounded-full bg-bg-tertiary flex items-center justify-center mx-auto mb-3 text-text-muted">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-base font-semibold text-text-primary mb-1">Post Unavailable</h2>
                    <p className="text-xs text-text-muted mb-5">{error}</p>
                    <Link to="/" className="btn btn-secondary btn-sm">
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto py-6 px-4 space-y-4">
            <div className="flex items-center gap-2">
                <button
                    onClick={() => navigate(-1)}
                    className="btn btn-ghost btn-xs text-text-muted hover:text-text-primary"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span>Back</span>
                </button>
            </div>
            <PostCard post={post} onDelete={handleDelete} />
        </div>
    );
};

export default PostView;
