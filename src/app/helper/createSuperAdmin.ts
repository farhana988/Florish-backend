import bcrypt from "bcryptjs";
import { prisma } from "../shared/prisma";
import config from "../../config";
import { UserRole } from "@prisma/client";

async function createSuperAdminIfNotExists() {
  const existingSuperAdmin = await prisma.user.findFirst({
    where: {
      role: "SUPER_ADMIN",
    },
  });

  if (!existingSuperAdmin) {
    const superAdminEmail = config.super_admin.superAdminEmail;
    const superAdminPassword = config.super_admin.superAdminPassword;
    const superAdminName = config.super_admin.superAdminName;
    const superAdminRole = UserRole.SUPER_ADMIN;

    if (!superAdminEmail || !superAdminPassword || !superAdminName) {
      throw new Error(
        "Missing super admin credentials in environment variables."
      );
    }

    const saltRounds = Number(config.bcrypt.salt_rounds);
    const hashPassword = await bcrypt.hash(superAdminPassword, saltRounds);

    await prisma.user.create({
      data: {
        name: superAdminName,
        email: superAdminEmail,
        password: hashPassword,
        role: superAdminRole,
      },
    });

    console.log("Super Admin user created successfully!");
  } else {
    console.log("Super Admin already exists.");
  }
}

export { createSuperAdminIfNotExists };
