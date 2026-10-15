import dotenv from 'dotenv';
import { createDatabaseCollections, initServer } from './app.js';
import { MongoClient } from 'mongodb';

dotenv.config();

const config = {
    mongoUri: process.env.MONGODB_URI,
    clientOrigin: process.env.CLIENT || 'http://localhost:5173',
    dbName: process.env.DB_TITLE || 'shank_project',
    port: Number(process.env.PORT) || 9000,
}

if (!config.mongoUri) {
    console.log("Please specify MONGODB_URI in your .env file.");
    process.exit(1);
}

const client = new MongoClient(config.mongoUri);

try {
    await client.connect();
    const db = client.db(config.dbName);
    await createDatabaseCollections(db)
    const app = initServer({ config, db });

    const server = app.listen(config.port, () => {
        console.log("Server is running!");
    })

    const shutdown = async () => {
        server.close(async () => {
            await client.close();
            process.exit(0);
        });
    }

    process.on('SIGINT', shutdown);
} catch (e) {
    console.log(`Unable to initialize server: ${e}.`)
    process.exit(1);
}

