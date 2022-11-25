const chalk = require("chalk");
global._ = console.log;
global.__ = (_) => {
	console.log(chalk.blue(_));
};
global.l = (_) => {
	console.log(chalk.black(_));
};
global._e = (_) => {
	console.log(chalk.red(_));
};

// *  Setting up the environment variables
const dotenv = require("dotenv");
dotenv.config({
	path: "./.env",
});

// ****************************** Database configuration ************************************
require("./database/database");

const { PORT } = process.env;
const app = require("./app");

app.listen(PORT, () => {
	__(`Server is running on port ${PORT}`);
});
