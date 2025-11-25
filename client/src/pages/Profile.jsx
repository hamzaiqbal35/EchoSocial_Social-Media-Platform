import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { userAPI, postAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { formatNumber, imageToBase64 } from '../utils/helpers';
import Avatar from '../components/Avatar';
import PostCard from '../components/PostCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';

const Profile = () => {
    const { id } = useParams();
    const { user: currentUser, updateUser } = useAuth();
    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editBio, setEditBio] = useState('');
    const [editAvatar, setEditAvatar] = useState('');
    const [updating, setUpdating] = useState(false);

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
            setEditAvatar(response.data.avatar || '');

            // Check if following
            if (currentUser && !isOwnProfile) {
                setIsFollowing(
                    currentUser.following?.some(f =>
                        typeof f === 'string' ? f === id : f._id === id
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
                avatar: editAvatar
            });
            setProfile(response.data);
            updateUser(response.data);
            setShowEditModal(false);
        } catch (error) {
            console.error('Failed to update profile:', error);
        } finally {
            setUpdating(false);
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
                                    <button
                                        onClick={handleFollow}
                                        className={`btn btn-sm ${isFollowing ? 'btn-secondary' : 'btn-primary'}`}
                                    >
                                        {isFollowing ? 'Unfollow' : 'Follow'}
                                    </button>
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
                onClose={() => setShowEditModal(false)}
                title="Edit Profile"
            >
                <div className="space-y-4">
                    <div className="flex flex-col items-center gap-4">
                        <Avatar src={editAvatar} alt={profile.username} size="xl" />
                        <label className="btn btn-secondary btn-sm cursor-pointer">
                            Change Avatar
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className="hidden"
                            />
                        </label>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Bio</label>
                        <textarea
                            className="input textarea"
                            placeholder="Tell us about yourself..."
                            value={editBio}
                            onChange={(e) => setEditBio(e.target.value)}
                            maxLength={160}
                        />
                        <div className="text-sm text-text-muted mt-1 text-right">
                            {editBio.length}/160
                        </div>
                    </div>

                    <div className="flex gap-3 justify-end pt-4">
                        <button
                            onClick={() => setShowEditModal(false)}
                            className="btn btn-secondary"
                            disabled={updating}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleUpdateProfile}
                            className="btn btn-primary"
                            disabled={updating}
                        >
                            {updating ? <LoadingSpinner size="sm" /> : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default Profile;
