import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { AuthService } from "./auth.service";

const login = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.login(req.body);
  const { accessToken, refreshToken, needPasswordChange } = result;

  res.cookie("accessToken", accessToken, {
    secure: true,
    httpOnly: true,
    sameSite: "none",
    maxAge: 1000 * 60 * 60,
  });
  res.cookie("refreshToken", refreshToken, {
    secure: true,
    httpOnly: true,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24 * 90,
  });

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "User logged In successfully!",
    data: {
      needPasswordChange,
    },
  });
});

const getCurrentUser = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const userEmail = req.user?.email;

    if (!userEmail) {
      return res.status(400).json({
        message: "User not found in the token!",
      });
    }

    const user = await AuthService.getCurrentUser(userEmail);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User information retrieved successfully!",
      data: user,
    });
  }
);

export const AuthController = {
  login,
  getCurrentUser,
};
