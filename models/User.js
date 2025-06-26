const bcrypt = require('bcrypt');

const users = []; // In-memory "DB"

async function createUser(username, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { id: Date.now(), username, password: hashedPassword };
  users.push(user);
  return user;
}

function findUser(username) {
  return users.find(user => user.username === username);
}

module.exports = { createUser, findUser };

