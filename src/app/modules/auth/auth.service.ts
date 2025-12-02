import { prisma } from "../../shared/prisma";
import bcrypt from "bcryptjs";
import { jwtHelper } from "../../helper/jwtHelper";
import config from "../../../config";

const login = async (payload: { email: string; password: string }) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
    },
  });

  const isCorrectPassword = await bcrypt.compare(
    payload.password,
    user.password
  );
  if (!isCorrectPassword) {
    throw new Error("Password is incorrect!");
  }

  const accessToken = jwtHelper.generateToken(
    { email: user.email, role: user.role },
    config.jwt.access_secret,
    config.jwt.access_expires_in
  );

  const refreshToken = jwtHelper.generateToken(
    { email: user.email, role: user.role },
    config.jwt.refresh_secret,
    config.jwt.refresh_expires_in
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: user.needPasswordChange,
  };
};

const getCurrentUser = async (email: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { email },
  });

  const { password, ...userWithoutPassword } = user;

  return userWithoutPassword;
};

export const AuthService = {
  login,
  getCurrentUser,
};
