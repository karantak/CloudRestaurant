const {Cart, Order, FoodItem} = require('../schema/models');

const addToCart = async (req, res) => {
	const {foodItemId, quantity} = req.body;
	if(!foodItemId || !quantity) 
		return res.json({success: false, message: 'Incomplete information provided'});
	let cart = await Cart.findOne({customerId: req.customer._id, locked: false});
	if(!cart) {
		cart = new Cart({locked: false, customerId: req.customer._id, foodItems: []});
		cart.foodItems.push({foodItemId, quantity});
	}
	else {
		let updated = false;
		for(let i = 0; i < cart.foodItems.length; ++i) {
			if(cart.foodItems[i].foodItemId === foodItemId) {
				cart.foodItems[i].quantity += quantity;
				updated = true;
			}
		}
		if(!updated) 
			cart.foodItems.push({foodItemId, quantity});
	}
	cart = await cart.save();
	return res.json({success: true, message: 'Food item added to cart', body: {cart}});
}

const removeFromCart = async (req, res) => {
	const {foodItemId} = req.body;
	if(!foodItemId) 
		return res.json({success: false, message: 'Incomplete information provided'});
	let cart = await Cart.findOne({customerId: req.customer._id});
	if(!cart) 
		res.json({success: false, message: 'Cart empty'});
	cart.foodItems = cart.foodItems.filter(cartItem => cartItem.foodItemId !== foodItemId);
	cart = await cart.save();
	return res.json({success: true, message: 'Food item removed from cart', body: {cart}});
}

const getCart = async (req, res) => {
	const cart = await Cart.findOne({customerId: req.customer._id});
	return res.json({success: true, body: {cart}});
}

const placeOrder = async (req, res) => {
	const {deliveryAddress} = req.body;
	const cart = await Cart.findOne({customerId: req.customer._id});
	if(!cart) 
		return res.json({success: false, message: 'Cart empty'})
	let totalPrice = 0;
	for(let i = 0; i < cart.foodItems.length; ++i) {
		const foodItem = await FoodItem.findById(cart.foodItems[i].foodItemId);
		if(!foodItem) 
			return res.json({success: false, message: 'Invalid food item in cart'});
		totalPrice += cart.foodItems[i].quantity + foodItem.price;
	}
	let order = new Order({
		deliveryAddress: deliveryAddress || req.customer.address,
		paymentDone: false,
		totalPrice,
		cartId: cart._id,
		customerId: req.customer._id,
	});
	order = await order.save();
	cart.locked = true;
	await cart.save();
	return res.json({success: true, message: 'Order placed', body: {order}});
}

const getOrders = async (req, res) => {
	const orders = await Order.find({customerId: req.customer._id});
	return res.json({success: true, body: {orders}})
}

const getFoodMenu = async (req, res) => {
	const foodMenu = await FoodItem.find({});
	return res.json({success: true, body: {foodMenu }})
}

module.exports = {addToCart, removeFromCart, placeOrder, getOrders, getFoodMenu, getCart};