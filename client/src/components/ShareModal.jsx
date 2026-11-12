import { useState, useEffect } from 'react';
import { userAPI, postAPI } from '../services/api';
import Modal from './Modal';
import Avatar from './Avatar';
import LoadingSpinner from './LoadingSpinner';

const ShareModal = ({ isOpen, onClose, post }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sharing, setSharing] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setSearchQuery('');
            setSearchResults([]);
            setSelectedUsers([]);
            setSuccessMessage('');
            setCopied(false);
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
                setSearchResults(response.data || []);
            } catch (error) {
                console.error('Failed to search users:', error);
            } finally {
                setLoading(false);
            }
        };

        const debounce = setTimeout(searchUsers, 250);
        return () => clearTimeout(debounce);
    }, [searchQuery]);

    const toggleUserSelection = (user) => {
        setSelectedUsers((prev) => {
            const isSelected = prev.some((u) => u._id === user._id);
            if (isSelected) {
                return prev.filter((u) => u._id !== user._id);
            } else {
                return [...prev, user];
            }
        });
    };

    const handleShare = async () => {
        if (selectedUsers.length === 0 || sharing) return;

        setSharing(true);
        try {
            const userIds = selectedUsers.map((u) => u._id);
            await postAPI.sharePost(post._id, userIds);
            setSuccessMessage(`Post shared with ${selectedUsers.length} ${selectedUsers.length > 1 ? 'people' : 'person'}`);

            setTimeout(() => {
                onClose();
            }, 1200);
        } catch (error) {
            console.error('Failed to share post:', error);
        } finally {
            setSharing(false);
        }
    };

    const baseUrl = import.meta.env.VITE_APP_URL || window.location.origin;
    const shareUrl = `${baseUrl}/post/${post?._id || ''}`;
    const shareTitle = post?.content ? `${post.content.slice(0, 100)}... on EchoSocial` : 'Check out this post on EchoSocial';

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy link:', err);
        }
    };

    const handleSocialShare = (platform) => {
        let targetUrl = '';
        const encodedUrl = encodeURIComponent(shareUrl);
        const encodedTitle = encodeURIComponent(shareTitle);

        switch (platform) {
            case 'whatsapp':
                targetUrl = `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`;
                break;
            case 'facebook':
                targetUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
                break;
            case 'twitter':
                targetUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
                break;
            case 'linkedin':
                targetUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
                break;
            case 'telegram':
                targetUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`;
                break;
            case 'native':
                if (navigator.share) {
                    navigator.share({
                        title: 'EchoSocial Post',
                        text: post?.content || 'Check out this post on EchoSocial',
                        url: shareUrl
                    }).catch(() => {});
                    return;
                }
                break;
            default:
                break;
        }

        if (targetUrl) {
            window.open(targetUrl, '_blank', 'noopener,noreferrer,width=640,height=560');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Share Post">
            <div className="space-y-4">
                {successMessage && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{successMessage}</span>
                    </div>
                )}

                {/* Direct Link Row */}
                <div className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-bg-secondary">
                    <div className="min-w-0 pr-2">
                        <div className="text-xs font-medium text-text-primary">Direct Post Link</div>
                        <div className="text-[11px] text-text-muted truncate">
                            {shareUrl}
                        </div>
                    </div>
                    <button
                        onClick={handleCopyLink}
                        className="btn btn-secondary btn-xs flex items-center gap-1.5 shrink-0"
                    >
                        {copied ? (
                            <>
                                <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-emerald-400">Copied</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                <span>Copy Link</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Social Share External Buttons */}
                <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-2">
                        Share via Social Apps
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                        {/* WhatsApp */}
                        <button
                            type="button"
                            onClick={() => handleSocialShare('whatsapp')}
                            className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-lg border border-border bg-bg-secondary hover:bg-emerald-500/10 hover:border-emerald-500/40 text-text-secondary hover:text-emerald-400 transition-all group"
                            title="Share on WhatsApp"
                        >
                            <div className="w-8 h-8 rounded-full bg-emerald-500/15 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.07-.996-.051-.576-.192-1.32-.472-2.31-1.332-1.258-1.092-2.064-2.457-2.208-2.661-.144-.204-.373-.496-.373-.948 0-.452.235-.676.32-.768.085-.092.186-.115.247-.115.061 0 .123 0 .178.006.059.006.136-.023.213.161.085.204.577 1.408.628 1.511.051.103.085.223.017.359-.068.136-.102.222-.204.341-.102.119-.214.265-.306.357-.102.102-.208.213-.09.416.119.204.527.868 1.132 1.407.781.696 1.439.912 1.643 1.014.204.102.323.085.442-.051.119-.136.51-.594.646-.798.136-.204.272-.17.458-.102.187.068 1.189.56 1.393.662.204.102.339.153.39.238.051.085.051.493-.093.898z" />
                                </svg>
                            </div>
                            <span className="text-[10px] font-medium">WhatsApp</span>
                        </button>

                        {/* Facebook */}
                        <button
                            type="button"
                            onClick={() => handleSocialShare('facebook')}
                            className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-lg border border-border bg-bg-secondary hover:bg-blue-600/10 hover:border-blue-500/40 text-text-secondary hover:text-blue-500 transition-all group"
                            title="Share on Facebook"
                        >
                            <div className="w-8 h-8 rounded-full bg-blue-600/15 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                </svg>
                            </div>
                            <span className="text-[10px] font-medium">Facebook</span>
                        </button>

                        {/* X / Twitter */}
                        <button
                            type="button"
                            onClick={() => handleSocialShare('twitter')}
                            className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-lg border border-border bg-bg-secondary hover:bg-neutral-500/10 hover:border-neutral-500/40 text-text-secondary hover:text-text-primary transition-all group"
                            title="Share on X (Twitter)"
                        >
                            <div className="w-8 h-8 rounded-full bg-bg-tertiary flex items-center justify-center text-text-primary group-hover:scale-110 transition-transform">
                                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                </svg>
                            </div>
                            <span className="text-[10px] font-medium">X</span>
                        </button>

                        {/* Telegram */}
                        <button
                            type="button"
                            onClick={() => handleSocialShare('telegram')}
                            className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-lg border border-border bg-bg-secondary hover:bg-sky-500/10 hover:border-sky-500/40 text-text-secondary hover:text-sky-400 transition-all group"
                            title="Share on Telegram"
                        >
                            <div className="w-8 h-8 rounded-full bg-sky-500/15 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform">
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                                </svg>
                            </div>
                            <span className="text-[10px] font-medium">Telegram</span>
                        </button>

                        {/* LinkedIn */}
                        <button
                            type="button"
                            onClick={() => handleSocialShare('linkedin')}
                            className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-lg border border-border bg-bg-secondary hover:bg-blue-700/10 hover:border-blue-700/40 text-text-secondary hover:text-blue-400 transition-all group"
                            title="Share on LinkedIn"
                        >
                            <div className="w-8 h-8 rounded-full bg-blue-700/15 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                                </svg>
                            </div>
                            <span className="text-[10px] font-medium">LinkedIn</span>
                        </button>
                    </div>
                </div>

                {/* Search recipient */}
                <div className="relative pt-1 border-t border-border">
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-2">
                        Send to EchoSocial Connections
                    </label>
                    <input
                        type="text"
                        className="input text-xs"
                        placeholder="Search users to share with..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Selected Users Pills */}
                {selectedUsers.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                        {selectedUsers.map((u) => (
                            <span
                                key={u._id}
                                className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-bg-tertiary border border-border text-text-primary"
                            >
                                <Avatar src={u.avatar} alt={u.username} size="xs" />
                                <span>{u.username}</span>
                                <button
                                    onClick={() => toggleUserSelection(u)}
                                    className="text-text-muted hover:text-text-primary ml-0.5"
                                >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </span>
                        ))}
                    </div>
                )}

                {/* User Search Results */}
                <div className="max-h-52 overflow-y-auto space-y-1 pr-1">
                    {loading && (
                        <div className="text-center py-4 text-xs text-text-muted">
                            <LoadingSpinner size="sm" />
                        </div>
                    )}

                    {!loading && searchQuery.trim().length >= 2 && searchResults.length === 0 && (
                        <div className="text-center py-4 text-xs text-text-muted">
                            No users found matching "{searchQuery}"
                        </div>
                    )}

                    {!loading &&
                        searchResults.map((u) => {
                            const isSelected = selectedUsers.some((sel) => sel._id === u._id);
                            return (
                                <div
                                    key={u._id}
                                    onClick={() => toggleUserSelection(u)}
                                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                                        isSelected
                                            ? 'bg-bg-tertiary border border-primary/40'
                                            : 'hover:bg-bg-tertiary border border-transparent'
                                    }`}
                                >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <Avatar src={u.avatar} alt={u.username} size="sm" />
                                        <div className="min-w-0">
                                            <p className="text-xs font-medium text-text-primary truncate">{u.username}</p>
                                            {u.bio && (
                                                <p className="text-[11px] text-text-muted truncate">{u.bio}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                                        isSelected ? 'bg-primary border-primary text-white' : 'border-border'
                                    }`}>
                                        {isSelected && (
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                </div>

                {/* Footer Send Button */}
                <div className="flex justify-end gap-2 pt-3 border-t border-border">
                    <button onClick={onClose} className="btn btn-secondary btn-sm">
                        Cancel
                    </button>
                    <button
                        onClick={handleShare}
                        className="btn btn-primary btn-sm"
                        disabled={selectedUsers.length === 0 || sharing}
                    >
                        {sharing ? (
                            <LoadingSpinner size="xs" />
                        ) : (
                            `Send (${selectedUsers.length})`
                        )}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ShareModal;
