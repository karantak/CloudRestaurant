const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

/* password */

const hashPassword = async (password) => {
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);
	return hashedPassword;
};

const comparePassword = async (password, hashedPassword) => {
	const isValid = await bcrypt.compare(password, hashedPassword);
	return isValid;
};

/* access token */

const getAccountId = async (accessToken) => {
	try {
		const customer = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
		return customer._id;
	} catch {
		return false;
	}
};

const generateAccessToken = (customer) => {
	return jwt.sign(
		{
			_id: customer._id,
			email: customer.email,
			name: customer.name,
			mobileNumber: customer.mobileNumber,
			address: customer.address,
		},
		ACCESS_TOKEN_SECRET
	);
};

const verifyAccessToken = async (req, res, next) => {
	const { _id } = req.params;
	const { accessToken } = req.cookies;
	if (!accessToken)
		return res
			.status(401)
			.json({ success: false, body: { error: "No access token" } });
	jwt.verify(accessToken, ACCESS_TOKEN_SECRET, async (err, customer) => {
		if (err || (_id && _id !== customer._id))
			return res.status(401).json({
				success: false,
				body: { error: "Invalid access token" },
			});
		req.customer = customer;
		next();
	});
};

module.exports = {
	hashPassword,
	comparePassword,
	generateAccessToken,
	verifyAccessToken,
	getAccountId,
};