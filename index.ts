import puppeteer, { EvaluateFn } from 'puppeteer';
import rand from 'randomstring';
import axios from 'axios';
import pageProxy from 'puppeteer-page-proxy';
import path from 'path';

const sleep = async(ms: number) => new Promise(r => setTimeout(r, ms));

const main = async() => {
  const browser = await puppeteer.launch({
    headless: false,
    devtools: false
  });
  console.log('start');
  launchPage(await browser.newPage());
  launchPage(await browser.newPage());
  launchPage(await browser.newPage());
  
};
const REGISTER_URL = 'https://flyosforum.huoyinetwork.cn/index.php?app=user&ac=register';
const launchPage = async(page: puppeteer.Page) => {
  while(true) {

    // const proxy = await axios.get('http://demo.spiderpy.cn/get/', {
    //   responseType: 'json'
    // });
    // console.log('proxy', proxy.data);
    // await pageProxy(page, proxy.data.https ? 'https://' : 'http://' +  proxy.data.proxt);
    console.log('goto register')
    await page.goto(REGISTER_URL);
    console.log('wait');
    const submit = await page.waitForSelector('#comm-submit');
    const email = await page.waitForSelector('#comm-form > div:nth-child(1) > input'),
      password = await page.waitForSelector('#comm-form > div:nth-child(2) > input'),
      passwordAgain = await page.waitForSelector('#comm-form > div:nth-child(3) > input'),
      username = await page.waitForSelector('#comm-form > div:nth-child(4) > input');

    console.log('ready');

    const rand0 = rand.generate({
      readable: true,
      charset: 'FLYOSFUCKYOUflyosfuckyou',
      length: 5
    }), rand1 = rand.generate({
      readable: true,
      charset: 'abcdefghijklmnopqrst1234567890',
      length: 8
    }), rand2 = rand.generate({
      readable: true,
      length: 10
    });

    console.log([`${rand0}@${rand1}.com`, rand0, rand2])

    await email!.evaluate((node: any, r0, r1) => {
      node.value = `${r0}@${r1}.com`; 
    }, rand0, rand1);

    await password!.evaluate((node: any, r2) => {
      node.value = r2; 
    }, rand2);

    await passwordAgain!.evaluate((node: any, r2) => {
      node.value = r2; 
    }, rand2);

    await username!.evaluate((node: any, r0) => {
      node.value = r0; 
    }, rand0);

    await submit!.click();
    console.log('set image')
    await sleep(8000);
    const picker = await page.waitForSelector('body > div:nth-child(4) > div > div.col-md-6 > div > div > form > div:nth-child(2) > div:nth-child(2) > input[type=file]');
    const picker_ok = await page.waitForSelector('body > div:nth-child(4) > div > div.col-md-6 > div > div > form > div:nth-child(3) > button');
    await picker!.uploadFile(path.resolve(__dirname, 'R.jpg'));
    await sleep(1000);
    await picker_ok!.click();
    await sleep(1000);
  
    await page.goto('https://flyosforum.huoyinetwork.cn/index.php?app=article&ac=add');
    await sleep(8000);
    console.log('send art')
    const art_title = await page.waitForSelector('body > div:nth-child(5) > div > div > div > div.col-md-8 > form > div:nth-child(1) > input');
    const art_content = await page.waitForSelector('#tseditor');
    const art_submit = await page.waitForSelector('body > div:nth-child(5) > div > div > div > div.col-md-8 > form > button');

    await art_title!.evaluate((node: any, rnd) => {
      node.value = `${rnd}`
    }, rand.generate({
      readable: true,
      length: 10
    }));

    await art_content!.evaluate((node: any, rnd) => {
      node.value = `${rnd}<br/>`;
    }, rand.generate({
      readable: true,
      length: 1000
    }));

    await art_submit!.click();

    await sleep(1000);

    await page.goto('https://flyosforum.huoyinetwork.cn/index.php?app=weibo');
    await sleep(8000);
    const wb_title = await page.waitForSelector('#title');
    const wb_submit = await page.waitForSelector('#comm-form > div.d-flex.justify-content-between.align-content-center.mt-2 > div:nth-child(2) > button');

    await wb_title!.evaluate((node: any, rnd) => {
      node.value = 'xdm说实话我也懒得浪费流量.' + rnd 
    }, rand.generate({
      readable: true,
      length: 800
    }));

    await wb_submit!.click();

    await sleep(1000);

    await page.deleteCookie(
      ...((await page.cookies()).map(({name}) => ({ name })))
    );  
    

    // await sleep(3000);
    
  }

}

main();