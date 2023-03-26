import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'
import {v4 as uuidv4} from "uuid";
import nodemailer from "nodemailer";



const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

const database = {
	users: [
		{
			userId: "239t2f",
			name: "Rita",
			email: "rita@ritabradley.dev",
			password: "8np05J^&fUf-",
			entries: 5,
			joined: new Date()
		},
		{
			userId: "392fn1",
			name: "Ron",
			email: "ronaldhopkins904@gmail.com",
			password: "9KnR&cT93*L",
			entries: 0,
			joined: new Date()
		}
	]
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});


app.get("/", (req, res) => {
	res.send(database.users);
});

// /signin --> POST == success/fail
app.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  const foundUser = database.users.find(user => email === user.email);

  if (foundUser) {
    const isPasswordMatch = await bcrypt.compare(password, foundUser.password);
    if (isPasswordMatch) {
      res.json('success');
    } else {
      res.status(404).json('Incorrect password');
    }
  } else {
    res.status(404).json('User not found');
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

// /forgotpassword --> POST == success/fail
app.post("/forgotpassword", async (req, res) => {
	const {email} = req.body;
	const foundUser = database.users.find(user => email === user.email);

	if (foundUser) {
		// Generate a unique token with an expiration time
		// Store the token and expiration time with the user's email
		// (In a production app, this would be saved to a real database)
		foundUser.resetPasswordToken = jwt.sign({email}, process.env.JWT_SECRET, {expiresIn: "1h"});
		foundUser.resetPasswordExpires = Date.now() + 3600000; // 1 hour from now

		// Send a password reset email with the token
    const mailOptions = {
      to: email,
      from: process.env.EMAIL_USER,
      subject: 'Password Reset',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
             Please click on the following link, or paste this into your browser to complete the process:\n\n
             http://${req.headers.host}/resetpassword/${token}\n\n
             If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    try {
      await transporter.sendMail(mailOptions);
      res.json({ message: 'Password reset email sent' });
    } catch (error) {
      console.error('Error sending password reset email:', error);
      res.status(500).json({ message: 'Error sending password reset email' });
    }
  } else {
    res.status(404).json({ message: 'User not found' });
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
