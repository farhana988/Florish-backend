import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { CartService } from "./cart.service";
import sendResponse from "../../shared/sendResponse";

// Get user's cart
const getCart = catchAsync(
  async (req: Request & { user?: { id: string } }, res: Response) => {
    const userId = req.user!.id;
    const cart = await CartService.getCart(userId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Cart retrieved successfully!",
      data: cart,
    });
  }
);

// Add item to cart
const addToCart = catchAsync(
  async (req: Request & { user?: { id: string } }, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      return sendResponse(res, {
        statusCode: 401,
        success: false,
        message: "Unauthorized: User not found",
        data: null,
      });
    }

    const { plantId, quantity } = req.body;

    const item = await CartService.addToCart(userId, { plantId, quantity });

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Added to cart successfully!",
      data: item,
    });
  }
);

// Update cart item
const updateCartItem = catchAsync(async (req: Request, res: Response) => {
  const { itemId } = req.params;
  const { quantity } = req.body;

  const updated = await CartService.updateCartItem({ itemId, quantity });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Cart item updated successfully!",
    data: updated,
  });
});

// Remove cart item
const removeCartItem = catchAsync(async (req: Request, res: Response) => {
  const { itemId } = req.params;

  await CartService.removeCartItem(itemId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Cart item removed successfully!",
    data: null,
  });
});

export const CartController = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
};
