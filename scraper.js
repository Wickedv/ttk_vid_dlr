// import puppeteer from "puppeteer";
// import { promises as fs } from "fs";
// import { config } from "dotenv";
// // import connectDB from "./connect.js";
// import mongoose from "mongoose";
// import { MongoClient } from "mongodb";
// import { runInContext } from "vm";

// config();

// const proxyList = ["proxy1-ip:port", "proxy2-ip:port", "proxy3-ip:port"];
// const randomProxy = proxyList[Math.floor(Math.random() * proxyList.length)];
// //,`--proxy-server=${randomProxy}`

// // console.log(process.env.mondodb_uri)

// (async () => {
//   try {
//     const client = await mongoose
//       .connect(process.env.mondodb_uri)
//       .then(() => console.log("Connected to MongoDB"));
//     const mydata = new mongoose.Schema({
//       src: { type: String, required: true },
//       alt: { type: String, required: true },
//       img: { type: String, required: true },
//     });

//     const dat = mongoose.model("mydata", mydata);

//     const browser = await puppeteer.launch({
//       headless: false,
//       args: ["--no-sandbox", "--disable-setuid-sandbox"],
//       defaultViewport: null,
//       userDataDir: "./myUserDataDir",
//     });
//     const page = await browser.newPage();

//     await page.goto(process.env.URL);
//     await page.waitForSelector(".css-1as5cen-DivWrapper"); //this the download button

//     await page.evaluate(async () => {
//       for (let i = 0; i < 10; i++) {
//         window.scrollTo(0, document.body.scrollHeight);
//         await new Promise((resolve) => setTimeout(resolve, 2000));
//       }
//     });

//     const lnks = await page.$$eval(".css-1as5cen-DivWrapper > a", (el) =>
//       el.map((x) => x.getAttribute("href"))
//     );
//     const imgData = await page.$$eval(".css-41hm0z  img", (images) =>
//       images.map((img) => ({
//         src: img.getAttribute("src"),
//         alt: img.getAttribute("alt"),
//       }))
//     );

//     const mergeData = imgData.map((item, index) => ({
//       link: lnks[index],
//       ...item,
//     }));

//     fs.writeFile("links.txt", JSON.stringify(mergeData));

//     const localData =  JSON.parse(fs.readFileSync("links.txt", "utf-8"));

//     await dat.deleteMany({});

//     for (let item of mergeData) {
//       let data = new dat({
//         src: item.link,
//         img: item.src,
//         alt: item.alt,
//       });

//       await data.save();
//     }

//     //mydata.insertMany(imgData);
//     // console.log(imgData);

//     const data = JSON.stringify(imgData);
//     fs.writeFile("links.txt", data);
//   } finally {
//     mongoose.disconnect();
//     browser.close();
//   }
// })();

import puppeteer from "puppeteer";
import { promises as fs } from "fs";
import { config } from "dotenv";
import mongoose from "mongoose";

config();

const proxyList = ["proxy1-ip:port", "proxy2-ip:port", "proxy3-ip:port"];
const randomProxy = proxyList[Math.floor(Math.random() * proxyList.length)];
let browser;

// Queue to store the history of picked videos
let pickedVideos = [];
// Load the history of picked videos from a file
try {
  pickedVideos = await JSON.parse(fs.readFileSync('pickedVideos.json', 'utf-8'));
} catch (err) {
  // If the file does not exist, initialize pickedVideos as an empty array
  pickedVideos = [];
}

async function pickRandomVideo(dat) {
  // Get the total number of videos
  const count = await dat.countDocuments().exec();

  // Pick a random video
  let video;
  do {
    const random = Math.floor(Math.random() * count);
    video = await dat.findOne().skip(random).exec();
  } while (pickedVideos.includes(video._id.toString()));

  // Add the picked video to the queue
  pickedVideos.push(video._id.toString());

  // If the queue's size exceeds 7, remove the oldest video from the queue
  if (pickedVideos.length > 7) {
    pickedVideos.shift();
  }

// Save the history of picked videos to a file
  await fs.writeFile('pickedVideos.json', JSON.stringify(pickedVideos));
  
  return video;
}

(async () => {
  try {
    await mongoose.connect(process.env.Mongodb_uri);
    console.log("Connected to MongoDB");

    const mydata = new mongoose.Schema({
      src: { type: String, required: true },
      alt: { type: String, required: true },
      img: { type: String, required: true },
    });

    const dat = mongoose.model("mydata", mydata);

    browser = await puppeteer.launch({
      headless: false,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      defaultViewport: null,
      userDataDir: "./myUserDataDir",
    });
    const page = await browser.newPage();

    await page.goto(process.env.URL);
    await page.waitForSelector(".css-1as5cen-DivWrapper");

    await page.evaluate(async () => {
      for (let i = 0; i < 10; i++) {
        window.scrollTo(0, document.body.scrollHeight);
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    });

    const lnks = await page.$$eval(".css-1as5cen-DivWrapper > a", (el) =>
      el.map((x) => x.getAttribute("href"))
    );
    const imgData = await page.$$eval(".css-41hm0z  img", (images) =>
      images.map((img) => ({
        alt: img.getAttribute("alt"),
        img: img.getAttribute("src"),
      }))
    );

    const mergeData = imgData.map((item, index) => ({
      src: lnks[index],
      ...item,
    }));

     await fs.writeFile("links.txt", JSON.stringify(mergeData));

    // const localData = JSON.parse(await fs.readFile("links.txt", "utf-8"));


    // // Get MongoDB data
    // const mongoData = await dat.find({}).exec();
    // console.log(mongoData);
    // // Compare data and find differences
    // const differences = localData.filter(
    //   (item) => !mongoData.some((mongoItem) => mongoItem.src === item.link)
    // );

    // // Upload differences to MongoDB
    // if (differences.length > 0) {
    //   await dat.insertMany(differences);
    //   console.log("Number of documents inserted: " + differences.length);
    // } else {
    //   console.log("No new data to insert.");
    // }

    // Read data from file
const localData = JSON.parse(await fs.readFile("links.txt", "utf-8"));

// Get MongoDB data
const mongoData = await dat.find({}).exec();

// Compare data and find differences
const differences = localData.filter(
  (item) => !mongoData.some((mongoItem) => mongoItem.src === item.src)
);

// Log the number of differences
console.log(`Number of differences: ${differences.length}`);

// Upload differences to MongoDB
if (differences.length > 0) {
  await dat.insertMany(differences);
  console.log(`Number of documents inserted: ${differences.length}`);
} else {
  console.log("No new data to insert.");
}

    const video = await pickRandomVideo(dat);
    console.log(video);
  } finally {
    mongoose.disconnect();
    browser.close();
  }
})();