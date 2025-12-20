import { prisma } from "../../shared/prisma";
import { DiscountType } from "@prisma/client";

export const CouponService = {
  createCoupon: async (data: {
    code: string;
    discountType: DiscountType;
    discountValue: number;
    minOrderValue?: number;
    maxDiscount?: number;
    expiryDate: Date;
    isActive?: boolean;
  }) => {
    // Check if coupon already exists
    const existing = await prisma.coupon.findUnique({
      where: { code: data.code },
    });
    if (existing) throw new Error("Coupon code already exists");

    const coupon = await prisma.coupon.create({
      data: {
        ...data,
        isActive: data.isActive ?? true,
      },
    });

    return coupon;
  },
};
