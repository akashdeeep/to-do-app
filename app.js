const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const app = express();
const port = 3000;
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
const itemsSchema = {
	name: String,
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
	name: "do GFG",
});
const item2 = new Item({
	name: "do Leetcode",
});
const item3 = new Item({
	name: "do git commit",
});
const defaultItems = [item1, item2, item3];

app.get("/", (req, res) => {
	let day = date.getDate();

	Item.find().then((foundItems) => {
		if (foundItems.length === 0) {
			Item.insertMany(defaultItems, (err) => {
				if (err) {
					console.log(err);
				} else {
					console.log("Successfully saved default items to DB.");
				}
			});
			res.redirect("/");
		} else {
			res.render("list", { listTitle: day, newListItems: foundItems });
		}
	});
});

app.post("/", (req, res) => {
	var itemName = req.body.newItem;
	const item = new Item({
		name: itemName,
	});
	item.save();
	res.redirect("/");
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
