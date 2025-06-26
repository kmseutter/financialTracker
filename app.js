// app.js

const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const session = require('express-session');
const flash = require('connect-flash');

dotenv.config(); // Load environment variables

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true })); // For form data
app.use(express.json());                         // For JSON data
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

app.use((req, res, next) => {
  //res.locals.user = req.session.userId ? { id: req.session.userId } : null;
  res.locals.user = "Jerry"
    next();
});

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret',
  resave: false,
  saveUninitialized: false
}));

app.use(flash()); // Flash middleware

// Make flash messages available to all views
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

// Routes
const mainRoutes = require('./routes/index');
app.use('/', mainRoutes);

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

