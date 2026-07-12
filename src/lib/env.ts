import "server-only";

// Centralised, validated access to environment configuration.
// Throws loudly on misconfiguration in production so problems surface at boot
// rather than as confusing runtime errors later.

const isProd = process.env.NODE_ENV === "production";

const DEV_DEFAULT_SECRET =
  "dev-only-secret-change-me-to-a-long-random-string-0123456789";

function required(name: string): string {
  const value = process.env[name];
  if (!value || value.trim().length === 0) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getJwtSecret(): string {
  const secret = required("JWT_SECRET");
  if (secret.length < 32) {
    throw new Error("JWT_SECRET must be at least 32 characters long.");
  }
  if (isProd && secret === DEV_DEFAULT_SECRET) {
    throw new Error(
      "JWT_SECRET is still the development default. Set a strong, unique secret in production."
    );
  }
  return secret;
}

export const env = {
  isProd,
  // Lazy getters: validation runs only when a value is actually read at
  // runtime, not on import. This keeps `next build` from failing while
  // collecting pages that never touch the database or auth.
  get databaseUrl() {
    return required("DATABASE_URL");
  },
  get jwtSecret() {
    return getJwtSecret();
  },
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000",
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || "",
    keySecret: process.env.RAZORPAY_KEY_SECRET || "",
    publicKeyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
    get configured() {
      return Boolean(this.keyId && this.keySecret);
    },
  },
};

export function isRazorpayConfigured(): boolean {
  return Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
}
