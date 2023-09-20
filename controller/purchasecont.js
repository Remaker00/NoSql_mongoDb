const Razorpay = require('razorpay');
const Order = require('../models/orders'); // Assuming you have a Mongoose model for orders
require('dotenv').config();

exports.getpayment = async (req, res) => {
    try {
        var instance = new Razorpay({
            key_id: process.env.RZP_API_ID,
            key_secret: process.env.RZP_API_SEC
        });

        const amount = 1500;

        // Assuming you have a Mongoose User model and you're using req.user to access the logged-in user
        const user = req.user;

        instance.orders.create({ amount, currency: "INR" }, async (err, razorpayOrder) => {
            if (err) {
                console.error("Error creating Razorpay order:", err);
                return res.status(500).json({ error: "An error occurred while creating the order." });
            }

            const order = new Order({
                orderid: razorpayOrder.id,
                status: 'PENDING',
                user: {
                    name: user.name, // Assuming you have a 'name' property in your user model
                    userId: user._id, // Assuming 'req.user' has the user's MongoDB ID
                }
            });

            try {
                await order.save();
                return res.status(201).json({ order: razorpayOrder, key_id: instance.key_id });
            } catch (error) {
                console.error("Error saving order to the database:", error);
                return res.status(500).json({ error: "An error occurred while saving the order." });
            }
        });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ error: "An error occurred while creating the order." });
    }
};

exports.updatepayment = async (req, res) => {
    try {
        const { orderId } = req.body;

        // Assuming you have a Mongoose User model and you're using req.user to access the logged-in user
        const user = req.user;

        const order = await Order.findOne({ orderid: orderId });

        if (!order) {
            return res.status(404).json({ error: "Order not found." });
        }

        order.status = 'SUCCESSFUL';

        try {
            await order.save();
            
            // Update the user to indicate premium status
            await user.updateOne({ ispremiumuser: true });

            return res.status(202).json({ success: true, message: "Transaction Successful" });
        } catch (err) {
            console.error("Error updating order and user:", err);
            return res.status(500).json({ error: "An error occurred while updating the order and user." });
        }
    } catch (err) {
        console.error(err);
        res.status(403).json({ error: err, message: 'Something went wrong' });
    }
};
