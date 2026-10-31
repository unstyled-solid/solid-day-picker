import {createSignal,For} from 'solid-js';

export type SidebarItem={type:string;route?:string;label:string;collapsed?:boolean;items?:SidebarItem[]};
function contains(item:SidebarItem,route:string):boolean{return item.route===route||!!item.items?.some(child=>contains(child,route));}
function SidebarEntry(props:{item:SidebarItem;route:string}){
  const [collapsed,setCollapsed]=createSignal((props.item.collapsed??false)&&!contains(props.item,props.route));
  return <li class={`menu__list-item ${props.item.items?'theme-doc-sidebar-item-category':'theme-doc-sidebar-item-link'} ${collapsed()?'menu__list-item--collapsed':''}`}>
    {props.item.items?<><div class="menu__list-item-collapsible"><a href={props.item.route??'#'} role={props.item.route?undefined:'button'} class={`menu__link menu__link--sublist ${props.item.route?'':'menu__link--sublist-caret'}`} aria-expanded={collapsed()?'false':'true'} onClick={event=>{if(!props.item.route){event.preventDefault();setCollapsed(value=>!value);}}}>{props.item.label}</a>{props.item.route&&<button type="button" class="clean-btn menu__caret" aria-label={`Toggle ${props.item.label}`} aria-expanded={collapsed()?'false':'true'} onClick={()=>setCollapsed(value=>!value)}/>}</div><ul class="menu__list" hidden={collapsed()}><For each={props.item.items}>{item=><SidebarEntry item={item} route={props.route}/>}</For></ul></>:<a class={`menu__link ${props.item.route===props.route?'menu__link--active':''}`} aria-current={props.item.route===props.route?'page':undefined} href={props.item.route}>{props.item.label.replaceAll('`','')}</a>}
  </li>;
}
export function Sidebar(props:{items:SidebarItem[];route:string}){return <ul class="theme-doc-sidebar-menu menu__list"><For each={props.items}>{item=><SidebarEntry item={item} route={props.route}/>}</For></ul>;}
