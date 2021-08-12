import randString from 'randomstring';
import puppeteer, { Page } from 'puppeteer';

const BASEURL = 'https://flyos.top';
const KEY = '3C4K7DVT';

const sleep = async(ms: number) => new Promise(r => setTimeout(r, ms));

async function BrowserMain(page: Page) {
  const start = Date.now();
  while (true) {
    try {
      const username = randString.generate({ readable: true, length: 10 });
      const email = username + '@' + randString.generate({ readable: true, length: 12 }) + '.com';
      const password = randString.generate({
        readable: true,
        length: 10
      });

      console.log({username, email, password});
    
      await page.goto(BASEURL + '/');
      await (await page.waitForSelector('#header-secondary > ul > li.item-signUp > button'))!.click()
      await page.waitForSelector('#modal > div > div > div > form > div.Modal-body > div.Form.Form--centered > div:nth-child(1) > input');
      await sleep(250);
      await (await page.waitForSelector('#modal > div > div > div > form > div.Modal-body > div.Form.Form--centered > div:nth-child(1) > input'))?.focus();
      await page.type('#modal > div > div > div > form > div.Modal-body > div.Form.Form--centered > div:nth-child(1) > input', username, {delay:10});
      await sleep(150);
      await (await page.waitForSelector('#modal > div > div > div > form > div.Modal-body > div.Form.Form--centered > div:nth-child(2) > input'))?.focus();
      await page.type('#modal > div > div > div > form > div.Modal-body > div.Form.Form--centered > div:nth-child(2) > input', email, {delay:10});
      await sleep(150);
      await (await page.waitForSelector('#modal > div > div > div > form > div.Modal-body > div.Form.Form--centered > div:nth-child(3) > input'))?.focus();
      await page.type('#modal > div > div > div > form > div.Modal-body > div.Form.Form--centered > div:nth-child(3) > input', password, {delay:10});
      await sleep(150);
      await (await page.waitForSelector('#modal > div > div > div > form > div.Modal-body > div.Form.Form--centered > div:nth-child(4) > input'))?.focus();
      await page.type('#modal > div > div > div > form > div.Modal-body > div.Form.Form--centered > div:nth-child(4) > input', KEY, {delay:10});
    
      await sleep(550);
      await (await page.waitForSelector("#modal > div > div > div > form > div.Modal-body > div.Form.Form--centered > div:nth-child(5) > button"))!.click()
      await page.waitForSelector("#header-secondary > ul > li.item-session > div > button > span.Avatar");
    
      console.log("reg ok");
      await (await page.waitForSelector("#content > div > div.container > div > nav > ul > li.App-primaryControl.item-newDiscussion > button"))!.click();
      console.log("new discu");
      await page.waitForSelector("#composer > div > div.Composer-content > div > div.ComposerBody-content");
      
      await (await page.waitForSelector("#composer > div > div.Composer-content > div > div.ComposerBody-content > ul > li.item-tags > a"))!.click();
      await (await page.waitForSelector("#modal > div > div > div > form > div.Modal-footer > ul > li.pinned.colored.active > span.icon.TagIcon"))!.click();
      await (await page.waitForSelector("#modal > div > div > div > form > div.Modal-body > div > div.TagDiscussionModal-form-submit.App-primaryControl > button"))!.click();

      console.log("set discu");
      await sleep(500);
      await page.type('#composer > div > div.Composer-content > div > div.ComposerBody-content > ul > li.item-discussionTitle > h3 > input',randString.generate({
        readable: true,
        length: 5
      }),{delay: 50});
       
      await page.type("#composer > div > div.Composer-content > div > div.ComposerBody-content > div > div > div > div > div.ComposerBody-mentionsWrapper > textarea", randString.generate({
        readable: true,
        length: 150
      }), {
        delay: 10
      });
    
      await (await page.waitForSelector("#composer > div > div.Composer-content > div > div.ComposerBody-content > div > div > ul > li.App-primaryControl.item-submit > button"))!.click();
      console.log("send discu");

      await sleep(500);
      await page.deleteCookie(
        ...((await page.cookies()).map(({name}) => ({ name })))
      );  
      
      if ((Date.now() - start) >= (6*60*60*1000)) break;
      await sleep(1500);
    } catch {
      console.log('err');
      continue;
    }
  }
}

(async() => {
  const browser = await puppeteer.launch({
    headless: true
  });

  await BrowserMain(await browser.newPage());

})();