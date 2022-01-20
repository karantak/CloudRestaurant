const { FoodItem } = require("../schema/models");

const rawFoodItems = [
	{ name: "Idli", type: "South", price: "35" },
	{ name: "Dosa", type: "South", price: "40" },
	{ name: "Masala Dosa", type: "South", price: "50" },
	{ name: "Hyderabadi Biryani", type: "South", price: "120" },
	{ name: "Paal Payasam", type: "South", price: "80" },
	{ name: "Gawti Chicken", type: "South", price: "110" },
	{ name: "Pongal", type: "South", price: "85" },
	{ name: "South Thali", type: "South", price: "150" },
	{ name: "Paneer Butter Masala", type: "North", price: "110" },
	{ name: "Palak Paneer", type: "North", price: "100" },
	{ name: "Kulcha", type: "North", price: "20" },
	{ name: "Naan", type: "North", price: "25" },
	{ name: "Sarso Saag", type: "North", price: "70" },
	{ name: "Makka Roti", type: "North", price: "30" },
	{ name: "North Special", type: "North", price: "120" },
	{ name: "North Thali", type: "North", price: "150" },
	{ name: "Tea", type: "Starter", price: "20" },
	{ name: "Coffee", type: "Starter", price: "25" },
	{ name: "Poha", type: "Starter", price: "30" },
	{ name: "Upma", type: "Starter", price: "30" },
	{ name: "Veg Crispy", type: "Starter", price: "30" },
	{ name: "Paneer Pakoda", type: "Starter", price: "40" },
	{ name: "Cutlet", type: "Starter", price: "35" },
	{ name: "Onion Pakoda", type: "Starter", price: "40" },
];

const populate = async () => {
	const foodItems = await FoodItem.find({});
	if (!foodItems.length) {
		console.log('Populating the database...');
		rawFoodItems.forEach(async ({ name, type, price }) => {
			const foodItem = new FoodItem({
				name,
				type,
				price,
			});
			await foodItem.save();
		});
		console.log('Populated the database')
	}
};

module.exports = populate;