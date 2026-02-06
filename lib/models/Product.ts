import mongoose, { Schema, model, models } from 'mongoose';

const ProductSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    discountedPrice: { type: Number },
    imageUrl: { type: String, required: true },
    category: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
    unit: { type: String, required: true },
    hasVariants: { type: Boolean, default: false },
    variants: [{
        name: { type: String, required: true }, // e.g. "1kg", "500g"
        price: { type: Number, required: true },
        discountedPrice: { type: Number },
        stock: { type: Number, required: true, default: 0 },
    }],
    createdAt: { type: Date, default: Date.now },
});

const Product = models.Product || model('Product', ProductSchema);

export default Product;
