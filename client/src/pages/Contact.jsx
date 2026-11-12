import { useState } from 'react';
import { Link } from 'react-router-dom';
import { contactAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ThemeToggle from '../components/ThemeToggle';
import Logo from '../components/Logo';

const Contact = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        const selected = Array.from(e.target.files);
        setFiles(selected);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('subject', subject || 'Support Request');
            formData.append('message', message);

            for (let i = 0; i < files.length; i++) {
                formData.append('media', files[i]);
            }

            await contactAPI.sendContactMessage(formData);
            setSuccess(true);
            setName('');
            setEmail('');
            setSubject('');
            setMessage('');
            setFiles([]);
        } catch (err) {
            console.error('Failed to send message:', err);
            setError(err.response?.data?.message || 'Failed to submit inquiry. Please try again.');
        } finally {
            setLoading(false);
        }
    };

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

            {/* Main Contact Container */}
            <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-12 w-full">
                <div className="text-center max-w-xl mx-auto mb-10">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">Support &amp; Inquiries</span>
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-text-primary mt-2 mb-3">
                        Contact Support
                    </h1>
                    <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                        Have a question, feedback, or need assistance with your account? Our team typically responds within 24 hours.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                    {/* Left: Contact Info Card */}
                    <div className="md:col-span-5 space-y-4">
                        <div className="card p-6 border border-border">
                            <h2 className="text-sm font-semibold text-text-primary mb-4">Direct Communication</h2>
                            
                            <div className="space-y-4 text-xs text-text-secondary">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-medium text-text-primary">Email Support</p>
                                        <a href="mailto:hamzaiqbalrajpoot35@gmail.com" className="text-primary hover:underline">
                                            hamzaiqbalrajpoot35@gmail.com
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-medium text-text-primary">Safety &amp; Abuse</p>
                                        <p className="text-[11px] text-text-muted">Report community violations directly via post menus or this form.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-medium text-text-primary">Hours</p>
                                        <p className="text-[11px] text-text-muted">Monday – Friday &bull; 9:00 AM – 6:00 PM UTC</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 rounded-xl bg-bg-card border border-border text-xs text-text-muted">
                            <p className="font-medium text-text-primary mb-1">Looking for account help?</p>
                            <p className="mb-3 text-[11px]">You can reset your password or update your security parameters directly in your profile.</p>
                            <Link to="/forgot-password" className="text-primary hover:underline font-medium">
                                Reset Password &rarr;
                            </Link>
                        </div>
                    </div>

                    {/* Right: Contact Form */}
                    <div className="md:col-span-7">
                        <div className="card p-6 sm:p-7 border border-border shadow-elevated">
                            {success ? (
                                <div className="text-center py-10 animate-fade-in">
                                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h2 className="text-base font-bold text-text-primary mb-1">Message Submitted</h2>
                                    <p className="text-xs text-text-secondary max-w-sm mx-auto mb-6">
                                        Thank you for reaching out. We have received your inquiry and a team member will reply shortly.
                                    </p>
                                    <div className="flex justify-center gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setSuccess(false)}
                                            className="btn btn-secondary btn-sm"
                                        >
                                            Send Another Message
                                        </button>
                                        <Link to="/welcome" className="btn btn-primary btn-sm">
                                            Back to Home
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {error && (
                                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-error text-xs flex items-center gap-2">
                                            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>{error}</span>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-text-secondary mb-1">
                                                Your Name
                                            </label>
                                            <input
                                                type="text"
                                                className="input text-xs"
                                                placeholder="Elena Vance"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                required
                                                disabled={loading}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-text-secondary mb-1">
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                className="input text-xs"
                                                placeholder="elena@example.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                disabled={loading}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-text-secondary mb-1">
                                            Subject
                                        </label>
                                        <input
                                            type="text"
                                            className="input text-xs"
                                            placeholder="Account inquiry, feature question, or report"
                                            value={subject}
                                            onChange={(e) => setSubject(e.target.value)}
                                            disabled={loading}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-text-secondary mb-1">
                                            Message
                                        </label>
                                        <textarea
                                            className="input textarea text-xs"
                                            placeholder="Please describe your question or issue in detail..."
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            required
                                            disabled={loading}
                                            rows={5}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-text-secondary mb-1">
                                            Attachments (Optional)
                                        </label>
                                        <input
                                            type="file"
                                            multiple
                                            onChange={handleFileChange}
                                            className="block w-full text-xs text-text-muted file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-bg-tertiary file:text-text-primary hover:file:bg-border cursor-pointer"
                                            disabled={loading}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary w-full py-2.5 text-xs font-semibold"
                                        disabled={loading}
                                    >
                                        {loading ? <LoadingSpinner size="xs" /> : 'Submit Support Request'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Clean Footer */}
            <footer className="border-t border-border py-6 text-xs text-text-muted">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <span>&copy; {new Date().getFullYear()} EchoSocial. All rights reserved.</span>
                    <div className="flex items-center gap-4">
                        <Link to="/terms" className="hover:text-text-primary transition-colors">Terms of Service</Link>
                        <Link to="/privacy" className="hover:text-text-primary transition-colors">Privacy Policy</Link>
                        <Link to="/standards" className="hover:text-text-primary transition-colors">Community Standards</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Contact;
