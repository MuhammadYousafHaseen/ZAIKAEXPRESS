// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/user.model";
import dbConnect from "@/lib/dbConnect";
import bcrypt from 'bcryptjs';
import { AuthOptions } from "next-auth";


interface Credentials {
    identifier: string;
    password: string;
}



export const authOptions: AuthOptions = {

    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "email" },
                password: { label: "Password", type: "password", placeholder: "password" },
            },
            async authorize(credentials: Credentials | undefined): Promise<any> {
                //console.log(credentials);
                if (!credentials) return null;
                await dbConnect();
                try {
                    const email = credentials.identifier?.trim().toLowerCase();
                    // console.log(email)

                    const user = await User.findOne({ email: email });
                    //console.log(user)
                    if (!user) {
                        throw new Error("User not found with this email");
                    }
                    if (!user.isVerified) {
                        throw new Error("User not verified yet! Please verify your email first");
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
                    if (!isPasswordCorrect) {
                        throw new Error("Invalid password");
                    }
                    return user;
                } catch (error) {
                    console.log("Error in authorizing user", error);
                    throw new Error("Invalid Credentials" + error);
                }
            },
        }),
    ],
    //csrf: false, // Disable CSRF for testing (do NOT use in production)

    //callbacks
    callbacks: {
        async jwt({ token, user }) {

            if (user) {
                token.id = user._id?.toString();;
                token.name = user.name;
                token.email = user.email;
                token.isAdmin = user.isAdmin;
                token.isVerified = user.isVerified;


            }
            return token;
        },
        async session({ session }) {
            await dbConnect(); // ensure DB connection
            const userInDb = await User.findOne({ email: session.user.email });

            if (userInDb) {
                session.user.isAdmin = userInDb.isAdmin;
                session.user.isVerified = userInDb.isVerified;
                session.user.id = userInDb._id.toString();
                session.user.name = userInDb.name;
                session.user.email = userInDb.email;
            }
            return session;
        },
    },
    pages: {
        signIn: "/auth/login",
        error: "/auth/login",
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET,

}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
