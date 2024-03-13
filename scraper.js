import puppeteer from "puppeteer";
import { promises as fs } from "fs";
import { config } from "dotenv";
// import connectDB from "./connect.js";
import mongoose from "mongoose";
import { MongoClient } from "mongodb";
import { runInContext } from "vm";

config();

const proxyList = ["proxy1-ip:port", "proxy2-ip:port", "proxy3-ip:port"];
const randomProxy = proxyList[Math.floor(Math.random() * proxyList.length)];
//,`--proxy-server=${randomProxy}`

// console.log(process.env.mondodb_uri)

(async () => {
  try {
    const client = await mongoose
      .connect(process.env.mondodb_uri)
      .then(() => console.log("Connected to MongoDB"));
    const mydata = new mongoose.Schema({
      src: { type: String, required: true },
      alt: { type: String, required: true },
      img: { type: String, required: true },
    });

    const dat = mongoose.model("mydata", mydata);

    const browser = await puppeteer.launch({
      headless: false,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      defaultViewport: null,
      userDataDir: "./myUserDataDir",
    });
    const page = await browser.newPage();

    await page.goto(process.env.URL);
    await page.waitForSelector(".css-1as5cen-DivWrapper"); //this the download button

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
        src: img.getAttribute("src"),
        alt: img.getAttribute("alt"),
      }))
    );

    const mergeData = imgData.map((item, index) => ({
      link: lnks[index],
      ...item,
    }));

    await dat.deleteMany({});

    for (let item of mergeData) {
      let data = new dat({
        src: item.link,
        img: item.src,
        alt: item.alt,
      });

      await data.save();
    }

    //mydata.insertMany(imgData);
    // console.log(imgData);

    const data = JSON.stringify(imgData);
    fs.writeFile("links.txt", data);
  } finally {
    mongoose.disconnect();
    browser.close();
  }
})();
