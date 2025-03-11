const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
});

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    products: [productSchema],
    totalAmount: {
        type: Number,
        required: true,
        default: 0,
    },
    orderStatus: {
        type: String,
        enum: ["pending", "shipped", "delivered", "cancelled"],
        default: "pending",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Calculate - Total Amount
orderSchema.pre("save", function (next) {
    this.totalAmount = this.products.reduce(
        (total, product) => total + product.price * product.quantity,
        0
    );
    next();
});

module.exports = mongoose.model("Order", orderSchema);
