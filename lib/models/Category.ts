import mongoose, { Schema, model, models } from 'mongoose';

const CategorySchema = new Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String },
    createdAt: { type: Date, default: Date.now },
});

const Category = models.Category || model('Category', CategorySchema);

export default Category;
