//required("dotenv").config();
// npm install express express-handlebars cookie-parser express-session
const express = require('express');
// @ts-ignore
const handlebars = require('express-handlebars');
const path = require('path');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;

const route = require('./route/index.js');
const db = require('./config/db.js');
const credentials = require('./credentials');
const handlebarsHelpers = require("./helpers")

db.connect();

const hbs = handlebars.create({ extname: '.hbs', helpers: handlebarsHelpers });
app.use(cookieParser())
app.use(expressSession({
    resave: false,
    saveUninitialized: false,
    secret: credentials.cookieSecret,
}))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
route(app)
app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`);
})