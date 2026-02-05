import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Category from "@/lib/models/Category";
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
        const category = await Category.findById(id);
        if (!category) return NextResponse.json({ error: "Category not found" }, { status: 404 });
        return NextResponse.json(category);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch category" }, { status: 500 });
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

        // Check if name changed and update products accordingly
        const existingCategory = await Category.findById(id);
        if (!existingCategory) {
            return NextResponse.json({ error: "Category not found" }, { status: 404 });
        }

        if (body.name && body.name !== existingCategory.name) {
            await Product.updateMany(
                { category: existingCategory.name },
                { category: body.name }
            );
        }

        const category = await Category.findByIdAndUpdate(id, body, { new: true });
        return NextResponse.json(category);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
    }
}

export async function DELETE(
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
        await Category.findByIdAndDelete(id);
        return NextResponse.json({ message: "Category deleted" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
    }
}
