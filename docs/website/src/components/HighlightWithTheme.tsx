import Prism from 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';

export function HighlightWithTheme(props:{code?:string;language?:string}) {
  return <pre class={`language-${props.language??'tsx'}`}><code innerHTML={Prism.highlight(props.code??'',Prism.languages[props.language??'tsx']??Prism.languages.tsx,props.language??'tsx')}/></pre>;
}
