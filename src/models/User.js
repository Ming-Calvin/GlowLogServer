const db = require('../config/dbConfig');
const uuid = require('uuid');

class User {
    // 注册
    static async register(email, password, username) {
        // 获取最大 UserId
        const [rows] = await db.query('SELECT MAX(userId) as maxId FROM Users');
        console.log(rows)
        const maxId = rows[0].maxId || 999999;
        const newUserId = maxId + 1;


        const SQL = `INSERT INTO Users (userId, email, password, username) VALUES (?, ?, ?, ?)`
        return db.query(SQL, [newUserId, email, password, username])
    }

    static login(email) {
        const SQL = `SELECT * FROM Users WHERE email = ?`

        return db.query(SQL, [email])
    }

    static sendCode(email, code, expiresAt) {
        const SQL = `INSERT INTO EmailVerifications (email, code, expiresAt) VALUES (?, ?, ?)`

        return db.query(SQL, [email, code, expiresAt])
    }

    // 在 userService 中添加 validateCode 方法
    static async validateCode(email, code) {
        const SQL = `
        SELECT code, expiresAt 
        FROM EmailVerifications 
        WHERE email = ? 
        ORDER BY createdAt DESC 
        LIMIT 1
    `;
        const result = await db.query(SQL, [email]);

        if (result[0].length === 0) {
            return false; // 没有找到对应的 email 和 code
        }


        const { code: latestCode, expiresAt } = result[0][0];

        // 检查 code 是否匹配以及是否过期
        const isCodeValid = latestCode == code;
        const isCodeNotExpired = new Date(expiresAt) > new Date();

        console.log(latestCode, code, expiresAt)
        console.log(isCodeValid, isCodeNotExpired)

        return isCodeValid && isCodeNotExpired;
    }

    static async getUserInfo(userId) {
        const SQL = `SELECT username FROM Users WHERE id = ?`;
        const [rows] = await db.query(SQL, [userId]);
        if (rows.length > 0) {
            return rows
        }
        return null;
    }
}

module.exports = User