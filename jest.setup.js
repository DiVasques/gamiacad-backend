jest.mock('@/config/di', () => ({
    configureContainer: jest.fn()
}));

global.console = {
    ...console,
    log: jest.fn(),
    debug: jest.fn(),
}