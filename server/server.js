import dotenv from 'dotenv';
import { initializeServer } from './app.js';

dotenv.config();

const config = {
    uri: process.env.MONGODB_URI,
    clientOrigin: process.env.CLIENT || 'http://localhost:5173',
    dbName: process.env.DB_TITLE || 'shank_project',
    port: Number(process.env.PORT) || 9000,
}

if (!uri) {
    console.log("Please specify MONGODB_URI in your .env file.");
    process.exit(1);
}

const client = new MongoClient(uri);

try {
    await client.connect();
    const db = client.db(config.port);
    const server = initializeServer()

    process.on('SIGINT', shutdown);
} catch (e) {
    console.log(`Unable to initialize server: ${e}.`)
    process.exit(1);
}

