import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import knex from "knex";

const database = knex({
	client: "pg",
	connection: {
		host: "127.0.0.1",
		port: 5432,
		user: "rita",
		password: process.env.DB_PASSWORD,
		database: "face-detective"
	}
});

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());


app.get("/", (req, res) => {
	res.send(database.users);
});

// /signin --> POST == success/fail
app.post("/signin", async (req, res) => {
	const {email, password} = req.body;

	database
		.select("email", "hash")
		.from("logins")
		.where("email", email)
		.then(async (response) => {
			const isMatchedPassword = await bcrypt.compare(password, response[0].hash);
			if (isMatchedPassword) {
				database.select("*")
					.from("users")
					.where("email", email)
					.then(user => {
						const modifiedUser = {
							userId: user[0].user_id, // Assuming 'id' is the unique identifier in the database
							name: user[0].name,
							email: user[0].email,
							entries: user[0].entries,
							joined: user[0].joined
						};
						res.json(modifiedUser);
					})
					.catch(err => res.status(400).json("unable to retrieve user"));
			} else {
				res.status(400).json("Invalid email or password. Please try again.");
			}
		})
		.catch((err) => {
			res.status(404).json("User not found");
		});
});



// /register --> POST == user
app.post("/register", async (req, res,) => {
	const {name, email, password} = req.body;

	const saltRounds = 10;
	const hashedPassword = await bcrypt.hash(password, saltRounds);

	await database.transaction(trx => {
		database("logins")
			.insert({
				"email": email,
				"hash": hashedPassword
			})
			.returning("email")
			.then(loginEmail => {
				trx("users")
					.returning("*")
					.insert({
						name,
						email: loginEmail[0].email,
						joined: new Date()
					}).then(user => {
						const modifiedUser = {
							userId: user[0].user_id, // Assuming 'id' is the unique identifier in the database
							name: user[0].name,
							email: user[0].email,
							entries: user[0].entries,
							joined: user[0].joined
						};
						res.json(modifiedUser);
					});
			})
			.then(trx.commit)
			.catch(trx.rollback);
	})
		.catch(err => res.status(404).json("We cannot register you at this time. Please try again later."));
});


app.post("/check-email", (req, res) => {
	const {email} = req.body;
	database("users")
		.select("email")
		.where("email", email)
		.then((result) => {
			if (result.length > 0) {
				res.status(400).json({message: "Email already exists"});
			} else {
				res.json({message: "Email is available"});
			}
		})
		.catch((err) => {
			res.status(500).json({message: "Error checking email availability"});
		});
});

// /profile/:userId --> GET res == user
app.get("/profile/:userId", (req, res) => {
	const {userId} = req.params;

	database("users")
		.select("*")
		.where("user_id", userId)
		.then(user => {
			if (user.length) {
				res.json(user[0]);
			} else {
				throw new Error;
			}
		}).catch(err => {
		res.status(404).json("user not found");
	});
});

app.put("/image", (req, res) => {
	const {userId} = req.body;
	console.log("Received userId:", userId);
	database("users")
		.where("user_id", userId)
		.increment("entries", 1)
		.returning("entries")
		.then(entries => {
			res.json({entries: entries[0].entries}); // Return a JSON object
		}).catch(err => {
		res.status(400).json("unable to update entries");
	});
});

app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
