import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { isValidEmail } from '../utils/helpers';
import LoadingSpinner from '../components/LoadingSpinner';
import ThemeToggle from '../components/ThemeToggle';
import Logo from '../components/Logo';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!username.trim() || !email.trim() || !password || !confirmPassword) {
            setError('Please fill in all required fields');
            return;
        }

        if (username.trim().length < 3) {
            setError('Username must be at least 3 characters');
            return;
        }

        if (!isValidEmail(email.trim())) {
            setError('Please enter a valid email address');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        const result = await register(username.trim(), email.trim(), password);
        setLoading(false);

        if (result.success) {
            navigate('/');
        } else {
            setError(result.message || 'Failed to create account. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-bg-primary text-text-primary selection:bg-primary selection:text-white">
            {/* Left Column: Visual Showcase (Visible on Large Screens) */}
            <div className="hidden lg:flex lg:w-1/2 xl:w-5/12 relative bg-neutral-950 overflow-hidden flex-col justify-between p-12 text-white">
                {/* Background Cosmic Visual with Gradient Vignette */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/assets/auth-cosmic.jpg"
                        alt="EchoSocial Cosmic Network Showcase"
                        className="w-full h-full object-cover opacity-60 scale-105 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/65 to-neutral-950/35" />
                    <div className="absolute inset-0 bg-indigo-900/15 mix-blend-color" />
                </div>

                {/* Top Brand Mark */}
                <div className="relative z-10 flex items-center justify-between">
                    <Link to="/welcome" className="flex items-center gap-2.5 group">
                        <Logo size="md" />
                        <span className="font-bold text-xl tracking-tight text-white group-hover:text-primary-light transition-colors">
                            EchoSocial
                        </span>
                    </Link>
                    <span className="text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white/90">
                        Join Community
                    </span>
                </div>

                {/* Center / Value Highlights Showcase */}
                <div className="relative z-10 space-y-6 max-w-lg">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-medium backdrop-blur-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                        Pure Signal Social Canvas
                    </div>

                    <h2 className="text-3xl xl:text-4xl font-extrabold tracking-tight leading-snug text-white">
                        Connect with the minds you actually respect.
                    </h2>

                    {/* Feature Checkpoints */}
                    <div className="space-y-3.5 pt-2 text-sm text-neutral-300">
                        <div className="flex items-start gap-3">
                            <div className="w-5 h-5 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary-light shrink-0 mt-0.5">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span>Uncompressed high-definition images and rich multimedia galleries.</span>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="w-5 h-5 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary-light shrink-0 mt-0.5">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span>100% reverse-chronological timeline — no opaque algorithmic feed curation.</span>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="w-5 h-5 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary-light shrink-0 mt-0.5">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span>Clean and calm user interface with zero third-party tracking scripts.</span>
                        </div>
                    </div>
                </div>

                {/* Bottom Status Ticker */}
                <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400">
                    <span>Free Forever</span>
                    <span>No Subscription Required</span>
                </div>
            </div>

            {/* Right Column: Registration Form */}
            <div className="w-full lg:w-1/2 xl:w-7/12 flex flex-col justify-between p-4 sm:p-8 lg:p-12 min-h-screen">
                {/* Header Top Bar */}
                <div className="w-full max-w-md mx-auto flex items-center justify-between pb-6">
                    <Link
                        to="/welcome"
                        className="inline-flex items-center gap-2 text-xs font-medium text-text-secondary hover:text-text-primary transition-colors group"
                    >
                        <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span>Back to EchoSocial</span>
                    </Link>

                    <ThemeToggle size="sm" />
                </div>

                {/* Main Auth Form Container */}
                <div className="w-full max-w-md mx-auto my-auto py-4">
                    {/* Mobile Logo Presentation */}
                    <div className="lg:hidden text-center mb-6">
                        <Link to="/welcome" className="inline-block mb-2">
                            <Logo size="lg" />
                        </Link>
                        <div className="text-lg font-bold text-text-primary">EchoSocial</div>
                    </div>

                    <div className="mb-6">
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text-primary">
                            Create your account
                        </h1>
                        <p className="text-xs sm:text-sm text-text-secondary mt-1.5">
                            Join thousands of authentic creators and thinkers on EchoSocial.
                        </p>
                    </div>

                    {/* Register Card */}
                    <div className="card p-6 sm:p-8 border border-border shadow-elevated bg-bg-card backdrop-blur-sm">
                        <form onSubmit={handleSubmit} className="space-y-3.5">
                            {error && (
                                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-error text-xs flex items-center gap-2 animate-fade-in">
                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>{error}</span>
                                </div>
                            )}

                            {/* Username Field */}
                            <div>
                                <label className="block text-xs font-semibold text-text-primary mb-1.5">
                                    Username
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        className="input text-xs pl-9"
                                        placeholder="alex_rivera"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        disabled={loading}
                                        required
                                        autoFocus
                                    />
                                </div>
                                <span className="text-[10px] text-text-muted mt-1 block">At least 3 characters. Unique handle.</span>
                            </div>

                            {/* Email Field */}
                            <div>
                                <label className="block text-xs font-semibold text-text-primary mb-1.5">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                        </svg>
                                    </div>
                                    <input
                                        type="email"
                                        className="input text-xs pl-9"
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={loading}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div>
                                <label className="block text-xs font-semibold text-text-primary mb-1.5">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        className="input text-xs pl-9 pr-9"
                                        placeholder="Minimum 6 characters"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={loading}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted hover:text-text-primary transition-colors"
                                        onClick={() => setShowPassword(!showPassword)}
                                        tabIndex={-1}
                                        aria-label="Toggle password visibility"
                                    >
                                        {showPassword ? (
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            </svg>
                                        ) : (
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password Field */}
                            <div>
                                <label className="block text-xs font-semibold text-text-primary mb-1.5">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                    </div>
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        className="input text-xs pl-9 pr-9"
                                        placeholder="Repeat your password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        disabled={loading}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted hover:text-text-primary transition-colors"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        tabIndex={-1}
                                        aria-label="Toggle confirm password visibility"
                                    >
                                        {showConfirmPassword ? (
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            </svg>
                                        ) : (
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Terms Agreement Note */}
                            <p className="text-[11px] text-text-muted leading-relaxed pt-1">
                                By signing up, you agree to EchoSocial's{' '}
                                <Link to="/terms" className="text-primary hover:underline font-medium">Terms of Service</Link>{' '}
                                and{' '}
                                <Link to="/privacy" className="text-primary hover:underline font-medium">Privacy Policy</Link>.
                            </p>

                            <button
                                type="submit"
                                className="btn btn-primary w-full py-2.5 text-xs font-semibold shadow-sm hover:shadow-md transition-all mt-2"
                                disabled={loading}
                            >
                                {loading ? <LoadingSpinner size="xs" /> : 'Create Free Account'}
                            </button>
                        </form>
                    </div>

                    {/* Switch to Login */}
                    <div className="mt-5 text-center text-xs text-text-secondary">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary font-semibold hover:underline">
                            Sign in instead
                        </Link>
                    </div>
                </div>

                {/* Bottom Footer Links */}
                <div className="w-full max-w-md mx-auto pt-6 border-t border-border flex items-center justify-between text-[11px] text-text-muted">
                    <div>&copy; {new Date().getFullYear()} EchoSocial</div>
                    <div className="flex items-center gap-3">
                        <Link to="/privacy" className="hover:text-text-primary transition-colors">Privacy</Link>
                        <Link to="/terms" className="hover:text-text-primary transition-colors">Terms</Link>
                        <Link to="/contact" className="hover:text-text-primary transition-colors">Contact</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
