const {Sequelize, Model, DataTypes} = require('sequelize');

const sequelize = new Sequelize('Cloudrestaurant', 'root', 'Yash@welcome1', {
	dialect: 'mysql',
})

const Customer = sequelize.define('Customer', {
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
		type: DataTypes.INTEGER,
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

const FoodItem = sequelize.define('FoodItem', {
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

const Cart = sequelize.define('Cart', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	customerId: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: {
			model: Customer,
			key: 'id',
		},
	},
	locked: {
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
});

const CartFoodItem = sequelize.define('CartFoodItem', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	cartId: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: {
			model: Cart,
			key: 'id',
		},
	},
	foodItemId: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: {
			model: FoodItem,
			key: 'id',
		},
	},
});

const Order = sequelize.define('Order', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	deliveryAddress: {
		type: DataTypes.STRING,
		allowNull: false
	},
	paymentDone: {
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	totalPrice: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	cartId: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: {
			model: Cart,
			key: 'id',
		},
	},
	customerId: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: {
			model: Customer,
			key: 'id',
		},
	},
});

const Payment = sequelize.define('Payment', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	deliveryAddress: {
		type: DataTypes.STRING,
		allowNull: false
	},
	paymentDone: {
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	orderId: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: {
			model: Order,
			key: 'id',
		},
	},
});

const initDb = async () => {
	await sequelize.sync()
}

module.exports = {
	Customer,
	Order,
	FoodItem,
	Cart,
	CartFoodItem,
	Payment,
	initDb
};

/*
Discord Bot Requirements
1. Monitor Phishing & Scam links
2. Role giving feature with logs
3. Sales and listing of the NFT marketplace
*/