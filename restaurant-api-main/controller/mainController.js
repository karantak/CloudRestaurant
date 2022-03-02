require('dotenv').config()
const {Customer, Cart, Order, FoodItem, CartFoodItem} = require('../schema/models');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

let deliveryAddresses = {};
const addToCart = async (req, res) => {
	const {foodItemId, quantity} = req.body;
	if(!foodItemId || !quantity || isNaN(quantity) || quantity < 1) 
		return res.json({success: false, message: 'Incomplete information provided'});
	else if(!await FoodItem.count({where: {id: foodItemId}})) 
		return res.json({success: false, message: 'Food item does not exist'});
	let cart = await Cart.findOne({where: {customerId: req.customer.id, locked: false}});
	if(!cart) {
		cart = await Cart.create({locked: false, customerId: req.customer.id});
		const cartItem = await CartFoodItem.create({quantity, foodItemId, cartId: cart.id});
	}
	else {
		const cartItem = await CartFoodItem.findOne({where: {cartId: cart.id, foodItemId}});
		if(cartItem) 
			await CartFoodItem.update({quantity: cartItem.quantity + quantity}, {where: {cartId: cart.id, foodItemId}});
		else 
			await CartFoodItem.create({quantity, foodItemId, cartId: cart.id});
	}
	cart = await cart.save();
	return res.json({success: true, message: 'Food item added to cart'});
}

const removeFromCart = async (req, res) => {
	const {cartItemId} = req.body;
	if(!cartItemId) 
		return res.json({success: false, message: 'Incomplete information provided'});
	await CartFoodItem.destroy({where: {id: cartItemId}});
	return res.json({success: true,                                                                                                                                         message: 'Food item removed from cart'});
}

const getCart = async (req, res) => {
	const cart = await Cart.findOne({where: {customerId: req.customer.id, locked: false}});
	if(cart) {
		const cartItems = await CartFoodItem.findAll({where: {cartId: cart.id}, include: [{model: Cart}, {model: FoodItem}]});
		return res.json({success: true, body: {cartItems}});
	} 
	return res.json({success: false});
}

const orderSession = async (req, res) => {
	const {deliveryAddress} = req.body;
	if(deliveryAddress && deliveryAddress != req.customer.address) 
		deliveryAddresses[req.customer.id] = deliveryAddress;
	const cart = await Cart.findOne({where: {customerId: req.customer.id, locked: false}});
	if(!cart) 
		return res.json({success: false});
	const cartItems = await CartFoodItem.findAll({where: {cartId: cart.id}, include: [{model: FoodItem}]});
	try {
		const session = await stripe.checkout.sessions.create({
			payment_method_types: ['card'],
			mode: 'payment',
			line_items: cartItems.map(item => {
				return {
					price_data: {
						currency: 'inr',
						product_data: {
							name: item.foodItem.name,
						},
						unit_amount: item.foodItem.price * 100,
					},
					quantity: item.quantity
				};
			}),
			success_url: 'http://localhost:3000/html/Success.html',
			cancel_url: 'http://localhost:3000/html/Cart.html',

		});
		const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);
		res.json({success: true, body: {url: session.url, clientSecret: paymentIntent['client_secret']}});
	} catch(err) {
		res.json({success: false, message: err.message}).status(501);
	}
};

const placeOrder = async (req, res) => {
	const cart = await Cart.findOne({where: {customerId: req.customer.id, locked: false}});
	if(!cart) 
		return res.json({success: false});
	const cartItems = await CartFoodItem.findAll({where: {cartId: cart.id}, include: [{model: FoodItem}]});
	if(!cart || !cartItems.length) 
		return res.json({success: false, message: 'Cart empty'});
	let totalPrice = 0;
	for(let i = 0; i < cartItems.length; ++i) 
		totalPrice += cartItems[i].quantity * cartItems[i].foodItem.price;
	const order = await Order.create({
		deliveryAddress: deliveryAddresses[req.customer.id] || req.customer.address,
		totalPrice,
		cartId: cart.id,
		customerId: req.customer.id
	});
	await Cart.update({locked: true}, {where: {id: cart.id}});
	return res.json({success: true, message: 'Order placed'});
}

const getAllOrders = async (req, res) => {
	if(!req.customer.isAdmin) 
		return res.json({success: false});
	let orders = await Order.findAll({include: [{model: Customer}]}), orderItems = {};
	for(let i = 0; i < orders.length; ++i) {
		const cartItems = await CartFoodItem.findAll({where: {cartId: orders[i].cartId}, include: [{model:FoodItem}]});
		orderItems[orders[i].id] = cartItems
	}
	return res.json({success: true, body: {orders, orderItems}});
};

const removeOrder = async (req, res) => {
	if(!req.customer.isAdmin) 
		return res.json({success: false});
	const {orderId} = req.params;
	const order = await Order.findOne({where: {id: orderId}});
	await CartFoodItem.destroy({where: {cartId: order.cartId}});
	await Cart.destroy({where: {id: order.cartId}});
	await Order.destroy({where: {id: orderId}});
	return res.json({success: true});
};

const getOrders = async (req, res) => {
	const orders = await Order.findAll({where: {customerId: req.customer.id}});
	return res.json({success: true, body: {orders}})
}

const getFoodMenu = async (req, res) => {
	const foodMenu = await FoodItem.findAll();
	return res.json({success: true, body: {foodMenu}})
}

module.exports = {addToCart, removeFromCart, placeOrder, getOrders, getFoodMenu, getCart, getAllOrders, removeOrder, orderSession};