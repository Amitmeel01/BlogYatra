
require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const favicon = require('serve-favicon');
const checkAuthenticationCookie = require('./middleware/authetication');

const app = express();

// Middleware for serving the favicon
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// Middlewares
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(cookieParser());
app.use(checkAuthenticationCookie('token'));






// Database connection
async function main() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('connected to database');
  } catch (err) {
    console.error('Database connection error:', err);
  }
}

main();




// Routes
app.use('/', require('./routes/user'));
app.use('/', require('./routes/blog'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Port configuration
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
