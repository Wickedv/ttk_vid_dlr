import puppeteer from 'puppeteer';
import { timeout } from 'puppeteer';
import { promises as fs } from 'fs';
import url from 'env';
import { getPageContent } from 'puppeteer';

(async() => {    
    const browser = await puppeteer.launch({headless: false, args: ['--no-sandbox', '--disable-setuid-sandbox'], defaultViewport: null});
    const page = await browser.newPage();
    await page.goto("$(url)");

    // Take a screenshot
    const content = await page.content("body");
    //const btn = await page.$('.css-u3m0da-DivBoxContainer');
    await page.waitForSelector('.css-u3m0da-DivBoxContainer' || '.css-7u35li-DivBoxContainer.e1cgu1qo0'|| '.css-1as5cen-DivWrapper');

    await page.click('.css-u3m0da-DivBoxContainer' || '.css-7u35li-DivBoxContainer.e1cgu1qo0');

    const files = await page.$(".css-1as5cen-DivWrapper")

    const filesString = JSON.stringify(files);
    fs.writeFile('files.txt', filesString);
    
    //fs.writeFile('btn.txt', btn);
    //fs.writeFileSync('content.txt', content);

    console.log(files);
    await page.screenshot({ path: 'screenshot.png' });
    //console.log(content);

   browser.close();
})()