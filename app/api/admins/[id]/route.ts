import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Admin from "@/lib/models/Admin";
import { currentUser } from "@clerk/nextjs/server";

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await currentUser();
        const userEmail = user?.emailAddresses[0]?.emailAddress;

        if (userEmail !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        await connectDB();
        await Admin.findByIdAndDelete(id);

        return NextResponse.json({ message: "Admin removed" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to remove admin" }, { status: 500 });
    }
}
