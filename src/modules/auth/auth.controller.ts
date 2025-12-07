import { Request, Response } from "express";
import { authService } from "./auth.service";

export const signup = async (req: Request, res: Response) => {
  try {
    const data = await authService.handleSignup(req.body);
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data,
    });
  } catch (err: any) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

export const signin = async (req: Request, res: Response) => {
  try {
    const data = await authService.handleSignin(req.body);
    return res.status(200).json({ success: true, message: "Login successful", data });
  } catch (err: any) {
    return res.status(400).json({ success: false, message: err.message });
  }
};
