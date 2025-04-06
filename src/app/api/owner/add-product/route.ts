import { NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/product.model";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// Ensure you have this configured
export async function POST(request: NextRequest) {
  await dbConnect();

  // Get the current session. We assume that for an owner, the session includes an ownerId.
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.ownerId) {
    return Response.json({ message: "Unauthorized or not an owner" }, { status: 401 });
  }

  try {
    // Parse the request body to obtain product details
    const { name, image, description, price, discount } = await request.json();

    // Validate required fields
    if (!name || !image || !description || price === undefined) {
      return Response.json({ message: "Missing required fields" }, { status: 400 });
    }

      
   

    // Create a new product document with the owner field set to the authenticated owner's ID
    const newProduct = await Product.create({
      name,
      image, // Use the URL from Cloudinary
      description,
      price,
      discount: discount || 0,
      owner: session.user.ownerId, // setting owner from session
    });

    return Response.json(
      { message: "Product added successfully", product: newProduct },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding product:", error);
    return Response.json(
      { message: "Error adding product" + error },
      { status: 500 }
    );
  }
}
