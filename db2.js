import mongoose from 'mongoose';
import { config } from 'dotenv';

config();

const url = process.env.Mongdb_uri;

// Define the schema
const ttkSchema = new mongoose.Schema({
  name: String,
  value: Number,
  // Add more fields as needed
});

const connectToDb = async () => {
    try {
        await mongoose.connect(url);
        console.log("Connected successfully to server");

        // Create a model using the schema
        const Ttk = mongoose.model('Ttk', ttkSchema, 'ttk');

        // Create a new document using the model
        const ttk = new Ttk({
          name: 'Example',
          value: 123,
          // Add more fields as needed
        });

        // Save the document to the database
        await ttk.save();
        console.log("Document inserted successfully");

        // Do something with the collection...
        const cursor = Ttk.find({}); 

    } catch (err) {
        console.error(err);
    }
    finally{
        mongoose.connection.close();
    }
};

connectToDb();