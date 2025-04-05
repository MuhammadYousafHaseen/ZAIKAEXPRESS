import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {

   await dbConnect()

   try {
     const {name,email,password,phone,address,city,country,state} = await request.json()
        if(!name || !email || !password || !phone || !address || !city){
            return Response.json(
                {
                    success:false,
                    message:"Please fill all the fields"
                },
                {
                    status:400
                }
            )
        }
     const existingVerifiedUser = await User.findOne({
        name,
        isVerified:true
     })

     if(existingVerifiedUser){
        return Response.json(
            {
                success:false,
                message:"User already exists"
            },
            {
                status:400
            }
        )
     }

     const existingUserByEmail = await User.findOne({email})
     const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()
     if(existingUserByEmail){
        if(existingUserByEmail.isVerified){
            return Response.json(
                {
                    success:false,
                    message:"User already exists"
                },
                {
                    status:400
                }
            )
        }else{
            const hashedPassword = await bcrypt.hash(password,10)
            existingUserByEmail.password = hashedPassword
            existingUserByEmail.verifyCode = verifyCode
            existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600 * 1000)
            await existingUserByEmail.save()
            
        }

     }else{
        const hashedPassword = await bcrypt.hash(password,10)
        const verifyCodeExpiry = new Date()
        verifyCodeExpiry.setHours(verifyCodeExpiry.getHours() + 1)
        
        const newUser = await User.create({
            name,
            email,
            password:hashedPassword,
            verifyCode,
            verifyCodeExpiry,
            isVerified:false,
            phone,
            address,
            city,
            country,
            state,
            isAdmin:false,
            

        })
        await newUser.save()

        

     }

    //send verification email
    const emailResponse = await sendVerificationEmail(email,verifyCode,name)

    if(!emailResponse.success){
        return Response.json(
            {
                success:false,
                message:emailResponse.message
            },
            {
                status:500
            }
        )
    }
    
    return Response.json(
        {
            success:true,
            message:"User registered successfully. Please verify your email"
        },
        {
            status:200
        }
    )

   } catch (error) {
    console.error("Error signing up",error);
    return Response.json(
        {
            success:false,
            message:"Error registering User"
        },
        {
            status:500
        }
    )
   }
}