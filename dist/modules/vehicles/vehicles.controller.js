"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVehicle = exports.updateVehicle = exports.getVehicleById = exports.getAllVehicles = exports.createVehicle = void 0;
const vehicles_service_1 = require("./vehicles.service");
const createVehicle = async (req, res) => {
    try {
        const data = await vehicles_service_1.vehiclesService.create(req.body);
        return res.status(201).json({ success: true, message: "Vehicle created successfully", data });
    }
    catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
};
exports.createVehicle = createVehicle;
const getAllVehicles = async (req, res) => {
    try {
        const data = await vehicles_service_1.vehiclesService.getAll();
        if (data.length === 0)
            return res.status(200).json({ success: true, message: "No vehicles found", data: [] });
        return res.status(200).json({ success: true, message: "Vehicles retrieved successfully", data });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.getAllVehicles = getAllVehicles;
const getVehicleById = async (req, res) => {
    try {
        const id = Number(req.params.vehicleId);
        const data = await vehicles_service_1.vehiclesService.getById(id);
        if (!data)
            return res.status(404).json({ success: false, message: "Vehicle not found" });
        return res.status(200).json({ success: true, message: "Vehicle retrieved successfully", data });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.getVehicleById = getVehicleById;
const updateVehicle = async (req, res) => {
    try {
        const id = Number(req.params.vehicleId);
        const data = await vehicles_service_1.vehiclesService.update(id, req.body);
        return res.status(200).json({ success: true, message: "Vehicle updated successfully", data });
    }
    catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
};
exports.updateVehicle = updateVehicle;
const deleteVehicle = async (req, res) => {
    try {
        const id = Number(req.params.vehicleId);
        await vehicles_service_1.vehiclesService.remove(id);
        return res.status(200).json({ success: true, message: "Vehicle deleted successfully" });
    }
    catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
};
exports.deleteVehicle = deleteVehicle;
