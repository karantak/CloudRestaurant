const {Sequelize, Model, DataTypes} = require('sequelize');

const sequelize = new Sequelize('Cloudrestaurant', 'root', 'Karan@123@', {
	dialect: 'mysql',
})

const Customer = sequelize.define('customer', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false
	},
	email: {
		type: DataTypes.STRING,
		allowNull: false
	},
	password: {
		type: DataTypes.STRING,
		allowNull: false
	},
	mobileNumber: {
		type: DataTypes.STRING,
		allowNull: false
	},
	address: {
		type: DataTypes.STRING,
		allowNull: false
	},
	isAdmin: {
		type: DataTypes.BOOLEAN,
		defaultValue: false
	}
});

const FoodItem = sequelize.define('foodItem', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	type: {
		type: DataTypes.STRING,
		allowNull: false
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false
	},
	price: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
});

const Cart = sequelize.define('cart', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	locked: {
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
});

const CartFoodItem = sequelize.define('cartFoodItem', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	quantity: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
});

const Order = sequelize.define('order', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	deliveryAddress: {
		type: DataTypes.STRING,
		allowNull: false
	},
	totalPrice: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
});

Customer.hasMany(Order);
Customer.hasMany(Cart);
FoodItem.hasMany(CartFoodItem);
Cart.hasMany(CartFoodItem);
Cart.hasMany(Order);
Cart.belongsTo(Customer);
CartFoodItem.belongsTo(Cart);
CartFoodItem.belongsTo(FoodItem);
Order.belongsTo(Customer);
Order.belongsTo(Cart);

const initDb = async () => {
	await sequelize.sync();
}

module.exports = {
	Customer,
	Order,
	FoodItem,
	Cart,
	CartFoodItem,
	initDb
};

/*
Discord Bot Requirements
1. Monitor Phishing & Scam links
2. Role giving feature with logs
3. Sales and listing of the NFT marketplace
*/