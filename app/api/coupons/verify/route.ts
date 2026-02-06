import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Coupon from "@/lib/models/Coupon";

export async function POST(request: Request) {
    try {
        await connectDB();
        const { code, orderTotal } = await request.json();

        if (!code) {
            return NextResponse.json({ valid: false, message: "Coupon code is required" }, { status: 400 });
        }

        const coupon = await Coupon.findOne({ code, isActive: true });

        if (!coupon) {
            return NextResponse.json({ valid: false, message: "Invalid coupon code" }, { status: 404 });
        }

        if (orderTotal < coupon.minOrderAmount) {
            return NextResponse.json({
                valid: false,
                message: `Minimum order amount of ₹${coupon.minOrderAmount} required`
            }, { status: 400 });
        }

        let discountAmount = 0;
        if (coupon.discountType === 'PERCENTAGE') {
            discountAmount = (orderTotal * coupon.discountValue) / 100;
        } else {
            discountAmount = coupon.discountValue;
        }

        // Ensure discount doesn't exceed total
        discountAmount = Math.min(discountAmount, orderTotal);

        return NextResponse.json({
            valid: true,
            discountAmount,
            code: coupon.code,
            type: coupon.discountType,
            value: coupon.discountValue
        });

    } catch (error) {
        return NextResponse.json({ error: "Failed to verify coupon" }, { status: 500 });
    }
}
