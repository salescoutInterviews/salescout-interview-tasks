// test('filterAndSortProducts should return unique products sorted by price', () => {
//     const { filterAndSortProducts } = require('../logic');

//     const products = [
//         { name: 'A', price: 30 },
//         { name: 'B', price: 20 },
//         { name: 'A', price: 30 },
//         { name: 'C', price: 10 }
//     ];

//     const result = filterAndSortProducts(products);

//     expect(result).toEqual([
//         { name: 'C', price: 10 },
//         { name: 'B', price: 20 },
//         { name: 'A', price: 30 }
//     ]);
// });

// test('fetchLongPosts should return posts longer than 100 characters', async () => {
//     jest.resetModules(); 
//     const axios = require('axios');
//     jest.mock('axios');
//     const { fetchLongPosts } = require('../work-with-api');

//     axios.get.mockResolvedValue({
//         data: [
//             { id: 1, userId: 1, title: 'Post 1', body: 'Short body' },
//             { id: 2, userId: 1, title: 'Post 2', body: 'A long body exceeding 100 characters is here...' }
//         ]
//     });

//     const result = await fetchLongPosts();

//     expect(result).toEqual([
//         { id: 2, userId: 1, title: 'Post 2', body: 'A long body exceeding 100 characters is here...' }
//     ]);
// });

// test('manageUsers should find users with duplicate emails', async () => {
//     jest.resetModules(); 
//     jest.mock('mongoose', () => ({
//         model: jest.fn().mockReturnValue({
//             create: jest.fn(),
//             aggregate: jest.fn().mockResolvedValue([{ email: 'duplicate@example.com' }])
//         }),
//         connect: jest.fn()
//     }));

//     const { manageUsers } = require('../work-with-mongodb');

//     const result = await manageUsers();
//     expect(result).toEqual([{ email: 'duplicate@example.com' }]);
// });

// test('POST /user and GET /users should work correctly', async () => {
//     const request = require('supertest');
//     const app = require('../users-api');

//     await request(app).post('/user').send({ name: 'John' }).expect(200);
//     const response = await request(app).get('/users').expect(200);

//     expect(response.body).toEqual([{ name: 'John' }]);
// });

// test('fetchAll should fetch data from multiple URLs in parallel', async () => {
//     jest.resetModules(); 
//     const axios = require('axios');
//     jest.mock('axios');
//     const { fetchAll } = require('../asynchonus-development');

//     axios.get.mockResolvedValueOnce({ data: 'Result 1', status: 200 });
//     axios.get.mockResolvedValueOnce({ data: 'Result 2', status: 200 });

//     const urls = ['url1', 'url2'];
//     const result = await fetchAll(urls);

//     expect(result).toEqual([
//         { data: 'Result 1', status: 200 },
//         { data: 'Result 2', status: 200 }
//     ]);
// });

// test('manageRedis should save and retrieve keys', async () => {
//     jest.resetModules();
//     jest.mock('redis', () => {
//         const redisMock = require('redis-mock');
//         return redisMock;
//     });

//     const { manageRedis } = require('../work-with-redis');
//     const redis = require('redis'); 
//     const mockRedisClient = redis.createClient();

//     jest.spyOn(mockRedisClient, 'set').mockImplementation((key, value, callback) => callback(null, 'OK'));
//     jest.spyOn(mockRedisClient, 'get').mockImplementation((key, callback) => callback(null, 'value'));

//     await manageRedis();

//     expect(mockRedisClient.set).toHaveBeenCalledWith('key', 'value', expect.any(Function));
//     expect(mockRedisClient.get).toHaveBeenCalledWith('key', expect.any(Function));
// });
 