import style from '@solid-unstyled/daypicker/style.css?raw';
import localeFontStyle from '../css/daypicker-locale-fonts.css?raw';
import {createSignal,createEffect} from 'solid-js';
import {Portal,Show,type JSX} from '@solidjs/web';

export function ShadowDomWrapper(props:{baseStyleCss?:string;children?:JSX.Element;styleStr?:string}) {
  const [mount,setMount]=createSignal<HTMLDivElement|undefined>(undefined);
  const [dark,setDark]=createSignal(false);
  createEffect(mount,node=>{
    if(!node)return;
    const update=()=>setDark(node.ownerDocument.documentElement.dataset.theme==='dark');
    update();const observer=new MutationObserver(update);observer.observe(node.ownerDocument.documentElement,{attributes:true,attributeFilter:['data-theme']});
    return()=>observer.disconnect();
  });
  return <div class="demo-shadow" ref={host=>{
    const root=host.attachShadow({mode:'open'});const node=host.ownerDocument.createElement('div');root.append(node);setMount(node);
  }}><Show when={mount()}>{node=><Portal mount={node()}>
    {props.children}
    <style>{props.baseStyleCss??style}</style><style>{localeFontStyle}</style>
    <style>{`.rdp-root {--rdp-accent-color:var(--ifm-color-primary);}`}</style>
    {dark()&&<style>{`.rdp-root {--rdp-accent-color:var(--ifm-color-primary);--rdp-accent-background-color:#073845;--rdp-range_end-color:black;--rdp-range_start-color:black;}`}</style>}
    {props.styleStr&&<style>{props.styleStr}</style>}
  </Portal>}</Show></div>;
}
