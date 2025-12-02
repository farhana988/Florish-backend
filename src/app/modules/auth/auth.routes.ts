import express from "express";
import { AuthController } from "./auth.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post("/login", AuthController.login);
router.get("/me", auth(), AuthController.getCurrentUser);
export const authRoutes = router;
