const sqlite3 = require('sqlite3');  // 引入 sqlite3 模块
const path = require('path');  // 引入路径处理模块

const dbName = path.join(__dirname, 'nft-transfer.db');  // 获取当前运行目录下的 data.db 文件
// 打开数据库
const db = new sqlite3.Database(dbName, err => {
  if (err !== null) console.log(err);  // 输出错误信息
});

db.run('INSERT INTO user (user_name, age) VALUES (?, ?)', ['Mark', 28], function(err) {
  if (err) console.log(err);  // 如果有错误就输出错误信息
  console.log(this.changes);  // 输出受影响的行数
  console.log(this.lastID);  // 输出 lastID
});

db.all('SELECT id, user_name, age FROM user', (err, rows) => {
  if (err) console.log(err);  // 如果出现错误就输出错误信息
  console.log(rows);  // 输出查询结果
});

db.close(err => {
  if (err) console.log(err);
});