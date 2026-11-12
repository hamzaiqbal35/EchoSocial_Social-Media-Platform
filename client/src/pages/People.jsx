import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import Avatar from '../components/Avatar';
import LoadingSpinner from '../components/LoadingSpinner';

const People = () => {
    const { user: currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState('suggested');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [followingIds, setFollowingIds] = useState([]);

    useEffect(() => {
        if (currentUser) {
            setFollowingIds(currentUser.following || []);
        }
    }, [currentUser]);

    useEffect(() => {
        loadUsers();
    }, [activeTab]);

    const loadUsers = async () => {
        try {
            setLoading(true);
            let response;
            if (activeTab === 'suggested') {
                response = await userAPI.getSuggestedUsers();
                setUsers(response.data || []);
            } else {
                response = await userAPI.getFollowing(currentUser?._id);
                setUsers(response.data || []);
                const followingUserIds = (response.data || []).map((u) => u._id);
                setFollowingIds(followingUserIds);
            }
        } catch (error) {
            console.error('Failed to load users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFollow = async (userId) => {
        try {
            await userAPI.followUser(userId);
            setFollowingIds([...followingIds, userId]);
            if (activeTab === 'suggested') {
                setUsers(users.filter((u) => u._id !== userId));
            }
        } catch (error) {
            console.error('Failed to follow user:', error);
        }
    };

    const handleUnfollow = async (userId) => {
        try {
            await userAPI.unfollowUser(userId);
            setFollowingIds(followingIds.filter((id) => id !== userId));
            if (activeTab === 'following') {
                setUsers(users.filter((u) => u._id !== userId));
            }
        } catch (error) {
            console.error('Failed to unfollow user:', error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
            {/* Header with Segmented Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-text-primary">Discover People</h1>
                    <p className="text-xs text-text-muted mt-0.5">Find creators and connect with the community</p>
                </div>

                {/* Segmented Control */}
                <div className="inline-flex p-1 bg-bg-secondary rounded-lg border border-border">
                    <button
                        onClick={() => setActiveTab('suggested')}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                            activeTab === 'suggested'
                                ? 'bg-bg-tertiary text-text-primary shadow-xs'
                                : 'text-text-muted hover:text-text-primary'
                        }`}
                    >
                        Suggested Creators
                    </button>
                    <button
                        onClick={() => setActiveTab('following')}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                            activeTab === 'following'
                                ? 'bg-bg-tertiary text-text-primary shadow-xs'
                                : 'text-text-muted hover:text-text-primary'
                        }`}
                    >
                        Following
                    </button>
                </div>
            </div>

            {/* Content State */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <LoadingSpinner size="lg" />
                    <span className="text-xs text-text-muted">Loading people...</span>
                </div>
            ) : users.length === 0 ? (
                <div className="card text-center py-16 px-4 border border-dashed border-border">
                    <div className="w-12 h-12 rounded-full bg-bg-tertiary flex items-center justify-center mx-auto mb-3 text-text-muted">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <h3 className="text-sm font-semibold text-text-primary mb-1">
                        {activeTab === 'suggested' ? 'No suggestions right now' : 'You are not following anyone yet'}
                    </h3>
                    <p className="text-xs text-text-muted max-w-sm mx-auto">
                        {activeTab === 'suggested'
                            ? 'Check back later or search for users by name in the top navigation bar.'
                            : 'Browse suggested creators to start populating your personalized feed.'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                    {users.map((targetUser) => {
                        const isFollowing = followingIds.includes(targetUser._id);
                        return (
                            <div
                                key={targetUser._id}
                                className="card p-4 flex flex-col justify-between hover:border-border-hover transition-colors"
                            >
                                <div>
                                    <div className="flex items-start justify-between gap-3 mb-3">
                                        <Link to={`/profile/${targetUser._id}`} className="group flex items-center gap-2.5 min-w-0">
                                            <Avatar src={targetUser.avatar} alt={targetUser.username} size="md" />
                                            <div className="min-w-0">
                                                <h3 className="text-xs font-semibold text-text-primary group-hover:underline truncate">
                                                    {targetUser.username}
                                                </h3>
                                                <span className="text-[11px] text-text-muted">
                                                    @{targetUser.username?.toLowerCase()}
                                                </span>
                                            </div>
                                        </Link>
                                    </div>

                                    <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed min-h-[36px] mb-3">
                                        {targetUser.bio || 'No bio provided yet.'}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between pt-3 border-t border-border">
                                    <span className="text-[11px] font-mono text-text-muted tabular-nums">
                                        {targetUser.followersCount || 0} {targetUser.followersCount === 1 ? 'follower' : 'followers'}
                                    </span>

                                    {targetUser._id !== currentUser?._id && (
                                        <button
                                            onClick={() =>
                                                isFollowing ? handleUnfollow(targetUser._id) : handleFollow(targetUser._id)
                                            }
                                            className={`btn btn-xs ${
                                                isFollowing ? 'btn-secondary' : 'btn-primary'
                                            }`}
                                        >
                                            {isFollowing ? 'Following' : 'Follow'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default People;
