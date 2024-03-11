import puppeteer from "puppeteer";
import { promises as fs } from "fs";
import { config } from "dotenv";
import connectDB from "./connect.js";
import { runInContext } from "vm";

config();

const proxyList = ["proxy1-ip:port", "proxy2-ip:port", "proxy3-ip:port"];
const randomProxy = proxyList[Math.floor(Math.random() * proxyList.length)];
//,`--proxy-server=${randomProxy}`



(async () => {
  // const browser = await puppeteer.launch({
  //   headless: false,
  //   args: ["--no-sandbox", "--disable-setuid-sandbox"],
  //   defaultViewport: null,
  //   userDataDir: "./myUserDataDir",
  // });
  // const page = await browser.newPage();

  // await page.goto(process.env.URL);
  // await page.waitForSelector(".css-1as5cen-DivWrapper"); //this the download button

  // await page.evaluate(async () => {
  //   for (let i = 0; i < 10; i++) {
  //     window.scrollTo(0, document.body.scrollHeight);
  //     await new Promise((resolve) => setTimeout(resolve, 2000));
  //   }
  // });

  // const lnks = await page.$$eval(".css-1as5cen-DivWrapper > a", (el) =>
  //   el.map((x) => x.getAttribute("href"))
  // );
  // const imgData = await page.$$eval(".css-41hm0z  img", (images) =>
  //   images.map((img) => ({
  //     src: img.getAttribute("src"),
  //     alt: img.getAttribute("alt"),
  //   }))
  // );
  // console.log(imgData);

  // const data = JSON.stringify(imgData);
  // fs.writeFile("links.txt", data);

  // browser.close();
})();
