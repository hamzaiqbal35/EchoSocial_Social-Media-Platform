import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { postAPI, commentAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { formatRelativeTime, getImageUrl } from '../utils/helpers';
import Avatar from './Avatar';
import Modal from './Modal';
import MediaViewer from './MediaViewer';
import ShareModal from './ShareModal';
import ReportModal from './ReportModal';

const PostCard = ({ post: initialPost, onDelete }) => {
    const { user } = useAuth();
    const [post, setPost] = useState(initialPost);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState('');
    const [loadingComments, setLoadingComments] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showFullScreen, setShowFullScreen] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [showShareModal, setShowShareModal] = useState(false);
    const [showOptionsMenu, setShowOptionsMenu] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);

    // Refs to store video elements
    const videoRefs = useRef({});

    const isLiked = post.likes?.some(like =>
        typeof like === 'string' ? like === user?._id : like._id === user?._id
    );
    const isOwner = post.author?._id === user?._id;

    const handleMediaClick = (url, type) => {
        // Mute all videos when opening full screen to prevent double audio
        Object.values(videoRefs.current).forEach(video => {
            if (video) video.muted = true;
        });
        setSelectedMedia({ url, type });
        setShowFullScreen(true);
    };

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

    const handleShare = () => {
        setShowShareModal(true);
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
                        <div className="relative">
                            <button
                                onClick={() => setShowOptionsMenu(!showOptionsMenu)}
                                className="text-text-muted hover:text-error transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                </svg>
                            </button>

                            {showOptionsMenu && (
                                <div className="absolute right-0 mt-2 w-40 bg-bg-primary border border-border rounded-lg shadow-lg z-10">
                                    <button
                                        onClick={() => {
                                            setShowDeleteModal(true);
                                            setShowOptionsMenu(false);
                                        }}
                                        className="w-full text-left px-4 py-3 hover:bg-bg-secondary transition-colors flex items-center gap-3 text-error"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Delete Post
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {!isOwner && (
                        <div className="relative">
                            <button
                                onClick={() => setShowOptionsMenu(!showOptionsMenu)}
                                className="text-text-muted hover:text-primary transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                </svg>
                            </button>

                            {showOptionsMenu && (
                                <div className="absolute right-0 mt-2 w-40 bg-bg-primary border border-border rounded-lg shadow-lg z-10">
                                    <button
                                        onClick={() => {
                                            setShowReportModal(true);
                                            setShowOptionsMenu(false);
                                        }}
                                        className="w-full text-left px-4 py-3 hover:bg-bg-secondary transition-colors flex items-center gap-3 text-error"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                        Report Post
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Post Content */}
                <p className="mb-4 whitespace-pre-wrap">{post.content}</p>

                {/* Post Media */}
                {post.media && post.media.length > 0 ? (
                    <div className={`mb-4 ${post.media.length > 1 ? 'grid grid-cols-2 gap-1' : ''}`}>
                        {post.media.map((item, index) => (
                            <div
                                key={index}
                                className={`cursor-pointer relative ${post.media.length === 3 && index === 0 ? 'col-span-2' : ''}`}
                                onClick={() => handleMediaClick(item.url, item.type)}
                            >
                                {item.type === 'video' ? (
                                    <video
                                        ref={el => videoRefs.current[`${post._id}-${index}`] = el}
                                        src={getImageUrl(item.url)}
                                        className="w-full h-64 object-cover rounded-lg"
                                        controls
                                    />
                                ) : (
                                    <img
                                        src={getImageUrl(item.url)}
                                        alt={`Post media ${index + 1}`}
                                        className="w-full h-64 object-cover rounded-lg"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                ) : post.mediaUrl ? (
                    <div className="mb-4 cursor-pointer" onClick={() => handleMediaClick(post.mediaUrl, post.mediaType)}>
                        {post.mediaType === 'video' ? (
                            <video
                                ref={el => videoRefs.current[`${post._id}-legacy`] = el}
                                src={getImageUrl(post.mediaUrl)}
                                className="w-full rounded-lg max-h-96 object-cover"
                                controls
                            />
                        ) : (
                            <img
                                src={getImageUrl(post.mediaUrl)}
                                alt="Post"
                                className="w-full rounded-lg max-h-96 object-cover"
                            />
                        )}
                    </div>
                ) : post.image && (
                    <div className="mb-4 cursor-pointer" onClick={() => handleMediaClick(post.image, 'image')}>
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

                    <button
                        onClick={handleShare}
                        className="btn btn-ghost flex-1"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                        Share
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
                mediaUrl={selectedMedia ? getImageUrl(selectedMedia.url) : ''}
                mediaType={selectedMedia ? selectedMedia.type : 'image'}
            />

            {/* Share Modal */}
            <ShareModal
                isOpen={showShareModal}
                onClose={() => setShowShareModal(false)}
                post={post}
            />

            {/* Report Modal */}
            <ReportModal
                isOpen={showReportModal}
                onClose={() => setShowReportModal(false)}
                reportType="post"
                targetId={post._id}
                targetName={`post by ${post.author?.username}`}
            />
        </>
    );
};

export default PostCard;