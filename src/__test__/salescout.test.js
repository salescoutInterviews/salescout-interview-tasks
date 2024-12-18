import { filterAndSortProducts } from '../logic';

test('filterAndSortProducts should return unique products sorted by price', () => {
    const products = [
        { name: 'A', price: 30 },
        { name: 'B', price: 20 },
        { name: 'A', price: 30 },
        { name: 'C', price: 10 }
    ];

    const result = filterAndSortProducts(products);

    const expected = [
        { name: 'C', price: 10 },
        { name: 'B', price: 20 },
        { name: 'A', price: 30 }
    ];

    expect(result).toEqual(expected);
});

import axios from 'axios';
jest.mock('axios');
import { fetchLongPosts } from '../work-with-api';

test('fetchLongPosts should return posts longer than 100 characters', async () => {
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

import mongoose from 'mongoose';
jest.mock('mongoose', () => ({
    model: jest.fn().mockReturnValue({
        create: jest.fn(),
        aggregate: jest.fn().mockResolvedValue([{ email: 'duplicate@example.com' }])
    }),
    connect: jest.fn()
}));
import { manageUsers } from '../work-with-mongodb';

test('manageUsers should find users with duplicate emails', async () => {
    const result = await manageUsers();
    expect(result).toEqual([{ email: 'duplicate@example.com' }]);
});

import request from 'supertest';
import app from '../users-api';

test('POST /user and GET /users should work correctly', async () => {
    await request(app).post('/user').send({ name: 'John' }).expect(200);
    const response = await request(app).get('/users').expect(200);

    expect(response.body).toEqual([{ name: 'John' }]);
});

import { fetchAll } from '../asynchonus-development';

test('fetchAll should fetch data from multiple URLs in parallel', async () => {
    axios.get.mockResolvedValueOnce({ data: 'Result 1', status: 200 });
    axios.get.mockResolvedValueOnce({ data: 'Result 2', status: 200 });

    const urls = ['url1', 'url2'];
    const result = await fetchAll(urls);

    expect(result).toEqual([
        { data: 'Result 1', status: 200 },
        { data: 'Result 2', status: 200 }
    ]);
});

jest.mock('redis', () => {
    const redisMock = require('redis-mock');
    return redisMock;
});
import { manageRedis } from '../work-with-redis';
import redis from 'redis';

test('manageRedis should save and retrieve keys', async () => {
    const mockRedisClient = redis.createClient();

    jest.spyOn(mockRedisClient, 'set').mockImplementation((key, value, callback) => callback(null, 'OK'));
    jest.spyOn(mockRedisClient, 'get').mockImplementation((key, callback) => callback(null, 'value'));

    await manageRedis();

    expect(mockRedisClient.set).toHaveBeenCalledWith('key', 'value', expect.any(Function));
    expect(mockRedisClient.get).toHaveBeenCalledWith('key', expect.any(Function));
});
