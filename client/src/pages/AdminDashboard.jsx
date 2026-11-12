import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import MediaViewer from '../components/MediaViewer';
import Avatar from '../components/Avatar';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar
} from 'recharts';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);

    // Overview stats
    const [stats, setStats] = useState(null);
    const [timeRange, setTimeRange] = useState('7d');
    const [customStartDate, setCustomStartDate] = useState('');
    const [customEndDate, setCustomEndDate] = useState('');

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

    const videoRefs = useRef({});

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
    }, [posts]);

    const getMediaUrl = (url) => {
        if (!url) return '';
        if (url.startsWith('/')) {
            return `http://localhost:5000${url}`;
        }
        return url;
    };

    const handleMediaClick = (url, type) => {
        Object.values(videoRefs.current).forEach((video) => {
            if (video) video.muted = true;
        });
        setMediaViewer({ isOpen: true, url, type });
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedUsersSearch(usersSearch);
        }, 350);
        return () => clearTimeout(timer);
    }, [usersSearch]);

    useEffect(() => {
        loadData();
    }, [activeTab, usersPage, debouncedUsersSearch, usersFilter, postsPage, reportsPage, reportsStatus, timeRange, customStartDate, customEndDate]);

    const loadData = async () => {
        try {
            setLoading(true);

            if (activeTab === 'overview') {
                if (timeRange !== 'custom' || (customStartDate && customEndDate)) {
                    const response = await adminAPI.getStats(timeRange, customStartDate, customEndDate);
                    setStats(response.data);
                }
            } else if (activeTab === 'users') {
                const response = await adminAPI.getAllUsers(usersPage, 20, debouncedUsersSearch, usersFilter);
                setUsers(response.data.users || []);
                setUsersTotalPages(response.data.totalPages || 1);
            } else if (activeTab === 'posts') {
                const response = await adminAPI.getAllPosts(postsPage, 20);
                setPosts(response.data.posts || []);
                setPostsTotalPages(response.data.totalPages || 1);
            } else if (activeTab === 'reports') {
                const response = await adminAPI.getReports(reportsPage, 20, reportsStatus);
                setReports(response.data.reports || []);
                setReportsTotalPages(response.data.totalPages || 1);
            }
        } catch (error) {
            console.error('Failed to load admin dashboard data:', error);
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-text-primary">Admin Console</h1>
                    <p className="text-xs text-text-muted mt-0.5">Platform telemetry, user moderation, and content integrity</p>
                </div>

                {/* Tab Navigation */}
                <div className="inline-flex p-1 bg-bg-secondary rounded-lg border border-border">
                    {[
                        { id: 'overview', label: 'Overview' },
                        { id: 'users', label: 'Users' },
                        { id: 'posts', label: 'Posts' },
                        { id: 'reports', label: 'Reports' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                                activeTab === tab.id
                                    ? 'bg-bg-tertiary text-text-primary shadow-xs'
                                    : 'text-text-muted hover:text-text-primary'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Overview Tab Content */}
            {activeTab === 'overview' && (
                loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <LoadingSpinner size="lg" />
                        <span className="text-xs text-text-muted">Loading platform telemetry...</span>
                    </div>
                ) : (
                    stats && (
                        <div className="space-y-6 animate-fade-in">
                            {/* KPI Metrics Cards */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="card p-4">
                                    <div className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-1">
                                        Total Users
                                    </div>
                                    <div className="text-2xl font-bold tracking-tight text-text-primary tabular-nums">
                                        {stats.totalUsers?.toLocaleString() || 0}
                                    </div>
                                </div>
                                <div className="card p-4">
                                    <div className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-1">
                                        Total Posts
                                    </div>
                                    <div className="text-2xl font-bold tracking-tight text-text-primary tabular-nums">
                                        {stats.totalPosts?.toLocaleString() || 0}
                                    </div>
                                </div>
                                <div className="card p-4">
                                    <div className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-1">
                                        Pending Reports
                                    </div>
                                    <div className={`text-2xl font-bold tracking-tight tabular-nums ${stats.pendingReports > 0 ? 'text-amber-400' : 'text-text-primary'}`}>
                                        {stats.pendingReports?.toLocaleString() || 0}
                                    </div>
                                </div>
                                <div className="card p-4">
                                    <div className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-1">
                                        Banned Users
                                    </div>
                                    <div className={`text-2xl font-bold tracking-tight tabular-nums ${stats.bannedUsers > 0 ? 'text-error' : 'text-text-primary'}`}>
                                        {stats.bannedUsers?.toLocaleString() || 0}
                                    </div>
                                </div>
                            </div>

                            {/* Time Filter & Charts */}
                            <div className="space-y-4">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <h2 className="text-sm font-semibold text-text-primary">Platform Telemetry</h2>
                                    <div className="inline-flex p-0.5 bg-bg-secondary rounded-lg border border-border">
                                        {['7d', '30d', '90d', '6m', '1y'].map((range) => (
                                            <button
                                                key={range}
                                                onClick={() => {
                                                    setTimeRange(range);
                                                    setCustomStartDate('');
                                                    setCustomEndDate('');
                                                }}
                                                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                                                    timeRange === range
                                                        ? 'bg-bg-tertiary text-text-primary shadow-xs'
                                                        : 'text-text-muted hover:text-text-primary'
                                                }`}
                                            >
                                                {range.toUpperCase()}
                                            </button>
                                        ))}
                                        <button
                                            onClick={() => setTimeRange('custom')}
                                            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                                                timeRange === 'custom'
                                                    ? 'bg-bg-tertiary text-text-primary shadow-xs'
                                                    : 'text-text-muted hover:text-text-primary'
                                            }`}
                                        >
                                            Custom
                                        </button>
                                    </div>
                                </div>

                                {timeRange === 'custom' && (
                                    <div className="flex items-center gap-3 card p-3">
                                        <div>
                                            <label className="block text-[11px] font-medium text-text-muted mb-1">Start Date</label>
                                            <input
                                                type="date"
                                                className="input text-xs py-1"
                                                value={customStartDate}
                                                onChange={(e) => setCustomStartDate(e.target.value)}
                                                max={new Date().toISOString().split('T')[0]}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-medium text-text-muted mb-1">End Date</label>
                                            <input
                                                type="date"
                                                className="input text-xs py-1"
                                                value={customEndDate}
                                                onChange={(e) => setCustomEndDate(e.target.value)}
                                                max={new Date().toISOString().split('T')[0]}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    {/* User Growth Line Chart */}
                                    <div className="card p-4">
                                        <div className="text-xs font-semibold text-text-primary mb-3">User Growth Trend</div>
                                        <div className="h-64 w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart data={stats.userGrowth || []}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.6} />
                                                    <XAxis
                                                        dataKey="date"
                                                        stroke="var(--text-muted)"
                                                        fontSize={11}
                                                        tickLine={false}
                                                        tickFormatter={(date) => {
                                                            const d = new Date(date);
                                                            return timeRange === '7d' || timeRange === '30d'
                                                                ? d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })
                                                                : d.toLocaleDateString(undefined, { month: 'short', year: '2-digit' });
                                                        }}
                                                    />
                                                    <YAxis
                                                        allowDecimals={false}
                                                        stroke="var(--text-muted)"
                                                        fontSize={11}
                                                        tickLine={false}
                                                    />
                                                    <Tooltip
                                                        contentStyle={{
                                                            backgroundColor: 'var(--bg-secondary)',
                                                            borderColor: 'var(--border)',
                                                            color: 'var(--text-primary)',
                                                            borderRadius: '0.5rem',
                                                            fontSize: '12px'
                                                        }}
                                                        labelFormatter={(date) => new Date(date).toLocaleDateString()}
                                                    />
                                                    <Line
                                                        type="monotone"
                                                        dataKey="count"
                                                        stroke="#2563eb"
                                                        name="New Users"
                                                        strokeWidth={2}
                                                        dot={false}
                                                        activeDot={{ r: 4 }}
                                                    />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    {/* Post Activity Bar Chart */}
                                    <div className="card p-4">
                                        <div className="text-xs font-semibold text-text-primary mb-3">Post Publishing Volume</div>
                                        <div className="h-64 w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={stats.postActivity || []}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.6} />
                                                    <XAxis
                                                        dataKey="date"
                                                        stroke="var(--text-muted)"
                                                        fontSize={11}
                                                        tickLine={false}
                                                        tickFormatter={(date) => {
                                                            const d = new Date(date);
                                                            return timeRange === '7d' || timeRange === '30d'
                                                                ? d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })
                                                                : d.toLocaleDateString(undefined, { month: 'short', year: '2-digit' });
                                                        }}
                                                    />
                                                    <YAxis
                                                        allowDecimals={false}
                                                        stroke="var(--text-muted)"
                                                        fontSize={11}
                                                        tickLine={false}
                                                    />
                                                    <Tooltip
                                                        contentStyle={{
                                                            backgroundColor: 'var(--bg-secondary)',
                                                            borderColor: 'var(--border)',
                                                            color: 'var(--text-primary)',
                                                            borderRadius: '0.5rem',
                                                            fontSize: '12px'
                                                        }}
                                                        labelFormatter={(date) => new Date(date).toLocaleDateString()}
                                                    />
                                                    <Bar
                                                        dataKey="count"
                                                        fill="#3b82f6"
                                                        name="New Posts"
                                                        radius={[4, 4, 0, 0]}
                                                    />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                )
            )}

            {/* Users Tab Content */}
            {activeTab === 'users' && (
                <div className="space-y-4 animate-fade-in">
                    {/* Search and Filter */}
                    <div className="card p-3 flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder="Search accounts by username or email..."
                                className="input text-xs pl-8"
                                value={usersSearch}
                                onChange={(e) => setUsersSearch(e.target.value)}
                            />
                            <svg className="w-4 h-4 text-text-muted absolute left-2.5 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>

                        <select
                            className="input text-xs sm:w-44 py-1.5"
                            value={usersFilter}
                            onChange={(e) => setUsersFilter(e.target.value)}
                        >
                            <option value="all">All Accounts</option>
                            <option value="active">Active Only</option>
                            <option value="banned">Banned Only</option>
                        </select>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <LoadingSpinner size="lg" />
                        </div>
                    ) : (
                        <>
                            <div className="card p-0 overflow-x-auto border border-border">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-bg-tertiary/50 border-b border-border text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                                        <tr>
                                            <th className="p-3">User</th>
                                            <th className="p-3">Email</th>
                                            <th className="p-3">Role</th>
                                            <th className="p-3">Status</th>
                                            <th className="p-3 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {users.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="p-8 text-center text-text-muted">
                                                    No users match the specified criteria
                                                </td>
                                            </tr>
                                        ) : (
                                            users.map((u) => (
                                                <tr key={u._id} className="hover:bg-bg-tertiary/40 transition-colors">
                                                    <td className="p-3">
                                                        <div className="flex items-center gap-2.5">
                                                            <Avatar src={u.avatar} alt={u.username} size="sm" />
                                                            <span className="font-medium text-text-primary">{u.username}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-3 text-text-secondary">{u.email}</td>
                                                    <td className="p-3">
                                                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                                            u.role === 'admin'
                                                                ? 'bg-primary/10 text-primary border border-primary/20'
                                                                : 'bg-bg-tertiary text-text-secondary'
                                                        }`}>
                                                            {u.role}
                                                        </span>
                                                    </td>
                                                    <td className="p-3">
                                                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                                            u.isActive
                                                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                                : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                                        }`}>
                                                            {u.isActive ? 'Active' : 'Banned'}
                                                        </span>
                                                    </td>
                                                    <td className="p-3 text-right">
                                                        {u.role !== 'admin' && (
                                                            u.isActive ? (
                                                                <button
                                                                    onClick={() => {
                                                                        setSelectedUser(u);
                                                                        setShowBanModal(true);
                                                                    }}
                                                                    className="btn btn-destructive btn-xs"
                                                                >
                                                                    Ban
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    onClick={() => handleUnbanUser(u._id)}
                                                                    className="btn btn-secondary btn-xs text-primary"
                                                                >
                                                                    Unban
                                                                </button>
                                                            )
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {usersTotalPages > 1 && (
                                <div className="flex items-center justify-between text-xs pt-2">
                                    <button
                                        onClick={() => setUsersPage((p) => Math.max(1, p - 1))}
                                        disabled={usersPage === 1}
                                        className="btn btn-secondary btn-xs"
                                    >
                                        Previous
                                    </button>
                                    <span className="text-text-muted tabular-nums">
                                        Page {usersPage} of {usersTotalPages}
                                    </span>
                                    <button
                                        onClick={() => setUsersPage((p) => Math.min(usersTotalPages, p + 1))}
                                        disabled={usersPage === usersTotalPages}
                                        className="btn btn-secondary btn-xs"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}

            {/* Posts Tab Content */}
            {activeTab === 'posts' && (
                <div className="space-y-4 animate-fade-in">
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <LoadingSpinner size="lg" />
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {posts.length === 0 ? (
                                <div className="card text-center py-12 text-xs text-text-muted">
                                    No posts found in platform database
                                </div>
                            ) : (
                                posts.map((post) => (
                                    <div key={post._id} className="card p-4">
                                        <div className="flex items-start justify-between gap-4 mb-2">
                                            <div className="flex items-center gap-2.5">
                                                <Avatar src={post.author?.avatar} alt={post.author?.username} size="sm" />
                                                <div>
                                                    <p className="text-xs font-semibold text-text-primary">{post.author?.username}</p>
                                                    <p className="text-[10px] text-text-muted">
                                                        {new Date(post.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDeletePost(post._id)}
                                                className="btn btn-destructive btn-xs"
                                            >
                                                Delete Post
                                            </button>
                                        </div>

                                        <p className="text-xs text-text-secondary leading-relaxed mb-3">
                                            {post.content}
                                        </p>

                                        {/* Media Preview Thumbnail */}
                                        {((post.media && post.media.length > 0) || post.mediaUrl || post.image) && (
                                            <div className="flex gap-2 overflow-x-auto py-1">
                                                {post.media && post.media.length > 0 ? (
                                                    post.media.map((item, idx) => (
                                                        <div
                                                            key={idx}
                                                            onClick={() => handleMediaClick(getMediaUrl(item.url), item.type)}
                                                            className="w-20 h-20 rounded-md overflow-hidden bg-bg-tertiary border border-border cursor-pointer shrink-0"
                                                        >
                                                            {item.type === 'video' ? (
                                                                <video src={getMediaUrl(item.url)} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <img src={getMediaUrl(item.url)} alt="Thumbnail" className="w-full h-full object-cover" />
                                                            )}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div
                                                        onClick={() => handleMediaClick(getMediaUrl(post.mediaUrl || post.image), 'image')}
                                                        className="w-20 h-20 rounded-md overflow-hidden bg-bg-tertiary border border-border cursor-pointer shrink-0"
                                                    >
                                                        <img src={getMediaUrl(post.mediaUrl || post.image)} alt="Thumbnail" className="w-full h-full object-cover" />
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}

                            {postsTotalPages > 1 && (
                                <div className="flex items-center justify-between text-xs pt-2">
                                    <button
                                        onClick={() => setPostsPage((p) => Math.max(1, p - 1))}
                                        disabled={postsPage === 1}
                                        className="btn btn-secondary btn-xs"
                                    >
                                        Previous
                                    </button>
                                    <span className="text-text-muted tabular-nums">
                                        Page {postsPage} of {postsTotalPages}
                                    </span>
                                    <button
                                        onClick={() => setPostsPage((p) => Math.min(postsTotalPages, p + 1))}
                                        disabled={postsPage === postsTotalPages}
                                        className="btn btn-secondary btn-xs"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Reports Tab Content */}
            {activeTab === 'reports' && (
                <div className="space-y-4 animate-fade-in">
                    <div className="card p-3 flex items-center justify-between">
                        <span className="text-xs font-medium text-text-secondary">Filter by status:</span>
                        <select
                            className="input text-xs w-44 py-1"
                            value={reportsStatus}
                            onChange={(e) => setReportsStatus(e.target.value)}
                        >
                            <option value="all">All Reports</option>
                            <option value="pending">Pending</option>
                            <option value="resolved">Resolved</option>
                            <option value="dismissed">Dismissed</option>
                        </select>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <LoadingSpinner size="lg" />
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {reports.length === 0 ? (
                                <div className="card text-center py-12 text-xs text-text-muted">
                                    No reports found with status: {reportsStatus}
                                </div>
                            ) : (
                                reports.map((report) => (
                                    <div key={report._id} className="card p-4">
                                        <div className="flex items-start justify-between gap-4 mb-2">
                                            <div>
                                                <p className="text-xs font-semibold text-text-primary">
                                                    Report by @{report.reporter?.username || 'Unknown'}
                                                </p>
                                                <p className="text-[10px] text-text-muted">
                                                    {new Date(report.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                                report.status === 'pending'
                                                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                                    : report.status === 'resolved'
                                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                    : 'bg-bg-tertiary text-text-muted'
                                            }`}>
                                                {report.status}
                                            </span>
                                        </div>

                                        <p className="text-xs mb-1 text-text-secondary">
                                            <span className="font-semibold text-text-primary">Reason:</span> {report.reason}
                                        </p>
                                        {report.description && (
                                            <p className="text-xs text-text-muted mb-2">"{report.description}"</p>
                                        )}

                                        {report.reportedUser && (
                                            <p className="text-xs mb-2">
                                                <span className="text-text-muted">Target user:</span>{' '}
                                                <Link
                                                    to={`/profile/${report.reportedUser._id}`}
                                                    className="text-primary hover:underline font-medium"
                                                >
                                                    @{report.reportedUser.username}
                                                </Link>
                                            </p>
                                        )}

                                        {report.reportedPost && (
                                            <p className="text-xs mb-3 text-text-secondary">
                                                <span className="text-text-muted">Target post:</span>{' '}
                                                <Link
                                                    to={`/post/${report.reportedPost._id}`}
                                                    className="text-primary hover:underline line-clamp-1 inline-block"
                                                >
                                                    {report.reportedPost.content || 'View post media'}
                                                </Link>
                                            </p>
                                        )}

                                        {report.status === 'pending' && (
                                            <div className="flex gap-2 pt-2 border-t border-border">
                                                <button
                                                    onClick={() => handleResolveReport(report._id, 'resolved')}
                                                    className="btn btn-primary btn-xs"
                                                >
                                                    Resolve
                                                </button>
                                                <button
                                                    onClick={() => handleResolveReport(report._id, 'dismissed')}
                                                    className="btn btn-secondary btn-xs"
                                                >
                                                    Dismiss
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}

                            {reportsTotalPages > 1 && (
                                <div className="flex items-center justify-between text-xs pt-2">
                                    <button
                                        onClick={() => setReportsPage((p) => Math.max(1, p - 1))}
                                        disabled={reportsPage === 1}
                                        className="btn btn-secondary btn-xs"
                                    >
                                        Previous
                                    </button>
                                    <span className="text-text-muted tabular-nums">
                                        Page {reportsPage} of {reportsTotalPages}
                                    </span>
                                    <button
                                        onClick={() => setReportsPage((p) => Math.min(reportsTotalPages, p + 1))}
                                        disabled={reportsPage === reportsTotalPages}
                                        className="btn btn-secondary btn-xs"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
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
                title={`Ban User @${selectedUser?.username}`}
            >
                <div className="space-y-3.5 text-xs">
                    <div>
                        <label className="block text-xs font-medium text-text-secondary mb-1">Reason for Ban</label>
                        <textarea
                            className="input textarea text-xs"
                            placeholder="State reason for policy violation..."
                            value={banReason}
                            onChange={(e) => setBanReason(e.target.value)}
                            rows={3}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-text-secondary mb-1">
                            Duration in Days (leave empty for permanent)
                        </label>
                        <input
                            type="number"
                            className="input text-xs"
                            placeholder="e.g. 7"
                            value={banDuration}
                            onChange={(e) => setBanDuration(e.target.value)}
                            min="1"
                        />
                    </div>
                    <div className="flex justify-end gap-2 pt-2 border-t border-border">
                        <button
                            onClick={() => {
                                setShowBanModal(false);
                                setSelectedUser(null);
                                setBanReason('');
                                setBanDuration('');
                            }}
                            className="btn btn-secondary btn-xs"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleBanUser}
                            className="btn btn-destructive btn-xs"
                            disabled={!banReason}
                        >
                            Confirm Ban
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Media Viewer Lightbox */}
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
