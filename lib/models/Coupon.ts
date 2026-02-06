import mongoose, { Schema, model, models } from 'mongoose';

const CouponSchema = new Schema({
    code: { type: String, required: true, unique: true },
    discountType: { type: String, enum: ['PERCENTAGE', 'FLAT'], required: true },
    discountValue: { type: Number, required: true },
    minOrderAmount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
});

const Coupon = models.Coupon || model('Coupon', CouponSchema);

export default Coupon;
