const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'webapp.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('正在查询数据库中的用户数据...');

db.all("SELECT * FROM user", (err, rows) => {
    if (err) {
        console.error('查询错误:', err);
    } else {
        console.log('用户数据:');
        console.table(rows);
    }

    db.close();
}); 