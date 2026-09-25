const puppeteer = require('puppeteer');
const path = require('path');
const artifactDir = 'C:/Users/marcos.teixeira/.gemini/antigravity/brain/3a2891e8-856a-4f0b-92dd-f3422c6430d2';

(async () => {
  console.log('📸 Initiating full screenshot capture of live site...');
  const browser = await puppeteer.launch({ headless: 'new', defaultViewport: { width: 1440, height: 900 } });
  const page = await browser.newPage();
  
  // 1. Landing Page / Fachada Dr Jesus
  console.log('📡 Navigating to https://www.singulariconsult.com.br...');
  await page.goto('https://www.singulariconsult.com.br', { waitUntil: 'networkidle2', timeout: 45000 });
  await new Promise(r => setTimeout(r, 2000));
  const img1 = path.join(artifactDir, 'screenshot_fachada_dr_jesus.png');
  await page.screenshot({ path: img1, fullPage: false });
  console.log('✅ Screenshot 1 saved:', img1);

  // 2. Click Acessar Sistema -> Login View
  const enterBtns = await page.$$('button');
  for (let b of enterBtns) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && (text.includes('Acessar Sistema') || text.includes('Entrar'))) {
      await b.click();
      await new Promise(r => setTimeout(r, 1500));
      break;
    }
  }
  const img2 = path.join(artifactDir, 'screenshot_tela_login.png');
  await page.screenshot({ path: img2, fullPage: false });
  console.log('✅ Screenshot 2 saved:', img2);

  // 3. Perform Login -> Central 6 Macromodulos
  const loginSubmit = await page.$('button[type="submit"], .btn-primary');
  if (loginSubmit) {
    await loginSubmit.click();
    await new Promise(r => setTimeout(r, 2000));
  }
  const img3 = path.join(artifactDir, 'screenshot_central_macromodulos.png');
  await page.screenshot({ path: img3, fullPage: false });
  console.log('✅ Screenshot 3 saved:', img3);

  await browser.close();
  console.log('🎉 All 3 screenshots captured successfully!');
})().catch(err => {
  console.error('❌ Screenshot capture error:', err);
  process.exit(1);
});
