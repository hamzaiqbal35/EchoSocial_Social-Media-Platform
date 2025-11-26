require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./src/models/User');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB connected');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};

const createAdminUser = async () => {
    try {
        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@echosocial.com' });

        if (existingAdmin) {
            console.log('ℹ️  Admin user already exists');
            console.log('📧 Email:', existingAdmin.email);
            console.log('👤 Username:', existingAdmin.username);
            console.log('🔑 Password: admin123');
            return;
        }

        // Create admin user
        const adminUser = await User.create({
            username: 'admin',
            email: 'admin@echosocial.com',
            password: 'admin123', // Will be hashed by pre-save hook
            role: 'admin',
            bio: 'Platform Administrator',
            isActive: true
        });

        console.log('✅ Admin user created successfully!');
        console.log('');
        console.log('═══════════════════════════════════════');
        console.log('📋 ADMIN CREDENTIALS');
        console.log('═══════════════════════════════════════');
        console.log('📧 Email:    admin@echosocial.com');
        console.log('👤 Username: admin');
        console.log('🔑 Password: admin123');
        console.log('═══════════════════════════════════════');
        console.log('');
        console.log('⚠️  IMPORTANT: Change the password after first login!');
        console.log('');

    } catch (error) {
        console.error('❌ Error creating admin user:', error);
    }
};

const run = async () => {
    await connectDB();
    await createAdminUser();
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    process.exit(0);
};

run();
