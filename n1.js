import puppeteer from "puppeteer";
import { promises as fs } from "fs";
import { config } from "dotenv";
import mongoose from "mongoose";

config();

const proxyList = process.env.PROXY_LIST.split(",");
const randomProxy = proxyList[Math.floor(Math.random() * proxyList.length)];

async function loadPickedVideos() {
  try {
    return JSON.parse(await fs.readFile('pickedVideos.txt', 'utf-8'));
  } catch (err) {
    return [];
  }
}

async function pickRandomVideo(dat, pickedVideos) {
  const count = await dat.countDocuments().exec();
  let video;
  do {
    const random = Math.floor(Math.random() * count);
    video = await dat.findOne().skip(random).exec();
  } while (pickedVideos.includes(video._id.toString()));

  pickedVideos.push(video._id.toString());
  if (pickedVideos.length > 7) {
    pickedVideos.shift();
  }

  await fs.writeFile('pickedVideos.txt', JSON.stringify(pickedVideos));
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
    const browser = await puppeteer.launch({
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

    const localData = JSON.parse(await fs.readFile("links.txt", "utf-8"));
    const mongoData = await dat.find({}).exec();

    const differences = localData.filter(
      (item) => !mongoData.find((mongoItem) => mongoItem.src === item.link)
    );

    if (differences.length > 0) {
      await dat.insertMany(differences);
      console.log(`Number of documents inserted: ${differences.length}`);
    } else {
      console.log("No new data to insert.");
    }

    const pickedVideos = await loadPickedVideos();
    const video = await pickRandomVideo(dat, pickedVideos);
    console.log(video);
  } catch (error) {
    console.error(error);
  } finally {
    mongoose.disconnect();
    if (browser) {
      browser.close();
    }
  }
})();