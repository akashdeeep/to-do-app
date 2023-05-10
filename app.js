const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const app = express();
const port = 3000;
const _ = require("lodash");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
const itemsSchema = {
	name: String,
	status: String,
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
	name: "do GFG",
	status: "not done",
});
const item2 = new Item({
	name: "do Leetcode",
	status: "not done",
});
const item3 = new Item({
	name: "do git commit",
	status: "not done",
});
const defaultItems = [item1, item2, item3];
const listSchema = {
	name: String,
	items: [itemsSchema],
};

const List = mongoose.model("List", listSchema);

app.get("/", (req, res) => {
	let day = date.getDate();
	try {
		Item.find().then((foundItems) => {
			if (foundItems.length === 0) {
				try {
					Item.insertMany(defaultItems).then(() => {
						console.log("Successfully saved default items to DB.");
					});
				} catch (err) {
					console.log(err, "insert error");
				}
				res.redirect("/");
			} else {
				res.render("list", { listTitle: day, newListItems: foundItems });
			}
		});
	} catch (err) {
		console.log(err);
	}
});

app.post("/", (req, res) => {
	var itemName = req.body.newItem;
	var listName = req.body.list;
	const item = new Item({
		name: itemName,
	});
	if (listName === date.getDate()) {
		item.save();
		res.redirect("/");
	} else {
		try {
			List.findOne({ name: listName }).then((foundList) => {
				foundList.items.push(item);
				foundList.save();
				res.redirect("/" + listName);
			});
		} catch (err) {
			console.log(err, "post error");
		}
	}
});
app.post("/delete", (req, res) => {
	const checkboxId = req.body.checkbox;
	const listName = req.body.listName;
	// console.log(checkboxId);
	if (listName === date.getDate()) {
		try {
			Item.findByIdAndRemove(checkboxId).then(() => {
				console.log("Successfully deleted checked item.");
				res.redirect("/");
			});
		} catch (err) {
			console.log(err, "delete error");
		}
	} else {
		try {
			List.findOneAndUpdate(
				{ name: listName },
				{ $pull: { items: { _id: checkboxId } } }
			).then(() => {
				res.redirect("/" + listName);
			});
		} catch (err) {
			console.log(err, "delete error");
		}
	}
});

app.get("/:customListName", (req, res) => {
	const customListName = _.capitalize(req.params.customListName);
	try {
		List.findOne({ name: customListName }).then((foundList) => {
			if (!foundList) {
				const list = new List({
					name: customListName,
					items: [],
				});
				list.save();
				res.redirect("/" + customListName);
			} else {
				res.render("list", {
					listTitle: foundList.name,
					newListItems: foundList.items,
				});
			}
		});
	} catch (err) {
		console.log(err, "custom list error");
	}
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
