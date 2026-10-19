const passport = require('passport');
const User = require('../models/user');

const register = async (req, res) => {
    if (!req.body.name || !req.body.email || !req.body.password) {
        return res.status(400).json({ message: "All fields required" });
    }

    const user = new User({ name: req.body.name, email: req.body.email });
    user.setPassword(req.body.password);

    try {
        await user.save();
        const token = user.generateJWT();
        return res.status(201).json({ token });
    } catch (err) {
        return res.status(400).json({ message: "Error creating user", error: err });
    }
};

const login = async (req, res) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email: req.body.email }).exec();
    if (!user || !user.validPassword(req.body.password)) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = user.generateJWT();
    return res.status(200).json({ token });
};

module.exports = { register, login };
