import { OrderStatus, PaymentType } from "@prisma/client";
import config from "../../../config";
import { prisma } from "../../shared/prisma";

// const stripe = new Stripe(config.stripe.secret);

export const OrderService = {
  // Create order
  createOrder: async (
    userId: string,
    addressId: string,
    paymentType: PaymentType
  ) => {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { plant: true } } },
    });

    if (!cart || cart.items.length === 0) throw new Error("Cart is empty");

    const totalPrice = cart.items.reduce(
      (sum, item) => sum + Number(item.plant.price) * item.quantity,
      0
    );

    const order = await prisma.order.create({
      data: {
        userId,
        addressId,
        cartId: cart.id,
        totalPrice,
        paymentType,
        items: {
          create: cart.items.map((item) => ({
            plantId: item.plantId,
            quantity: item.quantity,
            price: Number(item.plant.price),
          })),
        },
      },
    });

    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return { order, cart };
  },

  // COD processing
  processCOD: async (orderId: string) => {
    return prisma.order.update({
      where: { id: orderId },
      data: {
        status: "PROCESSING",
        paymentStatus: "PENDING",
      },
    });
  },

  // Stripe payment
  // payWithStripe: async (order: any) => {
  //   const session = await stripe.checkout.sessions.create({
  //     payment_method_types: ["card"],
  //     mode: "payment",
  //     success_url: `${config.app.url}/payment/success?orderId=${order.id}`,
  //     cancel_url: `${config.app.url}/payment/fail?orderId=${order.id}`,
  //     line_items: order.items.map((item: any) => ({
  //       price_data: {
  //         currency: "usd",
  //         product_data: { name: item.plant.name },
  //         unit_amount: item.price * 100,
  //       },
  //       quantity: item.quantity,
  //     })),
  //   });

  //   return session.url;
  // },

  // Confirm payment success
  confirmPayment: async (orderId: string) => {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) throw new Error("Order not found");

    // Deduct stock
    for (const item of order.items) {
      await prisma.plant.update({
        where: { id: item.plantId },
        data: { quantity: { decrement: item.quantity } },
      });
    }

    // Clear cart
    if (order.cartId) {
      await prisma.cartItem.deleteMany({ where: { cartId: order.cartId } });
    }

    return prisma.order.update({
      where: { id: orderId },
      data: { status: "PROCESSING", paymentStatus: "PAID" },
    });
  },

  // Get orders for user
  getOrdersByUser: async (userId: string) => {
    return prisma.order.findMany({
      where: { userId },
      include: { items: { include: { plant: true } }, address: true },
      orderBy: { createdAt: "desc" },
    });
  },

  // Get order details
  getOrderById: async (orderId: string) => {
    return prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: { include: { plant: true } },
        address: true,
        user: true,
      },
    });
  },

  // Admin: Update order status
  updateOrderStatus: async (orderId: string, newStatus: OrderStatus) => {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new Error("Order not found");

    // Cannot update cancelled orders
    if (order.status === "CANCELLED") {
      throw new Error("Cannot update a cancelled order");
    }
    // Enforce correct sequence
    const statusSequence: OrderStatus[] = [
      "PENDING",
      "PROCESSING",
      "SHIPPED",
      "COMPLETED",
    ];
    const currentIndex = statusSequence.indexOf(order.status);
    const newIndex = statusSequence.indexOf(newStatus);

    if (newIndex === -1) throw new Error("Invalid status");
    if (newIndex !== currentIndex + 1) {
      throw new Error(
        `Cannot update status to ${
          statusSequence[currentIndex + 1]
        } before the current status ${order.status}`
      );
    }

    return prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus },
    });
  },
  // Admin: Cancel order (only if pending)
  cancelOrder: async (orderId: string) => {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new Error("Order not found");

    if (order.status !== "PENDING") {
      throw new Error("Only pending orders can be cancelled");
    }

    return prisma.order.update({
      where: { id: orderId },
      data: { status: "CANCELLED", paymentStatus: "CANCELLED" },
    });
  },
};
