import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations/report";
import { checkRateLimit } from "@/lib/rate-limit";

const normalizeUrl = (value?: string) => value?.trim().replace(/\/+$/g, "");
const previewUrl = process.env.VERCEL_ENV === "preview" ? process.env.VERCEL_URL : undefined;
const hostUrl = previewUrl ? previewUrl : process.env.NEXTAUTH_URL;
const normalizedNextAuthUrl = normalizeUrl(hostUrl) ??
  (process.env.VERCEL_URL
    ? `https://${normalizeUrl(process.env.VERCEL_URL.replace(/^https?:\/\//, ""))}`
    : undefined);

if (normalizedNextAuthUrl) {
  process.env.NEXTAUTH_URL = normalizedNextAuthUrl;
}

if (!process.env.NEXTAUTH_URL) {
  console.warn("NEXTAUTH_URL is not configured. Authentication may fail in production or preview deployments.");
}
if (!process.env.NEXTAUTH_SECRET) {
  console.warn("NEXTAUTH_SECRET is not configured. NextAuth security may be broken.");
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 }, // 30 days
  pages: { signIn: "/login" },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        phone: { label: "Phone", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) {
          console.warn("NextAuth authorize validation failed", {
            credentials: { phone: credentials?.phone ?? null },
            errors: parsed.error.format(),
          });
          return null;
        }

        const { phone, password } = parsed.data;
        const normalizedPhone = phone.replace(/\D/g, "");
        const seedAdminName = process.env.SEED_ADMIN_NAME;
        const seedAdminPhone = process.env.SEED_ADMIN_PHONE?.replace(/\D/g, "");
        const seedAdminPassword = process.env.SEED_ADMIN_PASSWORD;

        const rateLimit = await checkRateLimit(`login:${normalizedPhone}`);
        if (!rateLimit.success) {
          throw new Error("Too many login attempts. Please try again later.");
        }

        let user = await prisma.user.findUnique({ where: { phone: normalizedPhone } });
        if (!user) {
          console.warn("NextAuth authorize: no user found", { normalizedPhone });
        }

        // Self-heal admin login when production DB was deployed before seeding.
        if (
          !user &&
          seedAdminName &&
          seedAdminPhone &&
          seedAdminPassword &&
          normalizedPhone === seedAdminPhone
        ) {
          const passwordHash = await bcrypt.hash(seedAdminPassword, 12);
          user = await prisma.user.create({
            data: {
              name: seedAdminName,
              phone: seedAdminPhone,
              passwordHash,
            },
          });
        }

        if (!user) return null;

        let isValid = await bcrypt.compare(password, user.passwordHash);

        // If admin exists with stale hash, repair it when seed admin password is used.
        if (
          !isValid &&
          seedAdminPhone &&
          seedAdminPassword &&
          normalizedPhone === seedAdminPhone &&
          password === seedAdminPassword
        ) {
          const passwordHash = await bcrypt.hash(seedAdminPassword, 12);
          user = await prisma.user.update({
            where: { id: user.id },
            data: { passwordHash },
          });
          isValid = true;
        }

        if (!isValid) return null;

        return { id: user.id, name: user.name, phone: user.phone };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
