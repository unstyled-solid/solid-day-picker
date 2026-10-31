import {hydrate} from '@solidjs/web';
import {App,loadPage} from './App';
const route=window.location.pathname.replace(/\/$/,'')||'/';
const Content=await loadPage(route);
hydrate(()=> <App route={route} Content={Content}/>,document.getElementById('docs')!,{renderId:'docs'});
document.documentElement.dataset.docsReady='true';
