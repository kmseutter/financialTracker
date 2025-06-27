const db = require('../db');

function addTransaction(userId, amount, category, date){
  const stsmt = db.prepare(
    'Insert INTO transactions (user_id, amount, category, date) VALUES (?,?,?,?)');
  stmt.run(userId, amount, category, date);
}

function getUserTransactions(userId){
  const stmt = db.prepare('SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC');
  return stmt.all(userId);
}

module.exports = {addTransaction, getUserTransactions};
