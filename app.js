const express = require('express');
const { ObjectId, MongoClient } = require('mongodb');
const cors = require('cors');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = express();

app.use(express.json());
app.use(cors());

let client;
const initializeDBAndServer = async () => {
    const username = encodeURIComponent("eerotubalakrishna");
    const password = encodeURIComponent("Mb6CibpOs6VuTx6j"); // Use your actual password here
    const uri = `mongodb+srv://${username}:${password}@cluster0.0fpbk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

    client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("Connected to MongoDB.....");
        app.listen(3008, () => {
            console.log('Server running on port: 3008');
        });
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
};

initializeDBAndServer();

app.get('/getProfiles', async (req, res) => {
    try {
        const db = client.db('myDatabase');

        // Parse limit and offset from query parameters with default values
        const limit = parseInt(req.query.limit) || 5;
        const offset = parseInt(req.query.offset) || 0; // Offset should typically start from 0

        const users = await db.collection('users')
            .find()
            .skip(offset) // Skip the first 'offset' number of documents
            .limit(limit) // Limit the result to 'limit' number of documents
            .toArray();

        res.status(200).json(users);
    } catch (error) {
        console.error("Error retrieving profiles:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.get('/sort', async (req, res) => {
    try {
        const db = client.db('myDatabase');
        const collection = db.collection('users');
        console.log("Fetching sorted users...");

        const sortedUsers = await collection.find().sort({ location: 1 }).toArray();
        console.log("Sorted users:", sortedUsers);

        res.status(200).json(sortedUsers);
    } catch (error) {
        console.error("Error sorting profiles:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.post('/createProfile', async (req, res) => {
    try {
        const db = client.db('myDatabase'); // Ensure the database name is correct
        const newProfile = req.body; // Assuming the profile data is sent in the request body

        // Insert the new profile into the 'users' collection
        const result = await db.collection('users').insertOne(newProfile);

        res.status(201).json({ message: 'Profile created successfully', profileId: result.insertedId });
    } catch (error) {
        console.error("Error creating profile:", error);
        res.status(500).send("Internal Server Error");
    }
});
