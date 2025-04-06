import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { name, code } = await request.json();
        console.log("Received Data:", { name, code });

        const decodedname = decodeURIComponent(name);
        console.log("Decoded Name:", decodedname);

        const user = await User.findOne({ name: decodedname });
        if (!user) {
            console.error("User not found in database.");
            return new Response("User not found", { status: 404 });
        }

        console.log("User Found:", user);

        // Check if code matches
        const isCodeValid = user.verifyCode === code;
        console.log("Is Code Valid:", isCodeValid);

        // Check if code is not expired
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();
        console.log("Is Code Not Expired:", isCodeNotExpired);

        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true;
            await user.save();
            console.log("User verification successful.");

            return Response.json({
                success: true,
                message: "User verified successfully"
            }, { status: 200 });

        } else if (!isCodeNotExpired) {
            console.warn("Verification code expired.");
            return Response.json({
                success: false,
                message: "Verification code expired"
            }, { status: 400 });
        } else {
            console.warn("Invalid verification code.");
            return Response.json({
                success: false,
                message: "Invalid verification code"
            }, { status: 400 });
        }

    } catch (error) {
        console.error("Error Verifying User:", error);
        return new Response("Error Verifying User", { status: 500 });
    }
}
