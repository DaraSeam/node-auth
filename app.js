//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
const port = 3000;

const app = express();


/* setup */
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

/* mongoose */
mongoose.connect('mongodb://localhost:27017/userDB');
// schema
const userSchema = new mongoose.Schema({
    email: String,
    password: String
})
// encrypting password
const secret = process.env.SECRET;
userSchema.plugin(encrypt, {secret: secret, encryptedFields: ['password']});

// model
const User = new mongoose.model('User', userSchema);

/* get route */
app.get('/', (req,res) => {
    res.render('home');
})
app.get('/login', (req,res) => {
    res.render('login');
})
app.get('/register', (req,res) => {
    res.render('register');
})

/*------------- post route -------------*/
// resgister route
app.post('/register', (req,res) => {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    })
    
    newUser.save((err) => {
        if (!err) {
            res.render('secrets')
        } else {
            console.log(err)
        }
    })
})

// login route
app.post('/login', (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    
    User.findOne({email: username}, (err, foundUser) => {
        if(foundUser) {
            if(foundUser.password === password) {
                res.render('secrets')
            } else {
                console.log("Incorrect password")
            }
        } else {
            console.log("User doesn't exist")
        }
    })
})

// delete route
app.delete('/', (req,res) => {
    User.deleteOne(
        {email: req.body.email},
        (err) => {
            if(err) {
                console.log(err)
            } else {
                res.send("Successfully deleted!")
            }
        }
    ) 
})

/* listen route */
app.listen(port, () => {
    console.log("Server running at: http://localhost:"+port);
});