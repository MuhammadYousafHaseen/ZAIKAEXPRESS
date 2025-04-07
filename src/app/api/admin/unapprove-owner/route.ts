// /api/admin/approve-owner/route.ts
import dbConnect from "@/lib/dbConnect";
import Owner from "@/models/owner.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await dbConnect();

  const { ownerId } = await req.json();
  if (!ownerId) {
    return NextResponse.json({ message: 'Owner ID is required' }, { status: 400 });
  }

  try {
    const owner = await Owner.findById(ownerId);
    if (!owner || !owner.isApprovedOwner) {
      return NextResponse.json({ message: 'Owner not found or already unapproved' }, { status: 404 });
    }

    owner.isApprovedOwner = false;
    await owner.save();

    return NextResponse.json({ message: 'Owner Unapproved successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error Unapproving owner:', error);
    return NextResponse.json({ message: 'Error Unapproving owner' }, { status: 500 });
  }
}
