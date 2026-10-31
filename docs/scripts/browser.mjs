import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {preview} from 'vite';
import {chromium} from 'playwright';
import pages from '../generated/pages.json' with {type:'json'};
import gallery from '../generated/gallery.json' with {type:'json'};

// Exercise the same preview implementation as docs:serve. A custom HTTP fixture
// previously hid Vite's extensionless-route fallback and false hydration passes.
const server=await preview({configFile:'docs/vite.config.ts',preview:{host:'127.0.0.1',port:0}});
const base=`http://127.0.0.1:${server.httpServer.address().port}`;
const browser=await chromium.launch({headless:true});
const errors=[];const checked=[];const failures=[];let liveViews=0;
try {
  const page=await browser.newPage();page.on('pageerror',error=>errors.push(error.stack));
  for(const route of [...pages.map(page=>page.route),'/playground','/examples',...gallery.map(item=>'/examples/'+item.name)]){try{
    const response=await page.goto(base+route,{waitUntil:'domcontentloaded'});assert.equal(response.status(),200,route);
    assert((await response.text()).includes(`data-docs-route="${route}"`),`${route}: server rendered wrong route`);
    await page.waitForFunction(()=>document.documentElement.dataset.docsReady==='true');
    assert(!await page.getByRole('heading',{name:'Page not found',exact:true}).count(),route);
    assert.equal(await page.locator('[data-demo-error]').count(),0,`${route}: demo error fallback`);
    const prose=await page.locator('article').evaluate(element=>{const clone=element.cloneNode(true);clone.querySelectorAll('pre').forEach(node=>node.remove());return clone.textContent;});
    assert(!/:::(note|tip|info|warning|danger|caution)/.test(prose),`${route}: raw admonition syntax outside fenced examples`);
    assert.match(await page.title(),/\| Solid DayPicker$/);
    const demos=page.locator('.demo-shadow');
    for(let i=0;i<await demos.count();i++){
      await page.waitForFunction(index=>{
        const host=document.querySelectorAll('.demo-shadow')[index];
        return !!host?.shadowRoot?.querySelector('.rdp-root,input,button,table,a,[role]');
      },i,{timeout:5000});liveViews++;
    }
    if(route==='/start'){
      assert.equal(await page.locator('.theme-admonition-note').count(),1);
      const button=page.locator('.rdp-day_button').first();await button.waitFor();await button.click();
      await page.getByText('Selected:',{exact:false}).first().waitFor();
      const month=await page.locator('.rdp-month_caption').first().textContent();
      await page.locator('.rdp-button_next').first().click();
      await page.waitForFunction(old=>document.querySelector('.demo-shadow')?.shadowRoot?.querySelector('.rdp-month_caption')?.textContent!==old,month);
      await page.locator('.example-source summary').first().click();
      assert.match(await page.locator('.example-source').first().textContent(),/createSignal/);
    }
    if(route==='/guides/input-fields'){
      const input=page.getByPlaceholder('MM/dd/yyyy').first();await input.waitFor();await input.fill('01/15/2024');
      await page.getByRole('grid',{name:'January 2024',exact:true}).first().waitFor();
      assert.equal(await input.inputValue(),'01/15/2024');
    }
    if(route==='/playground'){
      const modes=page.locator('select[name="mode"]');await modes.selectOption('range');
      await page.locator('.rdp-day_button').first().waitFor();
      assert.match(page.url(),/mode=range/);
      assert.match(await page.locator('pre').last().textContent(),/@solid-unstyled\/daypicker/);
    }
    checked.push(route);
  }catch(error){failures.push({route,message:error.message});}}
  assert.deepEqual(failures,[],'Production documentation route/live-view failures');
  assert.deepEqual(errors,[],'Production documentation runtime errors');
  await page.goto(base+'/start',{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>document.documentElement.dataset.docsReady==='true');
  await page.screenshot({path:'tracking/docs-desktop.png',fullPage:true});
  await page.setViewportSize({width:390,height:844});const toggle=page.getByRole('button',{name:'Toggle navigation bar',exact:true});await toggle.click();
  await page.waitForFunction(()=>Math.abs(document.querySelector('.navbar-sidebar').getBoundingClientRect().x)<1);
  assert.equal(await toggle.getAttribute('aria-expanded'),'true');
  assert.deepEqual(await toggle.evaluate(element=>({width:element.getBoundingClientRect().width,height:element.getBoundingClientRect().height,border:getComputedStyle(element).borderWidth})),{width:30,height:30,border:'0px'});
  assert(await page.locator('.navbar-sidebar').getByRole('link',{name:'Getting Started',exact:true}).isVisible());
  assert.deepEqual(await page.locator('.navbar-sidebar').getByRole('link',{name:'Getting Started',exact:true}).evaluate(element=>({background:getComputedStyle(element).backgroundColor,fontSize:getComputedStyle(element).fontSize})),{background:'rgba(0, 0, 0, 0)',fontSize:'14px'},'Copied site overrides must win over Infima defaults');
  await page.screenshot({path:'tracking/docs-mobile.png'});
  await page.getByRole('button',{name:'Back to main menu'}).click();
  await page.locator('.navbar-sidebar').getByRole('link',{name:'Playground',exact:true}).waitFor({state:'visible'});
  await page.getByRole('button',{name:'Close navigation bar',exact:true}).click();assert.equal(await toggle.getAttribute('aria-expanded'),'false');
  await page.goto(base+'/docs/appearance');assert.equal(await page.locator('article h1').textContent(),'Customization Props');
  await page.goto(base+'/docs/styling');await page.locator('.rdp-root').first().waitFor();
  await page.setViewportSize({width:1280,height:900});await page.goto(base+'/start');await page.waitForFunction(()=>document.documentElement.dataset.docsReady==='true');
  await page.locator('nav[aria-label="Docs sidebar"]').getByRole('link',{name:'Styling and Appearance',exact:true}).click();
  await page.locator('.rdp-root').first().waitFor();assert.equal(new URL(page.url()).pathname,'/docs/styling');
  await page.reload();await page.locator('.rdp-root').first().waitFor();
  await page.getByRole('button',{name:'Search',exact:true}).click();
  await page.getByRole('searchbox',{name:'Search documentation'}).fill('Persian');
  await page.locator('dialog').getByRole('link',{name:'Persian Calendar',exact:true}).click();
  await page.locator('.rdp-root').first().waitFor();assert.equal(new URL(page.url()).pathname,'/localization/persian');
  assert.equal((await page.goto(base+'/does-not-exist')).status(),404);
  assert.equal((await page.goto(base+'/development/source')).status(),404,'Upstream draft must not be published');
  assert.deepEqual(errors,[],'Final browser interaction runtime errors');
  await fs.writeFile('tracking/docs-browser-verification.json',JSON.stringify({server:'vite preview',staticRoutes:pages.length+2+gallery.length,checked,liveViews,errors,mobileMenu:true,admonitions:true,search:true,unknownRoute404:true},null,2));
  console.log(JSON.stringify({checked:checked.length,liveViews,errors,mobileMenu:true},null,2));
}finally{await browser.close();await new Promise(resolve=>server.httpServer.close(resolve));}
