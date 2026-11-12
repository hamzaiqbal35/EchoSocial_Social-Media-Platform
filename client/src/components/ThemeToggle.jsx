import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = ({ className = '', size = 'md', showLabel = false }) => {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    const sizeClasses = size === 'sm' 
        ? 'w-8 h-8 text-xs' 
        : 'w-9 h-9 text-sm';

    return (
        <button
            type="button"
            onClick={toggleTheme}
            className={`inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-bg-secondary text-text-secondary hover:text-text-primary hover:bg-bg-tertiary hover:border-border-hover transition-all duration-200 active:scale-95 shadow-xs ${sizeClasses} ${className}`}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        >
            {isDark ? (
                // Sun Icon (Switch to Light)
                <svg className="w-4 h-4 text-amber-400 transition-transform duration-300 rotate-0 hover:rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                </svg>
            ) : (
                // Moon Icon (Switch to Dark)
                <svg className="w-4 h-4 text-primary transition-transform duration-300 -rotate-12 hover:rotate-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                </svg>
            )}
            {showLabel && (
                <span className="text-xs font-medium">
                    {isDark ? 'Light' : 'Dark'}
                </span>
            )}
        </button>
    );
};

export default ThemeToggle;
