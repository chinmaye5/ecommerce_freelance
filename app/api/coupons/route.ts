import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic';
import connectDB from "@/lib/db";
import Coupon from "@/lib/models/Coupon";
import Admin from "@/lib/models/Admin";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(request: Request) {
    try {
        await connectDB();
        const coupons = await Coupon.find().sort({ createdAt: -1 });
        return NextResponse.json(coupons);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch coupons" }, { status: 500 });
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

        // Check for existing coupon
        const existingCode = await Coupon.findOne({ code: body.code });
        if (existingCode) {
            return NextResponse.json({ error: "Coupon code already exists" }, { status: 400 });
        }

        const coupon = await Coupon.create(body);
        return NextResponse.json(coupon, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create coupon" }, { status: 500 });
    }
}
