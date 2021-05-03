(window.webpackJsonp=window.webpackJsonp||[]).push([[30],{101:function(e,t,r){"use strict";r.r(t),r.d(t,"frontMatter",(function(){return i})),r.d(t,"metadata",(function(){return o})),r.d(t,"toc",(function(){return s})),r.d(t,"default",(function(){return b}));var n=r(3),a=r(7),c=(r(0),r(132)),i={id:"_mugshot_contracts.webdrivertestsetup",title:"Interface: WebdriverTestSetup",sidebar_label:"WebdriverTestSetup",custom_edit_url:null},o={unversionedId:"api/interfaces/_mugshot_contracts.webdrivertestsetup",id:"api/interfaces/_mugshot_contracts.webdrivertestsetup",isDocsHomePage:!1,title:"Interface: WebdriverTestSetup",description:"@mugshot/contracts.WebdriverTestSetup",source:"@site/docs/api/interfaces/_mugshot_contracts.webdrivertestsetup.md",sourceDirName:"api/interfaces",slug:"/api/interfaces/_mugshot_contracts.webdrivertestsetup",permalink:"/mugshot/api/interfaces/_mugshot_contracts.webdrivertestsetup",editUrl:null,version:"current",sidebar_label:"WebdriverTestSetup",frontMatter:{id:"_mugshot_contracts.webdrivertestsetup",title:"Interface: WebdriverTestSetup",sidebar_label:"WebdriverTestSetup",custom_edit_url:null},sidebar:"api",previous:{title:"Interface: WebdriverContractTest",permalink:"/mugshot/api/interfaces/_mugshot_contracts.webdrivercontracttest"},next:{title:"Interface: Color",permalink:"/mugshot/api/interfaces/mugshot.color"}},s=[{value:"Properties",id:"properties",children:[{value:"url",id:"url",children:[]}]}],p={toc:s};function b(e){var t=e.components,r=Object(a.a)(e,["components"]);return Object(c.b)("wrapper",Object(n.a)({},p,r,{components:t,mdxType:"MDXLayout"}),Object(c.b)("p",null,Object(c.b)("a",{parentName:"p",href:"/mugshot/api/modules/_mugshot_contracts"},"@mugshot/contracts"),".WebdriverTestSetup"),Object(c.b)("p",null,"Help the tests set up the environment."),Object(c.b)("p",null,"This is different from ",Object(c.b)("a",{parentName:"p",href:"/mugshot/api/interfaces/mugshot.webdriver"},"Webdriver")," because these methods are only\nneeded by the tests."),Object(c.b)("h2",{id:"properties"},"Properties"),Object(c.b)("h3",{id:"url"},"url"),Object(c.b)("p",null,"\u2022 ",Object(c.b)("strong",{parentName:"p"},"url"),": (",Object(c.b)("inlineCode",{parentName:"p"},"path"),": ",Object(c.b)("em",{parentName:"p"},"string"),") => ",Object(c.b)("em",{parentName:"p"},"Promise"),"<any",">"),Object(c.b)("p",null,"Navigate to an URL."),Object(c.b)("h4",{id:"type-declaration"},"Type declaration:"),Object(c.b)("p",null,"\u25b8 (",Object(c.b)("inlineCode",{parentName:"p"},"path"),": ",Object(c.b)("em",{parentName:"p"},"string"),"): ",Object(c.b)("em",{parentName:"p"},"Promise"),"<any",">"),Object(c.b)("h4",{id:"parameters"},"Parameters:"),Object(c.b)("table",null,Object(c.b)("thead",{parentName:"table"},Object(c.b)("tr",{parentName:"thead"},Object(c.b)("th",{parentName:"tr",align:"left"},"Name"),Object(c.b)("th",{parentName:"tr",align:"left"},"Type"))),Object(c.b)("tbody",{parentName:"table"},Object(c.b)("tr",{parentName:"tbody"},Object(c.b)("td",{parentName:"tr",align:"left"},Object(c.b)("inlineCode",{parentName:"td"},"path")),Object(c.b)("td",{parentName:"tr",align:"left"},Object(c.b)("em",{parentName:"td"},"string"))))),Object(c.b)("p",null,Object(c.b)("strong",{parentName:"p"},"Returns:")," ",Object(c.b)("em",{parentName:"p"},"Promise"),"<any",">"),Object(c.b)("p",null,"Defined in: ",Object(c.b)("a",{parentName:"p",href:"https://github.com/NiGhTTraX/mugshot/blob/5419683/packages/contracts/src/webdriver-spec.ts#L19"},"packages/contracts/src/webdriver-spec.ts:19")),Object(c.b)("p",null,"Defined in: ",Object(c.b)("a",{parentName:"p",href:"https://github.com/NiGhTTraX/mugshot/blob/5419683/packages/contracts/src/webdriver-spec.ts#L19"},"packages/contracts/src/webdriver-spec.ts:19")))}b.isMDXComponent=!0},132:function(e,t,r){"use strict";r.d(t,"a",(function(){return u})),r.d(t,"b",(function(){return d}));var n=r(0),a=r.n(n);function c(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function i(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function o(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?i(Object(r),!0).forEach((function(t){c(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function s(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},c=Object.keys(e);for(n=0;n<c.length;n++)r=c[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var c=Object.getOwnPropertySymbols(e);for(n=0;n<c.length;n++)r=c[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var p=a.a.createContext({}),b=function(e){var t=a.a.useContext(p),r=t;return e&&(r="function"==typeof e?e(t):o(o({},t),e)),r},u=function(e){var t=b(e.components);return a.a.createElement(p.Provider,{value:t},e.children)},l={inlineCode:"code",wrapper:function(e){var t=e.children;return a.a.createElement(a.a.Fragment,{},t)}},m=a.a.forwardRef((function(e,t){var r=e.components,n=e.mdxType,c=e.originalType,i=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),u=b(r),m=n,d=u["".concat(i,".").concat(m)]||u[m]||l[m]||c;return r?a.a.createElement(d,o(o({ref:t},p),{},{components:r})):a.a.createElement(d,o({ref:t},p))}));function d(e,t){var r=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var c=r.length,i=new Array(c);i[0]=m;var o={};for(var s in t)hasOwnProperty.call(t,s)&&(o[s]=t[s]);o.originalType=e,o.mdxType="string"==typeof e?e:n,i[1]=o;for(var p=2;p<c;p++)i[p]=r[p];return a.a.createElement.apply(null,i)}return a.a.createElement.apply(null,r)}m.displayName="MDXCreateElement"}}]);