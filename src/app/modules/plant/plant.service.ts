import { Request } from "express";
import { prisma } from "../../shared/prisma";

const createPlant = async (payload: any, userEmail: string) => {
  const createdPlant = await prisma.plant.create({
    data: {
      name: payload.name,
      category: payload.category,
      price: payload.price,
      rating: payload.rating,
      image: payload.image,
      badge: payload.badge,
      quantity: payload.quantity,
      description: payload.description,
      user: {
        connect: { email: userEmail },
      },
    },
  });

  return createdPlant;
};

export const PlantService = {
  createPlant,
};
