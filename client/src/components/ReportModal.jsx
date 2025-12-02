import { useState } from 'react';
import Modal from './Modal';
import LoadingSpinner from './LoadingSpinner';
import { userAPI } from '../services/api';

const ReportModal = ({ isOpen, onClose, reportType, targetId, targetName }) => {
    const [reason, setReason] = useState('');
    const [description, setDescription] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const reportReasons = [
        { value: 'spam', label: 'Spam' },
        { value: 'harassment', label: 'Harassment or Bullying' },
        { value: 'inappropriate', label: 'Inappropriate Content' },
        { value: 'violence', label: 'Violence or Dangerous Organizations' },
        { value: 'hate_speech', label: 'Hate Speech' },
        { value: 'misinformation', label: 'False Information' },
        { value: 'other', label: 'Other' }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!reason) {
            setError('Please select a reason for reporting');
            return;
        }

        setSubmitting(true);
        setError('');

        try {
            const reportData = {
                reason,
                description
            };

            if (reportType === 'user') {
                reportData.reportedUserId = targetId;
            } else {
                reportData.reportedPostId = targetId;
            }

            await userAPI.createReport(reportData);
            setSuccess(true);

            // Reset form and close after a short delay
            setTimeout(() => {
                handleClose();
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit report');
        } finally {
            setSubmitting(false);
        }
    };

    const handleClose = () => {
        setReason('');
        setDescription('');
        setError('');
        setSuccess(false);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title={`Report ${reportType === 'user' ? 'User' : 'Post'}`}>
            {success ? (
                <div className="text-center py-6">
                    <svg className="w-16 h-16 mx-auto text-success mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-lg font-semibold mb-2">Report Submitted</h3>
                    <p className="text-text-muted">Thank you for helping keep our community safe.</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-2">
                    <div>
                        <p className="text-xs text-text-muted mb-2">
                            {reportType === 'user'
                                ? `You are reporting ${targetName}. Please select a reason below.`
                                : 'You are reporting this post. Please select a reason below.'}
                        </p>

                        <div className="space-y-1 max-h-40 overflow-y-auto pr-2">
                            {reportReasons.map((r) => (
                                <label
                                    key={r.value}
                                    className="flex items-center gap-2 p-1.5 rounded-lg border border-border hover:bg-bg-secondary cursor-pointer transition-colors"
                                >
                                    <input
                                        type="radio"
                                        name="reason"
                                        value={r.value}
                                        checked={reason === r.value}
                                        onChange={(e) => setReason(e.target.value)}
                                        className="w-4 h-4 text-primary focus:ring-primary"
                                    />
                                    <span className="text-xs">{r.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium mb-1">
                            Additional Details (Optional)
                        </label>
                        <textarea
                            className="input textarea text-sm"
                            placeholder="Provide more context..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            maxLength={500}
                            rows={2}
                        />
                        <div className="text-xs text-text-muted mt-0.5 text-right">
                            {description.length}/500
                        </div>
                    </div>

                    {error && (
                        <div className="bg-error/10 border border-error text-error px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div className="flex gap-3 justify-end pt-2 border-t border-border">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="btn btn-secondary"
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary bg-error hover:bg-error/90"
                            disabled={submitting || !reason}
                        >
                            {submitting ? <LoadingSpinner size="sm" /> : 'Submit Report'}
                        </button>
                    </div>
                </form>
            )}
        </Modal>
    );
};

export default ReportModal;
