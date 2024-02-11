import puppeteer from 'puppeteer';
import { getPageContent } from 'puppeteer';

(async() => {    
    const browser = await puppeteer.launch({headless: false, args: ['--no-sandbox'], userDataDir: './userData'});
    const page = await browser.newPage();
    await page.goto('https://tiktok.com/@underrated.musicc');

    try {
        //for vid
         await page.waitForSelector('.css-1as5cen-DivWrapper.e1cg0wnj1')
        const vids = await page.$$('.css-1as5cen-DivWrapper.e1cg0wnj1 a')
        //const html = await vids.evaluate(d => d.href)
        const html = await vids.evaluate((vids)=>{
            return vids.href
        })
         console.log(html)
    
    //for img
        await page.waitForSelector(".css-vi46v1-DivDesContainer.eih2qak4")
        const name = await page.$(".css-vi46v1-DivDesContainer.eih2qak4 div a")
        const text = await name.evaluate(d => d.textContent)
        console.log(text)
        
    } catch (error) {
        console.log(error)
    }

    finally {
    await browser.close()
    }
})()