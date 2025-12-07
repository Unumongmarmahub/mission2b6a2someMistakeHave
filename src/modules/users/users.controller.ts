import { Request, Response } from "express";
import { usersService } from "./users.service";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const data = await usersService.getAll();
    return res.status(200).json({ success: true, message: "Users retrieved successfully", data });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.userId);
    const data = await usersService.update(id, req.body, (req as any).user);
    return res.status(200).json({ success: true, message: "User updated successfully", data });
  } catch (err: any) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.userId);
    await usersService.remove(id);
    return res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (err: any) {
    return res.status(400).json({ success: false, message: err.message });
  }
};
