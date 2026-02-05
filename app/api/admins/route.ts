import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Admin from "@/lib/models/Admin";
import { currentUser } from "@clerk/nextjs/server";

export async function GET() {
    try {
        const user = await currentUser();
        const userEmail = user?.emailAddresses[0]?.emailAddress;

        if (userEmail !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const admins = await Admin.find().sort({ createdAt: -1 });
        return NextResponse.json(admins);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch admins" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const user = await currentUser();
        const userEmail = user?.emailAddresses[0]?.emailAddress;

        if (userEmail !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        await connectDB();

        // Prevent adding super admin as regular admin
        if (email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
            return NextResponse.json({ error: "This email is already the Super Admin" }, { status: 400 });
        }

        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return NextResponse.json({ error: "Admin already exists" }, { status: 400 });
        }

        const newAdmin = await Admin.create({
            email,
            addedBy: userEmail,
        });

        return NextResponse.json(newAdmin, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to add admin" }, { status: 500 });
    }
}
