import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/lib/models/Order";
import Product from "@/lib/models/Product";
import Admin from "@/lib/models/Admin";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await connectDB();
        const order = await Order.findById(id);
        if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
        return NextResponse.json(order);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
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
        const { status } = body;

        const order = await Order.findById(id);
        if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

        // If marking as completed, reduce stock
        if (status === "completed" && order.status !== "completed") {
            for (const item of order.items) {
                await Product.findByIdAndUpdate(item.productId, {
                    $inc: { stock: -item.quantity }
                });
            }
        }

        order.status = status;
        await order.save();

        return NextResponse.json(order);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
    }
}
