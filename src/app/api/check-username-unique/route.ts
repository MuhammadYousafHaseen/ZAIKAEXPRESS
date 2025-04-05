import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";
import {z} from "zod";
import {nameValidation} from "@/schemas/signUpSchema";


const UsernameQuerySchema = z.object({
    name: nameValidation,
});

export async function GET(request: Request) {

    await dbConnect()

    try {
        const {searchParams} = new URL(request.url);
        const QueryParam = {
            username: searchParams.get("username"),
        }
        //validation with zode
        const result = UsernameQuerySchema.safeParse(QueryParam);
        console.log(result)
        if(!result.success){
            const nameErrors = result.error.format().name?._errors || [];
            return Response.json(
                {
                    success:false,
                    message: nameErrors?.length > 0 ? nameErrors.join(", "): "Invalid name query Paramaters",
                },
                {
                    status:400
                }
            )
        }

        const {name} = result.data;
        
        const existingVerifiedUser = await User.findOne({name, isVerified:true});
        if(existingVerifiedUser){
            return Response.json(
                {
                    success:false,
                    message:"name already exists"
                },
                {
                    status:400
                }
            )
        }

        return Response.json({
            success:true,
            message:"name is available"
        },
         {
        status:200
        }
      )


        
    } catch (error) {
        
        console.error("Error checking name",error)
        return Response.json(
            {
                success:false,
                message:"Error checking name"
            },
            {
                status:500
            }
        )
    }
}