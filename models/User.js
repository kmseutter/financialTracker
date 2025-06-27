const bcrypt = require('bcrypt');
const db = require('../db');

//const users = []; // In-memory "DB"

//Register user
async function createUser(username, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const stmt = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
  const info = stmt.run(username, hashedPassword);
  return {id: info.lastInsertRowid, username};
}

//Find user by username
function findUser(username) {
  const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
  return stsmt.get(username); //returns a user or undefined
}

module.exports = { createUser, findUser };

