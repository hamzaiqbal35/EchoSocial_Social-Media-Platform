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
                return 'published a new update';
            case 'share':
                return 'shared a post with you';
            case 'report_status':
                return `report was ${notification.report?.status || 'updated'}`;
            default:
                return 'interacted with your profile';
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'like':
                return (
                    <div className="w-6 h-6 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center shrink-0">
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </div>
                );
            case 'comment':
                return (
                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>
                );
            case 'follow':
                return (
                    <div className="w-6 h-6 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                );
            case 'share':
                return (
                    <div className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                    </div>
                );
            default:
                return (
                    <div className="w-6 h-6 rounded-full bg-bg-tertiary text-text-muted flex items-center justify-center shrink-0">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                );
        }
    };

    const handleNotificationClick = (notification) => {
        if (!notification.read) {
            markAsRead(notification._id);
        }

        if (notification.post) {
            navigate(`/post/${notification.post._id}`);
        } else if (notification.type === 'follow' && notification.actor) {
            navigate(`/profile/${notification.actor._id}`);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
                <LoadingSpinner size="lg" />
                <span className="text-xs text-text-muted">Loading notifications...</span>
            </div>
        );
    }

    const hasUnread = notifications.some((n) => !n.read);

    return (
        <div className="max-w-xl mx-auto px-4 py-6 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-border">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-text-primary">Notifications</h1>
                    <p className="text-xs text-text-muted mt-0.5">Real-time updates and activity</p>
                </div>

                {hasUnread && (
                    <button
                        onClick={markAllAsRead}
                        className="btn btn-secondary btn-xs text-xs font-medium"
                    >
                        Mark all as read
                    </button>
                )}
            </div>

            {/* Notification List */}
            {notifications.length === 0 ? (
                <div className="card text-center py-16 px-4 border border-dashed border-border">
                    <div className="w-12 h-12 rounded-full bg-bg-tertiary flex items-center justify-center mx-auto mb-3 text-text-muted">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                    </div>
                    <h3 className="text-sm font-semibold text-text-primary mb-1">No notifications yet</h3>
                    <p className="text-xs text-text-muted max-w-sm mx-auto">
                        When people follow you, like your posts, or mention you, updates will appear here.
                    </p>
                </div>
            ) : (
                <div className="space-y-2">
                    {notifications.map((notification) => (
                        <div
                            key={notification._id}
                            onClick={() => handleNotificationClick(notification)}
                            className={`card p-3 flex items-start gap-3 cursor-pointer transition-colors ${
                                !notification.read
                                    ? 'bg-bg-tertiary/70 border-border-hover'
                                    : 'hover:bg-bg-tertiary/50'
                            }`}
                        >
                            <Link
                                to={notification.actor ? `/profile/${notification.actor._id}` : '#'}
                                onClick={(e) => e.stopPropagation()}
                                className="shrink-0"
                            >
                                <Avatar
                                    src={notification.actor?.avatar}
                                    alt={notification.actor?.username}
                                    size="sm"
                                />
                            </Link>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                    <p className="text-xs text-text-primary leading-normal">
                                        <span className="font-semibold text-text-primary">
                                            {notification.actor?.username || 'System'}
                                        </span>{' '}
                                        <span className="text-text-secondary">{getNotificationText(notification)}</span>
                                    </p>
                                    {getNotificationIcon(notification.type)}
                                </div>

                                {notification.post?.content && (
                                    <p className="text-xs text-text-muted line-clamp-1 mt-1 bg-bg-secondary px-2 py-1 rounded border border-border">
                                        "{notification.post.content}"
                                    </p>
                                )}

                                <div className="flex items-center gap-2 mt-1.5 text-[11px] text-text-muted">
                                    <span>{formatRelativeTime(notification.createdAt)}</span>
                                    {!notification.read && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" title="Unread"></span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Notifications;
