(window.webpackJsonp=window.webpackJsonp||[]).push([[25],{132:function(e,t,r){"use strict";r.d(t,"a",(function(){return b})),r.d(t,"b",(function(){return f}));var n=r(0),a=r.n(n);function c(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function s(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function u(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?s(Object(r),!0).forEach((function(t){c(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):s(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function i(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},c=Object.keys(e);for(n=0;n<c.length;n++)r=c[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var c=Object.getOwnPropertySymbols(e);for(n=0;n<c.length;n++)r=c[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var o=a.a.createContext({}),l=function(e){var t=a.a.useContext(o),r=t;return e&&(r="function"==typeof e?e(t):u(u({},t),e)),r},b=function(e){var t=l(e.components);return a.a.createElement(o.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return a.a.createElement(a.a.Fragment,{},t)}},m=a.a.forwardRef((function(e,t){var r=e.components,n=e.mdxType,c=e.originalType,s=e.parentName,o=i(e,["components","mdxType","originalType","parentName"]),b=l(r),m=n,f=b["".concat(s,".").concat(m)]||b[m]||p[m]||c;return r?a.a.createElement(f,u(u({ref:t},o),{},{components:r})):a.a.createElement(f,u({ref:t},o))}));function f(e,t){var r=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var c=r.length,s=new Array(c);s[0]=m;var u={};for(var i in t)hasOwnProperty.call(t,i)&&(u[i]=t[i]);u.originalType=e,u.mdxType="string"==typeof e?e:n,s[1]=u;for(var o=2;o<c;o++)s[o]=r[o];return a.a.createElement.apply(null,s)}return a.a.createElement.apply(null,r)}m.displayName="MDXCreateElement"},96:function(e,t,r){"use strict";r.r(t),r.d(t,"frontMatter",(function(){return s})),r.d(t,"metadata",(function(){return u})),r.d(t,"toc",(function(){return i})),r.d(t,"default",(function(){return l}));var n=r(3),a=r(7),c=(r(0),r(132)),s={id:"mugshot.mugshotdiffresult",title:"Interface: MugshotDiffResult",sidebar_label:"MugshotDiffResult",custom_edit_url:null},u={unversionedId:"api/interfaces/mugshot.mugshotdiffresult",id:"api/interfaces/mugshot.mugshotdiffresult",isDocsHomePage:!1,title:"Interface: MugshotDiffResult",description:"mugshot.MugshotDiffResult",source:"@site/docs/api/interfaces/mugshot.mugshotdiffresult.md",sourceDirName:"api/interfaces",slug:"/api/interfaces/mugshot.mugshotdiffresult",permalink:"/mugshot/api/interfaces/mugshot.mugshotdiffresult",editUrl:null,version:"current",sidebar_label:"MugshotDiffResult",frontMatter:{id:"mugshot.mugshotdiffresult",title:"Interface: MugshotDiffResult",sidebar_label:"MugshotDiffResult",custom_edit_url:null},sidebar:"api",previous:{title:"Interface: ElementRect",permalink:"/mugshot/api/interfaces/mugshot.elementrect"},next:{title:"Interface: MugshotIdenticalResult",permalink:"/mugshot/api/interfaces/mugshot.mugshotidenticalresult"}},i=[{value:"Properties",id:"properties",children:[{value:"actual",id:"actual",children:[]},{value:"actualName",id:"actualname",children:[]},{value:"diff",id:"diff",children:[]},{value:"diffName",id:"diffname",children:[]},{value:"expected",id:"expected",children:[]},{value:"expectedName",id:"expectedname",children:[]},{value:"matches",id:"matches",children:[]}]}],o={toc:i};function l(e){var t=e.components,r=Object(a.a)(e,["components"]);return Object(c.b)("wrapper",Object(n.a)({},o,r,{components:t,mdxType:"MDXLayout"}),Object(c.b)("p",null,Object(c.b)("a",{parentName:"p",href:"/mugshot/api/modules/mugshot"},"mugshot"),".MugshotDiffResult"),Object(c.b)("h2",{id:"properties"},"Properties"),Object(c.b)("h3",{id:"actual"},"actual"),Object(c.b)("p",null,"\u2022 ",Object(c.b)("strong",{parentName:"p"},"actual"),": ",Object(c.b)("em",{parentName:"p"},"Buffer")),Object(c.b)("p",null,"A PNG MIME encoded buffer of the actual screenshot."),Object(c.b)("p",null,"Defined in: ",Object(c.b)("a",{parentName:"p",href:"https://github.com/NiGhTTraX/mugshot/blob/5419683/packages/mugshot/src/lib/mugshot.ts#L32"},"packages/mugshot/src/lib/mugshot.ts:32")),Object(c.b)("hr",null),Object(c.b)("h3",{id:"actualname"},"actualName"),Object(c.b)("p",null,"\u2022 ",Object(c.b)("strong",{parentName:"p"},"actualName"),": ",Object(c.b)("em",{parentName:"p"},"string")),Object(c.b)("p",null,"The name of the actual screenshot."),Object(c.b)("p",null,"Defined in: ",Object(c.b)("a",{parentName:"p",href:"https://github.com/NiGhTTraX/mugshot/blob/5419683/packages/mugshot/src/lib/mugshot.ts#L44"},"packages/mugshot/src/lib/mugshot.ts:44")),Object(c.b)("hr",null),Object(c.b)("h3",{id:"diff"},"diff"),Object(c.b)("p",null,"\u2022 ",Object(c.b)("strong",{parentName:"p"},"diff"),": ",Object(c.b)("em",{parentName:"p"},"Buffer")),Object(c.b)("p",null,"A PNG MIME encoded buffer of the diff image."),Object(c.b)("p",null,"Defined in: ",Object(c.b)("a",{parentName:"p",href:"https://github.com/NiGhTTraX/mugshot/blob/5419683/packages/mugshot/src/lib/mugshot.ts#L36"},"packages/mugshot/src/lib/mugshot.ts:36")),Object(c.b)("hr",null),Object(c.b)("h3",{id:"diffname"},"diffName"),Object(c.b)("p",null,"\u2022 ",Object(c.b)("strong",{parentName:"p"},"diffName"),": ",Object(c.b)("em",{parentName:"p"},"string")),Object(c.b)("p",null,"The name of the diff image."),Object(c.b)("p",null,"Defined in: ",Object(c.b)("a",{parentName:"p",href:"https://github.com/NiGhTTraX/mugshot/blob/5419683/packages/mugshot/src/lib/mugshot.ts#L48"},"packages/mugshot/src/lib/mugshot.ts:48")),Object(c.b)("hr",null),Object(c.b)("h3",{id:"expected"},"expected"),Object(c.b)("p",null,"\u2022 ",Object(c.b)("strong",{parentName:"p"},"expected"),": ",Object(c.b)("em",{parentName:"p"},"Buffer")),Object(c.b)("p",null,"A PNG MIME encoded buffer of the baseline image."),Object(c.b)("p",null,"Defined in: ",Object(c.b)("a",{parentName:"p",href:"https://github.com/NiGhTTraX/mugshot/blob/5419683/packages/mugshot/src/lib/mugshot.ts#L28"},"packages/mugshot/src/lib/mugshot.ts:28")),Object(c.b)("hr",null),Object(c.b)("h3",{id:"expectedname"},"expectedName"),Object(c.b)("p",null,"\u2022 ",Object(c.b)("strong",{parentName:"p"},"expectedName"),": ",Object(c.b)("em",{parentName:"p"},"string")),Object(c.b)("p",null,"The name of the baseline."),Object(c.b)("p",null,"Defined in: ",Object(c.b)("a",{parentName:"p",href:"https://github.com/NiGhTTraX/mugshot/blob/5419683/packages/mugshot/src/lib/mugshot.ts#L40"},"packages/mugshot/src/lib/mugshot.ts:40")),Object(c.b)("hr",null),Object(c.b)("h3",{id:"matches"},"matches"),Object(c.b)("p",null,"\u2022 ",Object(c.b)("strong",{parentName:"p"},"matches"),": ",Object(c.b)("inlineCode",{parentName:"p"},"false")),Object(c.b)("p",null,"Defined in: ",Object(c.b)("a",{parentName:"p",href:"https://github.com/NiGhTTraX/mugshot/blob/5419683/packages/mugshot/src/lib/mugshot.ts#L24"},"packages/mugshot/src/lib/mugshot.ts:24")))}l.isMDXComponent=!0}}]);