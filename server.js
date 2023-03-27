import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import {v4 as uuidv4} from "uuid";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

const saltRounds = 10;
const hashPassword = async (password) => {
	return await bcrypt.hash(password, saltRounds);
};

const users = [
	{
		userId: uuidv4(),
		name: "Rita",
		email: "rita@ritabradley.dev",
		password: await hashPassword("8np05J^&fUf-"),
		entries: 5,
		joined: new Date(),
	},
	{
		userId: uuidv4(),
		name: "Ron",
		email: "ronaldhopkins904@gmail.com",
		password: await hashPassword("9KnR&cT93*L"),
		entries: 0,
		joined: new Date(),
	},
];

const database = {
	users,
};


// const database = {
// 	users: [
// 		{
// 			userId: "239t2f",
// 			name: "Rita",
// 			email: "rita@ritabradley.dev",
// 			password: "8np05J^&fUf-",
// 			entries: 5,
// 			joined: new Date()
// 		},
// 		{
// 			userId: "392fn1",
// 			name: "Ron",
// 			email: "ronaldhopkins904@gmail.com",
// 			password: "9KnR&cT93*L",
// 			entries: 0,
// 			joined: new Date()
// 		}
// 	]
// };


app.get("/", (req, res) => {
	res.send(database.users);
});

// /signin --> POST == success/fail
app.post("/signin", async (req, res) => {
	const {email, password} = req.body;
	const foundUser = database.users.find(user => email === user.email);

	if (foundUser) {
		const isPasswordMatch = await bcrypt.compare(password, foundUser.password);
		if (isPasswordMatch) {
			res.json(foundUser);
		} else {
			res.status(404).json("Incorrect password");
		}
	} else {
		res.status(404).json("User not found");
	}
});


// /register --> POST == user
app.post("/register", async (req, res,) => {
	const {name, email, password} = req.body;
	const userId = uuidv4();

	const saltRounds = 10;
	const hashedPassword = await bcrypt.hash(password, saltRounds);

	database.users.push({
		userId,
		name,
		email,
		password: hashedPassword,
		entries: 0,
		joined: new Date()
	});
	res.json(database.users[database.users.length - 1]);
});

app.post("/check-email", (req, res) => {
	const {email} = req.body;
	const emailExists = database.users.some(user => email === user.email);

	if (emailExists) {
		res.status(400).json({message: "Email already exists"});
	} else {
		res.json({message: "Email is available"});
	}
});

// /profile/:userId --> GET res == user
app.get("/profile/:userId", (req, res) => {
	const {userId} = req.params;
	const foundId = database.users.find(user => userId === user.userId);
	if (foundId) {
		res.json(foundId);
	} else {
		res.status(404).json("user not found");
	}
});

app.put("/image", (req, res) => {
	const {userId} = req.body;
	const foundId = database.users.find(user => userId === user.userId);
	if (foundId) {
		foundId.entries++;
		res.json(foundId.entries);
	} else {
		res.status(404).json("user not found");
	}
});

app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
