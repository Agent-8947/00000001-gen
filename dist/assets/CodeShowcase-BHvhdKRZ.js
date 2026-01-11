import{c as g,u as j,r as N,j as e,m as n}from"./index-C0iSENIC.js";import"./vendor-uS-d4TUT.js";/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k=[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]],C=g("check",k);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const R=[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]],S=g("copy",R),V=({id:f,localOverrides:d})=>{var h;const{globalSettings:i}=j(),l=i.GL02.params,o=i.GL07.params,p=i.GL09.params,r=l[3].value,c=l[2].value,u=l[5].value,m=parseFloat(p[0].value),v=parseFloat(p[2].value),[b,y]=N.useState(null),a=d.data||{title:"Code Showcase",description:"Clean, efficient code examples from my projects",snippets:[{id:"1",title:"React Custom Hook",language:"typescript",code:`import { useState, useEffect } from 'react';

export const useLocalStorage = (key: string, initialValue: any) => {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};`},{id:"2",title:"API Utility Function",language:"javascript",code:`const fetchWithRetry = async (url, options = {}, retries = 3) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error('Request failed');
    return await response.json();
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return fetchWithRetry(url, options, retries - 1);
    }
    throw error;
  }
};`}]},x=d.layout||{paddingY:"80"},w=(t,s)=>{navigator.clipboard.writeText(t),y(s),setTimeout(()=>y(null),2e3)};return e.jsx(n.div,{id:f,initial:{opacity:0,y:v},whileInView:{opacity:1,y:0},viewport:{once:!0},transition:{duration:m},className:"w-full px-6",style:{paddingTop:`${x.paddingY}px`,paddingBottom:`${x.paddingY}px`},children:e.jsxs("div",{className:"max-w-5xl mx-auto",children:[e.jsxs("div",{className:"text-center mb-16",children:[a.title&&e.jsx(n.h2,{initial:{opacity:0,y:20},whileInView:{opacity:1,y:0},className:"text-4xl md:text-5xl font-black uppercase mb-6",style:{color:r,fontFamily:"var(--dna-font-family)"},children:a.title}),a.description&&e.jsx("p",{className:"text-lg opacity-50 max-w-2xl mx-auto",style:{color:r},children:a.description})]}),e.jsx("div",{className:"space-y-8",children:(h=a.snippets)==null?void 0:h.map((t,s)=>e.jsxs(n.div,{initial:{opacity:0,y:30},whileInView:{opacity:1,y:0},viewport:{once:!0},transition:{delay:s*.1,duration:m},className:"relative group",children:[e.jsxs("div",{className:"flex items-center justify-between px-6 py-4 border-b",style:{borderColor:u,backgroundColor:"rgba(0,0,0,0.02)",borderTopLeftRadius:`${o[0].value}px`,borderTopRightRadius:`${o[0].value}px`},children:[e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx("h3",{className:"font-black uppercase text-sm",style:{color:r,fontFamily:"var(--dna-font-family)"},children:t.title}),e.jsx("span",{className:"px-3 py-1 text-xs font-bold uppercase tracking-wider",style:{backgroundColor:`${c}10`,color:c,borderRadius:`${o[0].value}px`},children:t.language})]}),e.jsx("button",{onClick:()=>w(t.code,s),className:"p-2 opacity-50 hover:opacity-100 transition-opacity",style:{color:r},children:b===s?e.jsx(C,{size:18,style:{color:c}}):e.jsx(S,{size:18})})]}),e.jsx("div",{className:"border overflow-x-auto",style:{borderColor:u,backgroundColor:"#0a0a0a",borderBottomLeftRadius:`${o[0].value}px`,borderBottomRightRadius:`${o[0].value}px`},children:e.jsx("pre",{className:"p-6 text-sm leading-relaxed",children:e.jsx("code",{className:"font-mono",style:{color:"#e0e0e0"},children:t.code})})})]},t.id))})]})})};export{V as CodeShowcase};
