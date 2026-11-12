import { useState, useEffect, useRef } from 'react';
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
    const [deletePassword, setDeletePassword] = useState('');
    const [showDeletePassword, setShowDeletePassword] = useState(false);
    const [editEmail, setEditEmail] = useState('');

    const optionsRef = useRef(null);
    const isOwnProfile = currentUser?._id === id;

    useEffect(() => {
        loadProfile();
        loadPosts();
    }, [id]);

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

    const loadProfile = async () => {
        try {
            const response = await userAPI.getProfile(id);
            setProfile(response.data);
            setEditBio(response.data.bio || '');
            setEditUsername(response.data.username || '');
            setEditEmail(response.data.email || '');
            setEditAvatar(response.data.avatar || '');

            if (currentUser && !isOwnProfile) {
                setIsFollowing(
                    currentUser.following?.some((f) =>
                        typeof f === 'string' ? f === id : f._id === id
                    )
                );

                setIsBlocked(
                    currentUser.blockedUsers?.some((b) =>
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
            setPosts(response.data.posts || []);
        } catch (error) {
            console.error('Failed to load posts:', error);
        }
    };

    const handleFollow = async () => {
        try {
            if (isFollowing) {
                await userAPI.unfollowUser(id);
                setIsFollowing(false);
                setProfile((prev) => ({
                    ...prev,
                    followersCount: Math.max(0, (prev.followersCount || 1) - 1)
                }));
            } else {
                await userAPI.followUser(id);
                setIsFollowing(true);
                setProfile((prev) => ({
                    ...prev,
                    followersCount: (prev.followersCount || 0) + 1
                }));
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
                username: editUsername,
                email: editEmail
            });
            setProfile(response.data);
            updateUser(response.data);
            setShowEditModal(false);
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

            setPasswordSuccess('Password successfully updated');
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
            if (!deletePassword) {
                alert('Please enter your password to confirm account deletion');
                return;
            }
            setUpdating(true);
            await userAPI.deleteAccount(deletePassword);
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
                setIsFollowing(false);
            }
            setShowOptionsMenu(false);
        } catch (error) {
            console.error('Failed to block/unblock user:', error);
        }
    };

    const handlePostDeleted = (postId) => {
        setPosts((prev) => prev.filter((p) => p._id !== postId));
        if (profile) {
            setProfile((prev) => ({
                ...prev,
                postsCount: Math.max(0, (prev.postsCount || 1) - 1)
            }));
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
                <LoadingSpinner size="lg" />
                <span className="text-xs text-text-muted">Loading profile...</span>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="max-w-md mx-auto px-4 py-16 text-center">
                <div className="card p-8">
                    <h2 className="text-base font-semibold text-text-primary mb-1">User Not Found</h2>
                    <p className="text-xs text-text-muted mb-4">This profile does not exist or has been removed.</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-6">
                {/* Profile Identity Card */}
                <div className="card p-6">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                        <Avatar src={profile.avatar} alt={profile.username} size="xl" />

                        <div className="flex-1 text-center sm:text-left min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                                <div>
                                    <div className="flex items-center justify-center sm:justify-start gap-2">
                                        <h1 className="text-lg font-bold tracking-tight text-text-primary truncate">
                                            {profile.username}
                                        </h1>
                                        {profile.role === 'admin' && (
                                            <span className="badge badge-primary text-[10px] font-semibold">
                                                Admin
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-xs text-text-muted">
                                        @{profile.username?.toLowerCase()}
                                    </span>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center justify-center sm:justify-end gap-2">
                                    {isOwnProfile ? (
                                        <button
                                            onClick={() => setShowEditModal(true)}
                                            className="btn btn-secondary btn-xs font-medium"
                                        >
                                            Edit Profile
                                        </button>
                                    ) : (
                                        <>
                                            <button
                                                onClick={handleFollow}
                                                className={`btn btn-xs font-medium ${
                                                    isFollowing ? 'btn-secondary' : 'btn-primary'
                                                }`}
                                                disabled={isBlocked}
                                            >
                                                {isBlocked ? 'Blocked' : isFollowing ? 'Following' : 'Follow'}
                                            </button>

                                            {profile.role !== 'admin' && (
                                                <div className="relative" ref={optionsRef}>
                                                    <button
                                                        onClick={() => setShowOptionsMenu(!showOptionsMenu)}
                                                        className="p-1.5 rounded-md text-text-muted hover:text-text-primary hover:bg-bg-tertiary transition-colors"
                                                        aria-label="Profile actions"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                                        </svg>
                                                    </button>

                                                    {showOptionsMenu && (
                                                        <div className="absolute right-0 mt-1 w-40 card p-1 shadow-elevated z-20 border border-border animate-slide-down">
                                                            <button
                                                                onClick={handleBlock}
                                                                className="w-full text-left px-2.5 py-1.5 rounded text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors flex items-center gap-2"
                                                            >
                                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                                                </svg>
                                                                <span>{isBlocked ? 'Unblock user' : 'Block user'}</span>
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    setShowReportModal(true);
                                                                    setShowOptionsMenu(false);
                                                                }}
                                                                className="w-full text-left px-2.5 py-1.5 rounded text-xs font-medium text-error hover:bg-error/10 transition-colors flex items-center gap-2"
                                                            >
                                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                                </svg>
                                                                <span>Report user</span>
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Bio */}
                            {profile.bio ? (
                                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mb-4">
                                    {profile.bio}
                                </p>
                            ) : (
                                <p className="text-xs text-text-muted italic mb-4">No bio added yet.</p>
                            )}

                            {/* Stats Counter Strip */}
                            <div className="flex items-center justify-center sm:justify-start gap-6 pt-3 border-t border-border text-xs">
                                <div>
                                    <span className="font-semibold text-text-primary tabular-nums">
                                        {formatNumber(profile.postsCount || 0)}
                                    </span>{' '}
                                    <span className="text-text-muted">Posts</span>
                                </div>
                                <div>
                                    <span className="font-semibold text-text-primary tabular-nums">
                                        {formatNumber(profile.followersCount || 0)}
                                    </span>{' '}
                                    <span className="text-text-muted">Followers</span>
                                </div>
                                <div>
                                    <span className="font-semibold text-text-primary tabular-nums">
                                        {formatNumber(profile.followingCount || 0)}
                                    </span>{' '}
                                    <span className="text-text-muted">Following</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* User's Posts Feed */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-border">
                        <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted">Posts</h2>
                        <span className="text-xs font-mono text-text-muted tabular-nums">{posts.length} published</span>
                    </div>

                    {posts.length === 0 ? (
                        <div className="card text-center py-12 px-4 border border-dashed border-border">
                            <p className="text-xs text-text-muted">
                                {isOwnProfile
                                    ? "You haven't posted anything yet. Share your first update from the feed!"
                                    : "This creator hasn't published any posts yet."}
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
                    setEditEmail(profile?.email || '');
                    setEditAvatar(profile?.avatar || '');
                    setCurrentPassword('');
                    setNewPassword('');
                    setPasswordError('');
                    setPasswordSuccess('');
                }}
                title="Edit Profile"
            >
                <div className="space-y-4 text-xs">
                    {/* Avatar selection */}
                    <div className="flex items-center gap-4 pb-4 border-b border-border">
                        <Avatar src={editAvatar} alt={profile.username} size="lg" />
                        <div>
                            <label className="btn btn-secondary btn-xs cursor-pointer">
                                <span>Upload new avatar</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                    className="hidden"
                                />
                            </label>
                            <p className="text-[11px] text-text-muted mt-1">Recommended: square image, under 5MB</p>
                        </div>
                    </div>

                    {/* Basic Info Form */}
                    <div className="space-y-3">
                        <div>
                            <label className="block text-xs font-medium text-text-secondary mb-1">Username</label>
                            <input
                                type="text"
                                className="input text-xs"
                                value={editUsername}
                                onChange={(e) => setEditUsername(e.target.value)}
                                placeholder="Username"
                                maxLength={30}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-text-secondary mb-1">Email</label>
                            <input
                                type="email"
                                className={`input text-xs ${
                                    currentUser?.role !== 'admin' ? 'opacity-60 cursor-not-allowed bg-bg-tertiary' : ''
                                }`}
                                value={editEmail}
                                onChange={(e) => setEditEmail(e.target.value)}
                                disabled={currentUser?.role !== 'admin'}
                            />
                            {currentUser?.role !== 'admin' && (
                                <p className="text-[10px] text-text-muted mt-0.5">Contact an administrator to change registered email.</p>
                            )}
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label className="block text-xs font-medium text-text-secondary">Bio</label>
                                <span className="text-[10px] text-text-muted tabular-nums">{editBio.length}/160</span>
                            </div>
                            <textarea
                                className="input textarea text-xs"
                                placeholder="Write a short bio about yourself..."
                                value={editBio}
                                onChange={(e) => setEditBio(e.target.value)}
                                maxLength={160}
                                rows={3}
                            />
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                onClick={handleUpdateProfile}
                                className="btn btn-primary btn-xs"
                                disabled={updating}
                            >
                                {updating ? <LoadingSpinner size="xs" /> : 'Save Profile Changes'}
                            </button>
                        </div>
                    </div>

                    {/* Password Section Accordion */}
                    <div className="border-t border-border pt-3">
                        <button
                            type="button"
                            onClick={() => setShowPasswordSection(!showPasswordSection)}
                            className="flex items-center justify-between w-full py-1.5 text-xs font-semibold text-text-primary hover:text-primary transition-colors"
                        >
                            <span>Security: Change Password</span>
                            <svg
                                className={`w-3.5 h-3.5 transition-transform ${showPasswordSection ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {showPasswordSection && (
                            <div className="mt-2 space-y-2.5 p-3 rounded-lg bg-bg-tertiary border border-border animate-fade-in">
                                <div>
                                    <label className="block text-[11px] font-medium text-text-secondary mb-1">Current Password</label>
                                    <div className="relative">
                                        <input
                                            type={showCurrentPassword ? 'text' : 'password'}
                                            className="input text-xs pr-8"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            placeholder="Current password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                                        >
                                            {showCurrentPassword ? 'Hide' : 'Show'}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-medium text-text-secondary mb-1">New Password</label>
                                    <div className="relative">
                                        <input
                                            type={showNewPassword ? 'text' : 'password'}
                                            className="input text-xs pr-8"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="At least 6 characters"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                                        >
                                            {showNewPassword ? 'Hide' : 'Show'}
                                        </button>
                                    </div>
                                </div>

                                {passwordError && (
                                    <div className="text-[11px] text-error font-medium">{passwordError}</div>
                                )}
                                {passwordSuccess && (
                                    <div className="text-[11px] text-emerald-400 font-medium">{passwordSuccess}</div>
                                )}

                                <div className="flex justify-end pt-1">
                                    <button
                                        onClick={handleChangePassword}
                                        className="btn btn-secondary btn-xs"
                                        disabled={updating || !currentPassword || !newPassword}
                                    >
                                        {updating ? <LoadingSpinner size="xs" /> : 'Update Password'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Danger Zone: Delete Account */}
                    <div className="border-t border-border pt-3 flex items-center justify-between">
                        <div>
                            <div className="text-xs font-semibold text-error">Danger Zone</div>
                            <div className="text-[11px] text-text-muted">Permanently delete your profile and all content</div>
                        </div>
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="btn btn-destructive btn-xs"
                            disabled={currentUser?.role === 'admin'}
                            title={currentUser?.role === 'admin' ? 'Admins cannot delete their account directly' : ''}
                        >
                            Delete Account
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Delete Account Modal */}
            <Modal
                isOpen={showDeleteConfirm}
                onClose={() => {
                    setShowDeleteConfirm(false);
                    setDeletePassword('');
                    setShowDeletePassword(false);
                }}
                title="Delete Account"
            >
                <div className="space-y-4 text-xs">
                    <p className="text-text-secondary leading-relaxed">
                        Are you sure you want to permanently delete your account? This action is immediate and cannot be undone. All your posts, followers, and comments will be erased.
                    </p>

                    <div>
                        <label className="block text-xs font-medium text-text-secondary mb-1">
                            Confirm Your Password
                        </label>
                        <div className="relative">
                            <input
                                type={showDeletePassword ? 'text' : 'password'}
                                className="input text-xs pr-8"
                                placeholder="Enter password to confirm"
                                value={deletePassword}
                                onChange={(e) => setDeletePassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowDeletePassword(!showDeletePassword)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary text-[11px]"
                            >
                                {showDeletePassword ? 'Hide' : 'Show'}
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-border">
                        <button
                            onClick={() => setShowDeleteConfirm(false)}
                            className="btn btn-secondary btn-sm"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDeleteAccount}
                            className="btn btn-destructive btn-sm"
                            disabled={updating || !deletePassword}
                        >
                            {updating ? <LoadingSpinner size="xs" /> : 'Confirm Deletion'}
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
