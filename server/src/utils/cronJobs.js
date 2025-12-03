const Report = require('../models/Report');
const Notification = require('../models/Notification');

const checkExpiredReports = async () => {
    try {
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        // Find pending reports older than 7 days
        const expiredReports = await Report.find({
            status: 'pending',
            createdAt: { $lt: sevenDaysAgo }
        });

        if (expiredReports.length === 0) return;

        console.log(`Found ${expiredReports.length} expired reports. Auto-dismissing...`);

        for (const report of expiredReports) {
            report.status = 'dismissed';
            report.resolvedAt = new Date();
            // We don't set resolvedBy since it's system automated
            await report.save();

            // Create notification for the reporter
            await Notification.create({
                user: report.reporter,
                type: 'report_status',
                report: report._id
                // actor is undefined for system actions
            });
        }

        console.log(`Successfully auto-dismissed ${expiredReports.length} reports.`);
    } catch (error) {
        console.error('Error in checkExpiredReports:', error);
    }
};

module.exports = { checkExpiredReports };
