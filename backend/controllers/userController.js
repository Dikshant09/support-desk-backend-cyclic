const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

// @desc Register a new user
// @route /api/users
// @access public
// POST request : we will fetch data from request.body
const registerUser = asyncHandler(async (req, res, next) => {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please include all fields");
    }

    // Find if user already exists
    let userExists;
    try {
        userExists = await User.findOne({ email: email });
    } catch (error) {
        return console.error(error.message);
    }

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    // If user not exists, then we will create a new user...
    // First we will hash the password
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(password, salt);
    const hashedPassword = bcrypt.hashSync(password);

    // Create a new user
    const user = new User({
        name,
        email,
        password: hashedPassword
    });

    try {

        await user.save();
        res.status(201);
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
        console.log('User Created Successfully');
    } catch (error) {
        res.status(400);
        throw new Error('Invalid user data');
    }
})

// @desc Login a new user
// @route /api/users/login
// @access public
// POST request : we will fetch data from request.body
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    // console.log(req.body);
    const user = await User.findOne({ email: email });

    // Checking user and it's password
    if (user && bcrypt.compareSync(password, user.password)) {
        res.status(200);
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    } else {
        res.status(401);
        throw new Error(`Invalid Credentials`);
    }
})


// @desc get current user
// @route /api/users/me
// @access private
// GET request : we fetch current user data
const getMe = asyncHandler(async (req, res) => {
    const user = {
        name: req.user.name,
        email: req.user.email,
        id: req.user.id,
    }
    res.status(200).json(user);
})

// Token Generator
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
}


module.exports = {
    registerUser,
    loginUser,
    getMe
}