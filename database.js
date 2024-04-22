var mysql = require("mysql");
var connection = mysql.createConnection({
    host : 'localhost',
    database: 'project',
    user : 'root',
    password: 'change@123',
    port:'3306',
});
module.exports = connection;