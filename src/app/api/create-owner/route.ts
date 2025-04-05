import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";
import Owner from "@/models/owner.model";



export async function POST(request: Request) {
    await dbConnect();

    try {

        const { name, email, password, phone, address, productsCategory, requestForApproval } = await request.json();
        if (!name || !email || !password || !phone || !address || !productsCategory || !requestForApproval) {
            return Response.json(
                {
                    success: false,
                    message: "Please fill all the fields"
                },
                {
                    status: 400
                }
            )
        }
        // owner should also be a user
        const existingUser = await User.findOne({
            email
        })
        if (!existingUser) {
            return Response.json(
                {
                    success: false,
                    message: "User does not exist. Please register as a user first"
                },
                {
                    status: 400
                }
            )
        }
        // Check if the owner already exists with the same name and is approved

        const existingVerifiedOwner = await Owner.findOne({
            email, isApprovedOwner: true
        })
        if (existingVerifiedOwner) {
            return Response.json(
                {
                    success: false,
                    message: "Owner already exists"
                },
                {
                    status: 400
                }
            )
        }

        const existingOwnerByEmail = await Owner.findOne({ email: email });
        if (existingOwnerByEmail) {
            if (existingOwnerByEmail.isApprovedOwner) {
                return Response.json(
                    {
                        success: false,
                        message: "Owner already exists"
                    },
                    {
                        status: 400
                    }
                )
            } else {
                return Response.json(
                    {
                        success: false,
                        message: "Owner already exists but not approved. Please contact admin for approval"
                    },
                    {
                        status: 400
                    }
                )
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newOwner = await Owner.create({
                name,
                email,
                password: hashedPassword,
                phone,
                address,
                productsCategory,
                requestForApproval,
                isApprovedOwner: false
            })
            await newOwner.save();
            return Response.json({ success: true, message: "Owner registered successfully. Please wait for admin approval", newOwner }, { status: 200 })
        }


    } catch (error) {
        console.error("Error in registerin seller", error);
        return Response.json(
            {
                success: false,
                message: "Error registering Seller"
            },
            {
                status: 500
            }
        )
    }
}