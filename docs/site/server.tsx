import {renderToString,generateHydrationScript} from '@solidjs/web';
import {App,loadPage} from './App';
import pages from '../generated/pages.json';
import siteConfig from '../generated/site-config.json';
export async function render(route:string){const Content=await loadPage(route);const title=pages.find(page=>page.route===route)?.title.replaceAll('`','')??(route==='/playground'?'Playground':route.startsWith('/examples/')?route.slice('/examples/'.length):'Examples');return {html:renderToString(()=> <App route={route} Content={Content}/>,{renderId:'docs',onError:error=>{throw error;}}),bootstrap:generateHydrationScript(),title:`${title} | ${siteConfig.title}`};}
