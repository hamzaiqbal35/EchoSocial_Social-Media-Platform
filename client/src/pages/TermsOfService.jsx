import { Link } from 'react-router-dom';

const TermsOfService = () => {
    return (
        <div className="min-h-screen bg-bg-primary text-text-primary p-6 md:p-12">
            <div className="max-w-4xl mx-auto">
                <Link to="/" className="text-primary hover:underline mb-8 inline-block">&larr; Back to Home</Link>

                <h1 className="text-4xl font-bold gradient-text mb-8">Terms of Service</h1>
                <p className="text-text-muted mb-8">Last updated: {new Date().toLocaleDateString()}</p>

                <div className="space-y-8 text-text-secondary">
                    <section>
                        <h2 className="text-2xl font-semibold text-text-primary mb-4">1. Acceptance of Terms</h2>
                        <p>By accessing or using EchoSocial, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-text-primary mb-4">2. User Conduct</h2>
                        <p>You agree not to use the service for any unlawful purpose or in any way that interrupts, damages, or impairs the service.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-text-primary mb-4">3. Content</h2>
                        <p>You retain ownership of the content you post, but you grant EchoSocial a license to use, store, and display that content in connection with the service.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-text-primary mb-4">4. Termination</h2>
                        <p>We reserve the right to terminate or suspend your account at any time for violations of these terms.</p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;
