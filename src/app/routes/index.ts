import express from "express";
import { userRoutes } from "../modules/user/user.route";
import { authRoutes } from "../modules/auth/auth.routes";
import { plantRoutes } from "../modules/plant/plant.route";
import { cartRoutes } from "../modules/cart/cart.route";
import { orderRoutes } from "../modules/order/order.routes";
import { addressRoutes } from "../modules/address/address.route";
import { wishlistRoutes } from "../modules/wishlist/wishlist.routes";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/user",
    route: userRoutes,
  },
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/plant",
    route: plantRoutes,
  },
  {
    path: "/cart",
    route: cartRoutes,
  },
  {
    path: "/order",
    route: orderRoutes,
  },
  {
    path: "/address",
    route: addressRoutes,
  },
  {
    path: "/wishlist",
    route: wishlistRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
