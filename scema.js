import {mongoose} from 'mongoose';

const dataSchema = new mongoose.Schema({
    link: {type:String, required:true},
    img: {type:String, required:true},
    tag: {type:String, required:true}}
    );

const data = mongoose.model('data', dataSchema);

// const vid = new vid({
//     link: "https://www.youtube.com/watch?v=1",
//     img: "https://www.youtube.com/watch?v=1",
//     tag: "youtube"
// });

// vid.save();

export default data;