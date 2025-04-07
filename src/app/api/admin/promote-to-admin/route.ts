// /api/admin/promote-user/route.ts
import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await dbConnect();

  const { userId } = await req.json();
  if (!userId) {
    return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    user.isAdmin = true;
    await user.save();

    return NextResponse.json({ message: 'User promoted to admin' }, { status: 200 });
  } catch (error) {
    console.error('Error promoting user to admin:', error);
    return NextResponse.json({ message: 'Error promoting user to admin' }, { status: 500 });
  }
}
