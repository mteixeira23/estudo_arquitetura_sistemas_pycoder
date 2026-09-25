const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', defaultViewport: { width: 1440, height: 900 } });
  const page = await browser.newPage();
  
  console.log('📡 Accessing 1vhzr6n2z.vercel.app...');
  await page.goto('https://sgi-fundacao-dr-jesus-1vhzr6n2z.vercel.app', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));

  // Click Acessar Sistema
  const btns = await page.$$('button');
  for (let b of btns) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && text.includes('Acessar')) {
      await b.click();
      await new Promise(r => setTimeout(r, 1000));
      break;
    }
  }

  // Click Entrar no Sistema
  const submit = await page.$('button[type="submit"], .btn-primary');
  if (submit) {
    await submit.click();
    await new Promise(r => setTimeout(r, 1500));
  }

  // Inspect all card titles
  const h3s = await page.$$eval('h3', els => els.map(e => e.textContent.trim()));
  console.log('📋 Card Titles on 1vhzr6n2z:', h3s);

  await browser.close();
})().catch(console.error);
