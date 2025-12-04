import catchAsync from "../../shared/catchAsync";
import { Request, Response } from "express";
import sendResponse from "../../shared/sendResponse";
import { PlantService } from "./plant.service";

const createPlant = catchAsync(
  async (req: Request & { user?: { email: string } }, res: Response) => {
    const userEmail = req.user?.email;

    if (!userEmail) {
      return res.status(401).json({ message: "User not found in the token!" });
    }

    const result = await PlantService.createPlant(req.body, userEmail);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Plant created successfully!",
      data: result,
    });
  }
);

export const PlantController = {
  createPlant,
};
