import{E as e,Ht as t,Yt as n,Zn as r,_ as i,b as a,bt as o,ct as s,g as c,mt as l,o as u,tr as d,vn as f,y as p}from"./BKdLzFmX.js";import{S as m,b as h,x as g}from"./CNz-z9B2.js";import{t as _}from"./BDNMzG2s2.js";import{i as v,r as y,t as b}from"./BazZABqE2.js";var x={class:`image-demo-card`},S={class:`card-tab-header`},C={class:`tab-buttons`},w={class:`preview-container`},T={class:`controls-toolbar`},E={class:`pill-group`},D={class:`scheme-select-group`},O=[`value`],k={class:`canvas-viewport`},A={class:`params-bar`},j={key:0,class:`param-slider-group`},M={class:`slider-label`},N={key:1,class:`param-slider-group`},P={class:`slider-label`},F={key:2,class:`param-slider-group full-width`},I={class:`slider-label`},L={class:`code-container`},R={class:`code-header font-mono`},z={class:`code-block`},B=_({__name:`ImageProcessingDemo`,setup(_){let B=f(`preview`),V=f(`fractal`),H=f(`vermeer`),U=f(!1),W=f(-.4),G=f(.6),K=f(4),q=f(null),J=[`vermeer`,`viridis`,`inferno`,`plasma`,`magma`,`thermal`,`haline`,`leonardo`,`dracula`,`tableau_10`],Y=c(()=>{if(!y)return null;let e=H.value;if(y[e])return y[e];if(typeof v==`function`){let t=v(e);if(t&&t.length>0)return t[0].scheme}return y.vermeer||y.viridis});function X(){if(!q.value||!Y.value)return;let e=q.value,t=e.getContext(`2d`);if(!t)return;let n=e.width,r=e.height,i=Y.value,a=t.createImageData(n,r),o=a.data;if(V.value===`fractal`){let e=W.value,t=G.value;for(let a=0;a<r;a++){let s=a/r*2.4-1.2;for(let r=0;r<n;r++){let c=r/n*3.6-1.8,l=s,u=0;for(;c*c+l*l<4&&u<80;){let n=c*c-l*l+e;l=2*c*l+t,c=n,u++}let d=b(i,u===80?0:u/80),f=(a*n+r)*4;o[f]=Math.round(d.r*255),o[f+1]=Math.round(d.g*255),o[f+2]=Math.round(d.b*255),o[f+3]=255}}}else{let e=K.value;for(let t=0;t<r;t++){let a=t/r;for(let r=0;r<n;r++){let s=r/n,c=(Math.sin(s*8)*Math.cos(a*8)+Math.sin(s*18+a*14)*.5+1.5)/3;e>1&&(c=Math.floor(c*e)/e);let l=b(i,Math.max(0,Math.min(1,c))),u=(t*n+r)*4;o[u]=Math.round(l.r*255),o[u+1]=Math.round(l.g*255),o[u+2]=Math.round(l.b*255),o[u+3]=255}}}t.putImageData(a,0,0)}t([H,V,W,G,K],()=>{X()}),s(()=>{X()});let Z=c(()=>V.value===`fractal`?`import { colorschemes, get } from 'color-schemes-js';

function drawJuliaFractal(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const imgData = ctx.createImageData(width, height);
  const data = imgData.data;
  const scheme = colorschemes.${H.value};

  const cRe = ${W.value};
  const cIm = ${G.value};
  const maxIter = 80;

  for (let y = 0; y < height; y++) {
    const zy0 = (y / height) * 2.4 - 1.2;
    for (let x = 0; x < width; x++) {
      const zx0 = (x / width) * 3.6 - 1.8;

      let zx = zx0, zy = zy0, iter = 0;
      while (zx * zx + zy * zy < 4 && iter < maxIter) {
        const tmp = zx * zx - zy * zy + cRe;
        zy = 2 * zx * zy + cIm;
        zx = tmp;
        iter++;
      }

      // Continuous colormap index t ∈ [0.0, 1.0]
      const t = iter / maxIter;
      const color = get(scheme, t);

      const idx = (y * width + x) * 4;
      data[idx]     = Math.round(color.r * 255);
      data[idx + 1] = Math.round(color.g * 255);
      data[idx + 2] = Math.round(color.b * 255);
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);
}`:`import { colorschemes, get } from 'color-schemes-js';

// False-color map elevation matrix with colormap
function generateFalseColorElevation(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const imgData = ctx.createImageData(width, height);
  const data = imgData.data;
  const scheme = colorschemes.${H.value};

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const elevation = getElevationValue(x, y); // Normalized t ∈ [0.0, 1.0]
      const color = get(scheme, elevation);

      const idx = (y * width + x) * 4;
      data[idx]     = Math.round(color.r * 255);
      data[idx + 1] = Math.round(color.g * 255);
      data[idx + 2] = Math.round(color.b * 255);
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);
}`);function Q(){navigator.clipboard.writeText(Z.value),U.value=!0,setTimeout(()=>{U.value=!1},2e3)}return(t,s)=>(l(),a(`div`,x,[i(`div`,S,[i(`div`,C,[i(`button`,{class:r([`tab-toggle-btn`,{active:B.value===`preview`}]),onClick:s[0]||=e=>B.value=`preview`},[...s[8]||=[i(`svg`,{class:`tab-icon`,fill:`none`,stroke:`currentColor`,viewBox:`0 0 24 24`},[i(`path`,{"stroke-linecap":`round`,"stroke-linejoin":`round`,"stroke-width":`2`,d:`M15 12a3 3 0 11-6 0 3 3 0 016 0z`}),i(`path`,{"stroke-linecap":`round`,"stroke-linejoin":`round`,"stroke-width":`2`,d:`M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z`})],-1),e(` Preview `,-1)]],2),i(`button`,{class:r([`tab-toggle-btn`,{active:B.value===`code`}]),onClick:s[1]||=e=>B.value=`code`},[...s[9]||=[i(`svg`,{class:`tab-icon`,fill:`none`,stroke:`currentColor`,viewBox:`0 0 24 24`},[i(`path`,{"stroke-linecap":`round`,"stroke-linejoin":`round`,"stroke-width":`2`,d:`M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4`})],-1),e(` Code `,-1)]],2)]),s[10]||=i(`span`,{class:`demo-badge`},`Pixel Data Processing Engine`,-1)]),n(i(`div`,w,[i(`div`,T,[i(`div`,E,[i(`button`,{class:r([`pill-btn`,{active:V.value===`fractal`}]),onClick:s[2]||=e=>V.value=`fractal`},` Julia Set Fractal `,2),i(`button`,{class:r([`pill-btn`,{active:V.value===`elevation`}]),onClick:s[3]||=e=>V.value=`elevation`},` False-Color Elevation Map `,2)]),i(`div`,D,[s[11]||=i(`label`,{for:`img-scheme-select`,class:`select-label`},`Scheme:`,-1),n(i(`select`,{id:`img-scheme-select`,"onUpdate:modelValue":s[4]||=e=>H.value=e,class:`scheme-select`},[(l(),a(u,null,o(J,e=>i(`option`,{key:e,value:e},d(e),9,O)),64))],512),[[h,H.value]])])]),i(`div`,k,[i(`canvas`,{ref_key:`imageCanvas`,ref:q,class:`demo-canvas`,width:`680`,height:`300`},null,512)]),i(`div`,A,[V.value===`fractal`?(l(),a(`div`,j,[i(`label`,M,`Julia Parameter (cRe): `+d(W.value.toFixed(2)),1),n(i(`input`,{type:`range`,min:`-1`,max:`1`,step:`0.01`,"onUpdate:modelValue":s[5]||=e=>W.value=e,class:`param-slider`},null,512),[[g,W.value,void 0,{number:!0}]])])):p(``,!0),V.value===`fractal`?(l(),a(`div`,N,[i(`label`,P,`Julia Parameter (cIm): `+d(G.value.toFixed(2)),1),n(i(`input`,{type:`range`,min:`-1`,max:`1`,step:`0.01`,"onUpdate:modelValue":s[6]||=e=>G.value=e,class:`param-slider`},null,512),[[g,G.value,void 0,{number:!0}]])])):p(``,!0),V.value===`elevation`?(l(),a(`div`,F,[i(`label`,I,`Contour Sharpness: `+d(K.value),1),n(i(`input`,{type:`range`,min:`1`,max:`10`,step:`1`,"onUpdate:modelValue":s[7]||=e=>K.value=e,class:`param-slider`},null,512),[[g,K.value,void 0,{number:!0}]])])):p(``,!0)])],512),[[m,B.value===`preview`]]),n(i(`div`,L,[i(`div`,R,[s[12]||=i(`span`,null,`image-processing.ts`,-1),i(`button`,{class:`copy-code-btn`,onClick:Q},d(U.value?`Copied!`:`Copy Code`),1)]),i(`pre`,z,[i(`code`,null,d(Z.value),1)])],512),[[m,B.value===`code`]])]))}},[[`__scopeId`,`data-v-1d26e226`]]);export{B as default};