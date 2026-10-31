declare module '*.module.css' { const styles: Record<string,string>; export default styles; }
declare module '*.css?raw' { const css:string; export default css; }
declare module '*.mdx' { import type {Component} from 'solid-js'; const Content:Component<{components?:Record<string,unknown>}>; export default Content; }
