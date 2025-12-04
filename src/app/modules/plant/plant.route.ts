import express from "express";
import { PlantController } from "./plant.controller";
import auth from "../../middlewares/auth";
const router = express.Router();

router.post("/create-plant", auth(), PlantController.createPlant);

export const plantRoutes = router;
