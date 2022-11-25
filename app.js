const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
// ******************* Module imported ***********************
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const itemRoute = require("./routes/item");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const feedbackRoute = require("./routes/feedback");
const stripeRoute = require("./routes/stripe");

// ********************* Middleware *****************************
app.use(express.static("public"));
app.use(express.json());
app.use(cors());

// initial response
app.get("/", (req, res) => {
	res.sendFile("public/index.html", { root: __dirname });
});

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/items", itemRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api/feedbacks", feedbackRoute);
app.use("/api/checkout", stripeRoute);

// middleware for error handling
app.use(function (req, res, next) {
	res.sendFile("public/error.html", { root: __dirname });
});

// ******************* Module exported ***********************
module.exports = app;
