import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useNotifications } from '../contexts/NotificationContext';
import { formatRelativeTime } from '../utils/helpers';
import Avatar from '../components/Avatar';
import LoadingSpinner from '../components/LoadingSpinner';

const Notifications = () => {
    const { notifications, loading, fetchNotifications, markAsRead, markAllAsRead } = useNotifications();
    const navigate = useNavigate();

    useEffect(() => {
        fetchNotifications();
    }, []);

    const getNotificationText = (notification) => {
        switch (notification.type) {
            case 'follow':
                return 'started following you';
            case 'like':
                return 'liked your post';
            case 'comment':
                return 'commented on your post';
            case 'post':
                return 'posted a new update';
            case 'share':
                return 'shared a post with you';
            case 'report_status':
                return `report has been ${notification.report?.status || 'updated'}`;
            default:
                return 'interacted with you';
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'follow':
                return (
                    <div className="w-10 h-10 rounded-full bg-primary bg-opacity-20 flex items-center justify-center">
                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                );
            case 'like':
                return (
                    <div className="w-10 h-10 rounded-full bg-error bg-opacity-20 flex items-center justify-center">
                        <svg className="w-5 h-5 text-error" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </div>
                );
            case 'comment':
                return (
                    <div className="w-10 h-10 rounded-full bg-accent bg-opacity-20 flex items-center justify-center">
                        <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>
                );
            case 'post':
                return (
                    <div className="w-10 h-10 rounded-full bg-green-500 bg-opacity-20 flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                );
            case 'share':
                return (
                    <div className="w-10 h-10 rounded-full bg-blue-500 bg-opacity-20 flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                    </div>
                );
            case 'report_status':
                return (
                    <div className="w-10 h-10 rounded-full bg-warning bg-opacity-20 flex items-center justify-center">
                        <svg className="w-5 h-5 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                );
            default:
                return null;
        }
    };

    const handleNotificationClick = (notification) => {
        // Mark as read if unread
        if (!notification.read) {
            markAsRead(notification._id);
        }

        // Navigate based on notification type
        if (notification.post) {
            // For like, comment, share, and post notifications, navigate to the post
            navigate(`/post/${notification.post._id}`);
        } else if (notification.type === 'follow') {
            // For follow notifications, navigate to the actor's profile
            navigate(`/profile/${notification.actor._id}`);
        } else if (notification.type === 'report_status') {
            // No navigation for report status, just stay on notifications page
            // or maybe show a modal with report details if needed
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Notifications</h1>
                {notifications.length > 0 && notifications.some(n => !n.read) && (
                    <button
                        onClick={markAllAsRead}
                        className="btn btn-ghost btn-sm"
                    >
                        Mark all as read
                    </button>
                )}
            </div>

            {notifications.length === 0 ? (
                <div className="card text-center py-12">
                    <svg className="w-16 h-16 mx-auto text-text-muted mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <h3 className="text-xl font-semibold mb-2">No notifications yet</h3>
                    <p className="text-text-muted">
                        When someone follows you, likes or comments on your posts, you'll see it here
                    </p>
                </div>
            ) : (
                <div className="space-y-2">
                    {notifications.map((notification) => (
                        <div
                            key={notification._id}
                            className={`card cursor-pointer transition-all hover:shadow-md ${!notification.read ? 'bg-primary bg-opacity-5 border-primary' : ''
                                }`}
                            onClick={() => handleNotificationClick(notification)}
                        >
                            <div className="flex items-start gap-4">
                                <Link to={`/profile/${notification.actor?._id}`}>
                                    <Avatar
                                        src={notification.actor?.avatar}
                                        alt={notification.actor?.username}
                                        size="md"
                                    />
                                </Link>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start gap-3">
                                        <div className="flex-1">
                                            <p className="text-sm">
                                                <Link
                                                    to={notification.actor ? `/profile/${notification.actor._id}` : '#'}
                                                    className={`font-semibold ${notification.actor ? 'hover:underline' : 'cursor-default'}`}
                                                >
                                                    {notification.actor?.username || 'System'}
                                                </Link>
                                                {' '}
                                                <span className="text-text-muted">
                                                    {getNotificationText(notification)}
                                                </span>
                                            </p>
                                            {notification.post && (
                                                <p className="text-sm text-text-muted mt-1 truncate">
                                                    "{notification.post.content}"
                                                </p>
                                            )}
                                            <p className="text-xs text-text-muted mt-1">
                                                {formatRelativeTime(notification.createdAt)}
                                            </p>
                                        </div>

                                        {getNotificationIcon(notification.type)}
                                    </div>
                                </div>

                                {!notification.read && (
                                    <div className="badge-dot"></div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Notifications;
