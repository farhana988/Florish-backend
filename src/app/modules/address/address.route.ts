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
router.delete(
  "/delete-address/:addressId",
  auth(),
  AddressController.deleteAddress
);

export const addressRoutes = router;
