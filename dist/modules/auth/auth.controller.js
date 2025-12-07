"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signin = exports.signup = void 0;
const auth_service_1 = require("./auth.service");
const signup = async (req, res) => {
    try {
        const data = await auth_service_1.authService.handleSignup(req.body);
        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            data,
        });
    }
    catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
};
exports.signup = signup;
const signin = async (req, res) => {
    try {
        const data = await auth_service_1.authService.handleSignin(req.body);
        return res.status(200).json({ success: true, message: "Login successful", data });
    }
    catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
};
exports.signin = signin;
