const express = require('express');
const bodyparser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const ejs = require('ejs');


const port = 3000

const secret_key = "thisislittlesecretkey.";


const app = express();
app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());



const mongoose = require('mongoose');
//mongoose.connect("mongodb://localhost:27017/secretDB");
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
        trim: true,
        maxlength: 500
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Secret = mongoose.model("Secret", secretSchema);


const User = mongoose.model("seconds", trySchema);

function validatePassword(password) {
    const minLength = 6;
    const maxLength = 20;

    if (password.length < minLength || password.length > maxLength) {
        return `Password must be between ${minLength} and ${maxLength} characters long.`;

    }
    return null;
}

function authenticateToken(req, res, next) {
    const token = req.cookies.token;
    if (token == null) return res.redirect("/login");

    jwt.verify(token, secret_key, (err, user) => {
        if (err) return res.redirect("/login");
        req.user = user;
        next();
    })

}

app.get("/secret", authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        const secrets = await Secret.find().sort({ createdAt: -1 });
        res.render("secret", { user, secrets });

    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

app.post("/register", async function (req, res) {
    try {

        const {
            username,
            useremail,
            password
        } = req.body;


        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(useremail)) {
            return res.render("register", { error: "Invalid email format." });

        }

        const passwordError = validatePassword(password);
        if (passwordError) {
            return res.render("register", { error: passwordError });
        }

        const existingUser = await User.findOne({ email: useremail });
        if (existingUser) {
            return res.render("register", { error: "Email already registered. Please login." });
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
        res.render("register", { error: "Error during registration." }
        );
    }

});



app.post("/login", async function (req, res) {
    try {
        const { useremail, password } = req.body;
        const foundUser = await User.findOne({ email: useremail });

        if (!foundUser) {
            return res.render("login", { error: "user not Found" });

        }

        const validPassword = await bcrypt.compare(password, foundUser.password);
        if (!validPassword) {
            return res.render("login", { error: "Wrong password" });
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
        res.render("login", { error: "Error during login." });

    }
});

app.get("/", function (req, res) {
    res.render("home");
})

app.get("/submit", (req, res) => {
    res.render("submit");
})

app.get("/login", (req, res) => {
    res.render("login");
});


app.get("/register", function (req, res) {
    res.render("register");
});

app.post("/submit", async (req, res) => {
    const secret = req.body.secret;
    await Secret.create({ content: secret });
    res.redirect("/secret");
});


app.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.redirect("/login");
});



app.listen(port, function () {
    console.log("Server has started successfully")
});
