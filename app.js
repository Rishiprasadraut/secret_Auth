const express = require('express');
const bodyparser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const ejs = require('ejs');

const bcrypt = require('bcrypt');

const port = 3000

const secret_key = "thisislittlesecretkey.";


const app = express();
app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());



const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://rishiraut53_db_user:15u8NID9xOmDi6A7@cluster1.h1c0c6e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1");

const trySchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        unique: true
    },
    password: String
});

const secretSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        maxlength: 500
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model("seconds", trySchema);
const Secret = mongoose.model("Secret", secretSchema);



function authenticateToken(req, res, next) {
    const token = req.cookies.token;
    if (token == null) return res.redirect("/login");

    jwt.verify(token, secret_key, (err, user) => {
        if (err) return res.redirect("/login");
        req.user = user;
        next();
    })

}

app.get("/", function (req, res) {
    res.render("home");
})

app.post("/register", async function (req, res) {
    try {

        const {
            username,
            useremail,
            password
        } = req.body;


        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(useremail)) {
            return res.send("Invalid email....");
        }


        function validatePassword(password) {
            const minLength = 6;
            const maxLength = 8;

            if (password.length < minLength || password.length > maxLength) {
                return `Paasword must be between ${minLength} and ${maxLength} characters long.`;

            }
            return null;
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name: username,
            email: useremail,
            password: hashPassword
        });

        await newUser.save()

        res.render("login");

    } catch (err) {
        console.log(err);
        res.send("Error during registration.");
    }

});



app.post("/login", async function (req, res) {
    try {
        const { useremail, password } = req.body;
        const foundUser = await User.findOne({ email: useremail });

        if (!foundUser) {
            return res.send("user not Found");
        }

        const validPassword = await bcrypt.compare(password, foundUser.password);
        if (!validPassword) {
            return res.send("Wrong password");
        }

        const token = jwt.sign(
            { id: foundUser._id, email: foundUser.email },
            secret_key,
            { expiresIn: "1h" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            maxAge: 3600000
        });
        
        res.redirect("/secret");


    }
    catch (err) {
        console.log(err);
        res.render("Error during login.");
        
    }
});

app.get("/secret", authenticateToken, async (req, res) => {
    const user = await User.findById(req.user.id).select("-password");
    res.render("secret", { user });
});

app.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.redirect("/login");
});

app.get("/login", function (req, res) {
    res.render("login");
})

app.get("/register", function (req, res) {
    res.render("register");
});

app.get("/submit", authenticateToken, function (req, res) {
    res.render("submit");
});

app.post("/submit", authenticateToken, async function (req, res) {
    try {
        const { secret } = req.body;
        
        if (!secret || secret.trim().length === 0) {
            return res.send("Secret cannot be empty");
        }
        
        if (secret.length > 500) {
            return res.send("Secret is too long (max 500 characters)");
        }
        
        const newSecret = new Secret({
            content: secret.trim()
        });
        
        await newSecret.save();
        res.redirect("/secret");
        
    } catch (err) {
        console.log(err);
        res.send("Error submitting secret");
    }
});

app.listen(port, function () {
    console.log("Server has started successfully")
})
