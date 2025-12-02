import express, { NextFunction, Request, Response } from "express";
import { UserController } from "./user.controller";
import { UserValidation } from "./user.validation";
import { fileUploader } from "../../helper/fileUploader";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post(
  "/register",
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidation.createUserValidationSchema.parse(
      JSON.parse(req.body.data)
    );
    return UserController.createUser(req, res, next);
  }
);

router.get("/all-user", auth(UserRole.SUPER_ADMIN), UserController.getAllUsers);

router.patch(
  "/change-password",
  auth(), 
  UserController.changePassword
);

// UPDATE USER
router.patch(
  "/:id",
  auth(),
  fileUploader.upload.single("file"),
  UserController.updateUserInfo
);

// BLOCK USER 
router.patch(
  "/block/:id",
  auth(UserRole.SUPER_ADMIN),
  UserController.blockUser
);

// MAKE ADMIN 
router.patch(
  "/make-admin/:id",
  auth(UserRole.SUPER_ADMIN), 
  UserController.makeAdmin
);


export const userRoutes = router;
