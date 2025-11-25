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
            setPosts(response.data.posts);
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
            setPosts([...posts, ...response.data.posts]);
            setHasMore(response.data.currentPage < response.data.totalPages);
            setPage(nextPage);
        } catch (error) {
            console.error('Failed to load more posts:', error);
        } finally {
            setLoadingMore(false);
        }
    };

    const handlePostCreated = (newPost) => {
        setPosts([newPost, ...posts]);
    };

    const handlePostDeleted = (postId) => {
        setPosts(posts.filter(p => p._id !== postId));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
            {/* Create Post */}
            <CreatePost onPostCreated={handlePostCreated} />

            {/* Feed */}
            {posts.length === 0 ? (
                <div className="card text-center py-12">
                    <svg className="w-16 h-16 mx-auto text-text-muted mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                    <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
                    <p className="text-text-muted">
                        Be the first to create a post and share it with the community!
                    </p>
                </div>
            ) : (
                <>
                    {posts.map((post) => (
                        <PostCard key={post._id} post={post} onDelete={handlePostDeleted} />
                    ))}

                    {/* Load More */}
                    {hasMore && (
                        <div className="text-center py-4">
                            <button
                                onClick={loadMore}
                                className="btn btn-secondary"
                                disabled={loadingMore}
                            >
                                {loadingMore ? <LoadingSpinner size="sm" /> : 'Load More'}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Home;
