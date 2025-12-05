import express from "express";
import { PlantController } from "./plant.controller";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { createPlantSchema, updatePlantSchema } from "./plant.validation";
import { UserRole } from "@prisma/client";
const router = express.Router();

router.post(
  "/create-plant",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(createPlantSchema),
  PlantController.createPlant
);
router.get("/", PlantController.getAllPlants);
// Update Plant
router.patch(
  "/update-plant/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(updatePlantSchema),
  PlantController.updatePlant
);
export const plantRoutes = router;
