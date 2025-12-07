"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getAllUsers = void 0;
const users_service_1 = require("./users.service");
const getAllUsers = async (req, res) => {
    try {
        const data = await users_service_1.usersService.getAll();
        return res.status(200).json({ success: true, message: "Users retrieved successfully", data });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.getAllUsers = getAllUsers;
const updateUser = async (req, res) => {
    try {
        const id = Number(req.params.userId);
        const data = await users_service_1.usersService.update(id, req.body, req.user);
        return res.status(200).json({ success: true, message: "User updated successfully", data });
    }
    catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    try {
        const id = Number(req.params.userId);
        await users_service_1.usersService.remove(id);
        return res.status(200).json({ success: true, message: "User deleted successfully" });
    }
    catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
};
exports.deleteUser = deleteUser;
