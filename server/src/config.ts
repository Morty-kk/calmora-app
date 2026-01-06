import dotenv from "dotenv";

dotenv.config();

export const PORT = parseInt(process.env.PORT || "4000", 10);
export const JWT_SECRET = process.env.JWT_SECRET;
export const DATABASE_URL = process.env.DATABASE_URL;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not set in environment variables");
}

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not set in environment variables");
}
