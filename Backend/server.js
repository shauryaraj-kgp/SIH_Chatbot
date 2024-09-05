const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://shauryaraj694:q5nZBvDacu0tS3ZY@museum-cluster.8nllv.mongodb.net/?retryWrites=true&w=majority&appName=museum-cluster', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

const infoSchema = new mongoose.Schema({
    showName: String,
    price: Number,
    capacity: Number
});

const Info = mongoose.model('Info', infoSchema);

app.get('/getInfo/:dbName', async (req, res) => {
    const dbName = req.params.dbName; // The first input entered by user will be the dbName
    const infoData = await mongoose.connection.useDb(dbName).collection('info').find().toArray();
    res.send(infoData);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
