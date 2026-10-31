import fs from 'node:fs/promises';
const file='docs/website/src/components/Playground/index.tsx';
let text=await fs.readFile(file,'utf8');
text=text.replace('Object.entries(calendarLocale())','Object.entries(calendarLocale()!)');
text=text.replace(/selected\(\)!\.(from|to)/g,'selectedRange()!.$1');
text=text.replace(/dateLib\(\)\.format\(selectedRange\(\)!\.(from|to),/g,'dateLib().format(selectedRange()!.$1!,');
text=text.replace('  return (','  const selectedRange=()=>isDateRange(selected())?selected() as DateRange:undefined;\n  return (');
const start=text.indexOf('  const importStatements: string[] = [];');
const end=text.indexOf('  const formattedProps',start);
if(start>=0&&end>start){const body=text.slice(start,end).replace('const importStatements: string[] = [];','const imports: string[] = [];').replaceAll('importStatements.','imports.');text=text.slice(0,start)+`  const importStatements=()=>{${body}\nreturn imports;};\n`+text.slice(end);text=text.replace('importStatements.join','importStatements().join');}
// Only executable generated import statements are changed; historical prose is untouched.
text=text.replace(/from "@daypicker\/(react|buddhist|ethiopic|hebrew|hijri|persian)(\/locale)?"/g,(_,name,locale)=>`from "@solid-unstyled/daypicker${name==='react'?'':'/'+name}${locale??''}"`);
await fs.writeFile(file,text);
const keyboard='docs/examples/Keyboard.test.tsx';
text=await fs.readFile(keyboard,'utf8');text=text.replace('dir={dir}','dir={dir as "ltr" | "rtl"}');await fs.writeFile(keyboard,text);
