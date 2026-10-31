// Establish source cascade layers before any component stylesheet is loaded.
import './site.css';
import '../website/src/css/site.css';
import '../website/src/css/daypicker-locale-fonts.css';
import {For,createSignal,createEffect,Errored,type Component} from 'solid-js';
import {MDXProvider,BrowserWindow} from './mdx';
import {Examples} from '../generated/examples';
import gallery from '../generated/gallery.json';
import {Playground} from '../website/src/components/Playground';
import pages from '../generated/pages.json';
import sidebar from '../generated/sidebar.json';
import apiSidebar from '../generated/api-sidebar.json';
import siteConfig from '../generated/site-config.json';
import {Sidebar,type SidebarItem} from './Sidebar';
import MobileSidebarToggle from './MobileSidebarToggle';
import MobileSidebarLayout from './MobileSidebarLayout';
import NavbarContent from './NavbarContent';
import IconLightMode from './IconLightMode';
import IconDarkMode from './IconDarkMode';
import IconSystemColorMode from './IconSystemColorMode';
import IconExternalLink from './IconExternalLink';
import {SvgSpriteDefs} from './inlineSvgSprites';
import sidebarStyles from './DocSidebar.module.css';
import desktopStyles from './SidebarDesktop.module.css';
import sidebarContentStyles from './SidebarContent.module.css';
import mainStyles from './DocMain.module.css';
import itemStyles from './DocItem.module.css';
import rootStyles from './DocRoot.module.css';
import navbarStyles from './NavbarContent.module.css';
import colorStyles from './ColorModeToggle.module.css';
import tocStyles from './TOC.module.css';
import 'prismjs/themes/prism.css';

