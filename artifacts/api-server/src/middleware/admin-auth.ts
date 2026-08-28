import { createHmac, timingSafeEqual } from "node:crypto";
import type { NextFunction, Request, Response } from "express";

const tokenLifetimeSeconds = 60 * 60 * 12;

function requiredEnv(name: "ADMIN_PASSWORD" | "SESSION_SECRET"): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} environment variable is required`);
  return value;
}

function signature(payload: string): string {
  return createHmac("sha256", requiredEnv("SESSION_SECRET"))
    .update(payload)
    .digest("base64url");
}

export function createAdminToken(): string {
  const payload = Buffer.from(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + tokenLifetimeSeconds }))
    .toString("base64url");
  return `${payload}.${signature(payload)}`;
}

export function isAdminPassword(value: unknown): boolean {
  if (typeof value !== "string") return false;
  const expected = Buffer.from(requiredEnv("ADMIN_PASSWORD"));
  const actual = Buffer.from(value);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

function isValidToken(token: string): boolean {
  const [payload, suppliedSignature] = token.split(".");
  if (!payload || !suppliedSignature) return false;
  const expected = Buffer.from(signature(payload));
  const actual = Buffer.from(suppliedSignature);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { exp?: number };
    return typeof data.exp === "number" && data.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const authorization = req.headers.authorization;
  const token = authorization?.startsWith("Bearer ") ? authorization.slice(7) : "";
  if (!token || !isValidToken(token)) {
    res.status(401).json({ error: "Admin authentication required" });
    return;
  }
  next();
}
