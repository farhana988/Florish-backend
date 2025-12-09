import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { WishlistService } from "./wishlist.service";

// Get user's wishlist
const getWishlist = catchAsync(
  async (req: Request & { user?: { id: string } }, res: Response) => {
    const userId = req.user!.id;

    const wishlist = await WishlistService.getWishlist(userId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Wishlist retrieved successfully!",
      data: wishlist,
    });
  }
);

// Add item to wishlist
const addToWishlist = catchAsync(
  async (req: Request & { user?: { id: string } }, res: Response) => {
    const userId = req.user!.id;
    const { plantId } = req.body;

    const item = await WishlistService.addToWishlist(userId, plantId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Added to wishlist successfully!",
      data: item,
    });
  }
);

// Remove wishlist item
const removeWishlistItem = catchAsync(async (req: Request, res: Response) => {
  const { itemId } = req.params;

  await WishlistService.removeWishlistItem(itemId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Wishlist item removed successfully!",
    data: null,
  });
});

// Clear wishlist
const clearWishlist = catchAsync(
  async (req: Request & { user?: { id: string } }, res: Response) => {
    const userId = req.user!.id;

    await WishlistService.clearWishlist(userId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Wishlist cleared successfully!",
      data: null,
    });
  }
);

export const WishlistController = {
  getWishlist,
  addToWishlist,
  removeWishlistItem,
  clearWishlist,
};
