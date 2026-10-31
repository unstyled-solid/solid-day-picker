import type {SnapshotSerializer} from 'vitest';
const normalized=Symbol('native-framework-markers-normalized');
export default {
  test(value:unknown){return !!value&&typeof value==='object'&&'nodeType' in value&&!(value as Record<symbol,unknown>)[normalized];},
  serialize(value:Node,config,indentation,depth,refs,printer){
    const clone=value.cloneNode(true);
    function visit(node:Node){for(const child of [...node.childNodes]){
      if(child.nodeType===8&&/^(\$|\/|\$\d*)$/.test(child.nodeValue??'')||child.nodeType===3&&child.nodeValue==='')node.removeChild(child);
      else visit(child);
    }Object.defineProperty(node,normalized,{value:true});}
    visit(clone);
    return printer(clone,config,indentation,depth,refs);
  },
} satisfies SnapshotSerializer;
