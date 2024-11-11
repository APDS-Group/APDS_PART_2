import { connectToDatabase } from '../Backend/db/conn.mjs';
import { MongoClient } from 'mongodb';

// Mock the MongoClient class from the mongodb package
jest.mock('mongodb', () => {
    const mMongoClient = {
        connect: jest.fn(),
        db: jest.fn().mockReturnThis(),
    };
    return { MongoClient: jest.fn(() => mMongoClient) };
});

describe('connectToDatabase', () => {
    let originalEnv;

    beforeAll(() => {
        // Save the original environment variables
        originalEnv = process.env;
        // Set the ATLAS_URI environment variable for testing
        process.env.ATLAS_URI = 'mongodb://localhost:27017';
    });

    afterAll(() => {
        // Restore the original environment variables
        process.env = originalEnv;
    });

    it('should connect to the database and return the db reference', async () => {
        const db = await connectToDatabase();
        expect(MongoClient).toHaveBeenCalledWith('mongodb://localhost:27017', { tlsAllowInvalidCertificates: true });
        expect(db).toBeDefined();
    });

    it('should throw an error if connection fails', async () => {
        MongoClient.mockImplementationOnce(() => {
            return {
                connect: jest.fn().mockRejectedValue(new Error('Connection failed')),
                db: jest.fn(),
            };
        });

        await expect(connectToDatabase()).rejects.toThrow('Connection failed');
    });
});