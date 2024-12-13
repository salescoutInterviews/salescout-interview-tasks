test('filterAndSortProducts should return unique products sorted by price', () => {
    const { filterAndSortProducts } = require('../src/logic');

    const products = [
        { name: 'A', price: 30 },
        { name: 'B', price: 20 },
        { name: 'A', price: 30 },
        { name: 'C', price: 10 }
    ];

    const result = filterAndSortProducts(products);

    expect(result).toEqual([
        { name: 'C', price: 10 },
        { name: 'B', price: 20 },
        { name: 'A', price: 30 }
    ]);
});

test('fetchLongPosts should return posts longer than 100 characters', async () => {
    const { fetchLongPosts } = require('../src/work-with-api');

    const axios = require('axios');
    jest.mock('axios');

    axios.get.mockResolvedValue({
        data: [
            { id: 1, userId: 1, title: 'Post 1', body: 'Short body' },
            { id: 2, userId: 1, title: 'Post 2', body: 'A long body exceeding 100 characters is here...' }
        ]
    });

    const result = await fetchLongPosts();

    expect(result).toEqual([
        { id: 2, userId: 1, title: 'Post 2', body: 'A long body exceeding 100 characters is here...' }
    ]);
});

test('manageUsers should find users with duplicate emails', async () => {
    const { manageUsers } = require('../src/work-with-mongodb');

    const mongoose = require('mongoose');
    const mockUserModel = {
        create: jest.fn(),
        aggregate: jest.fn()
    };
    jest.mock('mongoose', () => ({
        model: jest.fn(() => mockUserModel),
        connect: jest.fn()
    }));

    mockUserModel.aggregate.mockResolvedValue([{ email: 'duplicate@example.com' }]);

    const result = await manageUsers();

    expect(result).toEqual([{ email: 'duplicate@example.com' }]);
});

test('POST /user and GET /users should work correctly', async () => {
    const request = require('supertest');
    const app = require('../src/users-api');

    await request(app).post('/user').send({ name: 'John' }).expect(200);
    const response = await request(app).get('/users').expect(200);

    expect(response.body).toEqual([{ name: 'John' }]);
});

test('fetchAll should fetch data from multiple URLs in parallel', async () => {
    const { fetchAll } = require('../src/asynchonus-development');
    const axios = require('axios');
    jest.mock('axios');

    axios.get.mockResolvedValueOnce({ data: 'Result 1', status: 200 });
    axios.get.mockResolvedValueOnce({ data: 'Result 2', status: 200 });

    const urls = ['url1', 'url2'];
    const result = await fetchAll(urls);

    expect(result).toEqual([
        { data: 'Result 1', status: 200 },
        { data: 'Result 2', status: 200 }
    ]);
});

test('manageRedis should save and retrieve keys', async () => {
    const { manageRedis } = require('../src/work-with-redis');
    const redis = require('redis-mock');
    jest.mock('redis', () => redis);

    const mockRedisClient = redis.createClient();
    jest.spyOn(mockRedisClient, 'set').mockImplementation((key, value, callback) => callback(null, 'OK'));
    jest.spyOn(mockRedisClient, 'get').mockImplementation((key, callback) => callback(null, 'value'));

    await manageRedis();

    expect(mockRedisClient.set).toHaveBeenCalledWith('key', 'value', expect.any(Function));
    expect(mockRedisClient.get).toHaveBeenCalledWith('key', expect.any(Function));
});