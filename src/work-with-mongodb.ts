// Write a script that:
// 1. Connects to MongoDB.
// 2. Creates the 'users' collection.
// 3. Adds new users.
// 4. Finds users with duplicate emails.

// Use Mongoose library

type DuplicatedUsers = {
    email: string
}

async function manageUsers(): Promise<DuplicatedUsers[]> {
    // Your code goes here   
    return []
}

module.exports = { manageUsers }