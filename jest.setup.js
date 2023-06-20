jest.mock('@/config/di', () => ({
    configureContainer: jest.fn()
}));