export const pageModules=import.meta.glob< {default:Component} >(['/docs/website/docs/**/*.{md,mdx}','/docs/generated/api/**/*.md']);
export async function loadPage(route:string){const page=pages.find(page=>page.route===route);if(!page)return undefined;const loader=pageModules[page.file];if(!loader)throw Error(`Missing source page module for ${route}: ${page.file}`);return(await loader()).default;}
export function App(props:{route:string;Content?:Component}){
  const page=()=>pages.find(page=>page.route===props.route);
  const Content=()=>props.Content;
  const example=()=>gallery.find(item=>props.route==='/examples/'+item.name);
  const [menuOpen,setMenuOpen]=createSignal(false);
  const [secondaryMenu,setSecondaryMenu]=createSignal(true);
  const [query,setQuery]=createSignal('');
  let searchDialog:HTMLDialogElement|undefined;
  const items=()=>(props.route.startsWith('/api')?apiSidebar:sidebar) as SidebarItem[];
  createEffect(menuOpen,shown=>{
    if(!shown)return;
    const previous=document.body.style.overflow;document.body.style.overflow='hidden';
    const close=(event:KeyboardEvent)=>{if(event.key==='Escape')setMenuOpen(false);};document.addEventListener('keydown',close);
    return()=>{document.body.style.overflow=previous;document.removeEventListener('keydown',close);};
  });
  const Brand=()=><a class="navbar__brand" href="/"><div class="navbar__logo"><img src={'/'+siteConfig.logo.src} alt={siteConfig.logo.alt}/></div><b class="navbar__title text--truncate">{siteConfig.title}</b></a>;
  const ThemeToggle=(p:{class?:string})=><div class={`${colorStyles.toggle} ${p.class??''}`}><button class={`clean-btn ${colorStyles.toggleButton}`} type="button" aria-label="Switch between dark and light mode" onClick={()=>{const root=document.documentElement;const choice=root.dataset.themeChoice==='system'?'light':root.dataset.themeChoice==='light'?'dark':'system';root.dataset.themeChoice=choice;root.dataset.theme=choice==='system'?(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):choice;localStorage.setItem('theme',choice);}}><IconLightMode aria-hidden="true" class={`${colorStyles.toggleIcon} ${colorStyles.lightToggleIcon}`}/><IconDarkMode aria-hidden="true" class={`${colorStyles.toggleIcon} ${colorStyles.darkToggleIcon}`}/><IconSystemColorMode aria-hidden="true" class={`${colorStyles.toggleIcon} ${colorStyles.systemToggleIcon}`}/></button></div>;
   const active=(href:string)=>href==='/api'?props.route.startsWith('/api'):href==='/examples'?props.route.startsWith('/examples'):href==='/'?!props.route.startsWith('/api')&&!props.route.startsWith('/examples')&&props.route!=='/playground':props.route===href;
  const NavLinks=(p:{mobile?:boolean;position?:string})=><For each={siteConfig.navLinks.filter(item=>p.mobile||item.position===(p.position??'left'))}>{item=>p.mobile?<li class="menu__list-item"><a class={`menu__link ${active(item.href)?'menu__link--active':''}`} aria-current={active(item.href)?'page':undefined} href={item.href} target={item.href.startsWith('https:')?'_blank':undefined} rel={item.href.startsWith('https:')?'noopener noreferrer':undefined}>{item.label}{item.href.startsWith('https:')&&<IconExternalLink/>}</a></li>:<a class={`navbar__item navbar__link ${active(item.href)?'navbar__link--active':''}`} aria-current={active(item.href)?'page':undefined} href={item.href} target={item.href.startsWith('https:')?'_blank':undefined} rel={item.href.startsWith('https:')?'noopener noreferrer':undefined}>{item.label}{item.href.startsWith('https:')&&<IconExternalLink/>}</a>}</For>;
  const Toc=()=><ul class="table-of-contents table-of-contents__left-border"><For each={page()?.toc??[]}>{heading=><li style={{'padding-left':heading.level===3?'1rem':undefined}}><a class="table-of-contents__link" href={'#'+heading.id}>{heading.title}</a></li>}</For></ul>;
  return <MDXProvider><svg width="0" height="0" aria-hidden="true" style={{position:'absolute'}} innerHTML={SvgSpriteDefs}/><nav aria-label="Main" class={`theme-layout-navbar navbar navbar--fixed-top ${menuOpen()?'navbar-sidebar--show':''}`}><NavbarContent left={<>
    <MobileSidebarToggle shown={menuOpen()} toggle={()=>{setSecondaryMenu(true);setMenuOpen(value=>!value);}}/><Brand/>
    <span class="navbar__item" title="Package version">{siteConfig.version}</span><NavLinks/>
  </>} right={<><NavLinks position="right"/><ThemeToggle class={navbarStyles.colorModeToggle}/><div class="navbarSearchContainer"><button type="button" class="DocSearch DocSearch-Button" aria-label="Search" onClick={()=>searchDialog?.showModal()}><span class="DocSearch-Button-Container"><svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="8" stroke="currentColor" fill="none" stroke-width="1.4"/><path d="m21 21-4.3-4.3" stroke="currentColor" fill="none" stroke-linecap="round"/></svg><span class="DocSearch-Button-Placeholder">Search</span></span></button></div></>}/>
    <div role="presentation" class="navbar-sidebar__backdrop" onClick={()=>setMenuOpen(false)}/>
    <MobileSidebarLayout shown={menuOpen()} secondaryMenuShown={secondaryMenu()} header={<div class="navbar-sidebar__brand"><Brand/><ThemeToggle class="margin-right--md"/><button type="button" aria-label="Close navigation bar" class="clean-btn navbar-sidebar__close" onClick={()=>setMenuOpen(false)}><svg viewBox="0 0 15 15" width="21" height="21"><g stroke="var(--ifm-color-emphasis-600)" stroke-width="1.2"><path d="M.75.75l13.5 13.5M14.25.75L.75 14.25"/></g></svg></button></div>} primaryMenu={<ul class="menu__list"><NavLinks mobile/><li class="menu__list-item"><a class="menu__link" href="/examples">Examples</a></li></ul>} secondaryMenu={<><button type="button" class="clean-btn navbar-sidebar__back" onClick={()=>setSecondaryMenu(false)}>← Back to main menu</button><Sidebar items={items()} route={props.route}/></>}/>
  </nav><dialog class="docs-search" ref={element=>{searchDialog=element;}}><form method="dialog"><button type="submit" class="clean-btn" aria-label="Close search">×</button></form><input type="search" aria-label="Search documentation" placeholder="Search docs" value={query()} onInput={event=>setQuery(event.currentTarget.value)}/><ul><For each={pages.filter(page=>page.title.toLowerCase().includes(query().toLowerCase())).slice(0,20)}>{page=><li><a href={page.route}>{page.title}</a></li>}</For></ul></dialog>
  <div class={`main-wrapper ${rootStyles.docsWrapper}`}><div class={rootStyles.docRoot}><aside class={`theme-doc-sidebar-container ${sidebarStyles.docSidebarContainer}`}><div class={sidebarStyles.sidebarViewport}><div class={desktopStyles.sidebar}><nav aria-label="Docs sidebar" class={`menu thin-scrollbar ${sidebarContentStyles.menu}`}><Sidebar items={items()} route={props.route}/></nav></div></div></aside><main data-docs-route={props.route} class={mainStyles.docMainContainer}><div class="container padding-top--md padding-bottom--lg"><div class="row"><div class={`col ${page()?.toc.length?itemStyles.docItemCol:''}`}><div class={itemStyles.docItemContainer}>
  {!!page()?.toc.length&&<details class="docs-mobile-toc"><summary>On this page</summary><Toc/></details>}<article class="markdown">
    {props.route==='/playground'?<Playground/>:props.route==='/examples'?<><h1>Examples</h1><p>Explore date selection, styling, localization, and custom components in Solid 2.</p><ul><For each={gallery}>{item=><li><a href={'/examples/'+item.name}>{item.name}</a></li>}</For></ul></>:example()?(()=>{
      const entry=example()!;const Demo=Examples[entry.name as keyof typeof Examples] as Component;
      return <><h1>{entry.name}</h1><Errored fallback={error=><aside role="alert" data-demo-error>{String(error())}</aside>}><BrowserWindow sourceUrl={siteConfig.repository+'/blob/main/'+entry.file}><Demo/></BrowserWindow></Errored></>;
    })():Content()?(()=>{const Page=Content()!;return <Page/>;})():<><h1>Page not found</h1><a href="/">Introduction</a></>}
  </article>{page()?.section!=='API'&&page()&&<footer class="theme-doc-footer"><a class="theme-edit-this-page" href={siteConfig.repository+'/edit/main'+page()!.file}>Edit this page</a></footer>}{(page()?.previous||page()?.next)&&<nav class="pagination-nav docusaurus-mt-lg" aria-label="Docs pages"><div>{page()?.previous&&<a class="pagination-nav__link pagination-nav__link--prev" href={page()!.previous!.route}><div class="pagination-nav__sublabel">Previous</div><div class="pagination-nav__label">{page()!.previous!.label}</div></a>}</div><div>{page()?.next&&<a class="pagination-nav__link pagination-nav__link--next" href={page()!.next!.route}><div class="pagination-nav__sublabel">Next</div><div class="pagination-nav__label">{page()!.next!.label}</div></a>}</div></nav>}</div></div>{!!page()?.toc.length&&<div class="col col--3 docs-desktop-toc"><div class={`theme-doc-toc-desktop ${tocStyles.tableOfContents}`}><Toc/></div></div>}</div></div></main></div></div></MDXProvider>;
}
