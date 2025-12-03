require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/database');

const PORT = process.env.PORT || 5000;

// Connect to database
const { checkExpiredReports } = require('./utils/cronJobs');

// Connect to database
connectDB();

// Start server
app.listen(PORT, () => {
    console.log(`🚀 EchoSocial server running on port ${PORT}`);
    console.log(`📡 API available at http://localhost:${PORT}/api`);

    // Initial check
    checkExpiredReports();

    // Check for expired reports every hour
    setInterval(checkExpiredReports, 60 * 60 * 1000);
});
