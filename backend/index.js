import express from "express";
import mongoose from "mongoose";
import cors from "cors";
const app = express();
const port = 3001; // or any other port you prefer

app.use(cors());
app.use(express.json());

// Connect to MongoDB (replace 'your_mongodb_connection_string' with your actual MongoDB connection string)
mongoose.connect('mongodb+srv://avadhanamarjit15:mongoarjit15@cluster0.lvudfup.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define a schema for the City model
const citySchema = new mongoose.Schema({
  name: String,
  temperature: Number,
  condition: String,
  description: String,
});

// Create a City model based on the schema
const City = mongoose.model('City', citySchema);

// Endpoint to save a city to MongoDB
app.post('/api/cities', async (req, res) => {
  try {
    const { name, temperature, condition, description } = req.body;
    const newCity = new City({
      name,
      temperature,
      condition,
      description,
    });

    await newCity.save();
    res.status(201).json(newCity);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Endpoint to get all cities from MongoDB
app.get('/api/cities', async (req, res) => {
  try {
    const cities = await City.find();
    res.json(cities);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});
app.delete('/api/cities/:id', async (req, res) => {
  const { id } = req.params;
  console.log("Received delete request for ID:", id);

  try {
    // Use mongoose to delete the city by ID
    const result = await City.findByIdAndDelete(id);

    console.log("Deletion result:", result); // Add this line

    if (!result) {
      return res.status(404).json({ message: 'City not found' });
    }

    return res.status(204).send(); // 204 No Content for successful deletion
  } catch (error) {
    console.error('Error deleting city:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});


// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
