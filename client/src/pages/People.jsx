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
                setUsers(response.data);
            } else {
                response = await userAPI.getFollowing(currentUser._id);
                setUsers(response.data);
                // Update followingIds to include all users in the following list
                const followingUserIds = response.data.map(u => u._id);
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
            // If in suggested tab, remove user from list
            if (activeTab === 'suggested') {
                setUsers(users.filter(u => u._id !== userId));
            }
        } catch (error) {
            console.error('Failed to follow user:', error);
        }
    };

    const handleUnfollow = async (userId) => {
        try {
            await userAPI.unfollowUser(userId);
            setFollowingIds(followingIds.filter(id => id !== userId));
            // If in following tab, remove user from list
            if (activeTab === 'following') {
                setUsers(users.filter(u => u._id !== userId));
            }
        } catch (error) {
            console.error('Failed to unfollow user:', error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">People</h1>

                <div className="flex bg-bg-secondary rounded-lg p-1">
                    <button
                        onClick={() => setActiveTab('suggested')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'suggested'
                            ? 'bg-gradient-to-r from-indigo-500 to-pink-500 text-white shadow-lg'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                            }`}
                    >
                        Suggested
                    </button>
                    <button
                        onClick={() => setActiveTab('following')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'following'
                            ? 'bg-gradient-to-r from-indigo-500 to-pink-500 text-white shadow-lg'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                            }`}
                    >
                        Following
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <LoadingSpinner size="lg" />
                </div>
            ) : users.length === 0 ? (
                <div className="text-center py-12 text-text-muted">
                    {activeTab === 'suggested'
                        ? 'No suggestions available at the moment.'
                        : 'You are not following anyone yet.'}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {users.map((user) => (
                        <div key={user._id} className="card flex flex-col items-center text-center p-6 hover:border-primary/50 transition-colors">
                            <Link to={`/profile/${user._id}`} className="mb-4">
                                <Avatar src={user.avatar} alt={user.username} size="xl" />
                            </Link>

                            <Link to={`/profile/${user._id}`} className="hover:underline">
                                <h3 className="font-bold text-lg mb-1">{user.username}</h3>
                            </Link>

                            {user.bio && (
                                <p className="text-text-secondary text-sm mb-4 line-clamp-2 h-10">
                                    {user.bio}
                                </p>
                            )}

                            <div className="mt-auto">
                                {followingIds.includes(user._id) ? (
                                    <button
                                        onClick={() => handleUnfollow(user._id)}
                                        className="btn btn-secondary w-full"
                                    >
                                        Unfollow
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleFollow(user._id)}
                                        className="btn btn-primary w-full"
                                    >
                                        Follow
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default People;
