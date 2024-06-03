const db = require('../config/dbConfig');

class Journal {
    static createJournal(userId, title, mood, content, imageUrl) {
        const SQL = `INSERT INTO Journal (userId, title, mood, content, imageUrl, createdAt) VALUES (?, ?, ?, ?, ?, NOW())`;
        return db.query(SQL, [userId, title, mood, content, imageUrl]);
    }

    static findJournal(userId, startDate, endDate) {
        let SQL = `SELECT * FROM Journal WHERE userId = ?`;
        const params = [userId];

        if (startDate) {
            SQL += ` AND createdAt >= ?`;
            params.push(startDate);
        }

        if (endDate) {
            SQL += ` AND createdAt <= ?`;
            params.push(endDate);
        }

        SQL += ` ORDER BY createdAt DESC`;
        return db.query(SQL, params);
    }

    // 可以根据需要添加更多方法，比如更新和删除日记
}

module.exports = Journal;
