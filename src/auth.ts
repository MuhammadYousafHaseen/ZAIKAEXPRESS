
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";

import { connectToDatabase } from "@/src/lib/db/connect";
import { loginSchema } from "@/src/schemas/auth.schema";
import User from "@/src/models/user.model";
import {
  USER_ROLES,
  ACCOUNT_STATUSES,
  type UserRole,
  type AccountStatus,
} from "@/src/types/domain";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7,
  },

  providers: [
    Credentials({
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        await connectToDatabase();

        const user = await User.findOne({
          email: parsed.data.email,
        })
          .select("+passwordHash")
          .exec();

        if (
          !user ||
          user.status !== "active" ||
          !user.passwordHash
        ) {
          return null;
        }

        const passwordMatches = await compare(
          parsed.data.password,
          user.passwordHash
        );

        if (!passwordMatches) {
          return null;
        }

        // Return only plain JavaScript values to Auth.js.
        // Do not pass Mongoose documents or Mongoose arrays into the JWT.
        return {
          id: String(user._id),
          name: user.name ? String(user.name) : null,
          email: user.email ? String(user.email) : null,
          roles: Array.from(user.roles ?? [], (role): UserRole => role),
          status: user.status as AccountStatus,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = String(user.id);

        token.roles = Array.isArray(user.roles)
          ? Array.from(user.roles, (role): UserRole => role)
          : [];

        if (user.status) {
          token.status = user.status as AccountStatus;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        const userId =
          typeof token.userId === "string"
            ? token.userId
            : typeof token.sub === "string"
              ? token.sub
              : "";

        const validRoles: UserRole[] = Array.isArray(token.roles)
          ? token.roles.filter(
            (role): role is UserRole =>
              typeof role === "string" &&
              USER_ROLES.includes(role as UserRole)
          )
          : [];

        const validStatus: AccountStatus =
          typeof token.status === "string" &&
            ACCOUNT_STATUSES.includes(token.status as AccountStatus)
            ? (token.status as AccountStatus)
            : "active";

        session.user.id = userId;
        session.user.roles =
          validRoles.length > 0 ? validRoles : ["customer"];
        session.user.status = validStatus;
      }

      return session;
    },
  },
});
