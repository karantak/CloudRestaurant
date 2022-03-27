const { Customer } = require("../schema/models");
const {
	hashPassword,
	comparePassword,
	generateAccessToken,
} = require("../utils/auth");
const {Op} = require('sequelize');
const {specialCharacters} = require('../utils/utils');

const signup = async (req, res) => {
	const { name, password, confirmPassword, mobileNumber, email, address } = req.body;
	if (!name || !password || (!mobileNumber && !email) || !address)
		return res.json({
			success: false,
			message: "Incomplete information provided",
		});
	if(password.length < 8) 
		return res.json({
			success: false,
			message: 'Password should contain atleast 8 characters'
		});
	let hasSpecialCharacter = false;
	for(let character of specialCharacters) {
		if(password.includes(character)) {
			hasSpecialCharacter = true;
			break;
		}
	}
	if(!hasSpecialCharacter) 
		return res.json({
			success: false,
			message: 'Password should contain atleast 1 special character'
		});
	console.log(password, confirmPassword);
	if(password !== confirmPassword) 
		return res.json({
			success: false,
			message: 'Passwords do not match'
		});
	const existingCustomer = await Customer.findOne({
		where: {
			[Op.or]: [
				{ mobileNumber: mobileNumber || "X" },
				{ email: email || "X" }
			]
		}
	});
	if (existingCustomer)
		return res.json({
			success: false,
			message:
				"Customer with provided email or mobile number already exists",
		});
	const hashedPassword = await hashPassword(password);
	const customer = await Customer.create({
		name,
		password: hashedPassword,
		mobileNumber: mobileNumber || "",
		email: email || "",
		address,
	});
	const accessToken = generateAccessToken(customer);
	res.cookie("accessToken", accessToken, { secure: true, sameSite: "None" });
	res.json({
		success: true,
		message: "Customer created successfully",
		body: { customer },
	});
};

const login = async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password)
		return res.json({
			success: false,
			message: "Incomplete information provided",
		});
	const customer = await Customer.findOne({where: {email}});
	if (!customer)
		return res.json({ success: false, message: "Customer does not exist" });
	if (!(await comparePassword(password, customer.password)))
		return res.json({ success: false, message: "Incorrect password" });
	const accessToken = generateAccessToken(customer);
	res.cookie("accessToken", accessToken, { secure: true, sameSite: "None" });
	res.json({
		success: true,
		message: "Logged in successfully",
		body: { customer },
	});
};

const refresh = async (req, res) => {
	const customer = await Customer.findOne({where: {id: req.customer.id}});
	res.json({
		success: true,
		message: "Token was verified",
		body: { customer },
	});
};

const logout = (req, res) => {
	res.clearCookie("accessToken");
	res.json({ success: true, message: "Logged out successfully" });
};

module.exports = { login, signup, logout, refresh };