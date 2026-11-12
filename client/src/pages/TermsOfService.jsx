import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import Logo from '../components/Logo';

const TermsOfService = () => {
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
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">Legal &amp; Governance</span>
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-text-primary mt-2 mb-3">
                        Terms of Service
                    </h1>
                    <p className="text-xs text-text-muted">
                        Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} &bull; Rules governing participation on EchoSocial
                    </p>
                </div>

                <div className="space-y-6 text-xs sm:text-sm text-text-secondary leading-relaxed">
                    <section className="card p-6 border border-border">
                        <h2 className="text-base font-bold text-text-primary mb-2 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-primary"></span>
                            1. Acceptance of Terms
                        </h2>
                        <p>
                            By creating an account, browsing content, or accessing the EchoSocial platform, you agree to comply with and be bound by these Terms of Service. If you do not agree with any provision, you may not access or use the platform.
                        </p>
                    </section>

                    <section className="card p-6 border border-border">
                        <h2 className="text-base font-bold text-text-primary mb-2 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            2. Civil Conduct &amp; Prohibited Actions
                        </h2>
                        <p>
                            EchoSocial is built for authentic human discourse. You agree not to distribute malicious software, harass other participants, upload non-consensual media, spam feeds, or employ automated scrapers to extract platform data.
                        </p>
                    </section>

                    <section className="card p-6 border border-border">
                        <h2 className="text-base font-bold text-text-primary mb-2 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                            3. Creator Ownership &amp; Intellectual Property
                        </h2>
                        <p>
                            You retain 100% ownership and copyright of the original content, images, and videos you publish to EchoSocial. You grant EchoSocial only the limited technical license needed to host, format, and display your posts to your intended audience.
                        </p>
                    </section>

                    <section className="card p-6 border border-border">
                        <h2 className="text-base font-bold text-text-primary mb-2 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                            4. Account Moderation &amp; Enforcement
                        </h2>
                        <p className="mb-3">
                            EchoSocial administrators reserve the right to review reported violations and suspend or terminate accounts that breach community standards, harass others, or compromise the safety of the network.
                        </p>
                        <div className="flex items-center gap-3 pt-2">
                            <Link to="/contact" className="btn btn-secondary btn-sm">
                                Contact Legal Team
                            </Link>
                            <Link to="/standards" className="text-xs text-primary hover:underline font-medium">
                                Read Community Standards &rarr;
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
                        <Link to="/privacy" className="hover:text-text-primary transition-colors">Privacy Policy</Link>
                        <Link to="/standards" className="hover:text-text-primary transition-colors">Community Standards</Link>
                        <Link to="/contact" className="hover:text-text-primary transition-colors">Contact Support</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default TermsOfService;
