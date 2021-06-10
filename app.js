// import shits
const express = require('express');
const dotenv = require('dotenv')
const mysql = require('mysql')
const myConnection = require('express-myconnection')
const session = require('express-session')
const flash = require('express-flash')
const methodOverride = require('method-override')
const studentRoute = require('./routes/student/student')


// config
dotenv.config()
const app = express()
const port = process.env.PORT || 3000

// db connect 
const dbOptions = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
}

app.use(myConnection(mysql, dbOptions, 'pool'))



//run app


//middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}))
app.use(flash())
app.use(methodOverride('_method'));
app.use(session({
    cookie: {
        maxAge: 6000
    },
    secret: 'ejak',
    resave: false,
    saveUninitialized: false
}))

// routes
app.use('/student', studentRoute)


app.get('/', (req, res) => {
    res.send('test')
});





app.listen(port, () => {
    console.log(`Server started on port`);
});
