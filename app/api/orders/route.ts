import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic';
import connectDB from "@/lib/db";
import Order from "@/lib/models/Order";
import Admin from "@/lib/models/Admin";
import { currentUser } from "@clerk/nextjs/server";

export async function GET() {
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
        const orders = await Order.find().sort({ createdAt: -1 });
        return NextResponse.json(orders);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const user = await currentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const body = await request.json();

        const order = await Order.create({
            ...body,
            userId: user.id,
            customerEmail: user.emailAddresses[0].emailAddress,
            status: "pending",
            createdAt: new Date(),
        });

        return NextResponse.json(order, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }
}
