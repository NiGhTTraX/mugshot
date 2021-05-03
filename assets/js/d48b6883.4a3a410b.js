(window.webpackJsonp=window.webpackJsonp||[]).push([[47],{120:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return a})),n.d(t,"metadata",(function(){return p})),n.d(t,"toc",(function(){return l})),n.d(t,"default",(function(){return s}));var r=n(3),i=n(7),o=(n(0),n(132)),a={id:"mugshot.pixeldifferoptions",title:"Interface: PixelDifferOptions",sidebar_label:"PixelDifferOptions",custom_edit_url:null},p={unversionedId:"api/interfaces/mugshot.pixeldifferoptions",id:"api/interfaces/mugshot.pixeldifferoptions",isDocsHomePage:!1,title:"Interface: PixelDifferOptions",description:"mugshot.PixelDifferOptions",source:"@site/docs/api/interfaces/mugshot.pixeldifferoptions.md",sourceDirName:"api/interfaces",slug:"/api/interfaces/mugshot.pixeldifferoptions",permalink:"/mugshot/api/interfaces/mugshot.pixeldifferoptions",editUrl:null,version:"current",sidebar_label:"PixelDifferOptions",frontMatter:{id:"mugshot.pixeldifferoptions",title:"Interface: PixelDifferOptions",sidebar_label:"PixelDifferOptions",custom_edit_url:null},sidebar:"api",previous:{title:"Interface: PNGProcessor",permalink:"/mugshot/api/interfaces/mugshot.pngprocessor"},next:{title:"Interface: ScreenshotOptions",permalink:"/mugshot/api/interfaces/mugshot.screenshotoptions"}},l=[{value:"Properties",id:"properties",children:[{value:"diffColor",id:"diffcolor",children:[]},{value:"threshold",id:"threshold",children:[]}]}],c={toc:l};function s(e){var t=e.components,n=Object(i.a)(e,["components"]);return Object(o.b)("wrapper",Object(r.a)({},c,n,{components:t,mdxType:"MDXLayout"}),Object(o.b)("p",null,Object(o.b)("a",{parentName:"p",href:"/mugshot/api/modules/mugshot"},"mugshot"),".PixelDifferOptions"),Object(o.b)("h2",{id:"properties"},"Properties"),Object(o.b)("h3",{id:"diffcolor"},"diffColor"),Object(o.b)("p",null,"\u2022 ",Object(o.b)("inlineCode",{parentName:"p"},"Optional")," ",Object(o.b)("strong",{parentName:"p"},"diffColor"),": ",Object(o.b)("a",{parentName:"p",href:"/mugshot/api/interfaces/mugshot.color"},Object(o.b)("em",{parentName:"a"},"Color"))),Object(o.b)("p",null,"The color used to mark different pixels."),Object(o.b)("p",null,"Defined in: ",Object(o.b)("a",{parentName:"p",href:"https://github.com/NiGhTTraX/mugshot/blob/5419683/packages/mugshot/src/lib/pixel-differ.ts#L15"},"packages/mugshot/src/lib/pixel-differ.ts:15")),Object(o.b)("hr",null),Object(o.b)("h3",{id:"threshold"},"threshold"),Object(o.b)("p",null,"\u2022 ",Object(o.b)("inlineCode",{parentName:"p"},"Optional")," ",Object(o.b)("strong",{parentName:"p"},"threshold"),": ",Object(o.b)("em",{parentName:"p"},"number")),Object(o.b)("p",null,"A number between ",Object(o.b)("inlineCode",{parentName:"p"},"0")," and ",Object(o.b)("inlineCode",{parentName:"p"},"1")," representing the max difference in %\nbetween 2 pixels to be considered identical."),Object(o.b)("p",null,Object(o.b)("strong",{parentName:"p"},Object(o.b)("inlineCode",{parentName:"strong"},"example")),"\n",Object(o.b)("inlineCode",{parentName:"p"},"0")," means the pixel need to be identical."),Object(o.b)("p",null,Object(o.b)("strong",{parentName:"p"},Object(o.b)("inlineCode",{parentName:"strong"},"example")),"\n",Object(o.b)("inlineCode",{parentName:"p"},"1")," means two completely different images will be identical. If the\nimages have different dimension then the comparison will fail."),Object(o.b)("p",null,Object(o.b)("strong",{parentName:"p"},Object(o.b)("inlineCode",{parentName:"strong"},"example")),"\n",Object(o.b)("inlineCode",{parentName:"p"},"0.1")," means black (",Object(o.b)("inlineCode",{parentName:"p"},"#000"),") and 90% gray (",Object(o.b)("inlineCode",{parentName:"p"},"#0a0a0a"),") will be identical."),Object(o.b)("p",null,"Defined in: ",Object(o.b)("a",{parentName:"p",href:"https://github.com/NiGhTTraX/mugshot/blob/5419683/packages/mugshot/src/lib/pixel-differ.ts#L31"},"packages/mugshot/src/lib/pixel-differ.ts:31")))}s.isMDXComponent=!0},132:function(e,t,n){"use strict";n.d(t,"a",(function(){return b})),n.d(t,"b",(function(){return m}));var r=n(0),i=n.n(r);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function p(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var c=i.a.createContext({}),s=function(e){var t=i.a.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):p(p({},t),e)),n},b=function(e){var t=s(e.components);return i.a.createElement(c.Provider,{value:t},e.children)},f={inlineCode:"code",wrapper:function(e){var t=e.children;return i.a.createElement(i.a.Fragment,{},t)}},u=i.a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,a=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),b=s(n),u=r,m=b["".concat(a,".").concat(u)]||b[u]||f[u]||o;return n?i.a.createElement(m,p(p({ref:t},c),{},{components:n})):i.a.createElement(m,p({ref:t},c))}));function m(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,a=new Array(o);a[0]=u;var p={};for(var l in t)hasOwnProperty.call(t,l)&&(p[l]=t[l]);p.originalType=e,p.mdxType="string"==typeof e?e:r,a[1]=p;for(var c=2;c<o;c++)a[c]=n[c];return i.a.createElement.apply(null,a)}return i.a.createElement.apply(null,n)}u.displayName="MDXCreateElement"}}]);