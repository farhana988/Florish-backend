import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { OrderService } from "./order.service";

const createOrder = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const userId = req.user.id;
    const { addressId, paymentType } = req.body;

    const { order } = await OrderService.createOrder(
      userId,
      addressId,
      paymentType
    );

    let paymentURL = null;

    if (paymentType === "COD") {
      await OrderService.processCOD(order.id);
    } else if (paymentType === "STRIPE") {
      // paymentURL = await OrderService.payWithStripe(order);
    }

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Order created successfully!",
      data: { orderId: order.id, paymentURL },
    });
  }
);

const confirmPayment = catchAsync(async (req: Request, res: Response) => {
  const { orderId } = req.query;
  const result = await OrderService.confirmPayment(orderId as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment confirmed and order processed!",
    data: result,
  });
});

const getUserOrders = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const orders = await OrderService.getOrdersByUser(req.user.id);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Orders retrieved",
      data: orders,
    });
  }
);

const getOrderDetails = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const { orderId } = req.params;
    const order = await OrderService.getOrderById(orderId);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Order details",
      data: order,
    });
  }
);
// Admin: List all orders
const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  const orders = await OrderService.getAllOrders();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All orders retrieved",
    data: orders,
  });
});
const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const order = await OrderService.updateOrderStatus(orderId, status);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Order status updated",
    data: order,
  });
});

const cancelOrder = catchAsync(async (req: Request, res: Response) => {
  const { orderId } = req.params;

  const order = await OrderService.cancelOrder(orderId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Order cancelled successfully",
    data: order,
  });
});

export const OrderController = {
  createOrder,
  confirmPayment,
  getUserOrders,
  getOrderDetails,
  updateOrderStatus,
  cancelOrder,
  getAllOrders,
};
