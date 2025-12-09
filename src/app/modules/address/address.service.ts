import { prisma } from "../../shared/prisma";

export const AddressService = {
  createAddress: async (
    userId: string,
    street: string,
    city: string,
    country: string
  ) => {
    return prisma.address.create({
      data: { userId, street, city, country },
    });
  },

  getAddresses: async (userId: string) => {
    return prisma.address.findMany({
      where: { userId },
    });
  },

  updateAddress: async (
    addressId: string,
    userId: string,
    street?: string,
    city?: string,
    country?: string
  ) => {
    // Check Owner
    const address = await prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!address) {
      throw new Error("Address not found");
    }

    if (address.userId !== userId) {
      throw new Error("Unauthorized: You cannot edit this address");
    }

    return prisma.address.update({
      where: { id: addressId },
      data: { street, city, country },
    });
  },

  deleteAddress: async (addressId: string, userId: string) => {
    // Check if address exists
    const address = await prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!address) {
      throw new Error("Address not found");
    }

    // Owner check
    if (address.userId !== userId) {
      throw new Error("Unauthorized: You cannot delete this address");
    }

    return prisma.address.delete({
      where: { id: addressId },
    });
  },
};
