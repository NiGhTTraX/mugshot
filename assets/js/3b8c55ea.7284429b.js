(window.webpackJsonp=window.webpackJsonp||[]).push([[13],{132:function(e,t,n){"use strict";n.d(t,"a",(function(){return u})),n.d(t,"b",(function(){return d}));var r=n(0),a=n.n(r);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function p(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var l=a.a.createContext({}),c=function(e){var t=a.a.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):p(p({},t),e)),n},u=function(e){var t=c(e.components);return a.a.createElement(l.Provider,{value:t},e.children)},b={inlineCode:"code",wrapper:function(e){var t=e.children;return a.a.createElement(a.a.Fragment,{},t)}},m=a.a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,i=e.parentName,l=s(e,["components","mdxType","originalType","parentName"]),u=c(n),m=r,d=u["".concat(i,".").concat(m)]||u[m]||b[m]||o;return n?a.a.createElement(d,p(p({ref:t},l),{},{components:n})):a.a.createElement(d,p({ref:t},l))}));function d(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,i=new Array(o);i[0]=m;var p={};for(var s in t)hasOwnProperty.call(t,s)&&(p[s]=t[s]);p.originalType=e,p.mdxType="string"==typeof e?e:r,i[1]=p;for(var l=2;l<o;l++)i[l]=n[l];return a.a.createElement.apply(null,i)}return a.a.createElement.apply(null,n)}m.displayName="MDXCreateElement"},84:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return i})),n.d(t,"metadata",(function(){return p})),n.d(t,"toc",(function(){return s})),n.d(t,"default",(function(){return c}));var r=n(3),a=n(7),o=(n(0),n(132)),i={id:"installation",title:"Installation",description:"TODO",slug:"/installation",sidebar_position:2},p={unversionedId:"installation",id:"installation",isDocsHomePage:!1,title:"Installation",description:"TODO",source:"@site/docs/installation.md",sourceDirName:".",slug:"/installation",permalink:"/mugshot/installation",editUrl:"https://github.com/nighttrax/mugshot/edit/master/packages/website/docs/installation.md",version:"current",sidebarPosition:2,frontMatter:{id:"installation",title:"Installation",description:"TODO",slug:"/installation",sidebar_position:2},sidebar:"docs",previous:{title:"Introduction",permalink:"/mugshot/"},next:{title:"Usage",permalink:"/mugshot/usage"}},s=[{value:"Adapters",id:"adapters",children:[{value:"Implementing your own Webdriver adapter",id:"implementing-your-own-webdriver-adapter",children:[]}]}],l={toc:s};function c(e){var t=e.components,n=Object(a.a)(e,["components"]);return Object(o.b)("wrapper",Object(r.a)({},l,n,{components:t,mdxType:"MDXLayout"}),Object(o.b)("pre",null,Object(o.b)("code",{parentName:"pre",className:"language-console"},"npm install --save-dev mugshot\n")),Object(o.b)("p",null,"Or alternatively with yarn"),Object(o.b)("pre",null,Object(o.b)("code",{parentName:"pre",className:"language-console"},"yarn add -D mugshot\n")),Object(o.b)("h2",{id:"adapters"},"Adapters"),Object(o.b)("p",null,"Depending on how you want to take screenshots, you'll need a ",Object(o.b)("a",{parentName:"p",href:"/mugshot/api/interfaces/mugshot.screenshotter"},Object(o.b)("inlineCode",{parentName:"a"},"Screenshotter"))," implementation. Mugshot bundles a ",Object(o.b)("a",{parentName:"p",href:"/mugshot/api/classes/mugshot.webdriverscreenshotter"},Object(o.b)("inlineCode",{parentName:"a"},"WebdriverScreenshotter"))," that you can use with Webdriver compatible clients e.g. ",Object(o.b)("a",{parentName:"p",href:"https://selenium.dev/"},"Selenium")," or ",Object(o.b)("a",{parentName:"p",href:"http://appium.io/"},"Appium"),". Each client might need an adapter that translates its API to the interface that Mugshot expects. The following adapters are available:"),Object(o.b)("table",null,Object(o.b)("thead",{parentName:"table"},Object(o.b)("tr",{parentName:"thead"},Object(o.b)("th",{parentName:"tr",align:null},"Package"),Object(o.b)("th",{parentName:"tr",align:null},"Version"))),Object(o.b)("tbody",{parentName:"table"},Object(o.b)("tr",{parentName:"tbody"},Object(o.b)("td",{parentName:"tr",align:null},Object(o.b)("a",{parentName:"td",href:"/mugshot/api/modules/_mugshot_webdriverio"},"@mugshot/webdriverio")),Object(o.b)("td",{parentName:"tr",align:null},Object(o.b)("img",{parentName:"td",src:"https://img.shields.io/npm/v/@mugshot/webdriverio.svg",alt:"npm"}))),Object(o.b)("tr",{parentName:"tbody"},Object(o.b)("td",{parentName:"tr",align:null},Object(o.b)("a",{parentName:"td",href:"/mugshot/api/modules/_mugshot_puppeteer"},"@mugshot/puppeteer")),Object(o.b)("td",{parentName:"tr",align:null},Object(o.b)("img",{parentName:"td",src:"https://img.shields.io/npm/v/@mugshot/puppeteer.svg",alt:"npm"}))),Object(o.b)("tr",{parentName:"tbody"},Object(o.b)("td",{parentName:"tr",align:null},Object(o.b)("a",{parentName:"td",href:"/mugshot/api/modules/_mugshot_playwright"},"@mugshot/playwright")),Object(o.b)("td",{parentName:"tr",align:null},Object(o.b)("img",{parentName:"td",src:"https://img.shields.io/npm/v/@mugshot/playwright.svg",alt:"npm"}))))),Object(o.b)("p",null,"If none of the provided adapters suit you, you can just roll your own by implementing the ",Object(o.b)("a",{parentName:"p",href:"/mugshot/api/interfaces/mugshot.webdriver"},Object(o.b)("inlineCode",{parentName:"a"},"Webdriver")," interface"),". See the ",Object(o.b)("a",{parentName:"p",href:"/mugshot/api/modules/_mugshot_contracts"},"docs")," on how to validate your implementation."),Object(o.b)("h3",{id:"implementing-your-own-webdriver-adapter"},"Implementing your own Webdriver adapter"),Object(o.b)("p",null,"Mugshot ships with a few adapters for the most popular webdriver clients, but if you need something else then you can easily write your own. You need to implement the ",Object(o.b)("a",{parentName:"p",href:"/mugshot/api/interfaces/mugshot.webdriver"},Object(o.b)("inlineCode",{parentName:"a"},"Webdriver")," interface")," by providing a way to take screenshots, get element geometry and execute scripts on the page."),Object(o.b)("p",null,"To validate your implementation you can run the ",Object(o.b)("a",{parentName:"p",href:"/mugshot/api/variables/_mugshot_contracts.webdrivercontractsuites"},"contract tests"),". Each suite consists of a number of tests that need your adapter implementation and a way to set up the test environment."),Object(o.b)("p",null,"The example below illustrates how to run the tests with ",Object(o.b)("a",{parentName:"p",href:"https://jestjs.io/"},"Jest")," for ",Object(o.b)("a",{parentName:"p",href:"/mugshot/api/classes/_mugshot_puppeteer.puppeteeradapter"},"PuppeteerAdapter"),":"),Object(o.b)("pre",null,Object(o.b)("code",{parentName:"pre",className:"language-typescript"},"import { webdriverContractSuites } from '@mugshot/contracts';\nimport { PuppeteerAdapter } from '@mugshot/puppeteer';\nimport puppeteer from 'puppeteer';\n\ndescribe('PuppeteerAdapter', () => {\n  let browser!: puppeteer.Browser, page!: puppeteer.Page;\n\n  beforeAll(async () => {\n    browser = await puppeteer.launch();\n    page = await browser.newPage();\n  });\n\n  afterAll(async () => {\n    await browser.close();\n  });\n\n  const setup = {\n    url: (path: string) => page.goto(path),\n  };\n\n  Object.keys(webdriverContractSuites).forEach((suite) => {\n    describe(suite, () => {\n      webdriverContractSuites[suite].forEach((test) => {\n        it(test.name, () => test.run(setup, new PuppeteerAdapter(page)));\n      });\n    });\n  });\n});\n")))}c.isMDXComponent=!0}}]);