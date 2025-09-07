import { DataSource } from 'typeorm';

// Get PostgreSQL connection string with proper fallback
const postgresUrl = process.env.POSTGRES_CONNECTION_STRING || 'postgresql://postgres:admin@localhost:5432/afterwork_db';

export const AppDataSource = new DataSource({
    type: 'postgres',
    url: postgresUrl,
    entities: [],
    synchronize: true, // Only for development - set to false in production
    logging: process.env.NODE_ENV === 'development',
    migrations: ['src/migrations/*.ts'],
    subscribers: ['src/subscribers/*.ts'],
});

// Initialize the database connection
export const initializeDatabase = async () => {
    try {
        await AppDataSource.initialize();
        console.log('TypeORM DataSource has been initialized successfully.');
    } catch (error) {
        console.error('Error during DataSource initialization:', error);
        throw error;
    }
};
