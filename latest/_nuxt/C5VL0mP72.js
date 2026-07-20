import{E as e,Ht as t,Yt as n,Zn as r,_ as i,b as a,bt as o,ct as s,g as c,mt as l,o as u,tr as d,vn as f}from"./BKdLzFmX.js";import{S as p,b as m}from"./CNz-z9B2.js";import{t as h}from"./BDNMzG2s2.js";import{i as g,n as _,r as v,t as y}from"./BazZABqE2.js";var b={class:`canvas-demo-card`},x={class:`card-tab-header`},S={class:`tab-buttons`},C={class:`preview-container`},w={class:`controls-toolbar`},T={class:`pill-group`},E={class:`scheme-select-group`},D=[`value`],O={class:`canvas-viewport`},k={class:`code-container`},A={class:`code-header font-mono`},j={class:`code-block`},M=h({__name:`CanvasDemo`,setup(h){let M=f(`preview`),N=f(`heatmap`),P=f(`viridis`),F=f(!1),I=f(null),L=[`viridis`,`inferno`,`plasma`,`magma`,`thermal`,`haline`,`tableau_10`,`leonardo`,`dracula`,`Purples_5`,`Spectral_5`],R=c(()=>{if(!v)return null;let e=P.value;if(v[e])return v[e];if(typeof g==`function`){let t=g(e);if(t&&t.length>0)return t[0].scheme}return v.viridis});function z(){if(!I.value||!R.value)return;let e=I.value,t=e.getContext(`2d`);if(!t)return;let n=e.width,r=e.height,i=R.value;if(t.clearRect(0,0,n,r),N.value===`heatmap`){let e=t.createImageData(n,r),a=e.data;for(let e=0;e<r;e++){let t=e/r*4-2;for(let r=0;r<n;r++){let o=r/n*6-3,s=(Math.sin(o*2.2)*Math.cos(t*2.2)+Math.sin(o+t)+2)/4,c=y(i,Math.max(0,Math.min(1,s))),l=(e*n+r)*4;a[l]=Math.round(c.r*255),a[l+1]=Math.round(c.g*255),a[l+2]=Math.round(c.b*255),a[l+3]=255}}t.putImageData(e,0,0)}else{t.fillStyle=`#0f172a`,t.fillRect(0,0,n,r);let e=_(i,8),a=(n-60-112)/8;[.65,.85,.45,.95,.7,.55,.8,.4].forEach((n,i)=>{let o=30+i*(a+16),s=(r-80)*n,c=r-40-s,l=e.colors[i],u=typeof l?.toCss==`function`?l.toCss():`#818cf8`;t.fillStyle=u,t.beginPath(),t.roundRect(o,c,a,s,6),t.fill(),t.fillStyle=`#94a3b8`,t.font=`600 12px ui-monospace, monospace`,t.textAlign=`center`,t.fillText(`${Math.round(n*100)}%`,o+a/2,c-10),t.fillStyle=`#f8fafc`,t.fillText(`Cat ${i+1}`,o+a/2,r-18)})}}t([P,N],()=>{z()}),s(()=>{z()});let B=c(()=>N.value===`heatmap`?`import { colorschemes, get } from 'color-schemes-js';

const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
const scheme = colorschemes.${P.value};

const imgData = ctx.createImageData(canvas.width, canvas.height);
const data = imgData.data;

for (let y = 0; y < canvas.height; y++) {
  for (let x = 0; x < canvas.width; x++) {
    // 1. Calculate normalized value t ∈ [0.0, 1.0]
    const t = calculateNormalizedValue(x, y);
    
    // 2. Sample color continuously
    const color = get(scheme, t);
    const idx = (y * canvas.width + x) * 4;

    data[idx]     = Math.round(color.r * 255);
    data[idx + 1] = Math.round(color.g * 255);
    data[idx + 2] = Math.round(color.b * 255);
    data[idx + 3] = 255;
  }
}

ctx.putImageData(imgData, 0, 0);`:`import { colorschemes, resample } from 'color-schemes-js';

const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

// 1. Resample scheme for 8 categorical data series
const scheme = colorschemes.${P.value};
const catScheme = resample(scheme, 8);

// 2. Render chart bars with discrete palette colors
dataSeries.forEach((value, index) => {
  const color = catScheme.colors[index];
  ctx.fillStyle = color.toCss();
  ctx.fillRect(xPosition, yPosition, barWidth, barHeight);
});`);function V(){navigator.clipboard.writeText(B.value),F.value=!0,setTimeout(()=>{F.value=!1},2e3)}return(t,s)=>(l(),a(`div`,b,[i(`div`,x,[i(`div`,S,[i(`button`,{class:r([`tab-toggle-btn`,{active:M.value===`preview`}]),onClick:s[0]||=e=>M.value=`preview`},[...s[5]||=[i(`svg`,{class:`tab-icon`,fill:`none`,stroke:`currentColor`,viewBox:`0 0 24 24`},[i(`path`,{"stroke-linecap":`round`,"stroke-linejoin":`round`,"stroke-width":`2`,d:`M15 12a3 3 0 11-6 0 3 3 0 016 0z`}),i(`path`,{"stroke-linecap":`round`,"stroke-linejoin":`round`,"stroke-width":`2`,d:`M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z`})],-1),e(` Preview `,-1)]],2),i(`button`,{class:r([`tab-toggle-btn`,{active:M.value===`code`}]),onClick:s[1]||=e=>M.value=`code`},[...s[6]||=[i(`svg`,{class:`tab-icon`,fill:`none`,stroke:`currentColor`,viewBox:`0 0 24 24`},[i(`path`,{"stroke-linecap":`round`,"stroke-linejoin":`round`,"stroke-width":`2`,d:`M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4`})],-1),e(` Code `,-1)]],2)]),s[7]||=i(`span`,{class:`demo-badge`},`HTML5 Canvas 2D Engine`,-1)]),n(i(`div`,C,[i(`div`,w,[i(`div`,T,[i(`button`,{class:r([`pill-btn`,{active:N.value===`heatmap`}]),onClick:s[2]||=e=>N.value=`heatmap`},` 2D Heatmap Surface `,2),i(`button`,{class:r([`pill-btn`,{active:N.value===`barchart`}]),onClick:s[3]||=e=>N.value=`barchart`},` Categorical Bar Chart `,2)]),i(`div`,E,[s[8]||=i(`label`,{for:`canvas-scheme-select`,class:`select-label`},`Scheme:`,-1),n(i(`select`,{id:`canvas-scheme-select`,"onUpdate:modelValue":s[4]||=e=>P.value=e,class:`scheme-select`},[(l(),a(u,null,o(L,e=>i(`option`,{key:e,value:e},d(e),9,D)),64))],512),[[m,P.value]])])]),i(`div`,O,[i(`canvas`,{ref_key:`mainCanvas`,ref:I,class:`demo-canvas`,width:`700`,height:`280`},null,512)])],512),[[p,M.value===`preview`]]),n(i(`div`,k,[i(`div`,A,[s[9]||=i(`span`,null,`canvas-2d-rendering.ts`,-1),i(`button`,{class:`copy-code-btn`,onClick:V},d(F.value?`Copied!`:`Copy Code`),1)]),i(`pre`,j,[i(`code`,null,d(B.value),1)])],512),[[p,M.value===`code`]])]))}},[[`__scopeId`,`data-v-dc32a292`]]);export{M as default};