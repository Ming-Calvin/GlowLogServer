const User = require('../models/User');

class UserService {
    static register(email, password, username) {
        return User.register(email, password, username)
    }

    static login(email) {
        return User.login(email)
    }

    static sendCode(email, code, expiresAt) {
        return User.sendCode(email, code, expiresAt)
    }

    static async validateCode(email, code) {
        return User.validateCode(email, code)
    }
}

module.exports = UserService