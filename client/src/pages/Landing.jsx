import { Link } from 'react-router-dom';

const Landing = () => {
    return (
        <div className="min-h-screen bg-bg-primary flex flex-col relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            {/* Navbar */}
            <nav className="relative z-10 px-6 py-6 flex justify-between items-center max-w-7xl mx-auto w-full">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <span className="text-2xl font-bold gradient-text">EchoSocial</span>
                </div>
                <div className="flex items-center gap-4">
                    <Link to="/login" className="text-text-secondary hover:text-text-primary font-medium transition-colors">
                        Login
                    </Link>
                    <Link to="/register" className="btn btn-primary">
                        Get Started
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
                <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-8 animate-fade-in">
                    Connect, Share, and <br />
                    <span className="gradient-text">Engage with the World</span>
                </h1>
                <p className="text-xl text-text-secondary mb-12 max-w-2xl animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    Join the next generation of social networking. Share your moments, discover new people, and build meaningful connections in a vibrant community.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                    <Link to="/register" className="btn btn-primary btn-lg group">
                        Join Now
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </Link>
                    <Link to="/login" className="btn btn-secondary btn-lg">
                        Sign In
                    </Link>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 w-full animate-fade-in" style={{ animationDelay: '0.6s' }}>
                    <div className="glass p-8 rounded-2xl hover:bg-bg-secondary/50 transition-colors">
                        <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4 mx-auto text-primary">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold mb-2">Share Moments</h3>
                        <p className="text-text-secondary">Upload photos and videos to share your life's highlights with your followers.</p>
                    </div>
                    <div className="glass p-8 rounded-2xl hover:bg-bg-secondary/50 transition-colors">
                        <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center mb-4 mx-auto text-secondary">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold mb-2">Connect</h3>
                        <p className="text-text-secondary">Find and follow friends, family, and interesting people from around the world.</p>
                    </div>
                    <div className="glass p-8 rounded-2xl hover:bg-bg-secondary/50 transition-colors">
                        <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4 mx-auto text-accent">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold mb-2">Stay Updated</h3>
                        <p className="text-text-secondary">Get real-time notifications when people interact with your content.</p>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 py-8 text-center text-text-muted text-sm">
                <p>&copy; {new Date().getFullYear()} EchoSocial. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Landing;
