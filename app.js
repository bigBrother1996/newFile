require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
var encrypt = require('mongoose-encryption');

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }))
app.set("view engine", "ejs");
mongoose.connect("mongodb://localhost:27017/userDB");
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });

const User = mongoose.model("User", userSchema)

app.get("/", function (req, res) {
    res.render("home")
});
app.get("/login", function (req, res) {
    res.render("login")
});
app.get("/register", function (req, res) {
    res.render("register")
});

app.post("/register", function (req, res) {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    })
    newUser.save(function (err) {
        if (!err) {
            res.render("secrets")
        }
        else { console.log(err); }
    })
})
app.post("/login", function (req, res) {
    User.findOne({ email: req.body.username }, function (err, foundUser) {
        if (foundUser) {
            if (foundUser.password === req.body.password) {
                res.render("secrets")
            } else {
                console.log("password is incorrect");
            }
        } else {
            console.log("not good");
        }

    })
})


app.listen(3000, function () {
    console.log("server is running port 3000");
})