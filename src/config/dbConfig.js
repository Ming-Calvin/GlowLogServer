const mysql = require('mysql2')

const dbConfig = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'growlog'
})

module.exports = dbConfig.promise()