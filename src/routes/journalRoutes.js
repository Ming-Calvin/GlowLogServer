const express = require('express');
const Journal = require('../models/Journal');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');

// 创建日记
router.post('/createJournal', authenticateToken, async (req, res) => {
    const { title, mood, content, imageUrl } = req.body;
    const userId = req.user.id;  // 从 token 中获取 userId

    try {
        await Journal.createJournal(userId, title, mood, content, imageUrl);
        res.status(201).send('Journal entry created successfully');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 根据用户ID和创建时间范围获取日记
router.get('/journal', authenticateToken,  async (req, res) => {
    const { startDate, endDate } = req.query;
    const userId = req.user.id;  // 从 token 中获取 userId

    try {
        const [entries] = await Journal.findJournal(userId, startDate, endDate);
        res.status(200).json(entries);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
module.exports = router;
