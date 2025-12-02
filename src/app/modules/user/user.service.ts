import { Request } from "express";
import { prisma } from "../../shared/prisma";
import bcrypt from "bcryptjs";
import { fileUploader } from "../../helper/fileUploader";
import config from "../../../config";
import { IOptions, paginationHelper } from "../../helper/paginationHelper";
import { Prisma } from "@prisma/client";
import { userSearchableFields } from "./user.constant";

const createUser = async (req: Request) => {
  if (req.file) {
    const uploadResult = await fileUploader.uploadToCloudinary(req.file);
    req.body.profilePhoto = uploadResult?.secure_url;
  }
  const saltRounds = Number(config.bcrypt.salt_rounds);
  const hashPassword = await bcrypt.hash(req.body.password, saltRounds);

  const result = await prisma.$transaction(async (tnx) => {
    const user = await tnx.user.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        password: hashPassword,
        profilePhoto: req.body.profilePhoto || null,
        address: req.body.address || null,
      },
    });
    return user;
  });

  return result;
};

const getAllUsers = async (params: any, options: IOptions) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andConditions: Prisma.UserWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: userSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.UserWhereInput =
    andConditions.length > 0
      ? {
          AND: andConditions,
        }
      : {};

  const result = await prisma.user.findMany({
    skip,
    take: limit,

    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.user.count({
    where: whereConditions,
  });
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const changePassword = async (req: Request) => {
  const email = (req as any).user?.email;

  if (!email) throw new Error("User not authenticated");

  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword)
    throw new Error("Old and new password required");

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("User not found");

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) throw new Error("Old password is incorrect");

  const saltRounds = Number(config.bcrypt.salt_rounds);
  const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

  const updatedUser = await prisma.user.update({
    where: { email },
    data: { password: hashedPassword, needPasswordChange: false },
  });

  const { password, ...safeUser } = updatedUser;
  return safeUser;
};

// UPDATE USER
const updateUserInfo = async (req: Request) => {
  const { id } = req.params;

  const allowedFields: Record<string, any> = {};

  if (req.body.name) allowedFields.name = req.body.name;
  if (req.body.address) allowedFields.address = req.body.address;

  if (req.file) {
    const uploadResult = await fileUploader.uploadToCloudinary(req.file);
    allowedFields.profilePhoto = uploadResult?.secure_url;
  }

  const result = await prisma.user.update({
    where: { id },
    data: allowedFields,
  });

  return result;
};

// BLOCK USER
const blockUser = async (req: Request) => {
  const { id } = req.params;

  const result = await prisma.user.update({
    where: { id },
    data: { isBlocked: true },
  });

  return result;
};

export const UserService = {
  createUser,
  getAllUsers,
  updateUserInfo,
  blockUser,
  changePassword,
};
