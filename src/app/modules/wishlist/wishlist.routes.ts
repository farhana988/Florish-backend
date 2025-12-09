import express from "express";
import auth from "../../middlewares/auth";
import { WishlistController } from "./wishlist.controller";

const router = express.Router();

router.get("/", auth(), WishlistController.getWishlist);
router.post("/add-wishlist", auth(), WishlistController.addToWishlist);
router.delete(
  "/remove-wishlist-item/:itemId",
  auth(),
  WishlistController.removeWishlistItem
);
router.delete("/clear-wishlist", auth(), WishlistController.clearWishlist);

export const wishlistRoutes = router;
