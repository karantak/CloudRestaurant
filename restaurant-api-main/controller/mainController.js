const {Cart, Order, FoodItem, CartFoodItem} = require('../schema/models');

const addToCart = async (req, res) => {
	const {foodItemId, quantity} = req.body;
	if(!foodItemId || !quantity || isNaN(quantity) || quantity < 1) 
		return res.json({success: false, message: 'Incomplete information provided'});
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
	return res.json({success: true, message: 'Food item removed from cart'});
}

const getCart = async (req, res) => {
	const cart = await Cart.findOne({where: {customerId: req.customer.id, locked: false}});
	if(cart) {
		const cartItems = await CartFoodItem.findAll({where: {cartId: cart.id}, include: [{model: Cart}, {model: FoodItem}]});
		return res.json({success: true, body: {cartItems}});
	} 
	return res.json({success: false});
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
	return res.json({success: true, message: 'Order placed'});
}

const getAllOrders = async (req, res) => {
	const orders = await Order.findAll();
	return res.json({success: true, body: {orders}});
};

const getOrders = async (req, res) => {
	const orders = await Order.findAll({where: {customerId: req.customer.id}});
	return res.json({success: true, body: {orders}})
}

const getFoodMenu = async (req, res) => {
	const foodMenu = await FoodItem.findAll();
	return res.json({success: true, body: {foodMenu}})
}

module.exports = {addToCart, removeFromCart, placeOrder, getOrders, getFoodMenu, getCart, getAllOrders};