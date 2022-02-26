var cartItems, totalPrice = 0;

const addCartItems = () => {
	cartItems.forEach(item => {
		totalPrice += item.quantity * item.foodItem.price;
		$('#cart-items').append(
			`
			<div>
				<h3>${item.foodItem.name}</h3>
				<p>Quantity - ${item.quantity}</p>
				<p>Price - ₹${item.quantity * item.foodItem.price}</p>
				<button onclick='removeFromCart(${item.id})'>Remove</button>
			</div>
			`
		);
	});
	$('#cart-items').append(
		`
		<h2>Total Cart Price - ₹${totalPrice}</h2>
		`
	)
}

const removeFromCart = async (id) => {
	const response = await fetch('http://localhost:5000/remove-from-cart', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
		body: JSON.stringify({cartItemId: id})
	});
	const data = await response.json();
	if(data.success) 
		return window.location.replace('/Cart.html');
}

$(document).ready(async () => {
	const response = await fetch('http://localhost:5000/get-cart', {
		credentials: 'include'
	});
	const data = await response.json();
	if(data.success) {
		cartItems = data.body.cartItems;
		addCartItems();
	}
	else 
		return window.location.replace('/');
});