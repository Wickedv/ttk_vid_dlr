import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';
import { config } from 'dotenv';
//import {data} from 'scema.js';

config();

const dataSchema = new mongoose.Schema({
    link: {type:String, required:true},
    img: {type:String, required:true},
    tag: {type:String, required:true}}
    );

const data = mongoose.model('data', dataSchema);

const connectDB = async (url) => {
    const client = new MongoClient(url);
// console.log(client)
    try {
        // await client.connect();
        // console.log('Connected to the database');
        // const database = client.db('ttk');
        // const collection = database.collection('ttk_fav');
        

        // const myData = new data({
        //     link: "https://www.youtube.com/watch?v=1",
        //     img: "https://www.youtube.com/watch?v=1",
        //     tag: "youtube"
        // });
        
        // collection.insertOne(myData);
        // // myData.save();
        // console.log(data.tag+" "+data.link+" "+data.img);

        // // Fetch all documents
        // const documents = await collection.find().toArray();

        // console.log(documents);
    } catch (error) {
        // console.error(error);
    } finally {
        // client.close();
    }
};

// connectDB(process.env.Mongdb_uri);

export default connectDB;
