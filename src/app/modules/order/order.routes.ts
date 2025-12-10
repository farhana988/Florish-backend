import { Router } from "express";
import auth from "../../middlewares/auth";
import { OrderController } from "./order.controller";
import { UserRole } from "@prisma/client";

const router = Router();

// Create order
router.post("/create-order", auth(), OrderController.createOrder);

// List user's orders
router.get("/", auth(), OrderController.getUserOrders);

// Order details
router.get("/:orderId", auth(), OrderController.getOrderDetails);

// Payment
router.post("/confirm-payment", auth(), OrderController.confirmPayment);

// Update order status
router.patch(
  "/update-order-status/:orderId",
  auth(UserRole.ADMIN),
  OrderController.updateOrderStatus
);

// Cancel order
router.patch(
  "/cancel-order/:orderId",
  auth(UserRole.ADMIN),
  OrderController.cancelOrder
);
export const orderRoutes = router;
