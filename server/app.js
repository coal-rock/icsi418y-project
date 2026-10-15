import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";

export const createDatabaseCollections = async (db) => {
    await db.collection('Projects').createIndex({ project_lead_id: 1 });
    await db.collection('Users').createIndex({ username: 1 }, { unique: true });
    await db.collection('ProjectMemberships').createIndex(
        { project_id: 1, user_id: 1 },
        { unique: true },
    );
}

const validateTextFields = (requestFields, expectedFields) => {
    for (const expectedField of expectedFields) {
        const value = requestFields[expectedField];
        if (typeof value !== "string" || value.trim().length === 0) {
            return false;
        }
    }

    return true;
}

export const initServer = ({ config, db }) => {
    const app = express();

    const users = db.collection('Users');

    app.use(cors({ origin: config.clientOrigin }));
    app.use(express.json());

    app.get('/api', (_req, res) => {
        res.json({ message: "API is online." });
    });

    app.post('/api/auth/signup', async (req, res) => {
        const { firstName, lastName, username, password } = req.body || {};

        const valid = validateTextFields(
            { firstName, lastName, username, password },
            ["firstName", "lastName", "username", "password"]
        );

        if (!valid) {
            return res.status(400).json({ message: "First and last name, as well as username and password are required fields." });
        }

        if (await users.findOne({ username: username.trim() })) {
            return res.status(409).json({ message: "Username is already in use." })
        }

        const newUser = {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            username: username.trim(),
            password: await bcrypt.hash(password, 12),
        }

        try {
            await users.insertOne(newUser);
        } catch (error) {
            if (error.code === 11000) {
                return res.status(409).json({ message: 'Username is already in use.' });
            }
            throw error;
        }


        res.status(201).json({ message: 'Account created successfully.' });
    });

    app.post('/api/auth/login', async (req, res) => {
        const { username, password } = req.body || {};

        const valid = validateTextFields(
            { username, password },
            ["username", "password"]
        );

        if (!valid) {
            return res.status(400).json({ message: "You must specify a username and password." });
        }

        const user = await users.findOne({ username: username.trim() });
        const validPassword = (user && await bcrypt.compare(password, user.password));

        if (!validPassword) {
            return res.status(401).json({ message: "Provided username or password was incorrect." });
        }

        res.json({ message: 'Login successful.' });
    });


    app.get('/api/auth/users', async (_req, res) => {
        const result = await users
            .find({}, { projection: { password: 0 } })
            .sort({ f_name: 1, l_name: 1, username: 1 }).toArray();

        res.json(result);
    });

    return app;
}

