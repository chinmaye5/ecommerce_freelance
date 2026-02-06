import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic';
import connectDB from "@/lib/db";
import Order from "@/lib/models/Order";
import Product from "@/lib/models/Product";
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

        // Stock Check & Deduction
        for (const item of body.items) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return NextResponse.json({ error: `Product ${item.name} not found` }, { status: 404 });
            }

            if (item.variant) {
                const variant = product.variants.find((v: any) => v.name === item.variant);
                if (!variant) {
                    return NextResponse.json({ error: `Variant ${item.variant} not found for ${item.name}` }, { status: 404 });
                }
                if (variant.stock < item.quantity) {
                    return NextResponse.json(
                        { error: `Insufficient stock for ${item.name} (${item.variant}). Available: ${variant.stock}` },
                        { status: 400 }
                    );
                }
                // Deduct stock
                variant.stock -= item.quantity;
                // Also update main stock count for cache/display
                product.stock -= item.quantity;
            } else {
                if (product.stock < item.quantity) {
                    return NextResponse.json(
                        { error: `Insufficient stock for ${item.name}. Available: ${product.stock}` },
                        { status: 400 }
                    );
                }
                product.stock -= item.quantity;
            }
            await product.save();
        }

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
