const Order = require("../models/Order");
const {
	verifyToken,
	verifyTokenAndAdmin,
	verifyTokenAndStaff,
} = require("../middlewares/verifyToken");

const router = require("express").Router();

// CREATE AN ORDER
router.post("/", verifyToken, async (req, res) => {
	const newOrder = new Order(req.body);

	try {
		const savedOrder = await newOrder.save();
		res.status(200).json(savedOrder);
	} catch (err) {
		res.status(500).json(err);
	}
});

// EDIT/UPDATE/MODIFY ORDER
router.put(
	"/:id",
	verifyTokenAndAdmin,
	async (req, res) => {
		try {
			const updatedOrder =
				await Order.findByIdAndUpdate(
					req.params.id,
					{
						$set: req.body,
					},
					{ new: true },
				);
			res.status(200).json(updatedOrder);
		} catch (err) {
			res.status(500).json(err);
		}
	},
);

// DELETE ORDER
router.delete(
	"/:id",
	verifyTokenAndAdmin,
	async (req, res) => {
		try {
			await Order.findByIdAndDelete(req.params.id);
			res.status(200).json("Order Deleted");
		} catch (err) {
			res.status(500).json(err);
		}
	},
);

// GET ORDER BY ID
router.get("/find/:orderId", async (req, res) => {
	try {
		const order = await Order.findById(
			req.params.orderId,
		);
		res.status(200).json(order);
	} catch (err) {
		res.status(500).json(err);
	}
});

// GET USER ORDERS
router.get(
	"/userOrder/:userId",
	verifyToken,
	async (req, res) => {
		try {
			const orders = await Order.find({
				userId: req.params.userId,
			});
			res.status(200).json(orders);
		} catch (err) {
			res.status(500).json(err);
		}
	},
);

// UPDATE ORDER STATUS = MARK ORDER AS PREPARED/COMPLETED (FOR CHEF/WAITER i.e., STAFF)
router.put(
	"/statusUpdate/:id",
	verifyTokenAndStaff,
	async (req, res) => {
		try {
			const updatedOrder =
				await Order.findByIdAndUpdate(
					req.params.id,
					{
						$set: req.body,
					},
					{ new: true },
				);
			res.status(200).json(updatedOrder);
		} catch (err) {
			res.status(500).json(err);
		}
	},
);

// GET ALL ORDERS (FOR ADMIN)
router.get("/", verifyTokenAndAdmin, async (req, res) => {
	try {
		const orders = await Order.find();
		res.status(200).json(orders);
	} catch (err) {
		res.status(500).json(err);
	}
});

// GET ALL ORDERS (FOR STAFF)
router.get(
	"/getOrders",
	verifyTokenAndStaff,
	async (req, res) => {
		try {
			const orders = await Order.find();
			res.status(200).json(orders);
		} catch (err) {
			res.status(500).json(err);
		}
	},
);

// GENERATE MONTHLY INCOME
router.get(
	"/income",
	verifyTokenAndAdmin,
	async (req, res) => {
		const productId = req.query.pid;
		const date = new Date();
		const lastMonth = new Date(
			date.setMonth(date.getMonth() - 1),
		);
		const previousMonth = new Date(
			new Date().setMonth(lastMonth.getMonth() - 1),
		);

		try {
			const income = await Order.aggregate([
				{
					$match: {
						createdAt: { $gte: lastMonth },
						...(productId && {
							products: {
								$elemMatch: { productId },
							},
						}),
					},
				},
				{
					$project: {
						month: { $month: "$createdAt" },
						sales: "$amount",
					},
				},
				{
					$group: {
						_id: "$month",
						total: { $sum: "$sales" },
					},
				},
			]);
			res.status(200).json(income);
		} catch (err) {
			res.status(500).json(err);
		}
	},
);

module.exports = router;
