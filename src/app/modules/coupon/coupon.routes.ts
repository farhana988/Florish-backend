import express from "express";
import auth from "../../middlewares/auth";
import { CouponController } from "./coupon.controller";
import { UserRole } from "@prisma/client";

const router = express.Router();
router.post(
  "/create-coupon",
  auth(UserRole.ADMIN),
  CouponController.createCoupon
);
router.get("/all-coupons", CouponController.getAllCoupons);
export const couponRoutes = router;
