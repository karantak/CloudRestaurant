$(document).ready(async () => {
	const response = await fetch('http://localhost:5000/place-order', {
		method: 'POST',
		credentials: 'include'
	});
	const data = await response.json();
	alert('Order placed');
	return window.location.replace('/');
});