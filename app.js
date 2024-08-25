const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

const URL = process.env.MONGO_URL;
const DB_NAME = 'Roamingo';
const DB_COLLECTION_BUS = 'Bus';

app.use(express.json());

let collection;

MongoClient.connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ssl: true 
}).then(client => {
    console.log("Connected to MongoDB");
    const db = client.db(DB_NAME);
    collection = db.collection(DB_COLLECTION_BUS);
}).catch(err => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1); // Exit if connection fails
});

app.get('/buses', async (req, res) => {
    try {
        if (!collection) {
            throw new Error("Database connection not established");
        }
        const buses = await collection.find({}).toArray();
        res.json(buses);
    } catch (err) {
        res.status(500).send("Error fetching buses: " + err);
    }
});

app.post('/buses', async (req, res) => {
    try {
        if (!collection) {
            throw new Error("Database connection not established");
        }
        const newBus = req.body;
        const result = await collection.insertOne(newBus);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).send("Error creating bus: " + err);
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
