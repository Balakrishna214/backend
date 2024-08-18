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
        
        // Retrieve all profiles from the database
        const users = await db.collection('users').find().toArray();

        // Send the entire profiles array to the frontend
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
        
        // Sort users by location and retrieve all sorted profiles
        const sortedUsers = await collection.find().sort({ location: 1 }).toArray();
        
        // Send the entire sorted profiles array to the frontend
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
