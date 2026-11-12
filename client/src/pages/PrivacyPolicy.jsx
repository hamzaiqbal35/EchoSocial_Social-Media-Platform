import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import Logo from '../components/Logo';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen flex flex-col bg-bg-primary text-text-primary hero-mesh">
            {/* Top Navigation */}
            <header className="sticky top-0 z-30 nav-blur border-b border-border">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
                    <Link to="/welcome" className="flex items-center gap-2 group">
                        <Logo size="sm" showText={true} />
                    </Link>

                    <div className="flex items-center gap-3">
                        <Link
                            to="/welcome"
                            className="text-xs font-medium text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1.5"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span>Back to Home</span>
                        </Link>
                        <ThemeToggle size="sm" />
                    </div>
                </div>
            </header>

            {/* Document Content */}
            <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-12">
                <div className="mb-10 text-center sm:text-left">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">Legal &amp; Privacy</span>
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-text-primary mt-2 mb-3">
                        Privacy Policy
                    </h1>
                    <p className="text-xs text-text-muted">
                        Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} &bull; Your privacy is our foundational commitment
                    </p>
                </div>

                <div className="space-y-6 text-xs sm:text-sm text-text-secondary leading-relaxed">
                    <section className="card p-6 border border-border">
                        <h2 className="text-base font-bold text-text-primary mb-2 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-primary"></span>
                            1. Information We Collect
                        </h2>
                        <p>
                            We collect only the information you explicitly provide when creating an account and participating in the platform. This includes your username, email address, salted password hash, profile avatar, bio, and content you voluntarily post. We do not use third-party tracking cookies or advertising pixels.
                        </p>
                    </section>

                    <section className="card p-6 border border-border">
                        <h2 className="text-base font-bold text-text-primary mb-2 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            2. How We Use Information
                        </h2>
                        <p>
                            Your information is used strictly to authenticate your identity, generate chronological feed updates for your followers, deliver real-time notifications, and protect community safety. We never sell, lease, or monetize your data with third-party advertisers.
                        </p>
                    </section>

                    <section className="card p-6 border border-border">
                        <h2 className="text-base font-bold text-text-primary mb-2 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                            3. Security &amp; Storage
                        </h2>
                        <p>
                            Credentials are secured using bcrypt hashing with unique salts. Sessions are managed through cryptographically signed JSON Web Tokens (JWT). All media files and communications are stored with strict access controls.
                        </p>
                    </section>

                    <section className="card p-6 border border-border">
                        <h2 className="text-base font-bold text-text-primary mb-2 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                            4. Your Rights &amp; Data Deletion
                        </h2>
                        <p className="mb-3">
                            You have the right to inspect, edit, or permanently erase your data at any time through your Profile settings. When you delete your account, your posts, media attachments, comments, and profile data are completely removed from our active database.
                        </p>
                        <div className="flex items-center gap-3 pt-2">
                            <Link to="/contact" className="btn btn-secondary btn-sm">
                                Contact Privacy Officer
                            </Link>
                            <Link to="/terms" className="text-xs text-primary hover:underline font-medium">
                                View Terms of Service &rarr;
                            </Link>
                        </div>
                    </section>
                </div>
            </main>

            {/* Clean Footer */}
            <footer className="border-t border-border py-6 text-xs text-text-muted">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <span>&copy; {new Date().getFullYear()} EchoSocial. All rights reserved.</span>
                    <div className="flex items-center gap-4">
                        <Link to="/terms" className="hover:text-text-primary transition-colors">Terms of Service</Link>
                        <Link to="/standards" className="hover:text-text-primary transition-colors">Community Standards</Link>
                        <Link to="/contact" className="hover:text-text-primary transition-colors">Contact Support</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default PrivacyPolicy;
