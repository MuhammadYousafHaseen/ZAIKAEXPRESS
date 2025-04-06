import dbConnect from "@/lib/dbConnect";
import Product from "@/models/product.model";
import { NextResponse } from "next/server";



export async function GET() {
    await dbConnect();

    try {
        const products = await Product.find({},"name image description price discount owner").sort({ createdAt: -1 }).populate("owner", "name email phone address city country state").lean();
        if(!products) {
            return NextResponse.json({ error: "No products found" }, { status: 404 });
        }
        return NextResponse.json({ products }, { status: 200 });
    } catch (error) {
        console.error("Error fetching videos:", error);
    return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 });
    }

}