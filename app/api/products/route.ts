import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic';
import connectDB from "@/lib/db";
import Product from "@/lib/models/Product";
import Admin from "@/lib/models/Admin";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(request: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const category = searchParams.get("category");
        const search = searchParams.get("search");

        let query: any = {};
        if (category) query.category = category;
        if (search) {
            query.name = { $regex: search, $options: "i" };
        }

        const products = await Product.find(query).sort({ createdAt: -1 });
        return NextResponse.json(products);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
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
        const product = await Product.create(body);
        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
    }
}
