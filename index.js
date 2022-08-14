require('dotenv').config();

/* This is the main file of the application. It is the entry point of the application. */
const express = require('express');
const app = express();

const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');

const router = require('./controller/router');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(session({ secret: 'Library@123', resave: false, saveUninitialized: true, cookie: { maxAge: 60000 } }));
app.use(flash());

app.set('view engine', 'ejs');

router(app);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
