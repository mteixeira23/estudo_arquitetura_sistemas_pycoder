const puppeteer = require('puppeteer');
const path = require('path');
const artifactDir = 'C:/Users/marcos.teixeira/.gemini/antigravity/brain/3a2891e8-856a-4f0b-92dd-f3422c6430d2';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', defaultViewport: { width: 1440, height: 900 } });
  const page = await browser.newPage();
  
  // 1. Landing Page / Fachada Dr Jesus
  console.log('📡 Navigating to https://www.singulariconsult.com.br...');
  await page.goto('https://www.singulariconsult.com.br', { waitUntil: 'networkidle2', timeout: 45000 });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(artifactDir, 'screen_1_fachada_dr_jesus.png') });
  console.log('📸 Screen 1 (Fachada Dr Jesus) captured');

  // 2. Click Acessar Sistema -> Login View
  const enterBtns = await page.$$('button');
  for (let b of enterBtns) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && (text.includes('Acessar Sistema') || text.includes('Entrar'))) {
      await b.click();
      await new Promise(r => setTimeout(r, 1200));
      break;
    }
  }
  await page.screenshot({ path: path.join(artifactDir, 'screen_2_login_view.png') });
  console.log('📸 Screen 2 (Tela de Login) captured');

  // 3. Perform Login -> Central 6 Macromodulos
  const loginSubmit = await page.$('button[type="submit"], .btn-primary');
  if (loginSubmit) {
    await loginSubmit.click();
    await new Promise(r => setTimeout(r, 1500));
  }
  await page.screenshot({ path: path.join(artifactDir, 'screen_3_central_6_macromodulos.png') });
  console.log('📸 Screen 3 (Central dos 6 Macromódulos) captured');

  await browser.close();
})().catch(console.error);
