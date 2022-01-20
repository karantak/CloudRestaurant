/* central server setup */

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
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
} = require("./controller/mainController");
const populate = require('./utils/populate');

/* app configurations */

const app = express();
const port = process.env.PORT || 5000;

/* middlewares */

app.use(cookieParser());
app.use(express.json());
app.use(
	cors({
		origin: ["http://localhost:3000"], // add the url of your front-end's server
		credentials: true,
		sameSite: "None",
		secure: true,
	})
);

/* mongodb database connection */

console.log(process.env.MONGO_URI);
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
mongoose.connection.on("error", () => {
	console.log("Error connecting to database");
});
mongoose.connection.on("open", () => {
	console.log("Connected to database");
	populate();
});

/* api */

app.get("/", (req, res) => res.json("oye"));
app.post("/signup", signup);
app.post("/login", login);
app.post("/refresh", verifyAccessToken, refresh);
app.delete("/logout", verifyAccessToken, logout);

app.post("/add-to-cart", verifyAccessToken, addToCart);
app.post("/remove-from-cart", verifyAccessToken, removeFromCart);
app.post("/place-order", verifyAccessToken, placeOrder);
app.get("/get-orders", verifyAccessToken, getOrders);
app.get("/get-food-menu", getFoodMenu);
app.get("/get-cart", verifyAccessToken, getCart);

/* making the app listen to a port */

app.listen(port, () => {
	console.log(`App listening port ${port}`);
});