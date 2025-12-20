import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { CouponService } from "./coupon.service";

const createCoupon = catchAsync(async (req: Request, res: Response) => {
  const {
    code,
    discountType,
    discountValue,
    minOrderValue,
    maxDiscount,
    expiryDate,
    isActive,
  } = req.body;

  const coupon = await CouponService.createCoupon({
    code,
    discountType,
    discountValue,
    minOrderValue,
    maxDiscount,
    expiryDate: new Date(expiryDate),
    isActive,
  });

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Coupon created successfully",
    data: coupon,
  });
});

export const CouponController = {
  createCoupon,
};
