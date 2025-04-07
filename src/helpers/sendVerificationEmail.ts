import {resend} from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponse";
import VerificationEmail from "../../emails/verificationEmail";

export async function sendVerificationEmail(email: string, username: string,  verifyCode: string): Promise<ApiResponse> {
     try {
        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "YourMessage | Verify your account",
            react: VerificationEmail({username:verifyCode,otp:username}),
        });
        //console.log("Email:", email, "Username:", username, "Verification Code:", verifyCode);


        return {
            success:true,
            message:"Verification email sent",
        }
     } catch (emailError) {
        console.error("Error sending verification email",emailError);
        return {
            success:false,
            message:"Error sending verification email",
        };
     }
}
