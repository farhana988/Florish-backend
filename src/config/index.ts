import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

export default {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: requireEnv("DATABASE_URL"),
  bcrypt: {
    salt_rounds: requireEnv("BCRYPT_SALT_ROUNDS"),
  },
  cloudinary: {
    api_secret: requireEnv("CLOUDINARY_API_SECRET"),
    cloud_name: requireEnv("CLOUDINARY_CLOUD_NAME"),
    api_key: requireEnv("CLOUDINARY_API_KEY"),
  },
  jwt: {
    access_secret: requireEnv("JWT_ACCESS_SECRET"),
    refresh_secret: requireEnv("JWT_REFRESH_SECRET"),
    access_expires_in: requireEnv("JWT_ACCESS_EXPIRES_IN"),
    refresh_expires_in: requireEnv("JWT_REFRESH_EXPIRES_IN"),
  },
};
