import { Router } from "express";
import auth from "../../middlewares/auth";
import { AddressController } from "./address.controller";

const router = Router();

router.post("/add-address", auth(), AddressController.createAddress);
router.get("/", auth(), AddressController.getAddresses);
router.patch(
  "/update-address/:addressId",
  auth(),
  AddressController.updateAddress
);

export const addressRoutes = router;
