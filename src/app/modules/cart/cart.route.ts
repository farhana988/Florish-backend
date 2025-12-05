import express from "express";
import auth from "../../middlewares/auth";
import { CartController } from "./cart.controller";

const router = express.Router();
router.get("/", auth(), CartController.getCart);
router.post("/add-to-cart", auth(), CartController.addToCart);
router.patch("/update-cart/:itemId", auth(), CartController.updateCartItem);
router.delete(
  "/remove-cart-item/:itemId",
  auth(),
  CartController.removeCartItem
);
export const cartRoutes = router;
