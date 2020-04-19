const router = require('express').Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation } = require('../validation'); // grabbing function from validation.js using destructuring

// VALIDATION
const Joi = require('@hapi/joi');

router.post('/register', async (req, res) => {
    // Validate data before creating new user
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Check if user is already in db
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) return res.status(400).send('Email already exists');

    // Hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    // Create new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword,
    });
    // catch error
    try{
        const savedUser = await user.save();
        res.send({ user: user._id});
    }catch(err) {
        res.status(400).send(err);
    }
});

// login route /api/user/login
router.post('/login', async (req, res) => {
    // Validate data before creating new user
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Check if email doesn't exist
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Email doesn\'t exist');

    // CHeck if password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send('Invalid password');

    // Create and assign JSON web token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);

    res.send('Logged in successfully!');




})


module.exports = router;