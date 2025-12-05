import express from "express";
import { userRoutes } from "../modules/user/user.route";
import { authRoutes } from "../modules/auth/auth.routes";
import { plantRoutes } from "../modules/plant/plant.route";
import { cartRoutes } from "../modules/cart/cart.route";

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
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
