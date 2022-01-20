const { Customer } = require("../schema/models");
const {
	hashPassword,
	comparePassword,
	generateAccessToken,
} = require("../utils/auth");

const signup = async (req, res) => {
	const { name, password, mobileNumber, email, address } = req.body;
	if (!name || !password || (!mobileNumber && !email) || !address)
		return res.json({
			success: false,
			message: "Incomplete information provided",
		});
	const existingCustomer = await Customer.findOne({
		$or: [
			{ mobileNumber: mobileNumber || "X" },
			{ email: email || "X" },
		],
	});
	if (existingCustomer)
		return res.json({
			success: false,
			message:
				"Customer with provided email or mobile number already exists",
		});
	const hashedPassword = await hashPassword(password);
	let customer = new Customer({
		name,
		password: hashedPassword,
		mobileNumber: mobileNumber || "",
		email: email || "",
		address,
	});
	customer = await customer.save();
	const accessToken = generateAccessToken(customer);
	res.cookie("accessToken", accessToken, { secure: true, sameSite: "None" });
	res.json({
		success: true,
		message: "Customer created successfully",
		body: { customer },
	});
};

const login = async (req, res) => {
	const { name, password } = req.body;
	if (!name || !password)
		return res.json({
			success: false,
			message: "Incomplete information provided",
		});
	const customer = await Customer.findOne({name});
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
	const customer = await Customer.findById(req.customer._id);
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