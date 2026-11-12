import { useState, useEffect } from 'react';
import { feedAPI } from '../services/api';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    useEffect(() => {
        loadFeed();
    }, []);

    const loadFeed = async () => {
        try {
            setLoading(true);
            const response = await feedAPI.getFeed(1, 10);
            setPosts(response.data.posts || []);
            setHasMore(response.data.currentPage < response.data.totalPages);
            setPage(1);
        } catch (error) {
            console.error('Failed to load feed:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadMore = async () => {
        if (loadingMore || !hasMore) return;

        try {
            setLoadingMore(true);
            const nextPage = page + 1;
            const response = await feedAPI.getFeed(nextPage, 10);
            setPosts((prev) => [...prev, ...response.data.posts]);
            setHasMore(response.data.currentPage < response.data.totalPages);
            setPage(nextPage);
        } catch (error) {
            console.error('Failed to load more posts:', error);
        } finally {
            setLoadingMore(false);
        }
    };

    const handlePostCreated = (newPost) => {
        setPosts((prev) => [newPost, ...prev]);
    };

    const handlePostDeleted = (postId) => {
        setPosts((prev) => prev.filter((p) => p._id !== postId));
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
                <LoadingSpinner size="lg" />
                <span className="text-xs text-text-muted">Loading feed...</span>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto px-4 py-6 space-y-5">
            {/* Create Post Composer */}
            <CreatePost onPostCreated={handlePostCreated} />

            {/* Posts Feed */}
            {posts.length === 0 ? (
                <div className="card text-center py-14 px-6 border border-dashed border-border">
                    <div className="w-12 h-12 rounded-full bg-bg-tertiary flex items-center justify-center mx-auto mb-3 text-text-muted">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                    </div>
                    <h3 className="text-sm font-semibold text-text-primary mb-1">Your feed is waiting</h3>
                    <p className="text-xs text-text-muted max-w-sm mx-auto mb-4">
                        Follow creators in the Discover tab or publish your first update using the composer above.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {posts.map((post) => (
                        <PostCard key={post._id} post={post} onDelete={handlePostDeleted} />
                    ))}

                    {/* Load More Button */}
                    {hasMore && (
                        <div className="text-center pt-2 pb-6">
                            <button
                                onClick={loadMore}
                                className="btn btn-secondary btn-sm"
                                disabled={loadingMore}
                            >
                                {loadingMore ? <LoadingSpinner size="xs" /> : 'Load more posts'}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Home;
