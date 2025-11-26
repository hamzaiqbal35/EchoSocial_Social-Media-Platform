import { useState } from 'react';
import { Link } from 'react-router-dom';
import { postAPI, commentAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { formatRelativeTime, getImageUrl } from '../utils/helpers';
import Avatar from './Avatar';
import Modal from './Modal';
import MediaViewer from './MediaViewer';

const PostCard = ({ post: initialPost, onDelete }) => {
    const { user } = useAuth();
    const [post, setPost] = useState(initialPost);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState('');
    const [loadingComments, setLoadingComments] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showFullScreen, setShowFullScreen] = useState(false);

    const isLiked = post.likes?.some(like =>
        typeof like === 'string' ? like === user?._id : like._id === user?._id
    );
    const isOwner = post.author?._id === user?._id;

    const handleLike = async () => {
        try {
            if (isLiked) {
                const response = await postAPI.unlikePost(post._id);
                setPost(response.data);
            } else {
                const response = await postAPI.likePost(post._id);
                setPost(response.data);
            }
        } catch (error) {
            console.error('Failed to like/unlike post:', error);
        }
    };

    const handleDelete = async () => {
        try {
            await postAPI.deletePost(post._id);
            if (onDelete) {
                onDelete(post._id);
            }
            setShowDeleteModal(false);
        } catch (error) {
            console.error('Failed to delete post:', error);
        }
    };

    const loadComments = async () => {
        if (comments.length > 0) {
            setShowComments(!showComments);
            return;
        }

        setLoadingComments(true);
        try {
            const response = await commentAPI.getPostComments(post._id);
            setComments(response.data);
            setShowComments(true);
        } catch (error) {
            console.error('Failed to load comments:', error);
        } finally {
            setLoadingComments(false);
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        try {
            const response = await commentAPI.createComment(post._id, { content: commentText });
            setComments([response.data, ...comments]);
            setCommentText('');
        } catch (error) {
            console.error('Failed to create comment:', error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await commentAPI.deleteComment(commentId);
            setComments(comments.filter(c => c._id !== commentId));
        } catch (error) {
            console.error('Failed to delete comment:', error);
        }
    };

    return (
        <>
            <div className="card animate-fade-in">
                {/* Post Header */}
                <div className="flex items-start justify-between mb-4">
                    <Link to={`/profile/${post.author?._id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <Avatar src={post.author?.avatar} alt={post.author?.username} size="md" />
                        <div>
                            <h3 className="font-semibold">{post.author?.username}</h3>
                            <p className="text-sm text-text-muted">{formatRelativeTime(post.createdAt)}</p>
                        </div>
                    </Link>

                    {isOwner && (
                        <button
                            onClick={() => setShowDeleteModal(true)}
                            className="text-text-muted hover:text-error transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    )}
                </div>

                {/* Post Content */}
                <p className="mb-4 whitespace-pre-wrap">{post.content}</p>

                {/* Post Media */}
                {post.mediaUrl && (
                    <div className="mb-4 cursor-pointer" onClick={() => setShowFullScreen(true)}>
                        {post.mediaType === 'video' ? (
                            <video
                                src={getImageUrl(post.mediaUrl)}
                                className="w-full rounded-lg max-h-96 object-cover"
                            />
                        ) : (
                            <img
                                src={getImageUrl(post.mediaUrl)}
                                alt="Post"
                                className="w-full rounded-lg max-h-96 object-cover"
                            />
                        )}
                    </div>
                )}

                {/* Backward compatibility for old posts */}
                {!post.mediaUrl && post.image && (
                    <div className="mb-4 cursor-pointer" onClick={() => setShowFullScreen(true)}>
                        <img
                            src={getImageUrl(post.image)}
                            alt="Post"
                            className="w-full rounded-lg max-h-96 object-cover"
                        />
                    </div>
                )}

                {/* Post Stats */}
                <div className="flex items-center gap-4 mb-4 text-sm text-text-muted">
                    <span>{post.likes?.length || 0} likes</span>
                </div>

                {/* Post Actions */}
                <div className="flex items-center gap-2 pt-4 border-t border-border">
                    <button
                        onClick={handleLike}
                        className={`btn btn-ghost flex-1 ${isLiked ? 'text-error' : ''}`}
                    >
                        <svg className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        Like
                    </button>

                    <button
                        onClick={loadComments}
                        className="btn btn-ghost flex-1"
                        disabled={loadingComments}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        Comment
                    </button>
                </div>

                {/* Comments Section */}
                {showComments && (
                    <div className="mt-4 pt-4 border-t border-border">
                        {/* Comment Form */}
                        <form onSubmit={handleComment} className="flex gap-2 mb-4">
                            <input
                                type="text"
                                className="input flex-1"
                                placeholder="Write a comment..."
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                maxLength={300}
                            />
                            <button type="submit" className="btn btn-primary" disabled={!commentText.trim()}>
                                Post
                            </button>
                        </form>

                        {/* Comments List */}
                        <div className="space-y-3">
                            {comments.map((comment) => (
                                <div key={comment._id} className="flex gap-3">
                                    <Link to={`/profile/${comment.author?._id}`}>
                                        <Avatar src={comment.author?.avatar} alt={comment.author?.username} size="sm" />
                                    </Link>
                                    <div className="flex-1">
                                        <div className="bg-bg-secondary rounded-lg p-3">
                                            <Link to={`/profile/${comment.author?._id}`} className="font-semibold text-sm hover:underline">
                                                {comment.author?.username}
                                            </Link>
                                            <p className="text-sm mt-1">{comment.content}</p>
                                        </div>
                                        <div className="flex items-center gap-3 mt-1 px-3">
                                            <span className="text-xs text-text-muted">{formatRelativeTime(comment.createdAt)}</span>
                                            {comment.author?._id === user?._id && (
                                                <button
                                                    onClick={() => handleDeleteComment(comment._id)}
                                                    className="text-xs text-text-muted hover:text-error"
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title="Delete Post"
            >
                <p className="mb-6">Are you sure you want to delete this post? This action cannot be undone.</p>
                <div className="flex gap-3 justify-end">
                    <button onClick={() => setShowDeleteModal(false)} className="btn btn-secondary">
                        Cancel
                    </button>
                    <button onClick={handleDelete} className="btn btn-primary bg-error hover:bg-error">
                        Delete
                    </button>
                </div>
            </Modal>
            {/* Full Screen Media Viewer */}
            <MediaViewer
                isOpen={showFullScreen}
                onClose={() => setShowFullScreen(false)}
                mediaUrl={post.mediaUrl ? getImageUrl(post.mediaUrl) : (post.image ? getImageUrl(post.image) : '')}
                mediaType={post.mediaType || 'image'}
            />
        </>
    );
};

export default PostCard;