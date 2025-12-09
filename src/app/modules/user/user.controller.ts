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

const changePassword = catchAsync(async (req, res) => {
  const result = await UserService.changePassword(req);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Password changed successfully!",
    data: result,
  });
});

// UPDATE USER
const updateUserInfo = catchAsync(async (req: Request, res: Response) => {
  // If the client sends a JSON string in `data`, parse it
  if (req.body.data) {
    const parsed = JSON.parse(req.body.data);
    req.body.name = parsed.name;
  }
  const result = await UserService.updateUserInfo(req);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User info updated successfully!",
    data: result,
  });
});

// BLOCK USER
const blockUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.blockUser(req);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User blocked successfully!",
    data: result,
  });
});

// MAKE ADMIN
const makeAdmin = catchAsync(async (req, res) => {
  const result = await UserService.makeAdmin(req.params.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User promoted to Admin successfully!",
    data: result,
  });
});

export const UserController = {
  createUser,
  getAllUsers,
  updateUserInfo,
  blockUser,
  changePassword,
  makeAdmin,
};
