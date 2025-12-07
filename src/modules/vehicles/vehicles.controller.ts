import { Request, Response } from "express";
import { vehiclesService } from "./vehicles.service";

export const createVehicle = async (req: Request, res: Response) => {
  try {
    const data = await vehiclesService.create(req.body);
    return res.status(201).json({ success: true, message: "Vehicle created successfully", data });
  } catch (err: any) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

export const getAllVehicles = async (req: Request, res: Response) => {
  try {
    const data = await vehiclesService.getAll();
    if (data.length === 0) return res.status(200).json({ success: true, message: "No vehicles found", data: [] });
    return res.status(200).json({ success: true, message: "Vehicles retrieved successfully", data });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getVehicleById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.vehicleId);
    const data = await vehiclesService.getById(id);
    if (!data) return res.status(404).json({ success: false, message: "Vehicle not found" });
    return res.status(200).json({ success: true, message: "Vehicle retrieved successfully", data });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const updateVehicle = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.vehicleId);
    const data = await vehiclesService.update(id, req.body);
    return res.status(200).json({ success: true, message: "Vehicle updated successfully", data });
  } catch (err: any) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

export const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.vehicleId);
    await vehiclesService.remove(id);
    return res.status(200).json({ success: true, message: "Vehicle deleted successfully" });
  } catch (err: any) {
    return res.status(400).json({ success: false, message: err.message });
  }
};
