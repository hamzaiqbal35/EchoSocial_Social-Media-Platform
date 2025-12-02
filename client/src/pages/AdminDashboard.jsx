import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import MediaViewer from '../components/MediaViewer';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);

    // Overview stats
    const [stats, setStats] = useState(null);

    // Users management
    const [users, setUsers] = useState([]);
    const [usersPage, setUsersPage] = useState(1);
    const [usersTotalPages, setUsersTotalPages] = useState(1);
    const [usersSearch, setUsersSearch] = useState('');
    const [usersFilter, setUsersFilter] = useState('all');
    const [showBanModal, setShowBanModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [banReason, setBanReason] = useState('');
    const [banDuration, setBanDuration] = useState('');

    // Posts management
    const [posts, setPosts] = useState([]);
    const [postsPage, setPostsPage] = useState(1);
    const [postsTotalPages, setPostsTotalPages] = useState(1);

    // Reports management
    const [reports, setReports] = useState([]);
    const [reportsPage, setReportsPage] = useState(1);
    const [reportsTotalPages, setReportsTotalPages] = useState(1);
    const [reportsStatus, setReportsStatus] = useState('pending');
    const [debouncedUsersSearch, setDebouncedUsersSearch] = useState('');
    const [mediaViewer, setMediaViewer] = useState({ isOpen: false, url: null, type: null });

    const getMediaUrl = (url) => {
        if (!url) return '';
        if (url.startsWith('/')) {
            return `http://localhost:5000${url}`;
        }
        return url;
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedUsersSearch(usersSearch);
        }, 500);
        return () => clearTimeout(timer);
    }, [usersSearch]);

    useEffect(() => {
        loadData();
    }, [activeTab, usersPage, debouncedUsersSearch, usersFilter, postsPage, reportsPage, reportsStatus]);

    const loadData = async () => {
        try {
            setLoading(true);

            if (activeTab === 'overview') {
                const response = await adminAPI.getStats();
                setStats(response.data);
            } else if (activeTab === 'users') {
                const response = await adminAPI.getAllUsers(usersPage, 20, usersSearch, usersFilter);
                setUsers(response.data.users);
                setUsersTotalPages(response.data.totalPages);
            } else if (activeTab === 'posts') {
                const response = await adminAPI.getAllPosts(postsPage, 20);
                setPosts(response.data.posts);
                setPostsTotalPages(response.data.totalPages);
            } else if (activeTab === 'reports') {
                const response = await adminAPI.getReports(reportsPage, 20, reportsStatus);
                setReports(response.data.reports);
                setReportsTotalPages(response.data.totalPages);
            }
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBanUser = async () => {
        try {
            await adminAPI.banUser(selectedUser._id, {
                reason: banReason,
                duration: banDuration ? parseInt(banDuration) : null
            });
            setShowBanModal(false);
            setBanReason('');
            setBanDuration('');
            setSelectedUser(null);
            loadData();
        } catch (error) {
            console.error('Failed to ban user:', error);
        }
    };

    const handleUnbanUser = async (userId) => {
        try {
            await adminAPI.unbanUser(userId);
            loadData();
        } catch (error) {
            console.error('Failed to unban user:', error);
        }
    };

    const handleDeletePost = async (postId) => {
        if (!confirm('Are you sure you want to delete this post?')) return;

        try {
            await adminAPI.deletePost(postId);
            loadData();
        } catch (error) {
            console.error('Failed to delete post:', error);
        }
    };

    const handleResolveReport = async (reportId, status) => {
        try {
            await adminAPI.resolveReport(reportId, status);
            loadData();
        } catch (error) {
            console.error('Failed to resolve report:', error);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-border overflow-x-auto">
                {['overview', 'users', 'posts', 'reports'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-3 font-medium capitalize transition-colors border-b-2 ${activeTab === tab
                            ? 'border-primary text-primary'
                            : 'border-transparent text-text-secondary hover:text-text-primary'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
                loading ? (
                    <div className="flex justify-center py-12">
                        <LoadingSpinner size="lg" />
                    </div>
                ) : (
                    stats && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="card">
                                <h3 className="text-text-muted text-sm font-medium mb-2">Total Users</h3>
                                <p className="text-3xl font-bold">{stats.totalUsers}</p>
                            </div>
                            <div className="card">
                                <h3 className="text-text-muted text-sm font-medium mb-2">Total Posts</h3>
                                <p className="text-3xl font-bold">{stats.totalPosts}</p>
                            </div>
                            <div className="card">
                                <h3 className="text-text-muted text-sm font-medium mb-2">Pending Reports</h3>
                                <p className="text-3xl font-bold text-error">{stats.pendingReports}</p>
                            </div>
                            <div className="card">
                                <h3 className="text-text-muted text-sm font-medium mb-2">Banned Users</h3>
                                <p className="text-3xl font-bold text-error">{stats.bannedUsers}</p>
                            </div>
                        </div>
                    )
                )
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
                <div>
                    <div className="card mb-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                            {/* Search Input with Icon */}
                            <div className="relative flex-1">
                                <svg className="w-5 h-5 text-slate-400 absolute left-4 top-1/3 -translate-y-1 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 0 0">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search by username..."
                                    className="input pl-12"
                                    value={usersSearch}
                                    onChange={(e) => setUsersSearch(e.target.value)}
                                />
                            </div>

                            {/* Filter Dropdown */}
                            <div className="relative sm:w-56">
                                <svg className="w-5 h-5 text-slate-400 absolute left-4 top-1/3 -translate-y-1 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 0 0">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                </svg>
                                <select
                                    className="input pl-12 pr-10 appearance-none cursor-pointer"
                                    value={usersFilter}
                                    onChange={(e) => setUsersFilter(e.target.value)}
                                >
                                    <option value="all">All Users</option>
                                    <option value="active">Active Only</option>
                                    <option value="banned">Banned Only</option>
                                </select>
                                <svg className="w-5 h-5 text-slate-400 absolute right-4 top-1/3 -translate-y-1 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <LoadingSpinner size="lg" />
                        </div>
                    ) : (
                        <>
                            <div className="card overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-border">
                                            <th className="text-left p-4">User</th>
                                            <th className="text-left p-4">Email</th>
                                            <th className="text-left p-4">Role</th>
                                            <th className="text-left p-4">Status</th>
                                            <th className="text-left p-4">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user) => (
                                            <tr key={user._id} className="border-b border-border">
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={getMediaUrl(user.avatar) || '/default-avatar.png'}
                                                            alt={user.username}
                                                            className="w-10 h-10 rounded-full"
                                                        />
                                                        <span className="font-medium">{user.username}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-text-secondary">{user.email}</td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-medium ${user.role === 'admin' ? 'bg-primary/20 text-primary' : 'bg-bg-secondary'
                                                        }`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-medium ${user.isActive ? 'bg-green-500/20 text-green-500' : 'bg-error/20 text-error'
                                                        }`}>
                                                        {user.isActive ? 'Active' : 'Banned'}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    {user.role !== 'admin' && (
                                                        user.isActive ? (
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedUser(user);
                                                                    setShowBanModal(true);
                                                                }}
                                                                className="text-error hover:underline text-sm"
                                                            >
                                                                Ban
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleUnbanUser(user._id)}
                                                                className="text-primary hover:underline text-sm"
                                                            >
                                                                Unban
                                                            </button>
                                                        )
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {usersTotalPages > 1 && (
                                <div className="flex justify-center gap-2 mt-6">
                                    <button
                                        onClick={() => setUsersPage(p => Math.max(1, p - 1))}
                                        disabled={usersPage === 1}
                                        className="btn btn-secondary btn-sm"
                                    >
                                        Previous
                                    </button>
                                    <span className="flex items-center px-4">
                                        Page {usersPage} of {usersTotalPages}
                                    </span>
                                    <button
                                        onClick={() => setUsersPage(p => Math.min(usersTotalPages, p + 1))}
                                        disabled={usersPage === usersTotalPages}
                                        className="btn btn-secondary btn-sm"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}

            {/* Posts Tab */}
            {activeTab === 'posts' && (
                loading ? (
                    <div className="flex justify-center py-12">
                        <LoadingSpinner size="lg" />
                    </div>
                ) : (
                    <div>
                        <div className="grid grid-cols-1 gap-6">
                            {posts.map((post) => (
                                <div key={post._id} className="card">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={getMediaUrl(post.author?.avatar) || '/default-avatar.png'}
                                                alt={post.author?.username}
                                                className="w-10 h-10 rounded-full"
                                            />
                                            <div>
                                                <p className="font-medium">{post.author?.username}</p>
                                                <p className="text-sm text-text-muted">
                                                    {new Date(post.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDeletePost(post._id)}
                                            className="text-error hover:underline text-sm"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                    <p className="mb-4">{post.content}</p>
                                    {(() => {
                                        const mediaUrl = post.mediaUrl || post.image;
                                        const isVideo = post.mediaType === 'video' || (mediaUrl && mediaUrl.match(/\.(mp4|webm|ogg)$/i));

                                        if (!mediaUrl) return null;

                                        return (
                                            <div className="relative group">
                                                {isVideo ? (
                                                    <div className="relative">
                                                        <video
                                                            controls
                                                            className="w-full rounded-lg max-h-96 bg-black"
                                                            preload="metadata"
                                                        >
                                                            <source src={getMediaUrl(mediaUrl)} type="video/mp4" />
                                                            <source src={getMediaUrl(mediaUrl)} type="video/webm" />
                                                            <source src={getMediaUrl(mediaUrl)} type="video/ogg" />
                                                            Your browser does not support the video tag.
                                                        </video>
                                                        <button
                                                            onClick={() => setMediaViewer({ isOpen: true, url: getMediaUrl(mediaUrl), type: 'video' })}
                                                            className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                                                            title="View Fullscreen"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="relative cursor-pointer" onClick={() => setMediaViewer({ isOpen: true, url: getMediaUrl(mediaUrl), type: 'image' })}>
                                                        <img
                                                            src={getMediaUrl(mediaUrl)}
                                                            alt="Post"
                                                            className="w-full rounded-lg max-h-96 object-cover hover:opacity-95 transition-opacity"
                                                        />
                                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-lg">
                                                            <span className="text-white bg-black/50 px-3 py-1 rounded-full text-sm">View Fullscreen</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })()}
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {postsTotalPages > 1 && (
                            <div className="flex justify-center gap-2 mt-6">
                                <button
                                    onClick={() => setPostsPage(p => Math.max(1, p - 1))}
                                    disabled={postsPage === 1}
                                    className="btn btn-secondary btn-sm"
                                >
                                    Previous
                                </button>
                                <span className="flex items-center px-4">
                                    Page {postsPage} of {postsTotalPages}
                                </span>
                                <button
                                    onClick={() => setPostsPage(p => Math.min(postsTotalPages, p + 1))}
                                    disabled={postsPage === postsTotalPages}
                                    className="btn btn-secondary btn-sm"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                )
            )}

            {/* Reports Tab */}
            {activeTab === 'reports' && (
                loading ? (
                    <div className="flex justify-center py-12">
                        <LoadingSpinner size="lg" />
                    </div>
                ) : (
                    <div>
                        <div className="mb-6">
                            <select
                                className="input"
                                value={reportsStatus}
                                onChange={(e) => setReportsStatus(e.target.value)}
                            >
                                <option value="all">All Reports</option>
                                <option value="pending">Pending</option>
                                <option value="resolved">Resolved</option>
                                <option value="dismissed">Dismissed</option>
                            </select>
                        </div>

                        <div className="space-y-4">
                            {reports.map((report) => (
                                <div key={report._id} className="card">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <p className="font-medium">
                                                Report by {report.reporter?.username}
                                            </p>
                                            <p className="text-sm text-text-muted">
                                                {new Date(report.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${report.status === 'pending' ? 'bg-error/20 text-error' :
                                            report.status === 'resolved' ? 'bg-green-500/20 text-green-500' :
                                                'bg-bg-secondary'
                                            }`}>
                                            {report.status}
                                        </span>
                                    </div>
                                    <p className="mb-2">
                                        <span className="font-medium">Reason:</span> {report.reason}
                                    </p>
                                    {report.description && (
                                        <p className="mb-2 text-text-secondary">{report.description}</p>
                                    )}
                                    {report.reportedUser && (
                                        <p className="mb-2">
                                            <span className="font-medium">Reported User:</span>{' '}
                                            <Link
                                                to={`/profile/${report.reportedUser._id}`}
                                                className="text-primary hover:underline"
                                            >
                                                {report.reportedUser.username}
                                            </Link>
                                        </p>
                                    )}
                                    {report.reportedPost && (
                                        <p className="mb-4 text-text-secondary">
                                            <span className="font-medium">Reported Post:</span>{' '}
                                            <Link
                                                to={`/`}
                                                className="text-primary hover:underline"
                                            >
                                                {report.reportedPost.content?.substring(0, 100)}...
                                            </Link>
                                        </p>
                                    )}
                                    {report.status === 'pending' && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleResolveReport(report._id, 'resolved')}
                                                className="btn btn-primary btn-sm"
                                            >
                                                Resolve
                                            </button>
                                            <button
                                                onClick={() => handleResolveReport(report._id, 'dismissed')}
                                                className="btn btn-secondary btn-sm"
                                            >
                                                Dismiss
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {reportsTotalPages > 1 && (
                            <div className="flex justify-center gap-2 mt-6">
                                <button
                                    onClick={() => setReportsPage(p => Math.max(1, p - 1))}
                                    disabled={reportsPage === 1}
                                    className="btn btn-secondary btn-sm"
                                >
                                    Previous
                                </button>
                                <span className="flex items-center px-4">
                                    Page {reportsPage} of {reportsTotalPages}
                                </span>
                                <button
                                    onClick={() => setReportsPage(p => Math.min(reportsTotalPages, p + 1))}
                                    disabled={reportsPage === reportsTotalPages}
                                    className="btn btn-secondary btn-sm"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                )
            )}

            {/* Ban User Modal */}
            <Modal
                isOpen={showBanModal}
                onClose={() => {
                    setShowBanModal(false);
                    setSelectedUser(null);
                    setBanReason('');
                    setBanDuration('');
                }}
                title="Ban User"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Reason</label>
                        <textarea
                            className="input textarea"
                            placeholder="Reason for ban..."
                            value={banReason}
                            onChange={(e) => setBanReason(e.target.value)}
                            rows={3}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Duration (days, leave empty for permanent)
                        </label>
                        <input
                            type="number"
                            className="input"
                            placeholder="e.g., 7"
                            value={banDuration}
                            onChange={(e) => setBanDuration(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-3 justify-end pt-4">
                        <button
                            onClick={() => {
                                setShowBanModal(false);
                                setSelectedUser(null);
                                setBanReason('');
                                setBanDuration('');
                            }}
                            className="btn btn-secondary"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleBanUser}
                            className="btn btn-primary bg-error hover:bg-error"
                            disabled={!banReason}
                        >
                            Ban User
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Media Viewer */}
            <MediaViewer
                isOpen={mediaViewer.isOpen}
                onClose={() => setMediaViewer({ ...mediaViewer, isOpen: false })}
                mediaUrl={mediaViewer.url}
                mediaType={mediaViewer.type}
            />
        </div>
    );
};

export default AdminDashboard;
