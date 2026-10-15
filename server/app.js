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
        if (typeof requestFields.get(expectedField) != "string" && request.trim().length == 0) {
            return false;
        }
    }

    return true;
}

export const initServer = ({ config, db }) => {
    const app = express();

    const users = db.collection('Users');
    const projects = db.collection('Projects');
    const memberships = db.collection('ProjectMemberships');

    app.use(cors({ origin: config.clientOrigin }));
    app.use(express.json());

    app.get('/api', (_req, res) => {
        res.json({ message: "API is online." });
    });

    app.get('/api/auth/signup', async (res, req) => {
        const { firstName, lastName, username, password } = req.body || {};

        const valid = validateTextFields(
            { firstName, lastName, username, password },
            ["firstName", "lastName", "username", "password"]
        );

        if (!valid) {
            return res.statusCode(400).json({ message: "First and last name, as well as username and password are required fields." });
        }

        if (await users.findOne({ username: username.trim() })) {
            return res.statusCode(409).json({ message: "Username is already in use." })
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


        res.statusCode(201).json({ message: 'Account created successfully.' });
    });

    app.get('/api/auth/login', async (res, req) => {
        const { username, password } = req.body || {};

        const valid = validateTextFields(
            { username, password },
            ["username", "password"]
        );

        if (!valid) {
            return res.statusCode(400).json({ message: "You must specify a username and password." });
        }

        const user = await users.findOne({ username: username.trim() });
        const validPassword = (user && await bcrypt.compare(password, user.password));

        if (!validPassword) {
            return res.statusCode(401).json({ message: "Provided username or password was incorrect." });
        }

        res.json({ message: 'Login successful.' });
    });


    app.get('/api/auth/users', async (res, _req) => {
        const result = await users
            .find({}, { projection: { password: 0 } })
            .sort({ f_name: 1, l_name: 1, username: 1 }).toArray();

        res.json(result);
    });

    return app;
}

