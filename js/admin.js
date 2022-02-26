var orders, orderItems;

const showOrders = () => {
	if(orders.length) {
		$('#orders-table').empty();
		$('#orders-table').append(
			`
			<tr>
				<th>ID</th>
				<th>Name</th>
				<th>Delivery Address</th>
				<th>Email</th>
				<th>Contact Number</th>
				<th>Total Price</th>
				<th>Items</th>
				<th></th>
			</tr>
			`	
		);
		orders.forEach(order => {
			$('#orders-table').append(
				`
				<tr>
					<td valign='top'>${order.id}</td>
					<td valign='top'>${order.customer.name}</td>
					<td valign='top'>${order.deliveryAddress}</td>
					<td valign='top'>${order.customer.email}</td>
					<td valign='top'>${order.customer.mobileNumber || ''}</td>
					<td valign='top'>₹${order.totalPrice}</td>
					<td valign='top'>
						<ul id='items-${order.id}'>
						</ul>
					</td>
					<td valign='top'>
						<button onclick='removeOrder(${order.id})'>Mark As Delivered</button>
					</td>
				</tr>
				`
			);
			orderItems[order.id].map(item => {
				$(`#items-${order.id}`).append(
					`
					<li>
						<p>${item.foodItem.name}</p>
						<p>Quantity - ${item.quantity}</p>
						<p>Price - ${item.quantity * item.foodItem.price}</p>
					</li>
					`
				);
			});
		});	
	}
};

const removeOrder = async (orderId) => {
	const response = await fetch(`http://localhost:5000/remove-order/${orderId}`, {credentials: 'include'});
	const data = await response.json();
	if(data.success) {
		alert('Order marked as delivered');
		return window.location.replace('/Admin.html');
	}
	else 
		alert('Some error occured! Try again');
};

$(document).ready(async () => {
	$('#orders-table').append('<p>No orders yet.</p>');
	const response = await fetch('http://localhost:5000/get-all-orders', {
		credentials: 'include',
	});
	const data = await response.json();
	if(data.success) {
		orders = data.body.orders;
		orderItems = data.body.orderItems;
		showOrders();
	}
	else 
		window.location.replace('/');
});