const { connection, connect } = require("mongoose");

const { DATABASE } = process.env;

connect(DATABASE, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

connection.on("connected", () => {
	__("Connected to database");
	console.log("All set");
});

connection.on("error", (error) => {
	_e("Error connecting to database: " + error);
});
