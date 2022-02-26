/* central server setup */

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { verifyAccessToken } = require("./utils/auth");
const {
	refresh,
	login,
	signup,
	logout,
} = require("./controller/authController");
const {
	placeOrder,
	getOrders,
	getFoodMenu,
	getCart,
	addToCart,
	removeFromCart,
	getAllOrders,
} = require("./controller/mainController");
const populate = require('./utils/populate');
const {initDb} = require('./schema/models');

/* app configurations */

const app = express();
const port = process.env.PORT || 5000;

/* middlewares */
//http://127.0.0.1:5500
app.use(cookieParser());
app.use(express.json());
app.use(
	cors({
		origin: ["http://localhost:5500", 'http://127.0.0.1:5500', 'http://localhost:3000'], // add the url of your front-end's server
		credentials: true,
		sameSite: "None",
		secure: true,
	})
);

/* mysql database connection */

const connectToDatabase = async () => {
	await initDb();
	populate();
}

connectToDatabase();

/* api */

app.get("/", (req, res) => res.json("oye"));
app.post("/signup", signup);
app.post("/login", login);
app.post("/refresh", verifyAccessToken, refresh);
app.delete("/logout", verifyAccessToken, logout);

app.post("/add-to-cart", verifyAccessToken, addToCart);
app.post("/remove-from-cart", verifyAccessToken, removeFromCart);
app.post("/place-order", verifyAccessToken, placeOrder);
app.get("/get-all-orders", verifyAccessToken, getAllOrders);
app.get("/get-orders", verifyAccessToken, getOrders);
app.get("/get-food-menu", getFoodMenu);
app.get("/get-cart", verifyAccessToken, getCart);

/* making the app listen to a port */

app.listen(port, () => {
	console.log(`App listening port ${port}`);
});