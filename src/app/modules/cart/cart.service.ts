import { prisma } from "../../shared/prisma";
import { AddToCart, UpdateCartItem } from "./cart.interface";

// Get user's cart
const getCart = async (userId: string) => {
  // Get or create cart
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: { include: { plant: true } } },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: { items: { include: { plant: true } } },
    });
  }

  return cart;
};

// Add item to cart
const addToCart = async (userId: string, itemData: AddToCart) => {
  const cart = await getCart(userId);

  // Get the plant to check available stock
  const plant = await prisma.plant.findUnique({
    where: { id: itemData.plantId },
  });

  if (!plant) {
    throw new Error("Plant not found!");
  }

  const existingItem = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, plantId: itemData.plantId },
  });

  // Calculate new total quantity in cart
  const newQuantity = (existingItem?.quantity || 0) + itemData.quantity;

  if (newQuantity > plant.quantity) {
    throw new Error(
      `Cannot add ${itemData.quantity} items. Only ${
        plant.quantity - (existingItem?.quantity || 0)
      } left in stock.`
    );
  }

  if (existingItem) {
    // Increase quantity if item exists
    return prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + itemData.quantity },
      include: { plant: true },
    });
  }
  // Add new item
  return prisma.cartItem.create({
    data: {
      cartId: cart.id,
      plantId: itemData.plantId,
      quantity: itemData.quantity,
    },
    include: { plant: true },
  });
};

// Update cart item
const updateCartItem = async (itemData: UpdateCartItem) => {
  if (itemData.quantity <= 0) {
    throw new Error("Quantity must be at least 1.");
  }

  // Find the cart item
  const existingItem = await prisma.cartItem.findUnique({
    where: { id: itemData.itemId },
    include: { plant: true },
  });

  if (!existingItem) {
    throw new Error("Cart item not found!");
  }

  const plant = existingItem.plant;

  // Check available stock
  if (itemData.quantity > plant.quantity) {
    throw new Error(
      `Cannot set quantity to ${itemData.quantity}. Only ${plant.quantity} available in stock.`
    );
  }
  return prisma.cartItem.update({
    where: { id: itemData.itemId },
    data: { quantity: itemData.quantity },
    include: { plant: true },
  });
};

// Remove cart item
const removeCartItem = async (itemId: string) => {
  return prisma.cartItem.delete({
    where: { id: itemId },
  });
};

// Clear cart
const clearCart = async (userId: string) => {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) return;

  return prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
};

export const CartService = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
};
