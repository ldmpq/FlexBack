import { Router } from "express";
import { AccountController } from "../controllers/accountController";

const router = Router();

router.get("/staff", AccountController.getAllStaff);
router.post("/", AccountController.createStaffAccount);

// ID routes
router.get("/detail/:id", AccountController.getAccountById);
router.put("/update/:id", AccountController.updateAccount);
router.delete("/delete/:id", AccountController.deleteStaffAccount);

export default router;
