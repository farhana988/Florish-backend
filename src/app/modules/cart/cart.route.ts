import express from "express";
import auth from "../../middlewares/auth";
import { CartController } from "./cart.controller";

const router = express.Router();
router.get("/", auth(), CartController.getCart);
router.post("/add-to-cart", auth(), CartController.addToCart);

export const cartRoutes = router;
