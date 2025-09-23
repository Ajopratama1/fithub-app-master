const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Admin, Member } = require('../models');

async function loginAdmin(req, res) {
    const { username, password } = req.body;
    try {
        const admin = await Admin.findOne({ where: { username } });
        if (!admin) {
            return res.status(401).json({ message: 'Username tidak ditemukan.' });
        }
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Password salah.' });
        }
        const token = jwt.sign({ id: admin.id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { ...admin.toJSON(), role: 'admin' } });
    } catch (error) {
        res.status(500).json({ message: 'Server error saat login admin.' });
    }
}

async function loginMember(req, res) {
    const { username, password } = req.body;
    try {
        const member = await Member.findOne({ where: { username } });
        if (!member) {
            return res.status(401).json({ message: 'Username tidak ditemukan.' });
        }
        const isMatch = await bcrypt.compare(password, member.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Password salah.' });
        }
        const token = jwt.sign({ id: member.id, role: 'member' }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { ...member.toJSON(), role: 'member' } });
    } catch (error) {
        res.status(500).json({ message: 'Server error saat login member.' });
    }
}

// Fungsi-fungsi lain yang dibutuhkan oleh authRoutes.js
async function registerAdmin(req, res) { /* ... */ }
async function registerMember(req, res) { /* ... */ }

module.exports = {
    loginAdmin,
    loginMember,
    registerAdmin,
    registerMember
};