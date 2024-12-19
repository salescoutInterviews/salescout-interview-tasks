afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
});

afterAll(async () => {
    if (global.mongoConnection) {
        await global.mongoConnection.close();
    }
    if (global.redisClient) {
        global.redisClient.quit();
    }
});
