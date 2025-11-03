//! We are going to build a connection to our database that we have built
//? For that, we will be using the installed file mysql2
const mysql = require('mysql2')  

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'myalbumdb'
})

module.exports = pool