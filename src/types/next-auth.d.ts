
import type { DefaultSession } from "next-auth";
import type { AccountStatus, UserRole } from "./domain";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      roles: UserRole[];
      status: AccountStatus;
    } & DefaultSession["user"];
  }

  interface User {
    roles?: UserRole[];
    status?: AccountStatus;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
    roles?: UserRole[];
    status?: AccountStatus;
  }
}
