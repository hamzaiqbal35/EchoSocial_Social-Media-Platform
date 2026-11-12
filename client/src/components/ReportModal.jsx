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
        { value: 'spam', label: 'Spam or malicious links' },
        { value: 'harassment', label: 'Harassment or hate speech' },
        { value: 'inappropriate', label: 'Inappropriate or explicit content' },
        { value: 'violence', label: 'Violence or dangerous acts' },
        { value: 'misinformation', label: 'False or misleading information' },
        { value: 'other', label: 'Other issue' }
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

            setTimeout(() => {
                handleClose();
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit report. Please try again.');
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
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto mb-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 className="text-sm font-semibold text-text-primary mb-1">Report submitted</h3>
                    <p className="text-xs text-text-muted">Thank you for helping keep the community safe.</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <p className="text-xs text-text-secondary mb-2.5">
                            {reportType === 'user'
                                ? `Select a reason for reporting ${targetName || 'this user'}:`
                                : 'Select a reason for reporting this post:'}
                        </p>

                        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                            {reportReasons.map((r) => (
                                <label
                                    key={r.value}
                                    className={`flex items-center gap-2.5 p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                                        reason === r.value
                                            ? 'border-primary/50 bg-bg-tertiary text-text-primary font-medium'
                                            : 'border-border hover:bg-bg-tertiary text-text-secondary'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="reason"
                                        value={r.value}
                                        checked={reason === r.value}
                                        onChange={(e) => setReason(e.target.value)}
                                        className="w-3.5 h-3.5 text-primary border-border focus:ring-0"
                                    />
                                    <span>{r.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-text-secondary mb-1">
                            Additional context (optional)
                        </label>
                        <textarea
                            className="input textarea text-xs min-h-[64px]"
                            placeholder="Provide any additional details that will help our review..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            maxLength={500}
                        />
                    </div>

                    {error && (
                        <div className="text-xs text-error font-medium flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="flex justify-end gap-2 pt-2 border-t border-border">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="btn btn-secondary btn-sm"
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-destructive btn-sm"
                            disabled={submitting || !reason}
                        >
                            {submitting ? <LoadingSpinner size="xs" /> : 'Submit Report'}
                        </button>
                    </div>
                </form>
            )}
        </Modal>
    );
};

export default ReportModal;
