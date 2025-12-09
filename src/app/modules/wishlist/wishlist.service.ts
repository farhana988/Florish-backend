import { prisma } from "../../shared/prisma";

// Get or create wishlist
const getWishlist = async (userId: string) => {
  let wishlist = await prisma.wishlist.findUnique({
    where: { userId },
    include: { items: { include: { plant: true } } },
  });

  if (!wishlist) {
    wishlist = await prisma.wishlist.create({
      data: { userId },
      include: { items: { include: { plant: true } } },
    });
  }

  return wishlist;
};

// Add to wishlist
const addToWishlist = async (userId: string, plantId: string) => {
  const wishlist = await getWishlist(userId);

  // Check if already exists
  const exists = await prisma.wishlistItem.findFirst({
    where: { wishlistId: wishlist.id, plantId },
  });

  if (exists) {
    throw new Error("Plant already exists in wishlist!");
  }

  return prisma.wishlistItem.create({
    data: {
      wishlistId: wishlist.id,
      plantId,
    },
    include: { plant: true },
  });
};

// Remove item
const removeWishlistItem = async (itemId: string) => {
  return prisma.wishlistItem.delete({
    where: { id: itemId },
  });
};

// Clear wishlist
const clearWishlist = async (userId: string) => {
  const wishlist = await prisma.wishlist.findUnique({ where: { userId } });

  if (!wishlist) return;

  return prisma.wishlistItem.deleteMany({
    where: { wishlistId: wishlist.id },
  });
};

export const WishlistService = {
  getWishlist,
  addToWishlist,
  removeWishlistItem,
  clearWishlist,
};
