import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { userAPI, postAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { formatNumber, imageToBase64 } from '../utils/helpers';
import Avatar from '../components/Avatar';
import PostCard from '../components/PostCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import ReportModal from '../components/ReportModal';

const Profile = () => {
    const { id } = useParams();
    const { user: currentUser, updateUser } = useAuth();
    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isBlocked, setIsBlocked] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showOptionsMenu, setShowOptionsMenu] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [editBio, setEditBio] = useState('');
    const [editUsername, setEditUsername] = useState('');
    const [editAvatar, setEditAvatar] = useState('');
    const [updating, setUpdating] = useState(false);

    // Password change state
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showPasswordSection, setShowPasswordSection] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const isOwnProfile = currentUser?._id === id;

    useEffect(() => {
        loadProfile();
        loadPosts();
    }, [id]);

    const loadProfile = async () => {
        try {
            const response = await userAPI.getProfile(id);
            setProfile(response.data);
            setEditBio(response.data.bio || '');
            setEditUsername(response.data.username || '');
            setEditAvatar(response.data.avatar || '');

            // Check if following
            if (currentUser && !isOwnProfile) {
                setIsFollowing(
                    currentUser.following?.some(f =>
                        typeof f === 'string' ? f === id : f._id === id
                    )
                );

                // Check if blocked
                setIsBlocked(
                    currentUser.blockedUsers?.some(b =>
                        typeof b === 'string' ? b === id : b._id === id
                    )
                );
            }
        } catch (error) {
            console.error('Failed to load profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadPosts = async () => {
        try {
            const response = await postAPI.getUserPosts(id, 1, 20);
            setPosts(response.data.posts);
        } catch (error) {
            console.error('Failed to load posts:', error);
        }
    };

    const handleFollow = async () => {
        try {
            if (isFollowing) {
                await userAPI.unfollowUser(id);
                setIsFollowing(false);
                setProfile({
                    ...profile,
                    followersCount: profile.followersCount - 1
                });
            } else {
                await userAPI.followUser(id);
                setIsFollowing(true);
                setProfile({
                    ...profile,
                    followersCount: profile.followersCount + 1
                });
            }
        } catch (error) {
            console.error('Failed to follow/unfollow:', error);
        }
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const base64 = await imageToBase64(file);
                setEditAvatar(base64);
            } catch (error) {
                console.error('Failed to process image:', error);
            }
        }
    };

    const handleUpdateProfile = async () => {
        try {
            setUpdating(true);
            const response = await userAPI.updateProfile({
                bio: editBio,
                avatar: editAvatar,
                username: editUsername
            });
            setProfile(response.data);
            updateUser(response.data);
            // Don't close modal, just show success or update state
            alert('Profile updated successfully');
        } catch (error) {
            console.error('Failed to update profile:', error);
            alert(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setUpdating(false);
        }
    };

    const handleChangePassword = async () => {
        try {
            setUpdating(true);
            setPasswordError('');
            setPasswordSuccess('');

            await userAPI.changePassword({
                currentPassword,
                newPassword
            });

            setPasswordSuccess('Password updated successfully');
            setCurrentPassword('');
            setNewPassword('');
        } catch (error) {
            setPasswordError(error.response?.data?.message || 'Failed to update password');
        } finally {
            setUpdating(false);
        }
    };

    const handleDeleteAccount = async () => {
        try {
            setUpdating(true);
            await userAPI.deleteAccount();
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        } catch (error) {
            console.error('Failed to delete account:', error);
            alert(error.response?.data?.message || 'Failed to delete account');
            setUpdating(false);
        }
    };

    const handleBlock = async () => {
        try {
            if (isBlocked) {
                await userAPI.unblockUser(id);
                setIsBlocked(false);
            } else {
                await userAPI.blockUser(id);
                setIsBlocked(true);
                // Unfollow when blocking
                setIsFollowing(false);
            }
            setShowOptionsMenu(false);
        } catch (error) {
            console.error('Failed to block/unblock user:', error);
        }
    };

    const handlePostDeleted = (postId) => {
        setPosts(posts.filter(p => p._id !== postId));
        if (profile) {
            setProfile({
                ...profile,
                postsCount: profile.postsCount - 1
            });
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-12 text-center">
                <h2 className="text-2xl font-bold mb-2">User not found</h2>
                <p className="text-text-muted">This user doesn't exist or has been removed.</p>
            </div>
        );
    }

    return (
        <>
            <div className="max-w-4xl mx-auto px-4 py-6">
                {/* Profile Header */}
                <div className="card mb-6">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                        <Avatar src={profile.avatar} alt={profile.username} size="xl" />

                        <div className="flex-1 text-center sm:text-left">
                            <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
                                <h1 className="text-2xl font-bold">{profile.username}</h1>

                                {isOwnProfile ? (
                                    <button
                                        onClick={() => setShowEditModal(true)}
                                        className="btn btn-secondary btn-sm"
                                    >
                                        Edit Profile
                                    </button>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={handleFollow}
                                            className={`btn btn-sm ${isFollowing ? 'btn-secondary' : 'btn-primary'}`}
                                            disabled={isBlocked}
                                        >
                                            {isFollowing ? 'Unfollow' : 'Follow'}
                                        </button>

                                        {/* Options Menu */}
                                        <div className="relative">
                                            <button
                                                onClick={() => setShowOptionsMenu(!showOptionsMenu)}
                                                className="btn btn-ghost btn-sm p-2"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                                </svg>
                                            </button>

                                            {showOptionsMenu && (
                                                <>
                                                    {/* Backdrop to close menu */}
                                                    <div
                                                        className="fixed inset-0 z-10"
                                                        onClick={() => setShowOptionsMenu(false)}
                                                    />

                                                    {/* Menu */}
                                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-xl z-20">
                                                        <button
                                                            onClick={handleBlock}
                                                            className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-3 text-gray-900 dark:text-gray-100 rounded-t-lg"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                                            </svg>
                                                            <span>{isBlocked ? 'Unblock User' : 'Block User'}</span>
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setShowReportModal(true);
                                                                setShowOptionsMenu(false);
                                                            }}
                                                            className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-3 text-red-600 dark:text-red-400 border-t border-gray-200 dark:border-slate-700 rounded-b-lg"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                            </svg>
                                                            <span>Report User</span>
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Stats */}
                            <div className="flex gap-6 justify-center sm:justify-start mb-4">
                                <div>
                                    <div className="font-bold text-lg">{formatNumber(profile.postsCount || 0)}</div>
                                    <div className="text-sm text-text-muted">Posts</div>
                                </div>
                                <div>
                                    <div className="font-bold text-lg">{formatNumber(profile.followersCount || 0)}</div>
                                    <div className="text-sm text-text-muted">Followers</div>
                                </div>
                                <div>
                                    <div className="font-bold text-lg">{formatNumber(profile.followingCount || 0)}</div>
                                    <div className="text-sm text-text-muted">Following</div>
                                </div>
                            </div>

                            {/* Bio */}
                            {profile.bio && (
                                <p className="text-text-secondary">{profile.bio}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Posts */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold">Posts</h2>

                    {posts.length === 0 ? (
                        <div className="card text-center py-12">
                            <svg className="w-16 h-16 mx-auto text-text-muted mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                            </svg>
                            <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
                            <p className="text-text-muted">
                                {isOwnProfile ? "You haven't posted anything yet" : "This user hasn't posted anything yet"}
                            </p>
                        </div>
                    ) : (
                        posts.map((post) => (
                            <PostCard key={post._id} post={post} onDelete={handlePostDeleted} />
                        ))
                    )}
                </div>
            </div>

            {/* Edit Profile Modal */}
            <Modal
                isOpen={showEditModal}
                onClose={() => {
                    setShowEditModal(false);
                    setEditBio(profile?.bio || '');
                    setEditUsername(profile?.username || '');
                    setEditAvatar(profile?.avatar || '');
                    setCurrentPassword('');
                    setNewPassword('');
                    setPasswordError('');
                    setPasswordSuccess('');
                }}
                title="Edit Profile"
            >
                <div className="space-y-3 max-h-120 max-w-120 overflow-y-auto">
                    {/* Avatar & Basic Info */}
                    <div className="flex items-start gap-4 max-h-120 max-w-120 overflow-y-auto">
                        <div className="flex flex-col items-center gap-2">
                            <Avatar src={editAvatar} alt={profile.username} size="lg" />
                            <label className="text-xs text-primary cursor-pointer hover:underline">
                                Change
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                    className="hidden"
                                />
                            </label>
                        </div>

                        <div className="flex-1 space-y-2">
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-xs font-medium mb-1">Username</label>
                                    <input
                                        type="text"
                                        className="input input-sm w-full"
                                        value={editUsername}
                                        onChange={(e) => setEditUsername(e.target.value)}
                                        placeholder="Username"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium mb-1">Email</label>
                                    <input
                                        type="email"
                                        className="input input-sm w-full bg-bg-secondary cursor-not-allowed opacity-70"
                                        value={profile.email}
                                        disabled
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium mb-1">Bio</label>
                                <textarea
                                    className="input textarea text-sm py-1 w-full"
                                    placeholder="Tell us about yourself..."
                                    value={editBio}
                                    onChange={(e) => setEditBio(e.target.value)}
                                    maxLength={160}
                                    rows={2}
                                />
                                <div className="text-xs text-text-muted mt-0.5 text-right">
                                    {editBio.length}/160
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end border-b border-border pb-3">
                        <button
                            onClick={handleUpdateProfile}
                            className="btn btn-primary btn-sm"
                            disabled={updating}
                        >
                            {updating ? <LoadingSpinner size="sm" /> : 'Save Info'}
                        </button>
                    </div>

                    {/* Collapsible Password Section */}
                    <div>
                        <button
                            onClick={() => setShowPasswordSection(!showPasswordSection)}
                            className="flex items-center justify-between w-full text-sm font-semibold mb-2 hover:bg-bg-secondary p-2 rounded transition-colors"
                        >
                            <span>Change Password</span>
                            <svg
                                className={`w-4 h-4 transition-transform ${showPasswordSection ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {showPasswordSection && (
                            <div className="space-y-2 p-2 bg-bg-secondary/30 rounded-lg animate-fade-in max-h-[150px] overflow-y-auto">
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-xs font-medium mb-1">Current</label>
                                        <div className="relative">
                                            <input
                                                type={showCurrentPassword ? "text" : "password"}
                                                className="input input-sm pr-8 w-full"
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                placeholder="Current"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                                            >
                                                {showCurrentPassword ? (
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                    </svg>
                                                ) : (
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium mb-1">New</label>
                                        <div className="relative">
                                            <input
                                                type={showNewPassword ? "text" : "password"}
                                                className="input input-sm pr-8 w-full"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                placeholder="New"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                                            >
                                                {showNewPassword ? (
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                    </svg>
                                                ) : (
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {passwordError && (
                                    <div className="text-error text-xs">{passwordError}</div>
                                )}
                                {passwordSuccess && (
                                    <div className="text-success text-xs">{passwordSuccess}</div>
                                )}

                                <div className="flex justify-end">
                                    <button
                                        onClick={handleChangePassword}
                                        className="btn btn-secondary btn-xs"
                                        disabled={updating || !currentPassword || !newPassword}
                                    >
                                        {updating ? <LoadingSpinner size="sm" /> : 'Update Password'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="border-t border-border pt-2">
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="text-error text-xs hover:underline"
                        >
                            Delete Account
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Delete Account Confirmation Modal */}
            <Modal
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                title="Delete Account"
            >
                <div className="space-y-4 max-h-120 max-w-96 overflow-y-auto overflow-x-hidden">
                    <p className="text-text-secondary">
                        Are you sure you want to delete your account? This action cannot be undone.
                        All your posts, comments, and data will be permanently removed.
                    </p>
                    <div className="flex gap-3 justify-end">
                        <button
                            onClick={() => setShowDeleteConfirm(false)}
                            className="btn btn-secondary"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDeleteAccount}
                            className="btn btn-primary bg-error hover:bg-error/90"
                            disabled={updating}
                        >
                            {updating ? <LoadingSpinner size="sm" /> : 'Yes, Delete My Account'}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Report Modal */}
            <ReportModal
                isOpen={showReportModal}
                onClose={() => setShowReportModal(false)}
                reportType="user"
                targetId={id}
                targetName={profile?.username}
            />
        </>
    );
};

export default Profile;
