import mongoose, { Schema, model, models } from 'mongoose';

const OrderItemSchema = new Schema({
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
});

const OrderSchema = new Schema({
    userId: { type: String, required: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, required: true },
    items: [OrderItemSchema],
    totalAmount: { type: Number, required: true },
    status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'cancelled'],
        default: 'pending'
    },
    deliveryAddress: { type: String, required: true },
    deliveryOption: { type: String, enum: ['delivery', 'pickup'], default: 'delivery' },
    createdAt: { type: Date, default: Date.now },
});

const Order = models.Order || model('Order', OrderSchema);

export default Order;
