import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postAPI, commentAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { formatRelativeTime, getImageUrl } from '../utils/helpers';
import Avatar from './Avatar';
import Modal from './Modal';
import MediaViewer from './MediaViewer';
import ShareModal from './ShareModal';
import ReportModal from './ReportModal';
import LoadingSpinner from './LoadingSpinner';

const PostCard = ({ post: initialPost, onDelete }) => {
    const { user } = useAuth();
    const [post, setPost] = useState(initialPost);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState('');
    const [loadingComments, setLoadingComments] = useState(false);
    const [submittingComment, setSubmittingComment] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showFullScreen, setShowFullScreen] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [showShareModal, setShowShareModal] = useState(false);
    const [showOptionsMenu, setShowOptionsMenu] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);

    const videoRefs = useRef({});
    const optionsRef = useRef(null);

    // Pause offscreen videos
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) {
                        const video = entry.target;
                        if (video && !video.paused) {
                            video.pause();
                        }
                    }
                });
            },
            { threshold: 0.5 }
        );

        Object.values(videoRefs.current).forEach((video) => {
            if (video) observer.observe(video);
        });

        return () => observer.disconnect();
    }, [post.media, post.mediaUrl]);

    // Close options menu on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (optionsRef.current && !optionsRef.current.contains(e.target)) {
                setShowOptionsMenu(false);
            }
        };
        if (showOptionsMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showOptionsMenu]);

    const isLiked = post.likes?.some((like) =>
        typeof like === 'string' ? like === user?._id : like._id === user?._id
    );
    const isOwner = post.author?._id === user?._id;

    const handleMediaClick = (url, type) => {
        Object.values(videoRefs.current).forEach((video) => {
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
            console.error('Failed to update post like:', error);
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
            setComments(response.data || []);
            setShowComments(true);
        } catch (error) {
            console.error('Failed to load comments:', error);
        } finally {
            setLoadingComments(false);
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim() || submittingComment) return;

        setSubmittingComment(true);
        try {
            const response = await commentAPI.createComment(post._id, { content: commentText.trim() });
            setComments([response.data, ...comments]);
            setCommentText('');
            // Update comments count in post
            setPost((prev) => ({
                ...prev,
                comments: [...(prev.comments || []), response.data._id]
            }));
        } catch (error) {
            console.error('Failed to create comment:', error);
        } finally {
            setSubmittingComment(false);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await commentAPI.deleteComment(commentId);
            setComments((prev) => prev.filter((c) => c._id !== commentId));
            setPost((prev) => ({
                ...prev,
                comments: (prev.comments || []).filter((id) => id !== commentId)
            }));
        } catch (error) {
            console.error('Failed to delete comment:', error);
        }
    };

    return (
        <>
            <article className="card p-4 transition-all">
                {/* Post Header */}
                <header className="flex items-start justify-between mb-3">
                    <Link
                        to={`/profile/${post.author?._id}`}
                        className="flex items-center gap-3 group min-w-0"
                    >
                        <Avatar src={post.author?.avatar} alt={post.author?.username} size="sm" />
                        <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                                <span className="text-xs font-semibold text-text-primary group-hover:underline truncate">
                                    {post.author?.username}
                                </span>
                            </div>
                            <span className="text-[11px] text-text-muted">
                                {formatRelativeTime(post.createdAt)}
                            </span>
                        </div>
                    </Link>

                    {/* Post Options Menu */}
                    <div className="relative" ref={optionsRef}>
                        <button
                            onClick={() => setShowOptionsMenu(!showOptionsMenu)}
                            className="p-1 rounded-md text-text-muted hover:text-text-primary hover:bg-bg-tertiary transition-colors"
                            aria-label="Post options"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                        </button>

                        {showOptionsMenu && (
                            <div className="absolute right-0 mt-1 w-36 card p-1 shadow-elevated z-20 border border-border animate-slide-down">
                                {isOwner ? (
                                    <button
                                        onClick={() => {
                                            setShowDeleteModal(true);
                                            setShowOptionsMenu(false);
                                        }}
                                        className="w-full text-left px-2.5 py-1.5 rounded text-xs font-medium text-error hover:bg-error/10 transition-colors flex items-center gap-2"
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Delete Post
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => {
                                            setShowReportModal(true);
                                            setShowOptionsMenu(false);
                                        }}
                                        className="w-full text-left px-2.5 py-1.5 rounded text-xs font-medium text-text-secondary hover:text-error hover:bg-error/10 transition-colors flex items-center gap-2"
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                        Report Post
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </header>

                {/* Post Content */}
                {post.content && (
                    <p className="text-xs sm:text-sm text-text-primary whitespace-pre-wrap leading-relaxed mb-3">
                        {post.content}
                    </p>
                )}

                {/* Post Media Display */}
                {post.media && post.media.length > 0 ? (
                    <div
                        className={`mb-3.5 rounded-lg overflow-hidden border border-border bg-bg-tertiary ${
                            post.media.length === 1
                                ? 'max-h-[500px]'
                                : post.media.length === 2
                                ? 'grid grid-cols-2 gap-0.5'
                                : 'grid grid-cols-2 gap-0.5'
                        }`}
                    >
                        {post.media.map((item, index) => (
                            <div
                                key={index}
                                className={`relative cursor-pointer overflow-hidden bg-bg-secondary ${
                                    post.media.length === 3 && index === 0 ? 'col-span-2' : ''
                                }`}
                                onClick={() => handleMediaClick(item.url, item.type)}
                            >
                                {item.type === 'video' ? (
                                    <div className="relative aspect-video">
                                        <video
                                            ref={(el) => (videoRefs.current[`${post._id}-${index}`] = el)}
                                            src={getImageUrl(item.url)}
                                            className="w-full h-full object-cover"
                                            controls
                                        />
                                    </div>
                                ) : (
                                    <img
                                        src={getImageUrl(item.url)}
                                        alt={`Post attachment ${index + 1}`}
                                        className="w-full max-h-[460px] object-cover hover:scale-[1.01] transition-transform duration-200"
                                        loading="lazy"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                ) : post.mediaUrl ? (
                    <div
                        className="mb-3.5 rounded-lg overflow-hidden border border-border cursor-pointer bg-bg-tertiary"
                        onClick={() => handleMediaClick(post.mediaUrl, post.mediaType)}
                    >
                        {post.mediaType === 'video' ? (
                            <video
                                ref={(el) => (videoRefs.current[`${post._id}-legacy`] = el)}
                                src={getImageUrl(post.mediaUrl)}
                                className="w-full max-h-[460px] object-cover"
                                controls
                            />
                        ) : (
                            <img
                                src={getImageUrl(post.mediaUrl)}
                                alt="Post media"
                                className="w-full max-h-[460px] object-cover hover:scale-[1.01] transition-transform duration-200"
                                loading="lazy"
                            />
                        )}
                    </div>
                ) : post.image ? (
                    <div
                        className="mb-3.5 rounded-lg overflow-hidden border border-border cursor-pointer bg-bg-tertiary"
                        onClick={() => handleMediaClick(post.image, 'image')}
                    >
                        <img
                            src={getImageUrl(post.image)}
                            alt="Post media"
                            className="w-full max-h-[460px] object-cover hover:scale-[1.01] transition-transform duration-200"
                            loading="lazy"
                        />
                    </div>
                ) : null}

                {/* Numeric Stats Strip */}
                <div className="flex items-center gap-4 text-[11px] text-text-muted mb-2.5 pb-2.5 border-b border-border">
                    <span className="tabular-nums font-medium text-text-secondary">
                        {post.likes?.length || 0} {post.likes?.length === 1 ? 'like' : 'likes'}
                    </span>
                    <span>•</span>
                    <button
                        onClick={loadComments}
                        className="tabular-nums font-medium hover:text-text-primary transition-colors"
                    >
                        {comments.length || post.comments?.length || 0} {comments.length === 1 ? 'comment' : 'comments'}
                    </button>
                </div>

                {/* Tactile Action Buttons */}
                <div className="flex items-center justify-between text-xs text-text-secondary pt-0.5">
                    {/* Like Button */}
                    <button
                        onClick={handleLike}
                        className={`flex-1 py-1.5 rounded-md flex items-center justify-center gap-1.5 font-medium transition-colors hover:bg-bg-tertiary ${
                            isLiked ? 'text-red-500' : 'hover:text-text-primary'
                        }`}
                        title={isLiked ? 'Unlike' : 'Like'}
                    >
                        <svg
                            className={`w-4 h-4 transition-transform active:scale-125 ${isLiked ? 'fill-current' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span>Like</span>
                    </button>

                    {/* Comment Button */}
                    <button
                        onClick={loadComments}
                        className="flex-1 py-1.5 rounded-md flex items-center justify-center gap-1.5 font-medium hover:text-text-primary hover:bg-bg-tertiary transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span>Comment</span>
                    </button>

                    {/* Share Button */}
                    <button
                        onClick={() => setShowShareModal(true)}
                        className="flex-1 py-1.5 rounded-md flex items-center justify-center gap-1.5 font-medium hover:text-text-primary hover:bg-bg-tertiary transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                        <span>Share</span>
                    </button>
                </div>

                {/* Comments Section Drawer */}
                {showComments && (
                    <div className="mt-3 pt-3 border-t border-border animate-fade-in">
                        {/* Inline Comment Composer */}
                        <form onSubmit={handleComment} className="flex gap-2 mb-3">
                            <input
                                type="text"
                                className="input text-xs py-1.5 flex-1"
                                placeholder="Add a comment..."
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                maxLength={300}
                                disabled={submittingComment}
                            />
                            <button
                                type="submit"
                                className="btn btn-primary btn-sm px-3"
                                disabled={!commentText.trim() || submittingComment}
                            >
                                {submittingComment ? <LoadingSpinner size="xs" /> : 'Post'}
                            </button>
                        </form>

                        {/* Comments List */}
                        {loadingComments ? (
                            <div className="py-4 text-center">
                                <LoadingSpinner size="sm" />
                            </div>
                        ) : comments.length === 0 ? (
                            <div className="py-4 text-center text-xs text-text-muted">
                                No comments yet. Be the first to share your thoughts.
                            </div>
                        ) : (
                            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                                {comments.map((comment) => (
                                    <div key={comment._id} className="flex gap-2.5 text-xs">
                                        <Link to={`/profile/${comment.author?._id}`}>
                                            <Avatar src={comment.author?.avatar} alt={comment.author?.username} size="xs" />
                                        </Link>
                                        <div className="flex-1 min-w-0">
                                            <div className="bg-bg-tertiary rounded-lg p-2.5 border border-border">
                                                <div className="flex items-center justify-between mb-1">
                                                    <Link
                                                        to={`/profile/${comment.author?._id}`}
                                                        className="font-semibold text-text-primary hover:underline truncate"
                                                    >
                                                        {comment.author?.username}
                                                    </Link>
                                                    <span className="text-[10px] text-text-muted">
                                                        {formatRelativeTime(comment.createdAt)}
                                                    </span>
                                                </div>
                                                <p className="text-text-secondary leading-relaxed break-words">
                                                    {comment.content}
                                                </p>
                                            </div>
                                            {comment.author?._id === user?._id && (
                                                <button
                                                    onClick={() => handleDeleteComment(comment._id)}
                                                    className="text-[10px] text-text-muted hover:text-error mt-1 px-1 transition-colors"
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </article>

            {/* Delete Modal */}
            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title="Delete Post"
            >
                <div className="space-y-4">
                    <p className="text-xs sm:text-sm text-text-secondary">
                        Are you sure you want to permanently delete this post? This action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            onClick={() => setShowDeleteModal(false)}
                            className="btn btn-secondary btn-sm"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDelete}
                            className="btn btn-destructive btn-sm"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Media Lightbox Viewer */}
            <MediaViewer
                isOpen={showFullScreen}
                onClose={() => setShowFullScreen(false)}
                mediaUrl={selectedMedia ? getImageUrl(selectedMedia.url) : ''}
                mediaType={selectedMedia ? selectedMedia.type : 'image'}
            />

            {/* Share Dialog */}
            <ShareModal
                isOpen={showShareModal}
                onClose={() => setShowShareModal(false)}
                post={post}
            />

            {/* Report Dialog */}
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