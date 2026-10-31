import {createContext,createSignal,createUniqueId,useContext,createEffect,omit,type Accessor} from 'solid-js';
import {Portal,Show,type JSX} from '@solidjs/web';

type SelectState={value:Accessor<string|undefined>;open:Accessor<boolean>;setOpen:(value:boolean)=>void;choose:(value:string)=>void;id:string;trigger:()=>HTMLButtonElement|undefined;setTrigger:(node:HTMLButtonElement)=>void;label:Accessor<JSX.Element>};
const Context=createContext<SelectState>();
const context=()=>useContext(Context);
export type SelectProps={children?:JSX.Element;value?:string;onValueChange?:(value:string)=>void};
export type SelectTriggerProps=JSX.ButtonHTMLAttributes<HTMLButtonElement>;
export type SelectContentProps=JSX.HTMLAttributes<HTMLDivElement>&{position?:'popper'|'item-aligned'};
export type SelectScrollDownButtonProps=JSX.ButtonHTMLAttributes<HTMLButtonElement>;
export type SelectPortalProps={children?:JSX.Element;container?:HTMLElement|null};
export type SelectItemProps=JSX.HTMLAttributes<HTMLDivElement>&{value:string;disabled?:boolean};
export function Root(props:SelectProps){
  const [open,setOpen]=createSignal(false);const [label,setLabel]=createSignal<JSX.Element>(undefined);
  let trigger:HTMLButtonElement|undefined;
  const value:SelectState={value:()=>props.value,open,setOpen,id:createUniqueId(),trigger:()=>trigger,setTrigger:node=>{trigger=node;},label,
    choose(next){props.onValueChange?.(next);setOpen(false);trigger?.focus();}};
  // Registered selected ItemText is resolved inside the owning provider.
  return <Context value={value}><LabelSetter value={props.value} setLabel={setLabel}>{props.children}</LabelSetter></Context>;
}
const Labels=createContext<{value:Accessor<string|undefined>;setLabel:(value:JSX.Element)=>void}>();
function LabelSetter(props:{children?:JSX.Element;value?:string;setLabel:(value:JSX.Element)=>void}){return <Labels value={{value:()=>props.value,setLabel:props.setLabel}}>{props.children}</Labels>;}
export function Group(props:JSX.HTMLAttributes<HTMLDivElement>){return <div role="group" {...props}/>;}
export function Value(){return <span>{context().label()}</span>;}
export function Trigger(props:SelectTriggerProps){const state=context();return <button {...props} ref={state.setTrigger} type="button" role="combobox" aria-expanded={state.open()?'true':'false'} aria-controls={state.id} aria-haspopup="listbox"
  onClick={()=>state.setOpen(!state.open())} onKeyDown={event=>{if(['ArrowDown','ArrowUp','Enter',' '].includes(event.key)){event.preventDefault();state.setOpen(true);}}}/>;}
export function Icon(props:{children?:JSX.Element;asChild?:boolean}){return props.children;}
export function Content(props:SelectContentProps){const state=context();let node:HTMLDivElement|undefined;
  createEffect(state.open,open=>{if(open)queueMicrotask(()=>node?.querySelector<HTMLElement>('[aria-selected="true"], [role="option"]:not([aria-disabled="true"])')?.focus());});
  const attrs=omit(props,'position');
  return <div {...attrs} ref={node} id={state.id} role="listbox" hidden={!state.open()} style={{...typeof props.style==='object'?props.style:{},position:'absolute','z-index':50}}
    onKeyDown={event=>{const options=[...node!.querySelectorAll<HTMLElement>('[role="option"]:not([aria-disabled="true"])')];const index=options.indexOf(event.target as HTMLElement);
      if(event.key==='Escape'){event.preventDefault();state.setOpen(false);state.trigger()?.focus();}
      else if(event.key==='ArrowDown'||event.key==='ArrowUp'){event.preventDefault();options[(index+(event.key==='ArrowDown'?1:-1)+options.length)%options.length]?.focus();}}}/>;
}
export function PortalComponent(props:SelectPortalProps){return <Portal mount={props.container??undefined}>{props.children}</Portal>;}
export {PortalComponent as Portal};
export function Viewport(props:JSX.HTMLAttributes<HTMLDivElement>){return <div {...props} style={{'max-height':'24rem','overflow-y':'auto'}}/>;}
export function Item(props:SelectItemProps){const state=context();const labels=useContext(Labels);const attrs=omit(props,'value','disabled');
  createEffect(()=>({selected:state.value()===props.value,label:props.children}),value=>{if(value.selected)labels.setLabel(value.label);});
  return <div {...attrs} role="option" tabindex="-1" aria-selected={state.value()===props.value?'true':'false'} aria-disabled={props.disabled?'true':'false'}
    onClick={()=>{if(!props.disabled)state.choose(props.value);}} onKeyDown={event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();if(!props.disabled)state.choose(props.value);}}}/>;
}
export function ItemText(props:{children?:JSX.Element}){return props.children;}
export function ScrollUpButton(props:SelectScrollDownButtonProps){return <button {...props} type="button" tabindex="-1" aria-label="Scroll options up" onClick={event=>event.currentTarget.parentElement?.querySelector('div')?.scrollBy(0,-100)}/>;}
export function ScrollDownButton(props:SelectScrollDownButtonProps){return <button {...props} type="button" tabindex="-1" aria-label="Scroll options down" onClick={event=>event.currentTarget.parentElement?.querySelector('div')?.scrollBy(0,100)}/>;}
