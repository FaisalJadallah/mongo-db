const express     = require("express");
const Order       = require("../models/Order");
const User        = require("../models/User");
const { protect } = require("../middleware/authMiddleware");
const router      = express.Router();

// POST - Create Order
router.post("/create", protect, async (req, res) => {
    const { products } = req.body;

    if (!products || products.length === 0) {
        return res.status(400).json({ message: "Products are required" });
    }

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const order = new Order({
            user: user._id,
            products: products,
        });

        await order.save();
        res.status(201).json({ message: "Order created successfully", order });
    } catch (err) {
        console.error("Error creating order:", err);
        res.status(500).json({ message: "Error creating order" });
    }
});

// GET - Orders
router.get("/orders", protect, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id });
        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: "No orders found" });
        }
        res.json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching orders" });
    }
});

module.exports = router;
