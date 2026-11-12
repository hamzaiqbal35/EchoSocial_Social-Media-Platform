import { useState } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import Logo from '../components/Logo';

const Landing = () => {
    const [activeTab, setActiveTab] = useState('media');
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(1482);
    const [openFaq, setOpenFaq] = useState(null);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    const toggleLike = () => {
        if (liked) {
            setLiked(false);
            setLikeCount((prev) => prev - 1);
        } else {
            setLiked(true);
            setLikeCount((prev) => prev + 1);
        }
    };

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const faqItems = [
        {
            q: 'How does EchoSocial differ from traditional ad-supported platforms?',
            a: 'EchoSocial is built on a pure signal-first philosophy. We do not use engagement-maximizing algorithms that push outrage or clickbait to your feed. Content appears strictly in reverse-chronological order from creators and friends you actively choose to follow, with zero sponsored ad insertions.'
        },
        {
            q: 'What media formats and resolutions does the platform support?',
            a: 'You can publish up to 10 high-resolution images (JPEG, PNG, WebP) or video files (MP4, WebM) per post. Our media pipeline preserves high-fidelity details, providing adaptive multi-image gallery grids and a distraction-free full-screen lightbox playback engine.'
        },
        {
            q: 'How does EchoSocial safeguard user privacy and security?',
            a: 'Every connection is cryptographically authenticated using stateless JSON Web Tokens (JWT) and Bcrypt salted hashing. We employ strict bidirectional user blocking, rapid community report triage, and zero third-party behavioral trackers or cookies.'
        },
        {
            q: 'Can I use both dark mode and light mode across all devices?',
            a: 'Yes. EchoSocial includes a first-class adaptive theme engine with persistent client-side caching. Both the dark obsidian/slate and light pearl-slate themes are engineered to exceed WCAG 2.1 AA accessibility contrast standards.'
        },
        {
            q: 'Is EchoSocial free to join?',
            a: 'Yes, creating an account and participating in the EchoSocial community is completely free. No subscription or credit card is required.'
        }
    ];

    return (
        <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col selection:bg-primary selection:text-white">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-40 nav-blur border-b border-border transition-colors">
                <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    {/* Brand Logo */}
                    <div className="flex items-center gap-6 lg:gap-8 min-w-0">
                        <Link to="/welcome" className="flex items-center gap-2 group shrink-0">
                            <Logo size="sm" showText={true} />
                        </Link>

                        {/* Desktop Navigation Links */}
                        <nav className="hidden md:flex items-center gap-1 text-xs font-medium text-text-secondary">
                            <a href="#features" className="px-3 py-1.5 rounded-md hover:text-text-primary hover:bg-bg-tertiary transition-colors">
                                Features
                            </a>
                            <a href="#showcase" className="px-3 py-1.5 rounded-md hover:text-text-primary hover:bg-bg-tertiary transition-colors">
                                Live Showcase
                            </a>
                            <a href="#community" className="px-3 py-1.5 rounded-md hover:text-text-primary hover:bg-bg-tertiary transition-colors">
                                Community
                            </a>
                            <a href="#faq" className="px-3 py-1.5 rounded-md hover:text-text-primary hover:bg-bg-tertiary transition-colors">
                                FAQ
                            </a>
                            <Link to="/contact" className="px-3 py-1.5 rounded-md hover:text-text-primary hover:bg-bg-tertiary transition-colors">
                                Contact
                            </Link>
                        </nav>
                    </div>

                    {/* Right Action Controls: Theme Toggle, Auth Buttons, Mobile Menu */}
                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                        <ThemeToggle size="sm" />

                        <div className="h-4 w-px bg-border hidden sm:block"></div>

                        <Link
                            to="/login"
                            className="hidden sm:inline-flex px-3 py-1.5 text-xs font-medium text-text-secondary hover:text-text-primary transition-colors"
                        >
                            Sign In
                        </Link>

                        <Link
                            to="/register"
                            className="btn btn-primary btn-xs sm:btn-sm shadow-sm px-2.5 sm:px-3.5"
                        >
                            <span>Get Started</span>
                            <svg className="w-3.5 h-3.5 hidden xs:inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </Link>

                        {/* Mobile Hamburger Toggle Button */}
                        <button
                            type="button"
                            onClick={() => setMobileNavOpen(!mobileNavOpen)}
                            className="md:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors focus:outline-none"
                            aria-label="Toggle navigation menu"
                            aria-expanded={mobileNavOpen}
                        >
                            {mobileNavOpen ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Dropdown Drawer */}
                {mobileNavOpen && (
                    <div className="md:hidden border-b border-border bg-bg-card/95 backdrop-blur-md px-4 pt-3 pb-5 space-y-2 animate-fade-in shadow-elevated">
                        <nav className="flex flex-col space-y-1 text-sm font-medium">
                            <a
                                href="#features"
                                onClick={() => setMobileNavOpen(false)}
                                className="px-3 py-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors"
                            >
                                Features & Capabilities
                            </a>
                            <a
                                href="#showcase"
                                onClick={() => setMobileNavOpen(false)}
                                className="px-3 py-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors"
                            >
                                Live Feed Showcase
                            </a>
                            <a
                                href="#community"
                                onClick={() => setMobileNavOpen(false)}
                                className="px-3 py-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors"
                            >
                                Community Values
                            </a>
                            <a
                                href="#faq"
                                onClick={() => setMobileNavOpen(false)}
                                className="px-3 py-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors"
                            >
                                Frequently Asked Questions
                            </a>
                            <Link
                                to="/contact"
                                onClick={() => setMobileNavOpen(false)}
                                className="px-3 py-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors"
                            >
                                Contact Support
                            </Link>
                        </nav>

                        <div className="pt-2 border-t border-border flex items-center gap-2">
                            <Link
                                to="/login"
                                onClick={() => setMobileNavOpen(false)}
                                className="btn btn-secondary btn-sm flex-1 justify-center text-xs"
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/register"
                                onClick={() => setMobileNavOpen(false)}
                                className="btn btn-primary btn-sm flex-1 justify-center text-xs"
                            >
                                Create Account
                            </Link>
                        </div>
                    </div>
                )}
            </header>

            {/* Hero Section with Ambient Glow Mesh */}
            <section className="relative overflow-hidden hero-mesh pt-16 pb-20 sm:pt-24 sm:pb-28 border-b border-border/60">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    {/* Status Pill Badge */}
                    <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-primary/20 bg-bg-secondary text-xs text-text-secondary mb-8 shadow-sm backdrop-blur-sm animate-fade-in">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="font-semibold text-text-primary">Signal-First Social Platform</span>
                        <span className="text-border">/</span>
                        <span className="text-text-muted hidden sm:inline">Zero algorithmic distortion &bull; High-definition media</span>
                        <span className="text-text-muted sm:hidden">Pure chronological</span>
                    </div>

                    {/* Hero Headline */}
                    <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-text-primary max-w-4xl mx-auto mb-6 leading-[1.08] animate-fade-in">
                        The high-signal canvas for{' '}
                        <span className="gradient-heading">authentic social connection</span>.
                    </h1>

                    {/* Subtitle */}
                    <p className="text-base sm:text-xl text-text-secondary max-w-3xl mx-auto mb-10 leading-relaxed font-normal animate-fade-in">
                        Share moments in uncompressed high-definition, follow the minds you actually respect, and communicate in a calm, chronologically honest platform engineered without behavioral manipulation.
                    </p>

                    {/* CTA Action Row */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto mb-14 animate-fade-in">
                        <Link
                            to="/register"
                            className="btn btn-primary btn-lg w-full sm:w-auto px-7 shadow-md group"
                        >
                            <span>Create Your Free Account</span>
                            <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </Link>
                        <a
                            href="#showcase"
                            className="btn btn-secondary btn-lg w-full sm:w-auto px-6"
                        >
                            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <span>Explore Platform Demo</span>
                        </a>
                    </div>

                    {/* Verified Creator Social Proof Stack */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-text-secondary pt-2">
                        <div className="flex items-center -space-x-2">
                            <img
                                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                                alt="Elena"
                                className="w-8 h-8 rounded-full border-2 border-bg-primary object-cover"
                            />
                            <img
                                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                                alt="Marcus"
                                className="w-8 h-8 rounded-full border-2 border-bg-primary object-cover"
                            />
                            <img
                                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
                                alt="Sarah"
                                className="w-8 h-8 rounded-full border-2 border-bg-primary object-cover"
                            />
                            <img
                                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
                                alt="Devon"
                                className="w-8 h-8 rounded-full border-2 border-bg-primary object-cover"
                            />
                            <img
                                src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80"
                                alt="Maya"
                                className="w-8 h-8 rounded-full border-2 border-bg-primary object-cover"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-text-primary">Joined by 12,000+ creators, architects, and engineers</span>
                            <span className="text-text-muted">&bull;</span>
                            <span className="text-emerald-500 font-medium flex items-center gap-1">
                                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                100% Chronological
                            </span>
                        </div>
                    </div>
                </div>

                {/* Hero Interactive Application Mockup Window */}
                <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-16 relative">
                    <div className="rounded-2xl border border-border bg-bg-card shadow-2xl overflow-hidden transition-all duration-300">
                        {/* Mock macOS Window Header */}
                        <div className="px-4 py-3 border-b border-border bg-bg-secondary/70 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
                                <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
                                <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-bg-tertiary border border-border text-[11px] font-mono text-text-muted">
                                <svg className="w-3 h-3 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                <span>echosocial.app/feed/editorial</span>
                            </div>
                            <div className="text-[11px] font-medium text-emerald-400 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                <span className="hidden sm:inline">Feed Live</span>
                            </div>
                        </div>

                        {/* Mock Post Content */}
                        <div className="p-5 sm:p-7">
                            {/* Author Info */}
                            <div className="flex items-center justify-between pb-4 mb-4 border-b border-border/70">
                                <div className="flex items-center gap-3">
                                    <img
                                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
                                        alt="Elena Vance"
                                        className="w-11 h-11 rounded-full object-cover border border-border ring-2 ring-primary/20"
                                    />
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-sm text-text-primary">Elena Vance</span>
                                            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20">
                                                Verified Creator
                                            </span>
                                        </div>
                                        <p className="text-xs text-text-muted">@elenavance &bull; Staff Architect &bull; 14m ago</p>
                                    </div>
                                </div>

                                <span className="text-xs font-medium text-text-muted px-2.5 py-1 rounded bg-bg-tertiary border border-border">
                                    Architecture &amp; Spaces
                                </span>
                            </div>

                            {/* Post Text */}
                            <p className="text-sm sm:text-base text-text-primary leading-relaxed mb-4">
                                Completed our Tokyo timber pavilion survey at dusk. Captured raw acoustics, natural cedar grain, and twilight reflection without any downsampling. Real human connection thrives when the details are preserved.
                            </p>

                            {/* Realistic High-Resolution Image */}
                            <div className="relative rounded-xl overflow-hidden border border-border mb-4 bg-bg-tertiary group">
                                <img
                                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=80"
                                    alt="Tokyo timber pavilion architecture"
                                    className="w-full h-64 sm:h-80 object-cover transition-transform duration-500 group-hover:scale-[1.01]"
                                />
                                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md text-white text-[11px] font-mono flex items-center gap-1.5 border border-white/10">
                                    <svg className="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span>RAW 4K &bull; 60fps</span>
                                </div>
                            </div>

                            {/* Engagement Bar with Clickable Like Counter */}
                            <div className="flex items-center justify-between pt-3 border-t border-border text-xs text-text-secondary">
                                <div className="flex items-center gap-5">
                                    <button
                                        type="button"
                                        onClick={toggleLike}
                                        className={`flex items-center gap-1.5 transition-colors ${
                                            liked ? 'text-red-500 font-semibold' : 'text-text-secondary hover:text-text-primary'
                                        }`}
                                    >
                                        <svg
                                            className={`w-4 h-4 transition-transform ${liked ? 'fill-current scale-110' : 'fill-none'}`}
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                            />
                                        </svg>
                                        <span className="tabular-nums">{likeCount.toLocaleString()}</span>
                                    </button>

                                    <div className="flex items-center gap-1.5 hover:text-text-primary cursor-pointer transition-colors">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                        <span className="tabular-nums">94</span>
                                    </div>

                                    <div className="flex items-center gap-1.5 hover:text-text-primary cursor-pointer transition-colors">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                        </svg>
                                        <span className="tabular-nums">128</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
                                    <span className="text-[11px] text-text-muted">Interactive live preview</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Interactive Feature Deep Dive Tabs */}
            <section id="showcase" className="py-20 sm:py-28 bg-bg-secondary/40 border-b border-border">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-14">
                        <span className="text-xs font-bold uppercase tracking-wider text-primary">Interactive Platform Tour</span>
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary mt-2 mb-4">
                            Engineered for human clarity, not algorithmic tricks.
                        </h2>
                        <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                            Explore the core architectural components that make EchoSocial feel like a breath of fresh air.
                        </p>

                        {/* Interactive Segmented Switcher */}
                        <div className="flex flex-wrap items-center justify-center gap-1.5 p-1 rounded-xl bg-bg-tertiary border border-border mt-8 max-w-xl mx-auto">
                            <button
                                type="button"
                                onClick={() => setActiveTab('media')}
                                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                                    activeTab === 'media'
                                        ? 'bg-bg-primary text-text-primary shadow-sm border border-border'
                                        : 'text-text-secondary hover:text-text-primary'
                                }`}
                            >
                                Rich Multimedia
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('feed')}
                                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                                    activeTab === 'feed'
                                        ? 'bg-bg-primary text-text-primary shadow-sm border border-border'
                                        : 'text-text-secondary hover:text-text-primary'
                                }`}
                            >
                                Chronological Feed
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('privacy')}
                                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                                    activeTab === 'privacy'
                                        ? 'bg-bg-primary text-text-primary shadow-sm border border-border'
                                        : 'text-text-secondary hover:text-text-primary'
                                }`}
                            >
                                Privacy &amp; Trust
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('theme')}
                                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                                    activeTab === 'theme'
                                        ? 'bg-bg-primary text-text-primary shadow-sm border border-border'
                                        : 'text-text-secondary hover:text-text-primary'
                                }`}
                            >
                                Adaptive Engine
                            </button>
                        </div>
                    </div>

                    {/* Tab 1: Multimedia */}
                    {activeTab === 'media' && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-fade-in">
                            <div className="lg:col-span-5 space-y-4">
                                <span className="badge badge-primary">Uncompressed High Resolution</span>
                                <h3 className="text-2xl font-bold tracking-tight text-text-primary">
                                    Multi-photo galleries and fluid 4K video playback.
                                </h3>
                                <p className="text-sm text-text-secondary leading-relaxed">
                                    Traditional networks aggressively compress imagery and video, reducing your hard work to pixelated artifacts. EchoSocial respects the medium with multi-file uploads, aspect-ratio preserved mosaic layouts, and a dedicated lightbox viewer with keyboard navigation.
                                </p>
                                <ul className="space-y-2.5 text-xs text-text-secondary pt-2">
                                    <li className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Up to 10 assets per post with zero lossy transcoding</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Full-screen carousel modal with native video player</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Automatic progressive image loading and instant blur hashes</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="lg:col-span-7 grid grid-cols-2 gap-3.5">
                                <div className="rounded-xl overflow-hidden border border-border shadow-md">
                                    <img
                                        src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80"
                                        alt="Aerial coastal coastline"
                                        className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="p-3 bg-bg-card text-[11px] font-medium text-text-secondary flex justify-between">
                                        <span>Big Sur Coastline</span>
                                        <span className="font-mono text-primary">4K JPEG</span>
                                    </div>
                                </div>
                                <div className="rounded-xl overflow-hidden border border-border shadow-md">
                                    <img
                                        src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80"
                                        alt="Design team workshop"
                                        className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="p-3 bg-bg-card text-[11px] font-medium text-text-secondary flex justify-between">
                                        <span>Design Lab Workshop</span>
                                        <span className="font-mono text-emerald-500">MP4 Video</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tab 2: Chronological Feed */}
                    {activeTab === 'feed' && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-fade-in">
                            <div className="lg:col-span-5 space-y-4">
                                <span className="badge badge-success">Zero Algorithmic Bias</span>
                                <h3 className="text-2xl font-bold tracking-tight text-text-primary">
                                    Your feed, strictly in the order it was published.
                                </h3>
                                <p className="text-sm text-text-secondary leading-relaxed">
                                    No opaque machine learning models deciding what emotion to trigger in you next. When you follow an author on EchoSocial, their posts appear directly on your timeline when they write them. When you are done reading, you reach the end.
                                </p>
                                <ul className="space-y-2.5 text-xs text-text-secondary pt-2">
                                    <li className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Strict reverse-chronological timestamp sorting</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Zero algorithmic reshuffling or sponsored placement</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Clear 'Caught up' status indicator when you have seen all new posts</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="lg:col-span-7 card p-5 border border-border shadow-lg">
                                <div className="space-y-3">
                                    <div className="p-3.5 rounded-lg bg-bg-tertiary/60 border border-border flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80"
                                                alt="Marcus"
                                                className="w-8 h-8 rounded-full object-cover"
                                            />
                                            <div>
                                                <p className="text-xs font-semibold text-text-primary">Marcus Vance</p>
                                                <p className="text-[11px] text-text-muted">Published 2m ago &bull; Chronological Slot #1</p>
                                            </div>
                                        </div>
                                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono">Real-time</span>
                                    </div>
                                    <div className="p-3.5 rounded-lg bg-bg-tertiary/60 border border-border flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80"
                                                alt="Sarah"
                                                className="w-8 h-8 rounded-full object-cover"
                                            />
                                            <div>
                                                <p className="text-xs font-semibold text-text-primary">Sarah Lin</p>
                                                <p className="text-[11px] text-text-muted">Published 11m ago &bull; Chronological Slot #2</p>
                                            </div>
                                        </div>
                                        <span className="text-[10px] px-2 py-0.5 rounded bg-bg-secondary text-text-muted font-mono">Verified</span>
                                    </div>
                                    <div className="p-3.5 rounded-lg bg-bg-tertiary/60 border border-border flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80"
                                                alt="Devon"
                                                className="w-8 h-8 rounded-full object-cover"
                                            />
                                            <div>
                                                <p className="text-xs font-semibold text-text-primary">Devon Carter</p>
                                                <p className="text-[11px] text-text-muted">Published 34m ago &bull; Chronological Slot #3</p>
                                            </div>
                                        </div>
                                        <span className="text-[10px] px-2 py-0.5 rounded bg-bg-secondary text-text-muted font-mono">Verified</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tab 3: Privacy & Trust */}
                    {activeTab === 'privacy' && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-fade-in">
                            <div className="lg:col-span-5 space-y-4">
                                <span className="badge badge-warning">Zero Telemetry Trackers</span>
                                <h3 className="text-2xl font-bold tracking-tight text-text-primary">
                                    Granular privacy controls and robust community safety.
                                </h3>
                                <p className="text-sm text-text-secondary leading-relaxed">
                                    We believe you have an absolute right to privacy. EchoSocial contains no cross-site surveillance tags, no fingerprinting scripts, and zero advertising pixels. If you ever need to isolate yourself from another user, 1-click bidirectional blocking takes effect instantly.
                                </p>
                                <ul className="space-y-2.5 text-xs text-text-secondary pt-2">
                                    <li className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Bidirectional blocking across feeds, comments, and direct views</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Community-driven content reporting with administrative triage</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Bcrypt salted password encryption and stateless JWT sessions</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="lg:col-span-7 card p-6 border border-border shadow-lg">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-xl bg-bg-tertiary border border-border">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                        </div>
                                        <p className="text-xs font-semibold text-text-primary">100% Data Sovereignty</p>
                                        <p className="text-[11px] text-text-muted mt-1">Export your data or permanently delete your account at any moment.</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-bg-tertiary border border-border">
                                        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                            </svg>
                                        </div>
                                        <p className="text-xs font-semibold text-text-primary">Granular Safety Tools</p>
                                        <p className="text-[11px] text-text-muted mt-1">Isolate accounts and file contextual reports directly to the admin queue.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tab 4: Adaptive Engine */}
                    {activeTab === 'theme' && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-fade-in">
                            <div className="lg:col-span-5 space-y-4">
                                <span className="badge badge-primary">Dual-Theme Architecture</span>
                                <h3 className="text-2xl font-bold tracking-tight text-text-primary">
                                    Deep obsidian dark mode &amp; crisp pearl light mode.
                                </h3>
                                <p className="text-sm text-text-secondary leading-relaxed">
                                    No washed out text or blinding white paper screens. Our themes are hand-crafted using calibrated slate and zinc tokens with subtle ambient light gradients that match your system settings automatically and remember your choice.
                                </p>
                                <div className="pt-2">
                                    <ThemeToggle size="md" showLabel={true} />
                                </div>
                            </div>
                            <div className="lg:col-span-7 grid grid-cols-2 gap-4">
                                <div className="p-5 rounded-xl bg-[#090d16] text-[#f8fafc] border border-white/10 shadow-lg">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-xs font-semibold">Dark Obsidian</span>
                                        <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 font-mono">#090D16</span>
                                    </div>
                                    <p className="text-xs text-slate-400">Low-glare contrast for late evening exploration and OLED screens.</p>
                                </div>
                                <div className="p-5 rounded-xl bg-[#f8fafc] text-[#0f172a] border border-slate-200 shadow-lg">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-xs font-semibold">Light Pearl Slate</span>
                                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 font-mono">#F8FAFC</span>
                                    </div>
                                    <p className="text-xs text-slate-600">High-clarity daytime reading with clean, crisp hairline borders.</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Bento Grid: Core System Capabilities */}
            <section id="features" className="py-20 sm:py-28 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">System Capabilities</span>
                    <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary mt-2 mb-4">
                        Crafted with production-level discipline.
                    </h2>
                    <p className="text-sm sm:text-base text-text-secondary">
                        Every feature in EchoSocial is built to remove friction and put human relationships back at the center.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Card 1: Multimedia (2-col span) */}
                    <div className="md:col-span-2 glow-card rounded-2xl p-7 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Multimedia Engine</span>
                            </div>
                            <h3 className="text-xl font-bold text-text-primary mb-2">High-Fidelity Photo &amp; Video Canvas</h3>
                            <p className="text-sm text-text-secondary leading-relaxed max-w-xl">
                                Upload up to 10 photos or video assets in a single post. The client dynamically builds 1-column, 2-column, 3-column, or mosaic masonry grids that look pristine on any screen size.
                            </p>
                        </div>
                        <div className="pt-6 mt-6 border-t border-border flex items-center justify-between text-xs text-text-muted">
                            <span>Adaptive aspect ratio preservation</span>
                            <span className="font-mono text-primary">Sub-20ms layout calculation</span>
                        </div>
                    </div>

                    {/* Card 2: Chronological */}
                    <div className="glow-card rounded-2xl p-7 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Timeline</span>
                            </div>
                            <h3 className="text-xl font-bold text-text-primary mb-2">100% Chronological</h3>
                            <p className="text-sm text-text-secondary leading-relaxed">
                                See updates from connections strictly in publication order. No AI curation or clickbait monetization.
                            </p>
                        </div>
                        <div className="pt-6 mt-6 border-t border-border text-xs text-text-muted">
                            Reverse-chronological feed guarantee
                        </div>
                    </div>

                    {/* Card 3: Optimistic Interaction */}
                    <div className="glow-card rounded-2xl p-7 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 text-accent flex items-center justify-center">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Performance</span>
                            </div>
                            <h3 className="text-xl font-bold text-text-primary mb-2">Instant Optimistic UI</h3>
                            <p className="text-sm text-text-secondary leading-relaxed">
                                Likes, follows, and bookmarks respond with zero perceived latency. Mutations sync with the backend asynchronously.
                            </p>
                        </div>
                        <div className="pt-6 mt-6 border-t border-border text-xs text-text-muted">
                            Automatic rollback on network failure
                        </div>
                    </div>

                    {/* Card 4: Granular Privacy */}
                    <div className="glow-card rounded-2xl p-7 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-warning flex items-center justify-center">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Safety</span>
                            </div>
                            <h3 className="text-xl font-bold text-text-primary mb-2">Bidirectional Blocking</h3>
                            <p className="text-sm text-text-secondary leading-relaxed">
                                Complete mutual isolation. Blocked accounts can neither view your profile, see your posts, nor find you in search.
                            </p>
                        </div>
                        <div className="pt-6 mt-6 border-t border-border text-xs text-text-muted">
                            Complete database-level query isolation
                        </div>
                    </div>

                    {/* Card 5: Administration (Large 1-col or 2-col) */}
                    <div className="glow-card rounded-2xl p-7 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-primary flex items-center justify-center">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Governance</span>
                            </div>
                            <h3 className="text-xl font-bold text-text-primary mb-2">Proactive Admin Console</h3>
                            <p className="text-sm text-text-secondary leading-relaxed">
                                Dedicated moderation console with real-time audit logs, report triage, account suspensions, and platform analytics.
                            </p>
                        </div>
                        <div className="pt-6 mt-6 border-t border-border text-xs text-text-muted">
                            Role-based access control (RBAC)
                        </div>
                    </div>
                </div>
            </section>

            {/* Performance Telemetry Matrix */}
            <section id="architecture" className="py-16 bg-bg-secondary/60 border-y border-border">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        <div className="p-4">
                            <p className="text-3xl sm:text-4xl font-extrabold text-text-primary font-mono tabular-nums">&lt; 45ms</p>
                            <p className="text-xs text-text-secondary mt-1 font-medium">Median API Latency</p>
                        </div>
                        <div className="p-4">
                            <p className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-mono tabular-nums">100%</p>
                            <p className="text-xs text-text-secondary mt-1 font-medium">Chronological Order</p>
                        </div>
                        <div className="p-4">
                            <p className="text-3xl sm:text-4xl font-extrabold text-primary font-mono tabular-nums">0</p>
                            <p className="text-xs text-text-secondary mt-1 font-medium">Behavioral Trackers</p>
                        </div>
                        <div className="p-4">
                            <p className="text-3xl sm:text-4xl font-extrabold text-text-primary font-mono tabular-nums">99.99%</p>
                            <p className="text-xs text-text-secondary mt-1 font-medium">Service Availability</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Realistic Creator Testimonials */}
            <section id="community" className="py-20 sm:py-28 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">Voices of the Community</span>
                    <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary mt-2 mb-4">
                        Loved by thoughtful creators and engineers.
                    </h2>
                    <p className="text-sm sm:text-base text-text-secondary">
                        Here is what designers, developers, and photographers say about switching to EchoSocial.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Testimonial 1 */}
                    <div className="card p-6 border border-border flex flex-col justify-between">
                        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mb-6">
                            "EchoSocial feels like the best days of the web returned with modern speed. The photos look identical to my raw camera captures, and there is zero manipulative algorithm attempting to push anger into my day."
                        </p>
                        <div className="flex items-center gap-3 pt-4 border-t border-border">
                            <img
                                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                                alt="Marcus Vance"
                                className="w-10 h-10 rounded-full object-cover border border-border"
                            />
                            <div>
                                <p className="text-xs font-semibold text-text-primary">Marcus Vance</p>
                                <p className="text-[11px] text-text-muted">Principal Designer at Craftworks</p>
                            </div>
                        </div>
                    </div>

                    {/* Testimonial 2 */}
                    <div className="card p-6 border border-border flex flex-col justify-between">
                        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mb-6">
                            "As a researcher, having a chronological timeline means I actually see what my peers publish instead of what an ad-bidding engine deems profitable. The dark mode theme is also the most comfortable I have used."
                        </p>
                        <div className="flex items-center gap-3 pt-4 border-t border-border">
                            <img
                                src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80"
                                alt="Dr. Maya Chen"
                                className="w-10 h-10 rounded-full object-cover border border-border"
                            />
                            <div>
                                <p className="text-xs font-semibold text-text-primary">Dr. Maya Chen</p>
                                <p className="text-[11px] text-text-muted">Systems &amp; AI Researcher</p>
                            </div>
                        </div>
                    </div>

                    {/* Testimonial 3 */}
                    <div className="card p-6 border border-border flex flex-col justify-between">
                        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mb-6">
                            "The lightbox viewer and native multi-image support made EchoSocial my primary portfolio and community home. It is genuinely calm and focused on craft."
                        </p>
                        <div className="flex items-center gap-3 pt-4 border-t border-border">
                            <img
                                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80"
                                alt="Alex Rivera"
                                className="w-10 h-10 rounded-full object-cover border border-border"
                            />
                            <div>
                                <p className="text-xs font-semibold text-text-primary">Alex Rivera</p>
                                <p className="text-[11px] text-text-muted">Editorial Photographer</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Interactive FAQ Accordion */}
            <section id="faq" className="py-20 bg-bg-secondary/30 border-t border-border">
                <div className="max-w-4xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-14">
                        <span className="text-xs font-bold uppercase tracking-wider text-primary">Got Questions?</span>
                        <h2 className="text-3xl font-bold tracking-tight text-text-primary mt-2 mb-3">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-xs sm:text-sm text-text-secondary">
                            Everything you need to know about the platform, technology, and privacy standards.
                        </p>
                    </div>

                    <div className="space-y-3">
                        {faqItems.map((item, index) => {
                            const isOpen = openFaq === index;
                            return (
                                <div
                                    key={index}
                                    className="card border border-border transition-colors cursor-pointer"
                                    onClick={() => toggleFaq(index)}
                                >
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xs sm:text-sm font-semibold text-text-primary">
                                            {item.q}
                                        </h3>
                                        <div className="p-1 rounded bg-bg-tertiary text-text-muted ml-3">
                                            <svg
                                                className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                    {isOpen && (
                                        <p className="mt-3 text-xs sm:text-sm text-text-secondary leading-relaxed pt-3 border-t border-border animate-fade-in">
                                            {item.a}
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* High-Impact Bottom Call to Action Banner */}
            <section className="py-16 sm:py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="relative rounded-3xl overflow-hidden border border-primary/30 p-8 sm:p-14 text-center hero-mesh bg-gradient-to-br from-bg-secondary via-bg-tertiary to-bg-card shadow-2xl">
                    <div className="max-w-2xl mx-auto relative z-10">
                        <span className="badge badge-primary mb-4">Start Connecting Today</span>
                        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-text-primary mb-5 leading-tight">
                            Ready for a calmer, higher-signal social experience?
                        </h2>
                        <p className="text-sm sm:text-base text-text-secondary mb-8 leading-relaxed">
                            Join thousands of creators, engineers, and storytellers who have stepped away from ad-driven feeds. Free forever, no credit card required.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                            <Link
                                to="/register"
                                className="btn btn-primary btn-lg w-full sm:w-auto px-8 shadow-md"
                            >
                                <span>Create Free Account</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </Link>
                            <Link
                                to="/login"
                                className="btn btn-secondary btn-lg w-full sm:w-auto px-7"
                            >
                                <span>Sign In to Existing Account</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Clean Modern Footer */}
            <footer className="border-t border-border bg-bg-secondary/40 py-12 text-xs text-text-muted mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                        {/* Brand Column */}
                        <div className="col-span-2 md:col-span-1">
                            <div className="mb-3">
                                <Logo size="sm" showText={true} />
                            </div>
                            <p className="text-xs text-text-secondary max-w-xs leading-relaxed">
                                A signal-first social platform designed for authentic connection, high-definition media, and zero ad surveillance.
                            </p>
                        </div>

                        {/* Col 2: Platform */}
                        <div>
                            <p className="font-semibold text-text-primary mb-3">Platform</p>
                            <ul className="space-y-2">
                                <li><Link to="/welcome" className="hover:text-text-primary transition-colors">Overview</Link></li>
                                <li><a href="#features" className="hover:text-text-primary transition-colors">Features</a></li>
                                <li><a href="#showcase" className="hover:text-text-primary transition-colors">Live Showcase</a></li>
                                <li><a href="#faq" className="hover:text-text-primary transition-colors">FAQ</a></li>
                            </ul>
                        </div>

                        {/* Col 3: Trust & Safety */}
                        <div>
                            <p className="font-semibold text-text-primary mb-3">Trust &amp; Safety</p>
                            <ul className="space-y-2">
                                <li><Link to="/privacy" className="hover:text-text-primary transition-colors">Privacy Policy</Link></li>
                                <li><Link to="/terms" className="hover:text-text-primary transition-colors">Terms of Service</Link></li>
                                <li><Link to="/standards" className="hover:text-text-primary transition-colors">Community Standards</Link></li>
                                <li><Link to="/contact" className="hover:text-text-primary transition-colors">Contact Support</Link></li>
                            </ul>
                        </div>

                        {/* Col 4: Community & Account */}
                        <div>
                            <p className="font-semibold text-text-primary mb-3">Get Started</p>
                            <ul className="space-y-2">
                                <li><Link to="/register" className="hover:text-text-primary transition-colors">Create Account</Link></li>
                                <li><Link to="/login" className="hover:text-text-primary transition-colors">Sign In</Link></li>
                                <li><Link to="/forgot-password" className="hover:text-text-primary transition-colors">Forgot Password</Link></li>
                                <li><Link to="/contact" className="hover:text-text-primary transition-colors">Help &amp; Inquiries</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                        <div className="flex items-center gap-2">
                            <span>&copy; {new Date().getFullYear()} EchoSocial. All rights reserved.</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            <span className="text-text-secondary">All systems operational</span>
                        </div>

                        <div className="flex items-center gap-4">
                            <a href="https://github.com/hamzaiqbal35" target="_blank" rel="noopener noreferrer" className="hover:text-text-primary transition-colors">
                                GitHub
                            </a>
                            <Link to="/contact" className="hover:text-text-primary transition-colors">
                                Contact Support
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
