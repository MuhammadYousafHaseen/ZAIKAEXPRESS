// app/api/location/update/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";

export async function POST(request: NextRequest) {
  await dbConnect();
  //const body = await req.json();
  const { userId, location } = await request.json();
  console.log(userId,location);

  if (!userId || !location) {
    console.log("missing Location Data")
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  try {
    await User.findByIdAndUpdate(userId, {
      $set: { "liveLocation.lat": location.lat, "liveLocation.lng": location.lng },
    });
    return NextResponse.json({ message: "Location updated" });
  } catch (err) {
    console.error("Error updating location",err);
    return NextResponse.json({ error: "Failed to update location" }, { status: 500 });
  }
}
