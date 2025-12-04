import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-bg-primary text-text-primary p-6 md:p-12">
            <div className="max-w-4xl mx-auto">
                <Link to="/" className="text-primary hover:underline mb-8 inline-block">&larr; Back to Home</Link>

                <h1 className="text-4xl font-bold gradient-text mb-8">Privacy Policy</h1>
                <p className="text-text-muted mb-8">Last updated: {new Date().toLocaleDateString()}</p>

                <div className="space-y-8 text-text-secondary">
                    <section>
                        <h2 className="text-2xl font-semibold text-text-primary mb-4">1. Information We Collect</h2>
                        <p>We collect information you provide directly to us, such as when you create an account, post content, or communicate with us. This may include your name, email address, and any other information you choose to provide.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-text-primary mb-4">2. How We Use Your Information</h2>
                        <p>We use the information we collect to provide, maintain, and improve our services, to develop new ones, and to protect EchoSocial and our users.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-text-primary mb-4">3. Sharing of Information</h2>
                        <p>We do not share your personal information with third parties except as described in this policy or with your consent.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-text-primary mb-4">4. Contact Us</h2>
                        <p>If you have any questions about this Privacy Policy, please contact us at support@echosocial.com.</p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
