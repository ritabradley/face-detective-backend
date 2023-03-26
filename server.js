import express from "express";

const app = express();
const PORT = 3000;

app.use(express.json());

const database = {
	users: [
		{
			userId: '239t2f',
			name: 'Rita',
			email: 'rita@ritabradley.dev',
			password: '8np05J^&fUf-',
			entries: 5,
			joined: new Date()
		},
		{
			userId: '392fn1',
			name: 'Ron',
			email: 'ronaldhopkins904@gmail.com',
			password: '9KnR&cT93*L',
			entries: 0,
			joined: new Date()
		}
	]
}

app.get('/', (req, res) => {
	res.send(database.users)
})

// /signin --> POST == success/fail
app.post('/signin', (req, res) => {
	const foundUser = database.users.find(user => req.body.email === user.email && req.body.password === user.password);

	if (foundUser) {
		res.json('success');
	} else {
		res.status(404).json('user not found');
	}
})

// /register --> POST == user
app.post('/register', (req, res, ) => {
	const {name, email, password} = req.body
	database.users.push({
		userId: '8h26fw',
			name,
			email,
			password,
			entries: 0,
			joined: new Date()
	})
	res.json(database.users[database.users.length - 1])
})

// /profile/:userId --> GET res == user
app.get('/profile/:userId', (req, res) => {
	const {userId} = req.params
	const foundId = database.users.find(user => userId === user.userId)
	if (foundId) {
		res.json(foundId)
	} else {
		res.status(404).json('user not found')
	}
})

app.put('/image', (req, res) => {
	res.send('image entries')
})

app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
