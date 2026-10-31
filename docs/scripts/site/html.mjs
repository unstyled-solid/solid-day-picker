const escape=value=>value.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
export function pageHtml(template,{html,bootstrap,title}){
  return template.replace(/<title>[^<]*<\/title>/,`<title>${escape(title)}</title>`).replace('<!--BOOTSTRAP-->',bootstrap).replace('<!--CONTENT-->',html);
}
