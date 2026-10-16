
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

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          roles: user.roles,
          status: user.status,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;

        if (user.roles) {
          token.roles = user.roles;
        }

        if (user.status) {
          token.status = user.status;
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
