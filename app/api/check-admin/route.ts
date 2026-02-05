import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Admin from "@/lib/models/Admin";
import { currentUser } from "@clerk/nextjs/server";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const user = await currentUser();
        if (!user) return NextResponse.json({ isAdmin: false });

        const email = user.emailAddresses[0]?.emailAddress;

        // Check super admin
        if (email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
            return NextResponse.json({ isAdmin: true, isSuperAdmin: true });
        }

        // Check regular admin
        await connectDB();
        const admin = await Admin.findOne({ email });

        return NextResponse.json({ isAdmin: !!admin, isSuperAdmin: false });
    } catch (error) {
        return NextResponse.json({ isAdmin: false, error: "Error checking admin status" });
    }
}
