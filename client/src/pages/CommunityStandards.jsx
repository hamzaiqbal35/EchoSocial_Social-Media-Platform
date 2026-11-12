import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import Logo from '../components/Logo';

const CommunityStandards = () => {
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
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">Trust &amp; Safety</span>
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-text-primary mt-2 mb-3">
                        Community Standards
                    </h1>
                    <p className="text-xs text-text-muted">
                        Last updated: October 2026 &bull; Guidelines for an authentic, respectful discourse
                    </p>
                </div>

                <div className="space-y-8 text-xs sm:text-sm text-text-secondary leading-relaxed">
                    <section className="card p-6 border border-border">
                        <h2 className="text-base font-bold text-text-primary mb-2 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-primary"></span>
                            1. Signal Over Noise
                        </h2>
                        <p>
                            EchoSocial exists to empower genuine human connection, creative expression, and authentic discussion. We do not reward clickbait, misleading headlines, or engagement-farming behavior. Publish content with care and substance.
                        </p>
                    </section>

                    <section className="card p-6 border border-border">
                        <h2 className="text-base font-bold text-text-primary mb-2 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            2. Zero Tolerance for Harassment &amp; Hate Speech
                        </h2>
                        <p>
                            Every participant is entitled to a safe, welcoming environment. We do not tolerate targeted harassment, hate speech, bullying, defamation, or threats of violence against any individual or group. Violations result in immediate content removal and permanent account suspension.
                        </p>
                    </section>

                    <section className="card p-6 border border-border">
                        <h2 className="text-base font-bold text-text-primary mb-2 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                            3. Intellectual Property &amp; Creative Attribution
                        </h2>
                        <p>
                            Respect creators and copyright owners. Only publish media (images, audio, videos) that you own or have explicit rights to share. Always give clear credit when sharing work produced by others.
                        </p>
                    </section>

                    <section className="card p-6 border border-border">
                        <h2 className="text-base font-bold text-text-primary mb-2 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                            4. User Safety &amp; Content Reporting
                        </h2>
                        <p className="mb-3">
                            You have full agency over your experience. Use our built-in blocking tools to isolate unwanted interactions immediately. If you encounter content that breaches these standards, click the report button on the post to escalate it to our moderation team.
                        </p>
                        <div className="flex items-center gap-3 pt-2">
                            <Link to="/contact" className="btn btn-secondary btn-sm">
                                Contact Safety Team
                            </Link>
                            <Link to="/privacy" className="text-xs text-primary hover:underline font-medium">
                                View Privacy Policy &rarr;
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
                        <Link to="/privacy" className="hover:text-text-primary transition-colors">Privacy Policy</Link>
                        <Link to="/contact" className="hover:text-text-primary transition-colors">Contact Support</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default CommunityStandards;
