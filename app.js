const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();
const port = 3000;
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

items = [];
workItem = [];
app.get("/", (req, res) => {
	let day = date();

	res.render("list", { listTitle: day, newListItems: items });
});

app.post("/", (req, res) => {
	var item = req.body.newItem;
	if (req.body.list === "Work") {
		workItem.push(item);
		res.redirect("/work");
	} else {
		items.push(item);
		res.redirect("/");
	}
});

app.get("/work", (req, res) => {
	res.render("list", { listTitle: "Work List", newListItems: workItem });
});
app.post("/work", (req, res) => {
	var item = req.body.newItem;
	workItem.push(item);
	res.redirect("/work");
});

app.get("/about", (req, res) => {
	res.render("about");
});

app.listen(port, () => {
	console.log("Server is running on port " + port);
});
