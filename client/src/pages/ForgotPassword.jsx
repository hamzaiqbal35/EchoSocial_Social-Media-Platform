import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

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
            await authAPI.forgotPassword(email);
            setMessage('Email sent! Please check your inbox for instructions.');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send email');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold gradient-text">Forgot Password</h1>
                    <p className="text-text-muted mt-2">Enter your email to reset your password</p>
                </div>

                <div className="glass rounded-2xl p-8 shadow-xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">Email</label>
                            <input
                                type="email"
                                className="input"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>

                        {message && (
                            <div className="bg-success bg-opacity-10 border border-success text-success rounded-lg p-3 text-sm">
                                {message}
                            </div>
                        )}

                        {error && (
                            <div className="bg-error bg-opacity-10 border border-error text-error rounded-lg p-3 text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary w-full btn-lg"
                            disabled={loading}
                        >
                            {loading ? <LoadingSpinner size="sm" /> : 'Send Reset Link'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link to="/login" className="text-primary hover:text-primary-light font-semibold">
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
