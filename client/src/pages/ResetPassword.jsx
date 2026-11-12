import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ThemeToggle from '../components/ThemeToggle';
import Logo from '../components/Logo';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { resetToken } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        setLoading(true);

        try {
            await authAPI.resetPassword(resetToken, password);
            setMessage('Password reset successful. Redirecting to sign in...');
            setTimeout(() => {
                navigate('/login');
            }, 1800);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password. The link may have expired.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-bg-primary text-text-primary selection:bg-primary selection:text-white">
            {/* Left Column: Visual Showcase (Visible on Large Screens) */}
            <div className="hidden lg:flex lg:w-1/2 xl:w-5/12 relative bg-neutral-950 overflow-hidden flex-col justify-between p-12 text-white">
                {/* Background Visual with Gradient Vignette */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/assets/auth-cosmic.jpg"
                        alt="EchoSocial Security Credentials"
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
                        Security Update
                    </span>
                </div>

                {/* Center / Security Guidance */}
                <div className="relative z-10 space-y-6 max-w-lg">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary-light text-xs font-medium backdrop-blur-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        Account Protection Standard
                    </div>

                    <h2 className="text-3xl xl:text-4xl font-extrabold tracking-tight leading-snug text-white">
                        Create a strong, unique password for your account.
                    </h2>

                    <p className="text-sm text-neutral-300 leading-relaxed">
                        To keep your profile and posts secure, choose a password you don't use on other services. We recommend using a mix of letters, numbers, and symbols.
                    </p>

                    <div className="space-y-2 pt-2 text-xs text-neutral-300">
                        <div className="flex items-center gap-2.5">
                            <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            <span>At least 6 characters long</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Salted with one-way Bcrypt hashing</span>
                        </div>
                    </div>
                </div>

                {/* Bottom Status Ticker */}
                <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400">
                    <span>Active Session Refresh</span>
                    <span>Instant Verification</span>
                </div>
            </div>

            {/* Right Column: Password Reset Form */}
            <div className="w-full lg:w-1/2 xl:w-7/12 flex flex-col justify-between p-4 sm:p-8 lg:p-12 min-h-screen">
                {/* Header Top Bar */}
                <div className="w-full max-w-md mx-auto flex items-center justify-between pb-6">
                    <Link
                        to="/login"
                        className="inline-flex items-center gap-2 text-xs font-medium text-text-secondary hover:text-text-primary transition-colors group"
                    >
                        <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span>Back to Sign In</span>
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
                            Set new password
                        </h1>
                        <p className="text-xs sm:text-sm text-text-secondary mt-1.5">
                            Enter and confirm your new password below.
                        </p>
                    </div>

                    {/* Form Card */}
                    <div className="card p-6 sm:p-8 border border-border shadow-elevated bg-bg-card backdrop-blur-sm">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {message && (
                                <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-start gap-2.5 animate-fade-in">
                                    <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>{message}</span>
                                </div>
                            )}

                            {error && (
                                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-error text-xs flex items-center gap-2 animate-fade-in">
                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>{error}</span>
                                </div>
                            )}

                            {/* New Password Field */}
                            <div>
                                <label className="block text-xs font-semibold text-text-primary mb-1.5">
                                    New Password
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
                                        autoFocus
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
                                    Confirm New Password
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
                                        placeholder="Repeat your new password"
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

                            <button
                                type="submit"
                                className="btn btn-primary w-full py-2.5 text-xs font-semibold shadow-sm hover:shadow-md transition-all mt-2"
                                disabled={loading}
                            >
                                {loading ? <LoadingSpinner size="xs" /> : 'Update Password & Sign In'}
                            </button>
                        </form>
                    </div>

                    {/* Switch back to Login */}
                    <div className="mt-6 text-center text-xs text-text-secondary">
                        Remember your password?{' '}
                        <Link to="/login" className="text-primary font-semibold hover:underline">
                            Return to sign in
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

export default ResetPassword;
