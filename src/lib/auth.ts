import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const TOKEN_NAME = "admin_token";
const fallbackSecret = "insecure-demo-secret";
const secret = process.env.AUTH_SECRET || fallbackSecret;

export function signAdminToken(adminId: string) {
  return jwt.sign({ sub: adminId }, secret, { expiresIn: "7d" });
}

export function verifyAdminToken(token: string) {
  return jwt.verify(token, secret) as { sub: string; iat: number; exp: number };
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function setAuthCookie(token: string) {
  cookies().set(TOKEN_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function clearAuthCookie() {
  cookies().set(TOKEN_NAME, "", { path: "/", maxAge: 0 });
}

export function getAdminIdFromCookies() {
  const token = cookies().get(TOKEN_NAME)?.value;
  if (!token) return null;

  try {
    const payload = verifyAdminToken(token);
    return payload.sub;
  } catch (error) {
    console.warn("Invalid admin token", error);
    return null;
  }
}

export function requireAdminSession() {
  const adminId = getAdminIdFromCookies();
  if (!adminId) {
    throw new Error("Unauthorized");
  }
  return adminId;
}
