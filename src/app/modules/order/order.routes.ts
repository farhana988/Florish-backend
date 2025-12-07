import { Router } from "express";
import auth from "../../middlewares/auth";
import { OrderController } from "./order.controller";

const router = Router();

// Create order
router.post("/create-order", auth(), OrderController.createOrder);
// List user's orders
router.get("/", auth(), OrderController.getUserOrders);
// Order details
router.get("/:orderId", auth(), OrderController.getOrderDetails);
// Payment
router.post("/order-confirm", auth(), OrderController.confirmPayment);

export const orderRoutes = router;
