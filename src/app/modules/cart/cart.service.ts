import { prisma } from "../../shared/prisma";
import { AddToCart, UpdateCartItem } from "./cart.interface";

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

const updateCartItem = async (itemData: UpdateCartItem) => {
  return prisma.cartItem.update({
    where: { id: itemData.itemId },
    data: { quantity: itemData.quantity },
    include: { plant: true },
  });
};
export const CartService = {
  getCart,
  addToCart,
  updateCartItem,
};
