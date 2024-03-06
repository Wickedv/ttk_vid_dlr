import puppeteer from 'puppeteer';
import { timeout } from 'puppeteer';
import { promises as fs } from 'fs';
import { config } from 'dotenv';
import { getPageContent } from 'puppeteer';

const proxyList = ['proxy1-ip:port', 'proxy2-ip:port', 'proxy3-ip:port'];
const randomProxy = proxyList[Math.floor(Math.random() * proxyList.length)];

(async() => {    
    const browser = await puppeteer.launch({headless: false, args: ['--no-sandbox', '--disable-setuid-sandbox',`--proxy-server=${randomProxy}`], defaultViewport: null, userDataDir: './myUserDataDir'});
    const page = await browser.newPage();
    //console.log(process.env.url);
    await page.goto((process.env.url));

    // Take a screenshot
    const content = await page.content("body");
    //const btn = await page.$('.css-u3m0da-DivBoxContainer');
    //await page.waitForSelector('.css-u3m0da-DivBoxContainer' || '.css-7u35li-DivBoxContainer.e1cgu1qo0'|| '.css-1as5cen-DivWrapper');  this the continue as guest button

    //await page.click('.css-u3m0da-DivBoxContainer' || '.css-7u35li-DivBoxContainer.e1cgu1qo0'); click on continue as guest button

    await page.waitForSelector('.css-1as5cen-DivWrapper'); //this the download button

    //const files = await page.$$((".css-1as5cen-DivWrapper.e1cg0wnji"));
    const dam = await page.evaluateHandle(() => {
        return document.querySelector(".css-1as5cen-DivWrapper.e1cg0wnji > a [href]");
    });

    const filesString = JSON.stringify(dam);
    fs.writeFile('files.txt', filesString);
    
    //fs.writeFile('btn.txt', btn);
    //fs.writeFileSync('content.txt', content);

    console.log(filesString);
    //await page.screenshot({ path: 'screenshot.png' });
    //console.log(content);

   browser.close();
})()