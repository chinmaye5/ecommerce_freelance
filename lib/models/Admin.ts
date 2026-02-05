import mongoose, { Schema, model, models } from 'mongoose';

const AdminSchema = new Schema({
    email: { type: String, required: true, unique: true },
    addedBy: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const Admin = models.Admin || model('Admin', AdminSchema);

export default Admin;
