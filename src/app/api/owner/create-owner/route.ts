import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";
import Owner from "@/models/owner.model";




export async function POST(request: Request) {
    await dbConnect();

    try {
        // Parse the incoming JSON data
        const data = await request.json();
        //console.log(data);
        const { name, email, password, phone, address, image, productsCategory, requestForApproval } = data;
        //console.log(name,email,password,phone,address,image,productsCategory,requestForApproval);
        // Validate required fields
        if (!name || !email || !password || !phone || !address || !productsCategory || !requestForApproval) {
            return Response.json(
                {
                    success: false,
                    message: "Please fill all the fields"
                },
                {
                    status: 400
                }
            );
        }

        // Check if the user exists
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return Response.json(
                {
                    success: false,
                    message: "User does not exist. Please register as a user first"
                },
                {
                    status: 400
                }
            );
        }

        // Check if the owner already exists and is approved
        const existingVerifiedOwner = await Owner.findOne({ email, isApprovedOwner: true });
        if (existingVerifiedOwner) {
            return Response.json(
                {
                    success: false,
                    message: "Owner already exists"
                },
                {
                    status: 400
                }
            );
        }

        // Check if the owner exists but is not approved
        const existingOwnerByEmail = await Owner.findOne({ email });
        if (existingOwnerByEmail) {
            const message = existingOwnerByEmail.isApprovedOwner
                ? "Owner already exists"
                : "Owner already exists but not approved. Please contact admin for approval";
            return Response.json(
                {
                    success: false,
                    message: message
                },
                {
                    status: 400
                }
            );
        }

        // Create a new owner
        const hashedPassword = await bcrypt.hash(password, 10);
        const newOwner = await Owner.create({
            name,
            email,
            image,
            password: hashedPassword,
            phone,
            address,
            productsCategory,
            requestForApproval,
            isApprovedOwner: false
        });
        await newOwner.save();
        const ownerId = newOwner._id?.toString();
        return Response.json(
            {
                success: true,
                data: newOwner,
                ownerId,
                message: "Owner registered successfully. Please wait for admin approval"
            },
            {
                status: 200
            }
        );

    } catch (error) {
        console.error("Error in registering seller", error);
        return Response.json(
            {
                success: false,
                message: "Error registering Seller"
            },
            {
                status: 500
            }
        );
    }
}
