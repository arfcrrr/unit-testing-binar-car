const authHelper = require('../helpers/auth.helper');
const authController = require('./AuthenticationController');
const { sequelize } = require("../models");

const { queryInterface } = sequelize;

beforeAll(async () => {
    const password = await authHelper.encryptPassword('password123');
    const timestamp = new Date();

    await queryInterface.bulkInsert('Users', [
        {
            name: 'Harry Potter',
            email: 'potter@hogwarts.com',
            password,
            roleId: 1,
            createdAt: timestamp,
            updatedAt: timestamp,
        }
    ], {});
});

afterAll(async () => {
    await queryInterface.bulkDelete('Users', null, {
        truncate: true,
        restartIdentity: true
    });
});

describe('Authentication Controller', () => {
    describe('#login()', () => {
        it('should return success 201 and token', async () => {
            const email = 'potter@hogwarts.com';
            const password = 'password123';

            const mockRequest = {
                body: {
                    email,
                    password,
                }
            };

            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
            };

            await authController.login(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith({
                accessToken: expect.any(String),
            });
        });

        it('should return error 401 and message', async () => {
            const email = 'potter@hogwarts.com';
            const password = 'passwordsalah123';

            const mockRequest = {
                body: {
                    email,
                    password,
                }
            };

            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
            };

            await authController.login(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: {
                    name: 'Error',
                    message: 'Password is not correct!',
                    details: this.details
                }
            });
        });

        it('should return error 404 and message', async () => {
            const email = 'harry@hogwarts.com';
            const password = 'password123';

            const mockRequest = {
                body: {
                    email,
                    password,
                }
            };

            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
            };

            await authController.login(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: {
                    name: 'Error',
                    message: `${email} is not registered!`,
                    details: { email }
                }
            });
        });
    })

    describe('#register', () => {
        it('should return 201 and token', async () => {
            const name = 'Luna Lovegood';
            const email = 'lovegood@hogwarts.com';
            const password = 'password123';

            const mockRequest = {
                body: {
                    name,
                    email,
                    password,
                }
            };

            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
            };

            await authController.register(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith({
                accessToken: expect.any(String),
            });
        });

        it('should return error 422 and message', async () => {
            const name = 'Luna Lovegood';
            const email = 'potter@hogwarts.com';
            const password = 'password123';

            const mockRequest = {
                body: {
                    name,
                    email,
                    password,
                }
            };

            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
            };

            await authController.register(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(422);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: {
                    name: 'ReferenceError',
                    message: 'EmailAlreadyTakenError is not defined',
                    details: null
                }
            });
        });
    });
});