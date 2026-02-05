import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Category from "@/lib/models/Category";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(request: Request) {
    try {
        const user = await currentUser();
        const isAdmin = user?.emailAddresses.some(
            (email) => email.emailAddress === process.env.NEXT_PUBLIC_ADMIN_EMAIL
        );

        if (!isAdmin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const defaultCategories = [
            { name: "Fruits & Vegetables", description: "Fresh farm produce" },
            { name: "Dairy & Bakery", description: "Milk, bread, eggs and more" },
            { name: "Atta, Rice & Dal", description: "Daily essentials and grains" },
            { name: "Snacks & Munchies", description: "Chips, biscuits and tea-time snacks" },
            { name: "Cleaning & Household", description: "Detergents and cleaning supplies" },
            { name: "Beauty & Grooming", description: "Personal care products" },
            { name: "Beverages", description: "Cold drinks, juices and energy drinks" },
        ];

        for (const cat of defaultCategories) {
            await Category.updateOne(
                { name: cat.name },
                { $setOnInsert: cat },
                { upsert: true }
            );
        }

        return NextResponse.json({ message: "Default categories seeded successfully" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to seed categories" }, { status: 500 });
    }
}
