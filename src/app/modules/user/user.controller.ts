import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { UserService } from "./user.service";
import sendResponse from "../../shared/sendResponse";
import pick from "../../helper/pick";
import { userFilterableFields } from "./user.constant";

const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createUser(req);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "User created successfully!",
    data: result,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, userFilterableFields);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

  const result = await UserService.getAllUsers(filters, options);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User retrieved successfully!",
    meta: result.meta,
    data: result.data,
  });
});
export const UserController = {
  createUser,
  getAllUsers,
};
