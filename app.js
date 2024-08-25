const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

const URL = 'mongodb+srv://DivyanshuAhirrao:Dadu%401699@roamingo.jodfp.mongodb.net/Roamingo?retryWrites=true&w=majority';
const DB_NAME = 'Roamingo';
const DB_COLLECTION_BUS = 'Bus';

app.use(express.json());

let db, collection;

// Connection with MongoDB
MongoClient.connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(client => {
    console.log("Connected to MongoDB");
    db = client.db(DB_NAME);
    collection = db.collection(DB_COLLECTION_BUS);
}).catch(err => console.error("Failed to connect to MongoDB", err));

app.get('/buses', async (req, res) => {
    try {
        const buses = await collection.find({}).toArray();
        res.json(buses);
    } catch (err) {
        res.status(500).send("Error fetching buses: " + err);
    }
});

app.post('/buses', async (req, res) => {
    try {
        const newBus = req.body;
        const result = await collection.insertOne(newBus);
        res.status(200 || 201).json(result);
    } catch (err) {
        res.status(500).send("Error creating buses: " + err);
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
