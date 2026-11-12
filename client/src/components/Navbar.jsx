import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { userAPI, postAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import { useTheme } from '../contexts/ThemeContext';
import Avatar from './Avatar';
import ThemeToggle from './ThemeToggle';
import Logo from './Logo';

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
    const dropdownRef = useRef(null);

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSearch(false);
            }
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Debounced Search
    useEffect(() => {
        if (!searchQuery.trim()) {
            setUserResults([]);
            setPostResults([]);
            setShowSearch(false);
            return;
        }

        const delayDebounceFn = setTimeout(async () => {
            setIsSearching(true);
            try {
                const [usersRes, postsRes] = await Promise.all([
                    userAPI.searchUsers(searchQuery),
                    postAPI.searchPosts(searchQuery)
                ]);
                setUserResults(usersRes.data || []);
                setPostResults(postsRes.data || []);
                setShowSearch(true);
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setIsSearching(false);
            }
        }, 250);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    const handleLogout = () => {
        setShowDropdown(false);
        setShowMobileMenu(false);
        logout();
        navigate('/login');
    };

    const clearSearch = () => {
        setSearchQuery('');
        setShowSearch(false);
        setShowMobileSearch(false);
    };

    return (
        <>
            <header className="sticky top-0 z-40 nav-blur">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center justify-between h-14">
                        {/* Left: Brand Identity */}
                        <div className="flex items-center gap-6">
                            <Link to="/" className="flex items-center gap-2 group">
                                <Logo size="sm" showText={true} />
                            </Link>

                            {/* Search Bar (Desktop) */}
                            <div className="hidden lg:block relative" ref={searchRef}>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search users or posts..."
                                        className="w-64 bg-bg-secondary text-xs rounded-lg pl-9 pr-8 py-1.5 border border-border text-text-primary placeholder-text-muted focus:w-80 focus:border-border-focus focus:bg-bg-card transition-all duration-200 outline-none"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onFocus={() => searchQuery.trim() && setShowSearch(true)}
                                    />
                                    {searchQuery && (
                                        <button
                                            onClick={clearSearch}
                                            className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-text-muted hover:text-text-primary"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    )}
                                </div>

                                {/* Desktop Search Dropdown */}
                                {showSearch && (
                                    <div className="absolute top-full left-0 w-80 mt-1.5 card p-2 z-50 shadow-lg border border-border max-h-96 overflow-y-auto animate-slide-down">
                                        {isSearching ? (
                                            <div className="p-4 text-center text-xs text-text-muted">Searching...</div>
                                        ) : userResults.length === 0 && postResults.length === 0 ? (
                                            <div className="p-4 text-center text-xs text-text-muted">No results found</div>
                                        ) : (
                                            <div className="space-y-3">
                                                {userResults.length > 0 && (
                                                    <div>
                                                        <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                                                            People
                                                        </div>
                                                        <div className="space-y-0.5">
                                                            {userResults.map((u) => (
                                                                <Link
                                                                    key={u._id}
                                                                    to={`/profile/${u._id}`}
                                                                    onClick={clearSearch}
                                                                    className="flex items-center gap-2.5 px-2 py-1.5 rounded-md hover:bg-bg-tertiary transition-colors"
                                                                >
                                                                    <Avatar src={u.avatar} alt={u.username} size="sm" />
                                                                    <div className="min-w-0 flex-1">
                                                                        <div className="text-xs font-medium text-text-primary truncate">{u.username}</div>
                                                                        {u.bio && (
                                                                            <div className="text-[11px] text-text-muted truncate">{u.bio}</div>
                                                                        )}
                                                                    </div>
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {postResults.length > 0 && (
                                                    <div className="border-t border-border pt-2">
                                                        <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                                                            Posts
                                                        </div>
                                                        <div className="space-y-0.5">
                                                            {postResults.map((p) => (
                                                                <Link
                                                                    key={p._id}
                                                                    to={`/post/${p._id}`}
                                                                    onClick={clearSearch}
                                                                    className="block px-2 py-1.5 rounded-md hover:bg-bg-tertiary transition-colors"
                                                                >
                                                                    <div className="flex items-center gap-2 mb-1">
                                                                        <Avatar src={p.author?.avatar} alt={p.author?.username} size="xs" />
                                                                        <span className="text-xs font-medium text-text-secondary">{p.author?.username}</span>
                                                                    </div>
                                                                    <p className="text-xs text-text-primary line-clamp-1">{p.content}</p>
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Center/Right: Desktop Nav Navigation Links */}
                        <nav className="hidden md:flex items-center gap-1">
                            <NavLink
                                to="/"
                                end
                                className={({ isActive }) =>
                                    `px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
                                        isActive
                                            ? 'bg-bg-tertiary text-text-primary shadow-xs'
                                            : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary/60'
                                    }`
                                }
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                <span>Feed</span>
                            </NavLink>

                            <NavLink
                                to="/people"
                                className={({ isActive }) =>
                                    `px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
                                        isActive
                                            ? 'bg-bg-tertiary text-text-primary shadow-xs'
                                            : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary/60'
                                    }`
                                }
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                <span>Discover</span>
                            </NavLink>

                            <NavLink
                                to="/notifications"
                                className={({ isActive }) =>
                                    `relative px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
                                        isActive
                                            ? 'bg-bg-tertiary text-text-primary shadow-xs'
                                            : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary/60'
                                    }`
                                }
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                <span>Notifications</span>
                                {unreadCount > 0 && (
                                    <span className="tabular-nums px-1.5 py-0.2 rounded-full text-[10px] font-semibold bg-primary text-white">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </NavLink>

                            {user?.role === 'admin' && (
                                <NavLink
                                    to="/admin"
                                    className={({ isActive }) =>
                                        `px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
                                            isActive
                                                ? 'bg-bg-tertiary text-text-primary shadow-xs'
                                                : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary/60'
                                        }`
                                    }
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                    <span>Admin</span>
                                </NavLink>
                            )}
                        </nav>

                        {/* Right: Actions (Theme Toggle, Profile Dropdown) */}
                        <div className="flex items-center gap-2">
                            {/* Mobile search toggle */}
                            <button
                                onClick={() => setShowMobileSearch(!showMobileSearch)}
                                className="lg:hidden p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors"
                                aria-label="Search"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>

                            {/* Theme Toggle Button */}
                            <ThemeToggle size="sm" />

                            {/* Profile Dropdown */}
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-border transition-all"
                                    aria-expanded={showDropdown}
                                    aria-haspopup="true"
                                >
                                    <Avatar src={user?.avatar} alt={user?.username} size="sm" />
                                </button>

                                {showDropdown && (
                                    <div className="absolute right-0 mt-2 w-56 card p-1.5 z-50 shadow-elevated border border-border animate-slide-down">
                                        {/* User Summary Header */}
                                        <div className="px-3 py-2 border-b border-border mb-1">
                                            <p className="text-xs font-semibold text-text-primary truncate">{user?.username}</p>
                                            <p className="text-[11px] text-text-muted truncate">{user?.email}</p>
                                        </div>

                                        <Link
                                            to={`/profile/${user?._id}`}
                                            onClick={() => setShowDropdown(false)}
                                            className="flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            <span>Your Profile</span>
                                        </Link>

                                        {user?.role === 'admin' && (
                                            <Link
                                                to="/admin"
                                                onClick={() => setShowDropdown(false)}
                                                className="flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                </svg>
                                                <span>Admin Console</span>
                                            </Link>
                                        )}

                                        <Link
                                            to="/contact"
                                            onClick={() => setShowDropdown(false)}
                                            className="flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>Contact Support</span>
                                        </Link>

                                        <div className="border-t border-border my-1"></div>

                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium text-error hover:bg-error/10 transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            <span>Sign out</span>
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Mobile Hamburger Menu Button */}
                            <button
                                onClick={() => setShowMobileMenu(!showMobileMenu)}
                                className="md:hidden p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors"
                                aria-label="Toggle menu"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {showMobileMenu ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Search Overlay Bar */}
                {showMobileSearch && (
                    <div className="lg:hidden border-t border-border px-4 py-2.5 bg-bg-card animate-slide-down">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search users or posts..."
                                className="w-full bg-bg-secondary text-xs rounded-lg pl-8 pr-4 py-2 border border-border text-text-primary placeholder-text-muted focus:border-border-focus outline-none"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus
                            />
                            <svg className="w-4 h-4 text-text-muted absolute left-2.5 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>

                        {/* Mobile Search Results */}
                        {searchQuery.trim() && (
                            <div className="mt-2 card p-2 max-h-60 overflow-y-auto">
                                {isSearching ? (
                                    <div className="p-3 text-center text-xs text-text-muted">Searching...</div>
                                ) : userResults.length === 0 && postResults.length === 0 ? (
                                    <div className="p-3 text-center text-xs text-text-muted">No results found</div>
                                ) : (
                                    <div className="space-y-2">
                                        {userResults.map((u) => (
                                            <Link
                                                key={u._id}
                                                to={`/profile/${u._id}`}
                                                onClick={clearSearch}
                                                className="flex items-center gap-2.5 p-1.5 rounded-md hover:bg-bg-tertiary"
                                            >
                                                <Avatar src={u.avatar} alt={u.username} size="sm" />
                                                <span className="text-xs font-medium text-text-primary">{u.username}</span>
                                            </Link>
                                        ))}
                                        {postResults.map((p) => (
                                            <Link
                                                key={p._id}
                                                to={`/post/${p._id}`}
                                                onClick={clearSearch}
                                                className="block p-1.5 rounded-md hover:bg-bg-tertiary"
                                            >
                                                <p className="text-xs text-text-primary line-clamp-1">{p.content}</p>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </header>

            {/* Mobile Drawer Navigation */}
            {showMobileMenu && (
                <div className="fixed inset-0 z-50 md:hidden flex">
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
                        onClick={() => setShowMobileMenu(false)}
                    ></div>

                    <div className="relative w-72 max-w-[85%] bg-bg-card border-r border-border h-full flex flex-col p-4 shadow-elevated z-10 animate-slide-in">
                        {/* Drawer Header */}
                        <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
                            <Logo size="xs" showText={true} />
                            <button
                                onClick={() => setShowMobileMenu(false)}
                                className="p-1.5 rounded-md text-text-muted hover:text-text-primary"
                                aria-label="Close menu"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Navigation Links */}
                        <div className="flex-1 space-y-1">
                            <NavLink
                                to="/"
                                end
                                onClick={() => setShowMobileMenu(false)}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium ${
                                        isActive ? 'bg-bg-tertiary text-text-primary' : 'text-text-secondary hover:text-text-primary'
                                    }`
                                }
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                <span>Feed</span>
                            </NavLink>

                            <NavLink
                                to="/people"
                                onClick={() => setShowMobileMenu(false)}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium ${
                                        isActive ? 'bg-bg-tertiary text-text-primary' : 'text-text-secondary hover:text-text-primary'
                                    }`
                                }
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                <span>Discover People</span>
                            </NavLink>

                            <NavLink
                                to="/notifications"
                                onClick={() => setShowMobileMenu(false)}
                                className={({ isActive }) =>
                                    `flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium ${
                                        isActive ? 'bg-bg-tertiary text-text-primary' : 'text-text-secondary hover:text-text-primary'
                                    }`
                                }
                            >
                                <div className="flex items-center gap-3">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                    <span>Notifications</span>
                                </div>
                                {unreadCount > 0 && (
                                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-semibold bg-primary text-white">
                                        {unreadCount}
                                    </span>
                                )}
                            </NavLink>

                            {user?.role === 'admin' && (
                                <NavLink
                                    to="/admin"
                                    onClick={() => setShowMobileMenu(false)}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium ${
                                            isActive ? 'bg-bg-tertiary text-text-primary' : 'text-text-secondary hover:text-text-primary'
                                        }`
                                    }
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                    <span>Admin Console</span>
                                </NavLink>
                            )}

                            <Link
                                to={`/profile/${user?._id}`}
                                onClick={() => setShowMobileMenu(false)}
                                className="flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium text-text-secondary hover:text-text-primary"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span>My Profile</span>
                            </Link>

                            <Link
                                to="/contact"
                                onClick={() => setShowMobileMenu(false)}
                                className="flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium text-text-secondary hover:text-text-primary"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Contact Support</span>
                            </Link>
                        </div>

                        {/* Footer Profile & Sign out */}
                        <div className="pt-4 border-t border-border space-y-3">
                            <button
                                onClick={toggleTheme}
                                className="w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium text-text-secondary hover:bg-bg-tertiary"
                            >
                                <span>Appearance</span>
                                <span className="capitalize text-text-primary">{theme}</span>
                            </button>

                            <div className="flex items-center justify-between pt-2">
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <Avatar src={user?.avatar} alt={user?.username} size="sm" />
                                    <div className="min-w-0">
                                        <div className="text-xs font-medium text-text-primary truncate">{user?.username}</div>
                                        <div className="text-[10px] text-text-muted truncate">{user?.email}</div>
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="p-1.5 rounded-md text-text-muted hover:text-error transition-colors"
                                    title="Sign out"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;
