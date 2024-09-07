// backend/server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://shauryaraj694:q5nZBvDacu0tS3ZY@museum-cluster.8nllv.mongodb.net/?retryWrites=true&w=majority&appName=museum-cluster')
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

// Define schemas (if necessary)
const infoSchema = new mongoose.Schema({
    showName: String,
    price: Number,
    capacity: Number,
    email: String,
    timings: String
});

const customerSchema = new mongoose.Schema({
    museumName: String,
    bookingDateTime: String,
    numTickets: Number,
    totalPrice: Number,
    entryFee: Number
});

// Define models (if necessary)
const Info = mongoose.model('Info', infoSchema);

app.get('/getInfo/:dbName', async (req, res) => {
    const dbName = req.params.dbName;
    try {
        const db = mongoose.connection.useDb(dbName);
        const infoData = await db.collection('info').find().toArray();
        res.send(infoData);
    } catch (error) {
        console.error('Error fetching info:', error);
        res.status(500).send({ error: 'Error fetching info' });
    }
});

app.post('/saveBooking/:dbName', async (req, res) => {
    const dbName = req.params.dbName;
    const bookingData = req.body;
    try {
        const db = mongoose.connection.useDb(dbName);
        const collection = db.collection('customers');
        await collection.insertOne(bookingData);
        res.status(200).send({ message: 'Booking saved successfully' });
    } catch (error) {
        console.error('Error saving booking:', error);
        res.status(500).send({ error: 'Error saving booking' });
    }
});

// Use Vercel's port or 3000 if running locally
const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
