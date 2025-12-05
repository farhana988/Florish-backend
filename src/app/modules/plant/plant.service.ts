import { Request } from "express";
import { prisma } from "../../shared/prisma";
import { IPlant } from "./plant.interface";

const createPlant = async (payload: IPlant, userEmail: string) => {
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

// Get all plants
const getAllPlants = async () => {
  const plants = await prisma.plant.findMany({
    orderBy: { createdAt: "desc" },
  });
  return plants;
};

// Update plant by id
const updatePlant = async (id: string, payload: any) => {
  const updatedPlant = await prisma.plant.update({
    where: { id },
    data: payload,
  });
  return updatedPlant;
};
// Delete plant by id
const deletePlant = async (id: string) => {
  const deletedPlant = await prisma.plant.delete({
    where: { id },
  });
  return deletedPlant;
};
export const PlantService = {
  createPlant,
  getAllPlants,
  updatePlant,
  deletePlant,
};
