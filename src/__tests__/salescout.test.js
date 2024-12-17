// Исходные тесты остаются без изменений
test('filterAndSortProducts should return unique products sorted by price', () => {
    const { filterAndSortProducts } = require('../logic');

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
    jest.resetModules(); 
    const axios = require('axios');
    jest.mock('axios');
    const { fetchLongPosts } = require('../work-with-api');

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
    jest.resetModules(); 
    jest.mock('mongoose', () => ({
        model: jest.fn().mockReturnValue({
            create: jest.fn(),
            aggregate: jest.fn().mockResolvedValue([{ email: 'duplicate@example.com' }])
        }),
        connect: jest.fn()
    }));

    const { manageUsers } = require('../work-with-mongodb');

    const result = await manageUsers();
    expect(result).toEqual([{ email: 'duplicate@example.com' }]);
});

test('POST /user and GET /users should work correctly', async () => {
    const request = require('supertest');
    const app = require('../users-api');

    await request(app).post('/user').send({ name: 'John' }).expect(200);
    const response = await request(app).get('/users').expect(200);

    expect(response.body).toEqual([{ name: 'John' }]);
});

test('fetchAll should fetch data from multiple URLs in parallel', async () => {
    jest.resetModules(); 
    const axios = require('axios');
    jest.mock('axios');
    const { fetchAll } = require('../asynchonus-development');

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
    jest.resetModules();
    jest.mock('redis', () => {
        const redisMock = require('redis-mock');
        return redisMock;
    });

    const { manageRedis } = require('../work-with-redis');
    const redis = require('redis'); 
    const mockRedisClient = redis.createClient();

    jest.spyOn(mockRedisClient, 'set').mockImplementation((key, value, callback) => callback(null, 'OK'));
    jest.spyOn(mockRedisClient, 'get').mockImplementation((key, callback) => callback(null, 'value'));

    await manageRedis();

    expect(mockRedisClient.set).toHaveBeenCalledWith('key', 'value', expect.any(Function));
    expect(mockRedisClient.get).toHaveBeenCalledWith('key', expect.any(Function));
});


//-------------------------------------------
// Ниже добавляются новые 14 тестов
//-------------------------------------------

// Дополнительные тесты для filterAndSortProducts

test('filterAndSortProducts should return an empty array if input is empty', () => {
    const { filterAndSortProducts } = require('../logic');
    const products = [];
    const result = filterAndSortProducts(products);
    expect(result).toEqual([]);
});

test('filterAndSortProducts should handle products with identical prices and return them sorted alphabetically by name', () => {
    const { filterAndSortProducts } = require('../logic');
    const products = [
        { name: 'B', price: 10 },
        { name: 'A', price: 10 },
        { name: 'C', price: 10 }
    ];
    // Предположим, если цены равны, дополнительно сортируем по имени
    const result = filterAndSortProducts(products);
    expect(result).toEqual([
        { name: 'A', price: 10 },
        { name: 'B', price: 10 },
        { name: 'C', price: 10 }
    ]);
});

test('filterAndSortProducts should remove exact duplicates (same name and price)', () => {
    const { filterAndSortProducts } = require('../logic');
    const products = [
        { name: 'A', price: 50 },
        { name: 'A', price: 50 },
        { name: 'B', price: 50 }
    ];
    const result = filterAndSortProducts(products);
    expect(result).toEqual([
        { name: 'A', price: 50 },
        { name: 'B', price: 50 }
    ]);
});

// Дополнительные тесты для fetchLongPosts

test('fetchLongPosts should return empty array if no posts are long enough', async () => {
    jest.resetModules();
    const axios = require('axios');
    jest.mock('axios');
    const { fetchLongPosts } = require('../work-with-api');

    axios.get.mockResolvedValue({
        data: [
            { id: 1, userId: 1, title: 'Short Post', body: 'Not long' }
        ]
    });

    const result = await fetchLongPosts();
    expect(result).toEqual([]);
});

test('fetchLongPosts should handle empty API response gracefully', async () => {
    jest.resetModules();
    const axios = require('axios');
    jest.mock('axios');
    const { fetchLongPosts } = require('../work-with-api');

    axios.get.mockResolvedValue({ data: [] });

    const result = await fetchLongPosts();
    expect(result).toEqual([]);
});

