const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const router = require('./routes/index.routes')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const morgan = require('morgan')
const flash = require('connect-flash')
const session = require('express-session')

const app = express();

//-->Settings
app.set('PORT', process.env.PORT || 5000);
app.set('views', path.join(__dirname, 'views'));
app.set('static', path.join(__dirname, 'static'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

//-->Middlewares
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(methodOverride('_method'))
app.use(bodyParser.json())
app.use(express.static(app.get('static')));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(flash());

//Global Variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    next()
})

//--> Routes
app.use(router);

module.exports = app;
