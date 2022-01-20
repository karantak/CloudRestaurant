# API Docs

Format of the docs:-

	HTTP_METHOD /url

	for e.g. POST /signup

	BODY contains the body parameters which you have to pass through the request. RESPONSE is the data which you receive after requesting a specific route. COOKIE sets a cookie on the browser which remembers the login session. DELETE_COOKIE logs out the user. (verified) means the request can only be initiated by users who are logged in.

### Example request with JavaScript - 
	
```

const response = await fetch('http://localhost:5000/get-food-menu', {
	method: 'GET'
}); // sending a GET request with fetch api to the get-food-menu endpoint
const data = await response.json(); // converts the json data to JavaScript object
console.log(data.body.foodMenu); // prints all the food items

```

### POST /signup -
		
	BODY -> name, email, mobileNumber, address, password

	RESPONSE -> customer

	COOKIE -> access_token

### POST /login - 

	BODY -> mobileNumber, email, password

	RESPONSE -> customer

	COOKIE -> access_token

### POST /refresh (verified) -

	RESPONSE -> customer

### DELETE /logout (verified) - 
	
	DELETE_COOKIE -> access_token

### POST /add-to-cart (verified) - 

	BODY -> foodItemID, quantity

	RESPONSE -> cart

### POST /remove-to-cart (verified) - 

	BODY -> foodItem

	RESPONSE -> cart

### POST /place-order (verified) - 

	BODY -> deliveryAddress

	RESPONSE -> order

### GET /get-orders (verified) - 

	RESPONSE -> orders

### GET /get-food-menu - 

	RESPONSE -> foodMenu

### GET /get-cart - 

	RESPONSE -> cart