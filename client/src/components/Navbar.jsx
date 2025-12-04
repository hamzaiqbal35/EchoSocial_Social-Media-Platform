import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { userAPI, postAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import { useTheme } from '../contexts/ThemeContext';
import Avatar from './Avatar';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { unreadCount } = useNotifications();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [userResults, setUserResults] = useState([]);
    const [postResults, setPostResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [showMobileSearch, setShowMobileSearch] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
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
        <>
            <nav
                className="sticky top-0 z-40 border-b transition-all duration-300"
                style={{
                    backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
                    borderColor: theme === 'dark' ? '#475569' : '#e2e8f0'
                }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2">
                            <img
                                src="/Logo.png"
                                alt="EchoSocial Logo"
                                className="h-20 w-auto"
                            />
                        </Link>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setShowMobileMenu(!showMobileMenu)}
                            className="md:hidden btn btn-ghost btn-sm"
                            aria-label="Toggle Menu"
                        >
                            {showMobileMenu ? (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>



                        {/* Desktop Navigation Links */}
                        <div className="hidden md:flex items-center gap-2 sm:gap-4">
                            {/* 1. Home */}
                            <NavLink
                                to="/"
                                end
                                className={({ isActive }) =>
                                    `btn btn-sm transition-all duration-200 ${isActive
                                        ? 'text-primary !border-b-2 !border-primary rounded-b-none bg-gradient-to-r from-primary to-primary/50'
                                        : 'btn-ghost hover:bg-primary/5'
                                    }`
                                }
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                <span className="hidden sm:inline">Home</span>
                            </NavLink>

                            {/* 2. People */}
                            <NavLink
                                to="/people"
                                className={({ isActive }) =>
                                    `btn btn-sm transition-all duration-200 ${isActive
                                        ? 'text-primary !border-b-2 !border-primary rounded-b-none bg-gradient-to-r from-primary to-primary/50'
                                        : 'btn-ghost hover:bg-primary/5'
                                    }`
                                }
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                <span className="hidden sm:inline">People</span>
                            </NavLink>

                            {/* 3. Notifications */}
                            <NavLink
                                to="/notifications"
                                className={({ isActive }) =>
                                    `btn btn-sm relative transition-all duration-200 ${isActive
                                        ? 'text-primary !border-b-2 !border-primary rounded-b-none bg-gradient-to-r from-primary to-primary/50'
                                        : 'btn-ghost hover:bg-primary/5'
                                    }`
                                }
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                <span className="hidden sm:inline">Notifications</span>
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </NavLink>

                            {/* 4. Admin (if admin) */}
                            {user?.role === 'admin' && (
                                <NavLink
                                    to="/admin"
                                    className={({ isActive }) =>
                                        `btn btn-sm transition-all duration-200 ${isActive
                                            ? 'text-primary !border-b-2 !border-primary rounded-b-none bg-gradient-to-r from-primary to-primary/50'
                                            : 'btn-ghost hover:bg-primary/5'
                                        }`
                                    }
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                    <span className="hidden sm:inline">Admin</span>
                                </NavLink>
                            )}

                            {/* 5. Search Bar (Desktop) */}
                            <div className="hidden md:block relative" ref={searchRef}>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search users..."
                                        className="w-64 bg-white border border-transparent focus:border-primary/50 rounded-full py-2.5 pl-11 pr-4 text-black placeholder-gray-500 focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-300 ease-in-out focus:w-80 focus:shadow-[0_0_15px_rgba(99,102,241,0.3)]"
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
                                    <div className="absolute top-full right-0 w-96 mt-2 glass rounded-xl shadow-xl border border-border overflow-hidden z-50 max-h-[80vh] overflow-y-auto">
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

                            {/* 6. Mobile Search Button */}
                            <button
                                className="md:hidden btn btn-ghost btn-sm"
                                onClick={() => setShowMobileSearch(!showMobileSearch)}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>

                            {/* 7. Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className="btn btn-ghost btn-sm"
                                aria-label="Toggle Theme"
                            >
                                {theme === 'dark' ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                    </svg>
                                )}
                            </button>

                            {/* 8. Profile Dropdown */}
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
                    <div className="absolute top-16 left-0 right-0 p-4 bg-bg-primary/95 backdrop-blur-xl border-b border-border md:hidden animate-fade-in">
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

            {/* Mobile Menu Overlay */}
            {
                showMobileMenu && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                            onClick={() => setShowMobileMenu(false)}
                        ></div>

                        {/* Mobile Menu Panel */}
                        <div
                            className="fixed top-0 left-0 h-full w-64 border-r z-50 md:hidden animate-slide-in shadow-2xl"
                            style={{
                                backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
                                borderColor: theme === 'dark' ? '#475569' : '#e2e8f0'
                            }}
                        >
                            <div className="flex flex-col h-full">
                                {/* Menu Header */}
                                <div
                                    className="flex items-center justify-between p-4 border-b"
                                    style={{
                                        borderColor: theme === 'dark' ? '#475569' : '#e2e8f0'
                                    }}
                                >
                                    <span
                                        className="text-lg font-bold"
                                        style={{
                                            color: theme === 'dark' ? '#ffffff' : '#0f172a'
                                        }}
                                    >Menu</span>
                                    <button
                                        onClick={() => setShowMobileMenu(false)}
                                        className="p-2 rounded-lg transition-colors"
                                        style={{
                                            color: theme === 'dark' ? '#ffffff' : '#0f172a',
                                            backgroundColor: 'transparent'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme === 'dark' ? '#334155' : '#f1f5f9'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Menu Items */}
                                <div className="flex-1 overflow-y-auto p-4">
                                    <div className="space-y-2">
                                        {/* Home */}
                                        <Link
                                            to="/"
                                            className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
                                            style={{
                                                color: theme === 'dark' ? '#ffffff' : '#0f172a'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme === 'dark' ? '#334155' : '#f1f5f9'}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                            onClick={() => setShowMobileMenu(false)}
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                            </svg>
                                            <span className="font-medium">Home</span>
                                        </Link>

                                        {/* People */}
                                        <Link
                                            to="/people"
                                            className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
                                            style={{
                                                color: theme === 'dark' ? '#ffffff' : '#0f172a'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme === 'dark' ? '#334155' : '#f1f5f9'}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                            onClick={() => setShowMobileMenu(false)}
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                            </svg>
                                            <span className="font-medium">People</span>
                                        </Link>

                                        {/* Notifications */}
                                        <Link
                                            to="/notifications"
                                            className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors relative"
                                            style={{
                                                color: theme === 'dark' ? '#ffffff' : '#0f172a'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme === 'dark' ? '#334155' : '#f1f5f9'}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                            onClick={() => setShowMobileMenu(false)}
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                            </svg>
                                            <span className="font-medium">Notifications</span>
                                            {unreadCount > 0 && (
                                                <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                                    {unreadCount > 9 ? '9+' : unreadCount}
                                                </span>
                                            )}
                                        </Link>

                                        {/* Admin */}
                                        {user?.role === 'admin' && (
                                            <Link
                                                to="/admin"
                                                className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
                                                style={{
                                                    color: theme === 'dark' ? '#ffffff' : '#0f172a'
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme === 'dark' ? '#334155' : '#f1f5f9'}
                                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                                onClick={() => setShowMobileMenu(false)}
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                </svg>
                                                <span className="font-medium">Admin</span>
                                            </Link>
                                        )}

                                        {/* Divider */}
                                        <div
                                            className="border-t my-2"
                                            style={{
                                                borderColor: theme === 'dark' ? '#475569' : '#e2e8f0'
                                            }}
                                        ></div>

                                        {/* Theme Toggle */}
                                        <button
                                            onClick={() => {
                                                toggleTheme();
                                                setShowMobileMenu(false);
                                            }}
                                            className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full text-left"
                                            style={{
                                                color: theme === 'dark' ? '#ffffff' : '#0f172a'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme === 'dark' ? '#334155' : '#f1f5f9'}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                        >
                                            {theme === 'dark' ? (
                                                <>
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                                    </svg>
                                                    <span className="font-medium">Light Mode</span>
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                                    </svg>
                                                    <span className="font-medium">Dark Mode</span>
                                                </>
                                            )}
                                        </button>

                                        {/* Profile */}
                                        <Link
                                            to={`/profile/${user?._id}`}
                                            className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
                                            style={{
                                                color: theme === 'dark' ? '#ffffff' : '#0f172a'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme === 'dark' ? '#334155' : '#f1f5f9'}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                            onClick={() => setShowMobileMenu(false)}
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            <span className="font-medium">My Profile</span>
                                        </Link>

                                        {/* Logout */}
                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                setShowMobileMenu(false);
                                            }}
                                            className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full text-left"
                                            style={{
                                                color: theme === 'dark' ? '#f87171' : '#dc2626'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme === 'dark' ? 'rgba(127, 29, 29, 0.3)' : '#fee2e2'}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            <span className="font-medium">Logout</span>
                                        </button>
                                    </div>
                                </div>

                                {/* User Info Footer */}
                                <div
                                    className="p-4 border-t"
                                    style={{
                                        borderColor: theme === 'dark' ? '#475569' : '#e2e8f0'
                                    }}
                                >
                                    <div className="flex items-center gap-3">
                                        <Avatar src={user?.avatar} alt={user?.username} size="md" />
                                        <div className="flex-1 min-w-0">
                                            <p
                                                className="font-semibold truncate"
                                                style={{
                                                    color: theme === 'dark' ? '#ffffff' : '#0f172a'
                                                }}
                                            >{user?.username}</p>
                                            <p
                                                className="text-sm truncate"
                                                style={{
                                                    color: theme === 'dark' ? '#94a3b8' : '#64748b'
                                                }}
                                            >{user?.email}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )
            }
        </>
    );
};

export default Navbar;
