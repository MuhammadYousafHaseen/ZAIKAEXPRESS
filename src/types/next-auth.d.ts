import 'next-auth';
import { DefaultSession } from 'next-auth';


declare module 'next-auth' {
    interface User{
        _id?:string;
        isVerified?:boolean;
        isAdmin:boolean;
        name?:string;
    }
    interface Session{
          user:{
            id?:string;
            isVerified?:boolean;
            isAdmin?:boolean;
            name?:string;
          } & DefaultSession['user']
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id?: string;
        isVerified?: boolean;
        name?: string;
        isAdmin: boolean;
        ownerId?:string;
    }
}