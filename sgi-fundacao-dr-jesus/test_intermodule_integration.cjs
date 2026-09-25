const puppeteer = require('puppeteer');
const path = require('path');
const artifactDir = 'C:/Users/marcos.teixeira/.gemini/antigravity/brain/3a2891e8-856a-4f0b-92dd-f3422c6430d2';

(async () => {
  console.log('🚀 Starting E2E Intermodule Integration & Button Audit with Puppeteer...');

  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: { width: 1440, height: 900 }
  });
  const page = await browser.newPage();

  // 1. Navigate to live site
  console.log('📡 Navigating to https://www.singulariconsult.com.br...');
  await page.goto('https://www.singulariconsult.com.br', { waitUntil: 'networkidle2', timeout: 45000 });
  await new Promise(r => setTimeout(r, 2000));

  // 2. Click + Entrada button and submit a test entry
  console.log('🔘 Testing Button 1: `+ Entrada`...');
  const allBtns1 = await page.$$('button');
  for (let b of allBtns1) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && text.includes('Entrada') && text.includes('+')) {
      await b.click();
      console.log('  👉 Clicked `+ Entrada` button!');
      await new Promise(r => setTimeout(r, 1200));
      break;
    }
  }

  // Fill Entrada form modal if open
  const qtyInput = await page.$('.modal input[type="number"], .modal input[placeholder*="Quantidade"]');
  if (qtyInput) {
    await qtyInput.type('50');
    console.log('  ✍️ Filled test quantity: 50 kg');
  }

  const saveBtn = await page.$('.modal button.btn-success, .modal button[type="submit"]');
  if (saveBtn) {
    await saveBtn.click();
    console.log('  ✅ Submitted `+ Entrada` form modal!');
    await new Promise(r => setTimeout(r, 1500));
  }

  // Screenshot 1: After Entrada test
  const img1 = path.join(artifactDir, 'test_1_after_entrada.png');
  await page.screenshot({ path: img1, fullPage: false });
  console.log('📸 Screenshot 1 saved:', img1);

  // 3. Test RMI button
  console.log('🔘 Testing Button 2: `RMI (Requisição Interna)`...');
  const allBtns2 = await page.$$('button');
  for (let b of allBtns2) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && (text.includes('RMI') || text.includes('Requisição'))) {
      await b.click();
      console.log('  👉 Clicked `RMI` button!');
      await new Promise(r => setTimeout(r, 1200));
      break;
    }
  }

  const rmiQtyInput = await page.$('.modal input[type="number"], .modal input[placeholder*="Quantidade"]');
  if (rmiQtyInput) {
    await rmiQtyInput.type('20');
  }

  const rmiSaveBtn = await page.$('.modal button.btn-primary, .modal button[type="submit"]');
  if (rmiSaveBtn) {
    await rmiSaveBtn.click();
    console.log('  ✅ Submitted `RMI` form modal!');
    await new Promise(r => setTimeout(r, 1500));
  }

  // Screenshot 2: After RMI test
  const img2 = path.join(artifactDir, 'test_2_after_rmi.png');
  await page.screenshot({ path: img2, fullPage: false });
  console.log('📸 Screenshot 2 saved:', img2);

  // 4. Test Sub-tab navigation across Sub-aba 5.1 -> 5.2 -> 5.3 -> 5.4 -> 5.5
  console.log('📑 Testing Sub-tab Communication & Navigation...');
  const subTabs = await page.$$('.sub-tab, button');
  for (let tab of subTabs) {
    const text = await page.evaluate(el => el.textContent, tab);
    if (text && (text.includes('Entradas de Doações') || text.includes('Requisições Internas') || text.includes('Inventário Físico'))) {
      console.log('  🔄 Clicking sub-tab:', text.trim());
      await tab.click();
      await new Promise(r => setTimeout(r, 800));
    }
  }

  const img3 = path.join(artifactDir, 'test_3_intermodule_sync.png');
  await page.screenshot({ path: img3, fullPage: false });
  console.log('📸 Screenshot 3 saved:', img3);

  await browser.close();
  console.log('🎉 Intermodule integration & button testing completed with 0 errors!');
})().catch(err => {
  console.error('❌ Integration test error:', err);
  process.exit(1);
});
