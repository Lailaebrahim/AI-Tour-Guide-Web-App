import User from "../models/User.js";
import { hash, compare } from 'bcrypt';
import { setCookie, removeCookie } from "../utils/token-manager.js";
export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json({ messages: "OK", users });
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
};
export const userSignUp = async (req, res, next) => {
    try {
        const { email, name, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(401).json({ message: "Email already registered !" });
        const hashedPassword = await hash(password, parseInt(process.env.SALT));
        const newUser = new User({ email, name, password: hashedPassword });
        await newUser.save();
        res = removeCookie(res);
        res = setCookie(res, newUser._id.toString(), newUser.email);
        res.status(201).json({ message: "User created successfully", id: newUser._id.toString(), name: newUser.name, email: newUser.email });
    }
    catch (error) {
        res.status(409).json({ message: error.message });
    }
};
export const userLogIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user)
            return res.status(401).json({ message: "Email not registered" });
        const isValid = await compare(password, user.password);
        if (!isValid)
            return res.status(401).json({ message: "Invalid password" });
        res = removeCookie(res);
        res = setCookie(res, user._id.toString(), user.email);
        res.status(200).json({ message: "Login successful", id: user._id.toString(), name: user.name, email: user.email });
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
};
export const userLogOut = async (req, res, next) => {
    try {
        res = removeCookie(res);
        res.status(200).json({ message: "Logout successful" });
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
};
export const verifyUser = async (req, res, next) => {
    try {
        const user = await User.findById(res.locals.JwtData.id);
        if (!user)
            return res.status(401).json({ message: "User not authorized" });
        res.status(200).json({ message: "User authorized", id: user._id.toString(), name: user.name, email: user.email });
    }
    catch (error) {
        res.status(401).json({ message: error.message });
    }
};
//# sourceMappingURL=users.controller.js.map