const { Schema, model } = require("mongoose");

const customerSchema = new Schema({
	name: String,
	email: String,
	password: String,
	mobileNumber: Number,
	address: String,
});

const foodItemSchema = new Schema({
	type: String,
	name: String,
	price: Number,
});

const cartSchema = new Schema({
	foodItems: [{foodItemId: {type: Schema.Types.ObjectId, ref: 'FoodItem'}, quantity: Number}],
	customerId: {type: Schema.Types.ObjectId, ref: 'Customer'},
	locked: Boolean,
});

const orderSchema = new Schema({
	deliveryAddress: String,
	paymentDone: Boolean,
	totalPrice: Number,
	cartId: {type: Schema.Types.ObjectId, ref: 'Cart'},
	customerId: {type: Schema.Types.ObjectId, ref: 'Customer'},
});

const paymentSchema = new Schema({
	type: String,
	status: String,
	orderId: { type: Schema.Types.ObjectId, ref: "Order" },
});

module.exports = {
	Customer: model("Customer", customerSchema),
	FoodItem: model("FoodItem", foodItemSchema),
	Order: model("Order", orderSchema),
	Cart: model("Cart", cartSchema),
	Payment: model("Payment", paymentSchema),
};
