import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { userAPI, postAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import Avatar from './Avatar';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { unreadCount } = useNotifications();
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [userResults, setUserResults] = useState([]);
    const [postResults, setPostResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [showMobileSearch, setShowMobileSearch] = useState(false);
    const searchRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSearch(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchQuery.length > 0) {
                setIsSearching(true);
                try {
                    const [usersRes, postsRes] = await Promise.all([
                        userAPI.searchUsers(searchQuery),
                        postAPI.searchPosts(searchQuery)
                    ]);
                    setUserResults(usersRes.data);
                    setPostResults(postsRes.data);
                    setShowSearch(true);
                } catch (error) {
                    console.error(error);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setUserResults([]);
                setPostResults([]);
                setShowSearch(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="sticky top-0 z-40 glass border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold gradient-text hidden sm:block">EchoSocial</span>
                    </Link>

                    {/* Search Bar */}
                    <div className="hidden md:block flex-1 max-w-md mx-8 relative" ref={searchRef}>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search users..."
                                className="w-full bg-white border border-transparent focus:border-primary/50 rounded-full py-2.5 pl-11 pr-4 text-black placeholder-gray-500 focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-300 ease-in-out focus:w-full focus:shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                                value={searchQuery}
                                onChange={handleSearch}
                                onFocus={() => searchQuery.length > 0 && setShowSearch(true)}
                            />
                            <svg className="w-5 h-5 text-black absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>

                        {/* Search Results Dropdown */}
                        {showSearch && (userResults.length > 0 || postResults.length > 0 || isSearching) && (
                            <div className="absolute top-full left-0 right-0 mt-2 glass rounded-xl shadow-xl border border-border overflow-hidden z-50 max-h-[80vh] overflow-y-auto">
                                {isSearching ? (
                                    <div className="p-4 text-center text-text-muted">Searching...</div>
                                ) : (
                                    <>
                                        {userResults.length > 0 && (
                                            <div className="p-2">
                                                <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider px-2 mb-1">Users</h3>
                                                {userResults.map(user => (
                                                    <Link
                                                        key={user._id}
                                                        to={`/profile/${user._id}`}
                                                        className="flex items-center gap-3 px-2 py-2 hover:bg-bg-tertiary rounded-lg transition-colors"
                                                        onClick={() => {
                                                            setShowSearch(false);
                                                            setSearchQuery('');
                                                        }}
                                                    >
                                                        <Avatar src={user.avatar} alt={user.username} size="sm" />
                                                        <div>
                                                            <p className="font-medium text-sm">{user.username}</p>
                                                            {user.bio && <p className="text-xs text-text-secondary truncate max-w-[200px]">{user.bio}</p>}
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        )}

                                        {postResults.length > 0 && (
                                            <div className="p-2 border-t border-border">
                                                <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider px-2 mb-1 mt-1">Posts</h3>
                                                {postResults.map(post => (
                                                    <div
                                                        key={post._id}
                                                        className="px-2 py-2 hover:bg-bg-tertiary rounded-lg transition-colors cursor-pointer"
                                                        onClick={() => {
                                                            // Navigate to post or open modal (not implemented yet, so just close search)
                                                            setShowSearch(false);
                                                            setSearchQuery('');
                                                        }}
                                                    >
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <Avatar src={post.author?.avatar} alt={post.author?.username} size="xs" />
                                                            <span className="text-xs font-medium">{post.author?.username}</span>
                                                        </div>
                                                        <p className="text-sm text-text-primary line-clamp-2">{post.content}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {userResults.length === 0 && postResults.length === 0 && !isSearching && searchQuery && (
                                            <div className="p-4 text-center text-text-muted">No results found</div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Navigation Links */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        {/* Mobile Search Button */}
                        <button
                            className="md:hidden btn btn-ghost btn-sm"
                            onClick={() => setShowMobileSearch(!showMobileSearch)}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>

                        <Link to="/" className="btn btn-ghost btn-sm">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            <span className="hidden sm:inline">Home</span>
                        </Link>

                        <Link to="/people" className="btn btn-ghost btn-sm">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            <span className="hidden sm:inline">People</span>
                        </Link>

                        <Link to="/notifications" className="btn btn-ghost btn-sm relative">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            <span className="hidden sm:inline">Notifications</span>
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-error text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            )}
                        </Link>

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                            >
                                <Avatar src={user?.avatar} alt={user?.username} size="sm" />
                                <span className="hidden md:block text-sm font-medium">{user?.username}</span>
                                <svg className="w-4 h-4 hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {showDropdown && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setShowDropdown(false)}
                                    ></div>
                                    <div className="absolute right-0 mt-2 w-48 glass rounded-lg shadow-xl py-2 z-20 animate-fade-in">
                                        <Link
                                            to={`/profile/${user?._id}`}
                                            className="block px-4 py-2 text-sm hover:bg-bg-tertiary transition-colors"
                                            onClick={() => setShowDropdown(false)}
                                        >
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                My Profile
                                            </div>
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-sm hover:bg-bg-tertiary transition-colors text-error"
                                        >
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                </svg>
                                                Logout
                                            </div>
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Search Overlay */}
            {showMobileSearch && (
                <div className="absolute top-16 left-0 right-0 p-4 glass border-b border-border md:hidden animate-fade-in">
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="w-full bg-bg-secondary border-none rounded-lg py-2 px-4 focus:ring-2 focus:ring-primary focus:outline-none"
                        value={searchQuery}
                        onChange={handleSearch}
                        autoFocus
                    />
                    {isSearching ? (
                        <div className="mt-2 p-4 text-center text-text-muted">Searching...</div>
                    ) : (
                        (userResults.length > 0 || postResults.length > 0) && (
                            <div className="mt-2 bg-bg-primary rounded-lg shadow-lg overflow-hidden border border-border max-h-[60vh] overflow-y-auto">
                                {userResults.length > 0 && (
                                    <div className="p-2">
                                        <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider px-2 mb-1">Users</h3>
                                        {userResults.map(user => (
                                            <Link
                                                key={user._id}
                                                to={`/profile/${user._id}`}
                                                className="flex items-center gap-3 px-2 py-2 hover:bg-bg-secondary rounded-lg transition-colors"
                                                onClick={() => {
                                                    setShowMobileSearch(false);
                                                    setSearchQuery('');
                                                }}
                                            >
                                                <Avatar src={user.avatar} alt={user.username} size="sm" />
                                                <span className="font-medium">{user.username}</span>
                                            </Link>
                                        ))}
                                    </div>
                                )}

                                {postResults.length > 0 && (
                                    <div className="p-2 border-t border-border">
                                        <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider px-2 mb-1 mt-1">Posts</h3>
                                        {postResults.map(post => (
                                            <div
                                                key={post._id}
                                                className="px-2 py-2 hover:bg-bg-secondary rounded-lg transition-colors"
                                                onClick={() => {
                                                    setShowMobileSearch(false);
                                                    setSearchQuery('');
                                                }}
                                            >
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Avatar src={post.author?.avatar} alt={post.author?.username} size="xs" />
                                                    <span className="text-xs font-medium">{post.author?.username}</span>
                                                </div>
                                                <p className="text-sm text-text-primary line-clamp-2">{post.content}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
