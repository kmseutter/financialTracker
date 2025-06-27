const Database = require('better-sqlite3');
const path = require('path');

// Create or connect to SQLite DB
const db = new Database(path.join(__dirname, 'finance.db'));

// Create Users table if not exists
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  );
`).run();

// Create Transactions table
db.prepare(`
  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    amount REAL,
    category TEXT,
    date TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`).run();

module.exports = db;