test('fetchLongPosts should reject if API call fails', async () => {
    jest.resetModules();
    const axios = require('axios');
    jest.mock('axios');
    const { fetchLongPosts } = require('../work-with-api');

    axios.get.mockRejectedValue(new Error('Network Error'));

    await expect(fetchLongPosts()).rejects.toThrow('Network Error');
});

// Дополнительные тесты для manageUsers (MongoDB)

test('manageUsers should return empty array if no duplicates found', async () => {
    jest.resetModules();
    jest.mock('mongoose', () => ({
        model: jest.fn().mockReturnValue({
            create: jest.fn(),
            aggregate: jest.fn().mockResolvedValue([])
        }),
        connect: jest.fn()
    }));

    const { manageUsers } = require('../work-with-mongodb');
    const result = await manageUsers();
    expect(result).toEqual([]);
});

test('manageUsers should handle errors gracefully', async () => {
    jest.resetModules();
    jest.mock('mongoose', () => ({
        model: jest.fn().mockReturnValue({
            create: jest.fn(),
            aggregate: jest.fn().mockRejectedValue(new Error('DB Error'))
        }),
        connect: jest.fn()
    }));

    const { manageUsers } = require('../work-with-mongodb');
    await expect(manageUsers()).rejects.toThrow('DB Error');
});

// Дополнительные тесты для POST /user и GET /users

test('POST /user should allow adding multiple users and GET /users returns them all', async () => {
    const request = require('supertest');
    const app = require('../users-api');

    await request(app).post('/user').send({ name: 'Alice' }).expect(200);
    await request(app).post('/user').send({ name: 'Bob' }).expect(200);
    const response = await request(app).get('/users').expect(200);

    expect(response.body).toEqual([{ name: 'Alice' }, { name: 'Bob' }]);
});

test('GET /users should return empty array if no users posted', async () => {
    const request = require('supertest');
    const app = require('../users-api');

    const response = await request(app).get('/users').expect(200);
    expect(response.body).toEqual([]);
});

// Дополнительные тесты для fetchAll

test('fetchAll should return empty array if no URLs provided', async () => {
    jest.resetModules();
    const axios = require('axios');
    jest.mock('axios');
    const { fetchAll } = require('../asynchonus-development');

    const result = await fetchAll([]);
    expect(result).toEqual([]);
});

test('fetchAll should handle errors from one of the URLs', async () => {
    jest.resetModules();
    const axios = require('axios');
    jest.mock('axios');
    const { fetchAll } = require('../asynchonus-development');

    axios.get.mockResolvedValueOnce({ data: 'Result 1', status: 200 });
    axios.get.mockRejectedValueOnce(new Error('Network Fail'));

    const urls = ['url1', 'url2'];
    await expect(fetchAll(urls)).rejects.toThrow('Network Fail');
});

// Дополнительные тесты для manageRedis

test('manageRedis should handle multiple keys', async () => {
    jest.resetModules();
    jest.mock('redis', () => {
        const redisMock = require('redis-mock');
        return redisMock;
    });

    const { manageRedisMultipleKeys } = require('../work-with-redis'); 
    // Предположим, есть новая функция для работы с несколькими ключами

    const redis = require('redis');
    const mockRedisClient = redis.createClient();

    jest.spyOn(mockRedisClient, 'set')
        .mockImplementation((key, value, cb) => cb(null, 'OK'));
    jest.spyOn(mockRedisClient, 'get')
        .mockImplementation((key, cb) => cb(null, key === 'key1' ? 'val1' : 'val2'));

    const result = await manageRedisMultipleKeys(['key1', 'key2'], ['val1', 'val2']);
    expect(mockRedisClient.set).toHaveBeenCalledTimes(2);
    expect(mockRedisClient.get).toHaveBeenCalledTimes(2);
    expect(result).toEqual(['val1', 'val2']);
});

test('manageRedis should handle redis errors gracefully', async () => {
    jest.resetModules();
    jest.mock('redis', () => {
        const redisMock = require('redis-mock');
        return redisMock;
    });

    const { manageRedisWithError } = require('../work-with-redis'); 
    // Допустим, есть функция, которая вызывает ошибку
    const redis = require('redis');
    const mockRedisClient = redis.createClient();

    jest.spyOn(mockRedisClient, 'set')
        .mockImplementation((key, value, cb) => cb(new Error('Redis Set Error')));
    jest.spyOn(mockRedisClient, 'get')
        .mockImplementation((key, cb) => cb(null, 'unused'));

    await expect(manageRedisWithError('key', 'value')).rejects.toThrow('Redis Set Error');
});
