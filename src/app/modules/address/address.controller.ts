import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { AddressService } from "./address.service";

const createAddress = catchAsync(async (req: any, res) => {
  const userId = req.user.id;
  const { street, city, country } = req.body;

  const address = await AddressService.createAddress(
    userId,
    street,
    city,
    country
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Address created successfully",
    data: address,
  });
});

const getAddresses = catchAsync(async (req: any, res) => {
  const addresses = await AddressService.getAddresses(req.user.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Addresses fetched",
    data: addresses,
  });
});

const updateAddress = catchAsync(async (req: any, res) => {
  const userId = req.user.id;
  const { addressId } = req.params;
  const { street, city, country } = req.body;

  const updated = await AddressService.updateAddress(
    addressId,
    userId,
    street,
    city,
    country
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Address updated successfully",
    data: updated,
  });
});

export const AddressController = {
  createAddress,
  getAddresses,
  updateAddress,
};
