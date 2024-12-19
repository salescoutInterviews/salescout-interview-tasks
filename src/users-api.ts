// Create an API using Node.js and Express:
// 1. POST /user - adds a user.
// 2. GET /users - returns all users.

// Use Express library

import express, { Request, Response } from 'express'; // Импортируем нужные типы
const app = express();

app.use(express.json());

const users: any[] = [];

app.post('/user', (req: Request, res: Response) => {
    // Your code goes here
    res.status(200).send();
});

app.get('/users', (req: Request, res: Response) => {
    // Your code goes here
    res.status(200).json(users);
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;