// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/user.model";
import dbConnect from "@/lib/dbConnect";
import bcrypt from 'bcryptjs';
import { AuthOptions } from "next-auth";
import { IUser } from "@/models/user.model";
import Owner from "@/models/owner.model"

interface Credentials {
    email?: string;
    password: string;
    name?: string;
}



export const authOptions: AuthOptions = {
    providers:[
        CredentialsProvider({
            id:"credentials",
            name:"Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "email" },
                password: { label: "Password", type: "password", placeholder: "password" },
            },
            async authorize(credentials: Credentials | undefined): Promise<IUser | null> {
                if (!credentials) return null;
                await dbConnect();
                try {
                    const user = await User.findOne({ 
                      $or:  [ {email: credentials.email},{name: credentials.name}]
                     });
                     if(!user){
                        throw new Error("User not found with this email");
                     }
                     if(!user.isVerified){
                        throw new Error("User not verified yet! Please verify your email first");
                     }
    
                     const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
                     if(!isPasswordCorrect){
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

    //callbacks
    callbacks:{
        async jwt({token, user}){
            if(user){
                token.id = user._id?.toString();;
                token.name = user.name;
                token.email = user.email;
                token.isAdmin = user.isAdmin;
                const owner = await Owner.findOne({email: user.email});
                if(owner){
                    token.ownerId = owner._id?.toString();
                }

            }
            return token;
        },
        async session({session, token}){
            if(token){
                session.user.id = token.id?.toString();
                session.user.name = token.name;
                session.user.email = token.email;
                session.user.isAdmin = token.isAdmin;
                if(token.ownerId){
                    session.user.ownerId = token.ownerId;
                }
            }
            return session;
        },
    },
    pages:{
        signIn:"/auth/login",
        error:"/auth/login",
    },
    session:{
        strategy:"jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET,
    
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
