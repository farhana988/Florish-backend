import express from "express";
import { PlantController } from "./plant.controller";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { createPlantSchema } from "./plant.validation";
import { UserRole } from "@prisma/client";
const router = express.Router();

router.post(
  "/create-plant",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(createPlantSchema),
  PlantController.createPlant
);
router.get("/", PlantController.getAllPlants);
export const plantRoutes = router;
