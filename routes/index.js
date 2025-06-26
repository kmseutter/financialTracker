// routes/index.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { createUser, findUser } = require('../models/User');

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
router.get('/dashboard', (req, res) => {
  if (!req.session.userId) return res.redirect('/login');
  res.render('dashboard', { title: 'Dashboard', categories: [], amounts: [] });
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

module.exports = router;

