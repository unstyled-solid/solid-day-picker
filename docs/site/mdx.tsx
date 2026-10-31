import {createContext,useContext,createSignal,omit,type Component} from 'solid-js';
import {dynamic,type JSX} from '@solidjs/web';
import {BrowserWindow as SourceBrowserWindow} from '../website/src/components/BrowserWindow';
import {AnatomyDiagram} from '../website/src/components/AnatomyDiagram';
import {HighlightWithTheme} from '../website/src/components/HighlightWithTheme';
import {Examples} from '../generated/examples';
import sources from '../generated/examples.json';
import Admonition from './AdmonitionLayout';

const unitless=new Set(['opacity','z-index','font-weight','line-height','flex','flex-grow','flex-shrink','order']);
function htmlStyle(value:JSX.CSSProperties|undefined){if(!value)return value;return Object.fromEntries(Object.entries(value).map(([key,entry])=>{
  const name=key.replace(/[A-Z]/g,c=>'-'+c.toLowerCase());return[name,typeof entry==='number'&&entry!==0&&!name.startsWith('--')&&!unitless.has(name)?entry+'px':entry];
}));}
const tags=['h1','h2','h3','h4','h5','h6','p','a','strong','em','code','pre','ul','ol','li','blockquote','table','thead','tbody','tr','th','td','br','hr','img','div','span','aside','kbd','section','article','figure','figcaption','details','summary','sup','small','dl','dt','dd','iframe','style','label','input','button','select','option'];
const html=Object.fromEntries(tags.map(tag=>{
  const Tag=dynamic(()=>tag,{static:true});
  const Render=(props:Record<string,unknown>)=>{
    const rest=omit(props,'className','style');
    const element=<Tag {...rest} class={props.class as JSX.ClassValue??props.className as JSX.ClassValue} style={htmlStyle(props.style as JSX.CSSProperties)}/>;
    return tag==='h1'?<header>{element}</header>:element;
  };
  return[tag,Render];
}));
export function BrowserWindow(props:Parameters<typeof SourceBrowserWindow>[0]){
  const source=()=>sources.find(entry=>props.sourceUrl?.endsWith(entry.file.replace('docs/',''))||props.sourceUrl?.endsWith('/examples/'+entry.file.split('/').pop()));
  const [open,setOpen]=createSignal(false);
  return <section class="example-block">
    <SourceBrowserWindow {...props} sourceUrl={source()?`/source/${source()!.file}`:props.sourceUrl} sourceLabel="View Solid source"/>
    {source()&&<details open={open()} onToggle={event=>setOpen(event.currentTarget.open)} class="example-source">
      <summary>View Solid source · {source()!.file.split('/').pop()}</summary>
       <p><a href={`/source/${source()!.file}`}>Download source</a></p>
      <HighlightWithTheme code={source()!.source} language="tsx"/>
      {source()!.dependencies.map(dependency=><details><summary>{dependency.file}</summary><HighlightWithTheme code={dependency.source} language={dependency.file.endsWith('.css')?'css':'tsx'}/></details>)}
    </details>}
  </section>;
}
function Tabs(props:{children?:JSX.Element}){return <div class="tabs-container">{props.children}</div>;}
function TabItem(props:{children?:JSX.Element;label?:string}){return <section class="tab-item"><h3>{props.label}</h3>{props.children}</section>;}
const components={...html,BrowserWindow,AnatomyDiagram,Examples,Tabs,TabItem,Admonition};
const Context=createContext<Record<string,unknown>>(components);
export function useMDXComponents(){return useContext(Context);}
export function MDXProvider(props:{children?:JSX.Element}){return <Context value={components}>{props.children}</Context>;}
export function HTMLContent(props:{html:string}){return <div class="markdown" innerHTML={props.html}/>;}
