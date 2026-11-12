import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ThemeToggle from '../components/ThemeToggle';
import Logo from '../components/Logo';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);

        try {
            await authAPI.forgotPassword(email.trim());
            setMessage('Password reset instructions sent. Please check your email inbox.');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send reset instructions');
        } finally {
            setLoading(false);
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
                        alt="EchoSocial Account Recovery"
                        className="w-full h-full object-cover opacity-60 scale-105 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/65 to-neutral-950/35" />
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
                        Account Recovery
                    </span>
                </div>

                {/* Center / Security Assurance */}
                <div className="relative z-10 space-y-6 max-w-lg">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary-light text-xs font-medium backdrop-blur-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        Encrypted Security Verification
                    </div>

                    <h2 className="text-3xl xl:text-4xl font-extrabold tracking-tight leading-snug text-white">
                        Regain access to your account quickly and safely.
                    </h2>

                    <p className="text-sm text-neutral-300 leading-relaxed">
                        We send time-limited recovery links to ensure that only the authenticated owner can reset account credentials. If you experience any issues, our support team is standing by to help.
                    </p>

                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md space-y-2">
                        <div className="text-xs font-semibold text-white flex items-center gap-2">
                            <svg className="w-4 h-4 text-primary-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            Need live support?
                        </div>
                        <p className="text-xs text-neutral-400">
                            Visit our <Link to="/contact" className="text-primary-light underline">Help Desk</Link> or email our support desk directly at <span className="text-neutral-200">hamzaiqbalrajpoot35@gmail.com</span>.
                        </p>
                    </div>
                </div>

                {/* Bottom Status Ticker */}
                <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400">
                    <span>Expiring 1-Hour Links</span>
                    <span>Protected Identity</span>
                </div>
            </div>

            {/* Right Column: Recovery Form */}
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
                            Reset your password
                        </h1>
                        <p className="text-xs sm:text-sm text-text-secondary mt-1.5">
                            Enter the email associated with your EchoSocial account to receive a secure recovery link.
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

                            <div>
                                <label className="block text-xs font-semibold text-text-primary mb-1.5">
                                    Registered Email Address
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

                            <button
                                type="submit"
                                className="btn btn-primary w-full py-2.5 text-xs font-semibold shadow-sm hover:shadow-md transition-all mt-2"
                                disabled={loading}
                            >
                                {loading ? <LoadingSpinner size="xs" /> : 'Send Recovery Instructions'}
                            </button>
                        </form>
                    </div>

                    {/* Switch back to Login */}
                    <div className="mt-6 text-center text-xs text-text-secondary">
                        Remembered your password?{' '}
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

export default ForgotPassword;
