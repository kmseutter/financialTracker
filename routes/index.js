// routes/index.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { createUser, findUser } = require('../models/User');
const ensureAuthenticated = require('../middleware/auth');
const { addTransaction, getUserTransactions } = require('../models/Transaction');

// Sample homepage route
router.get('/', (req, res) => {
  res.render('dashboard', { title: 'Dashboard', categories: [], amounts: [] });
});

// Show register form
router.get('/register', (req, res) => {
  res.render('register', { title: 'Register' });
});

// Handle registration
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (findUser(username)){
      req.flash('error', 'User already exists');
      return res.redirect('/register');
  }
  await createUser(username, password);
  req.flash('success', 'Registered successfully! Please log in.');
  res.redirect('/login');
});

// Show login form
router.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});

// Handle login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = findUser(username);
  if (!user){
    req.flash('error', 'User not found');
    return res.redirect('/login');
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match){
    req.flash('error', 'Incorrect password');
    return res.redirect('/login');
  }
  req.session.userId = user.id;
  req.flash('success', 'Welcome back!');
  res.redirect('/dashboard');
});

// Dashboard (protected)
router.get('/dashboard', ensureAuthenticated, (req, res) => {
  const transactions = getUserTransactions(req.session.userId);

  // Group by category and sum amounts
  const categoryTotals = {};

  for (const tx of transactions) {
    if (!categoryTotals[tx.category]) {
      categoryTotals[tx.category] = 0;
    }
    categoryTotals[tx.category] += tx.amount;
  }

  const categories = Object.keys(categoryTotals);
  const amounts = Object.values(categoryTotals);

  res.render('dashboard', { 
    title: 'Dashboard', 
    transactions, categories, amounts});
});

//Transactions
router.post('/transactions', ensureAuthenticated, (req, res) => {
  const { amount, category, date } = req.body;
  if (!amount || !category || !date) {
    req.flash('error', 'All fields are required.');
    return res.redirect('/dashboard');
  }

  addTransaction(req.session.userId, parseFloat(amount), category, date);
  req.flash('success', 'Transaction added.');
  res.redirect('/dashboard');
});

// Logout
router.get('/logout', ensureAuthenticated, (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

module.exports = router;

