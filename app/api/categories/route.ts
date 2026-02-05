import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Category from "@/lib/models/Category";
import Admin from "@/lib/models/Admin";
import { currentUser } from "@clerk/nextjs/server";

export async function GET() {
    try {
        await connectDB();
        const categories = await Category.find().sort({ name: 1 });
        return NextResponse.json(categories);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const user = await currentUser();
        const email = user?.emailAddresses[0]?.emailAddress;

        await connectDB();

        const isSuperAdmin = email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;
        let isRegularAdmin = false;

        if (!isSuperAdmin) {
            const admin = await Admin.findOne({ email });
            isRegularAdmin = !!admin;
        }

        if (!isSuperAdmin && !isRegularAdmin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const body = await request.json();
        const category = await Category.create(body);
        return NextResponse.json(category, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
    }
}
