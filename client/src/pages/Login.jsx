import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ThemeToggle from '../components/ThemeToggle';
import Logo from '../components/Logo';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email.trim() || !password) {
            setError('Please enter both email and password');
            return;
        }

        setLoading(true);
        const result = await login(email.trim(), password);
        setLoading(false);

        if (result.success) {
            navigate('/');
        } else {
            setError(result.message || 'Invalid email or password');
        }
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-bg-primary text-text-primary selection:bg-primary selection:text-white">
            {/* Left Column: Visual Showcase (Visible on Large Screens) */}
            <div className="hidden lg:flex lg:w-1/2 xl:w-5/12 relative bg-neutral-950 overflow-hidden flex-col justify-between p-12 text-white">
                {/* Background Image with Dark Vignette Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/assets/auth-arch.jpg"
                        alt="EchoSocial Architectural Showcase"
                        className="w-full h-full object-cover opacity-65 scale-105 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-neutral-950/30" />
                    <div className="absolute inset-0 bg-primary/10 mix-blend-color" />
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
                        Signal-First Network
                    </span>
                </div>

                {/* Center / Bottom Editorial Testimonial Showcase */}
                <div className="relative z-10 space-y-6 max-w-lg">
                    {/* Value Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary-light text-xs font-medium backdrop-blur-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        Zero Algorithmic Manipulation
                    </div>

                    <h2 className="text-3xl xl:text-4xl font-extrabold tracking-tight leading-snug text-white">
                        A calm canvas for creators who value substance over noise.
                    </h2>

                    <blockquote className="border-l-2 border-primary/60 pl-4 py-1 text-sm text-neutral-300 italic leading-relaxed">
                        "EchoSocial provides the clarity and authentic reach that modern social media abandoned years ago. The chronological feed and uncompressed media make all the difference."
                    </blockquote>

                    {/* Author Attributed Card */}
                    <div className="flex items-center gap-3 pt-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-sm text-white shadow-md">
                            SJ
                        </div>
                        <div>
                            <div className="font-semibold text-sm text-white flex items-center gap-1.5">
                                Sarah Jenkins
                                <svg className="w-3.5 h-3.5 text-primary-light" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="text-xs text-neutral-400">Creative Director & Photographer</div>
                        </div>
                    </div>
                </div>

                {/* Bottom Status Ticker */}
                <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400">
                    <span>100% Reverse-Chronological</span>
                    <span>High-Definition Media</span>
                </div>
            </div>

            {/* Right Column: Authentication Form */}
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
                <div className="w-full max-w-md mx-auto my-auto py-6">
                    {/* Mobile Logo Presentation */}
                    <div className="lg:hidden text-center mb-6">
                        <Link to="/welcome" className="inline-block mb-2">
                            <Logo size="lg" />
                        </Link>
                        <div className="text-lg font-bold text-text-primary">EchoSocial</div>
                    </div>

                    <div className="mb-6">
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text-primary">
                            Welcome back
                        </h1>
                        <p className="text-xs sm:text-sm text-text-secondary mt-1.5">
                            Enter your credentials to access your chronological feed.
                        </p>
                    </div>

                    {/* Login Card */}
                    <div className="card p-6 sm:p-8 border border-border shadow-elevated bg-bg-card backdrop-blur-sm">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-error text-xs flex items-center gap-2 animate-fade-in">
                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>{error}</span>
                                </div>
                            )}

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
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="block text-xs font-semibold text-text-primary">
                                        Password
                                    </label>
                                    <Link
                                        to="/forgot-password"
                                        className="text-xs text-primary hover:underline font-medium"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        className="input text-xs pl-9 pr-9"
                                        placeholder="Enter your password"
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

                            <button
                                type="submit"
                                className="btn btn-primary w-full py-2.5 text-xs font-semibold shadow-sm hover:shadow-md transition-all mt-2"
                                disabled={loading}
                            >
                                {loading ? <LoadingSpinner size="xs" /> : 'Sign In to EchoSocial'}
                            </button>
                        </form>
                    </div>

                    {/* Switch to Register */}
                    <div className="mt-6 text-center text-xs text-text-secondary">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-primary font-semibold hover:underline">
                            Create free account
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

export default Login;
