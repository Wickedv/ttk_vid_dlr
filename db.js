import { MongoClient } from 'mongodb';
import { config } from 'dotenv';

config();

const url = process.env.Mongdb_uri;
const dbName = 'ttk';
const collectionName = 'ttk_fav';

const connectToDb = async () => {
    try {
        const client = await MongoClient.connect(url);
        console.log("Connected successfully to server");

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Do something with the collection...
        const cursor = collection.find({}); 

        // Print documents
        await cursor.forEach(doc => console.log(doc));

        // Don't forget to close the connection when you're done
        await client.close();
    } catch (err) {
        console.error('An error occurred connecting to MongoDB: ', err);
        throw err; // re-throw the error unchanged
    }
};

connectToDb();



// in mongoose form 

/*  import mongoose from 'mongoose';
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
        await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected successfully to server");

        // Create a model using the schema
        const Ttk = mongoose.model('Ttk', ttkSchema, 'ttk_fav');

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
};

connectToDb(); 
*/