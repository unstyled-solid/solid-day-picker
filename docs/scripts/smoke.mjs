import assert from 'node:assert/strict';
import {preview} from 'vite';
import {chromium} from 'playwright';

const server=await preview({configFile:'docs/vite.config.ts',preview:{host:'127.0.0.1',port:0}});
const base=`http://127.0.0.1:${server.httpServer.address().port}`;
const browser=await chromium.launch({headless:true});
try {
  const page=await browser.newPage({viewport:{width:1280,height:900}});
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  for(const route of ['/','/start','/examples','/guides/custom-components','/development/contributing','/api/react/interfaces/PropsBase']){
    assert.equal((await page.goto(base+route)).status(),200);
    await page.waitForFunction(()=>document.documentElement.dataset.docsReady==='true');
    assert.match(await page.title(),/Solid DayPicker/);
    assert.equal(await page.locator('.theme-edit-this-page').count(),route.startsWith('/api')||route==='/examples'?0:1);
  }
  await page.goto(base+'/start');
  await page.waitForFunction(()=>document.documentElement.dataset.docsReady==='true');
  assert.equal(await page.locator('.navbar__link').getByText('Examples',{exact:true}).count(),1);
  assert.equal(await page.locator('a.navbar__link').filter({hasText:'Support'}).getAttribute('href'),'https://github.com/unstyled-solid/daypicker/issues');
  assert.equal(await page.locator('.theme-edit-this-page').getAttribute('href'),'https://github.com/unstyled-solid/daypicker/edit/main/docs/website/docs/start.mdx');
  await page.locator('.rdp-day_button').first().click();
  await page.getByText('Selected:',{exact:false}).first().waitFor();
  await page.locator('.example-source summary').first().click();
  const source=await page.locator('.example-source').first().textContent();
  assert.match(source,/@solid-unstyled\/daypicker/);assert(!source.includes('SHA-256'));
  await page.setViewportSize({width:390,height:844});
  await page.getByRole('button',{name:'Toggle navigation bar',exact:true}).click();
  await page.getByRole('button',{name:'Back to main menu'}).click();
  await page.locator('.navbar-sidebar').getByRole('link',{name:'Examples',exact:true}).first().waitFor({state:'visible'});
  assert.equal((await page.goto(base+'/does-not-exist')).status(),404);
  assert.deepEqual(errors,[]);
  console.log('Documentation smoke checks passed: routes, branding, support/edit links, source, selection, mobile navigation, and 404.');
} finally {
  await browser.close();await new Promise(resolve=>server.httpServer.close(resolve));
}
