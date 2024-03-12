import connecttoDB from "./db.js";

async  function run() {
    connecttoDB();
    console.log('Connected to the database');
    const database = .db('ttk');
    const collection = database.collection('ttk_fav');  

    console.log(collection);
}

run();