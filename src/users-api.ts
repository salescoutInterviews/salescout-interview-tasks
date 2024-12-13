// Create an API using Node.js and Express:
// 1. POST /user - adds a user.
// 2. GET /users - returns all users.

// Use Express library

const express = require('express');
const app = express();

app.use(express.json());

const users = [];

app.post('/user', (req: Request, res: Response) => {
    // Your code goes here
});

app.get('/users', (req: Request, res: Response) => {
    // Your code goes here
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;