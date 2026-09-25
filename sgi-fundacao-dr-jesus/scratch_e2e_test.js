const puppeteer = require('puppeteer');
const path = require('path');
const artifactDir = 'C:/Users/marcos.teixeira/.gemini/antigravity/brain/3a2891e8-856a-4f0b-92dd-f3422c6430d2';

(async () => {
  console.log('?? Initiating Puppeteer E2E Visual Audit for Almoxarifado Kardex...');
  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: { width: 1440, height: 900 }
  });
  const page = await browser.newPage();
  
  console.log('?? Navigating to https://www.singulariconsult.com.br...');
  await page.goto('https://www.singulariconsult.com.br', { waitUntil: 'networkidle2', timeout: 45000 });
  await new Promise(r => setTimeout(r, 2000));

  const imgPath1 = path.join(artifactDir, 'kardex_initial_view.png');
  await page.screenshot({ path: imgPath1, fullPage: false });
  console.log('?? Screenshot 1 saved:', imgPath1);

  console.log('?? Expanding inline operational extrato row...');
  const rows = await page.('table.data-table tbody tr');
  if (rows.length > 0) {
    await rows[0].click();
    await new Promise(r => setTimeout(r, 1200));
  }

  const imgPath2 = path.join(artifactDir, 'kardex_inline_timeline.png');
  await page.screenshot({ path: imgPath2, fullPage: false });
  console.log('?? Screenshot 2 saved:', imgPath2);

  console.log('?? Testing Sub-aba 5.2 (Entradas de Doações & Compras NFe)...');
  const buttons = await page.('button, .sub-tab');
  for (let btn of buttons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('Entradas de Doações')) {
      await btn.click();
      await new Promise(r => setTimeout(r, 1200));
      break;
    }
  }

  const imgPath3 = path.join(artifactDir, 'subaba_doacoes_view.png');
  await page.screenshot({ path: imgPath3, fullPage: false });
  console.log('?? Screenshot 3 saved:', imgPath3);

  await browser.close();
  console.log('? Visual E2E Audit finished cleanly!');
})().catch(err => {
  console.error('? E2E Error:', err);
  process.exit(1);
});
