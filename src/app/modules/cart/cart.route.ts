import express from "express";
import auth from "../../middlewares/auth";
import { CartController } from "./cart.controller";

const router = express.Router();

router.post("/add-to-cart", auth(), CartController.addToCart);

export const cartRoutes = router;
