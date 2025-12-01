import { useState, useEffect } from 'react';
import { userAPI, postAPI } from '../services/api';
import Modal from './Modal';
import Avatar from './Avatar';

const ShareModal = ({ isOpen, onClose, post }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sharing, setSharing] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (!isOpen) {
            // Reset state when modal closes
            setSearchQuery('');
            setSearchResults([]);
            setSelectedUsers([]);
            setSuccessMessage('');
        }
    }, [isOpen]);

    useEffect(() => {
        const searchUsers = async () => {
            if (searchQuery.trim().length < 2) {
                setSearchResults([]);
                return;
            }

            setLoading(true);
            try {
                const response = await userAPI.searchUsers(searchQuery);
                setSearchResults(response.data);
            } catch (error) {
                console.error('Failed to search users:', error);
            } finally {
                setLoading(false);
            }
        };

        const debounce = setTimeout(searchUsers, 300);
        return () => clearTimeout(debounce);
    }, [searchQuery]);

    const toggleUserSelection = (user) => {
        setSelectedUsers(prev => {
            const isSelected = prev.some(u => u._id === user._id);
            if (isSelected) {
                return prev.filter(u => u._id !== user._id);
            } else {
                return [...prev, user];
            }
        });
    };

    const handleShare = async () => {
        if (selectedUsers.length === 0) {
            return;
        }

        setSharing(true);
        try {
            const userIds = selectedUsers.map(u => u._id);
            await postAPI.sharePost(post._id, userIds);
            setSuccessMessage(`Post shared with ${selectedUsers.length} user${selectedUsers.length > 1 ? 's' : ''}!`);

            // Clear selection and close after a short delay
            setTimeout(() => {
                onClose();
            }, 1500);
        } catch (error) {
            console.error('Failed to share post:', error);
            alert('Failed to share post. Please try again.');
        } finally {
            setSharing(false);
        }
    };

    const handleCopyLink = async () => {
        const shareUrl = `${window.location.origin}/post/${post._id}`;
        try {
            await navigator.clipboard.writeText(shareUrl);
            setSuccessMessage('Link copied to clipboard!');
            setTimeout(() => setSuccessMessage(''), 2000);
        } catch (err) {
            console.error('Failed to copy link:', err);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Share Post">
            <div className="space-y-4">
                {/* Success Message */}
                {successMessage && (
                    <div className="bg-success/10 text-success px-4 py-3 rounded-lg text-sm font-medium">
                        {successMessage}
                    </div>
                )}

                {/* Search Bar */}
                <div className="relative">
                    <input
                        type="text"
                        className="input w-full"
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Selected Users */}
                {selectedUsers.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {selectedUsers.map(user => (
                            <div
                                key={user._id}
                                className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm"
                            >
                                <span>{user.username}</span>
                                <button
                                    onClick={() => toggleUserSelection(user)}
                                    className="hover:bg-primary/20 rounded-full p-0.5"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Search Results */}
                <div className="max-h-64 overflow-y-auto space-y-2">
                    {loading && (
                        <div className="text-center py-4 text-text-muted">
                            Searching...
                        </div>
                    )}

                    {!loading && searchQuery.trim().length >= 2 && searchResults.length === 0 && (
                        <div className="text-center py-4 text-text-muted">
                            No users found
                        </div>
                    )}

                    {!loading && searchResults.map(user => {
                        const isSelected = selectedUsers.some(u => u._id === user._id);
                        return (
                            <div
                                key={user._id}
                                onClick={() => toggleUserSelection(user)}
                                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${isSelected
                                    ? 'bg-primary/10 border-2 border-primary'
                                    : 'bg-bg-secondary hover:bg-bg-tertiary border-2 border-transparent'
                                    }`}
                            >
                                <Avatar src={user.avatar} alt={user.username} size="sm" />
                                <div className="flex-1">
                                    <h4 className="font-semibold">{user.username}</h4>
                                    {user.bio && (
                                        <p className="text-sm text-text-muted line-clamp-1">{user.bio}</p>
                                    )}
                                </div>
                                {isSelected && (
                                    <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-border">
                    <button
                        onClick={handleCopyLink}
                        className="btn btn-secondary flex-1"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy Link
                    </button>
                    <button
                        onClick={handleShare}
                        className="btn btn-primary flex-1"
                        disabled={selectedUsers.length === 0 || sharing}
                    >
                        {sharing ? 'Sharing...' : `Send${selectedUsers.length > 0 ? ` (${selectedUsers.length})` : ''}`}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ShareModal;
