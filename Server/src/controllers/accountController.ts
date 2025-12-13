import { Request, Response } from "express";
import { AccountService } from "../services/accountService";

export const AccountController = {
  
  async getAllStaff(req: Request, res: Response) {
    const result = await AccountService.getAllStaff();
    res.status(result.status).json(result);
  },

  async createStaffAccount(req: Request, res: Response) {
    const result = await AccountService.createStaffAccount(req.body);
    res.status(result.status).json(result);
  },

  // Cập nhật thông tin tài khoản (chỉ Admin)
  async updateAccount(req: Request, res: Response) {
    const id = Number(req.params.id);
    const result = await AccountService.updateAccount(id, req.body);
    res.status(result.status).json(result);
  },

  async deleteStaffAccount(req: Request, res: Response) {
    const id = Number(req.params.id);
    const result = await AccountService.deleteStaffAccount(id);
    res.status(result.status).json(result);
  },

  async getAccountById(req: Request, res: Response) {
    const id = Number(req.params.id);
    const result = await AccountService.getAccountById(id);
    res.status(result.status).json(result);
  }
};
