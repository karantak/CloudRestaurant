const addFoodItems = (foodMenu, foodType, containerId) => {
	foodMenu.filter(item => item.type === foodType).forEach(item => {
		$(`#${containerId}`).append(
			`
			<div class="menuadditem">
				<li class="menuli">${item.name}</li>
				<li class="menuliprice">₹${item.price}</li>
				<input class="menuinputli" type="number" id='quantity-${item.id}'/>
				<button class="menubtnli" onclick='addToCart(${item.id})'>ADD</button>
			</div>
			`
		);
	});
}

const addToCart = async (id) => {
	if(!isLoggedIn) 
		return window.location.replace('/Login.html');
	const quantity = Number($(`#quantity-${id}`).val());
	if(!quantity || quantity < 1) {
		alert('Quantity should be atleast 1');
		return;
	}
	const response = await fetch('http://localhost:5000/add-to-cart', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
		body: JSON.stringify({foodItemId: id, quantity}),
	});
	const data = await response.json();
	if(data.success) {
		$(`#quantity-${id}`).val('');
		alert('Food item added to the cart');
	}
	else 
		alert('Some error occured! Try again');
};

$(document).ready(async () => {
	const response = await fetch('http://localhost:5000/get-food-menu');
	const {body: {foodMenu}} = await response.json();
	addFoodItems(foodMenu, 'Starter', 'starter');
	addFoodItems(foodMenu, 'North', 'north');
	addFoodItems(foodMenu, 'South', 'south');
});