"use strict";(self.webpackChunkapache_streampark_website=self.webpackChunkapache_streampark_website||[]).push([[7643],{34478:(e,t,n)=>{n.d(t,{A:()=>o});n(30758);var a=n(13526),i=n(86397);const s={tag:"tag_mtSO",tagRegular:"tagRegular_u5wg",tagWithCount:"tagWithCount_MP1N"};var l=n(86070);function o(e){let{permalink:t,label:n,count:o}=e;return(0,l.jsxs)(i.A,{href:t,className:(0,a.A)(s.tag,o?s.tagWithCount:s.tagRegular),children:[n,o&&(0,l.jsx)("span",{children:o})]})}},43348:(e,t,n)=>{n.d(t,{A:()=>r});n(30758);var a=n(13526),i=n(59987),s=n(34478);const l={tags:"tags_bUDc",tag:"tag_edSN"};var o=n(86070);function r(e){let{tags:t}=e;return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)("b",{children:(0,o.jsx)(i.A,{id:"theme.tags.tagsListLabel",description:"The label alongside a tag list",children:"Tags:"})}),(0,o.jsx)("ul",{className:(0,a.A)(l.tags,"padding--none","margin-left--sm"),children:t.map((e=>{let{label:t,permalink:n}=e;return(0,o.jsx)("li",{className:l.tag,children:(0,o.jsx)(s.A,{label:t,permalink:n})},n)}))})]})}},86546:(e,t,n)=>{n.d(t,{e:()=>r,i:()=>o});var a=n(30758),i=n(23423),s=n(86070);const l=a.createContext(null);function o(e){let{children:t,content:n,isBlogPostPage:i=!1}=e;const o=function(e){let{content:t,isBlogPostPage:n}=e;return(0,a.useMemo)((()=>({metadata:t.metadata,frontMatter:t.frontMatter,assets:t.assets,toc:t.toc,isBlogPostPage:n})),[t,n])}({content:n,isBlogPostPage:i});return(0,s.jsx)(l.Provider,{value:o,children:t})}function r(){const e=(0,a.useContext)(l);if(null===e)throw new i.dV("BlogPostProvider");return e}},17216:(e,t,n)=>{n.d(t,{W:()=>c});var a=n(30758),i=n(37145);const s=["zero","one","two","few","many","other"];function l(e){return s.filter((t=>e.includes(t)))}const o={locale:"en",pluralForms:l(["one","other"]),select:e=>1===e?"one":"other"};function r(){const{i18n:{currentLocale:e}}=(0,i.A)();return(0,a.useMemo)((()=>{try{return function(e){const t=new Intl.PluralRules(e);return{locale:e,pluralForms:l(t.resolvedOptions().pluralCategories),select:e=>t.select(e)}}(e)}catch(t){return console.error(`Failed to use Intl.PluralRules for locale "${e}".\nDocusaurus will fallback to the default (English) implementation.\nError: ${t.message}\n`),o}}),[e])}function c(){const e=r();return{selectMessage:(t,n)=>function(e,t,n){const a=e.split("|");if(1===a.length)return a[0];a.length>n.pluralForms.length&&console.error(`For locale=${n.locale}, a maximum of ${n.pluralForms.length} plural forms are expected (${n.pluralForms.join(",")}), but the message contains ${a.length}: ${e}`);const i=n.select(t),s=n.pluralForms.indexOf(i);return a[Math.min(s,a.length-1)]}(n,t,e)}}},3545:(e,t,n)=>{n.d(t,{A:()=>m});var a=n(30758),i=n(68835),s=n(80806),l=n(59987),o=n(86070);const r={note:{infimaClassName:"secondary",iconComponent:function(){return(0,o.jsx)("svg",{viewBox:"0 0 14 16",children:(0,o.jsx)("path",{fillRule:"evenodd",d:"M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"})})},label:(0,o.jsx)(l.A,{id:"theme.admonition.note",description:"The default label used for the Note admonition (:::note)",children:"note"})},tip:{infimaClassName:"success",iconComponent:function(){return(0,o.jsx)("svg",{viewBox:"0 0 12 16",children:(0,o.jsx)("path",{fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"})})},label:(0,o.jsx)(l.A,{id:"theme.admonition.tip",description:"The default label used for the Tip admonition (:::tip)",children:"tip"})},danger:{infimaClassName:"danger",iconComponent:function(){return(0,o.jsx)("svg",{viewBox:"0 0 12 16",children:(0,o.jsx)("path",{fillRule:"evenodd",d:"M5.05.31c.81 2.17.41 3.38-.52 4.31C3.55 5.67 1.98 6.45.9 7.98c-1.45 2.05-1.7 6.53 3.53 7.7-2.2-1.16-2.67-4.52-.3-6.61-.61 2.03.53 3.33 1.94 2.86 1.39-.47 2.3.53 2.27 1.67-.02.78-.31 1.44-1.13 1.81 3.42-.59 4.78-3.42 4.78-5.56 0-2.84-2.53-3.22-1.25-5.61-1.52.13-2.03 1.13-1.89 2.75.09 1.08-1.02 1.8-1.86 1.33-.67-.41-.66-1.19-.06-1.78C8.18 5.31 8.68 2.45 5.05.32L5.03.3l.02.01z"})})},label:(0,o.jsx)(l.A,{id:"theme.admonition.danger",description:"The default label used for the Danger admonition (:::danger)",children:"danger"})},info:{infimaClassName:"info",iconComponent:function(){return(0,o.jsx)("svg",{viewBox:"0 0 14 16",children:(0,o.jsx)("path",{fillRule:"evenodd",d:"M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"})})},label:(0,o.jsx)(l.A,{id:"theme.admonition.info",description:"The default label used for the Info admonition (:::info)",children:"info"})},caution:{infimaClassName:"warning",iconComponent:function(){return(0,o.jsx)("svg",{viewBox:"0 0 16 16",children:(0,o.jsx)("path",{fillRule:"evenodd",d:"M8.893 1.5c-.183-.31-.52-.5-.887-.5s-.703.19-.886.5L.138 13.499a.98.98 0 0 0 0 1.001c.193.31.53.501.886.501h13.964c.367 0 .704-.19.877-.5a1.03 1.03 0 0 0 .01-1.002L8.893 1.5zm.133 11.497H6.987v-2.003h2.039v2.003zm0-3.004H6.987V5.987h2.039v4.006z"})})},label:(0,o.jsx)(l.A,{id:"theme.admonition.caution",description:"The default label used for the Caution admonition (:::caution)",children:"caution"})}},c={secondary:"note",important:"info",success:"tip",warning:"danger"};function d(e){const{mdxAdmonitionTitle:t,rest:n}=function(e){const t=a.Children.toArray(e),n=t.find((e=>a.isValidElement(e)&&"mdxAdmonitionTitle"===e.props?.mdxType)),i=(0,o.jsx)(o.Fragment,{children:t.filter((e=>e!==n))});return{mdxAdmonitionTitle:n,rest:i}}(e.children);return{...e,title:e.title??t,children:n}}function m(e){const{children:t,type:n,title:a,icon:l}=d(e),m=function(e){const t=c[e]??e,n=r[t];return n||(console.warn(`No admonition config found for admonition type "${t}". Using Info as fallback.`),r.info)}(n),h=a??m.label,{iconComponent:g}=m,u=l??(0,o.jsx)(g,{});return(0,o.jsxs)("div",{className:(0,i.A)(s.G.common.admonition,s.G.common.admonitionType(e.type),"alert",`alert--${m.infimaClassName}`,"admonition"),children:[(0,o.jsx)("div",{className:(0,i.A)("alert-icon","admonition-icon"),children:u}),(0,o.jsxs)("div",{className:(0,i.A)("alert-content","admonition-content"),children:[(0,o.jsx)("div",{className:"admonition-heading",children:h}),t]})]})}},19349:(e,t,n)=>{n.d(t,{A:()=>x});n(30758);var a=n(68835),i=n(43347),s=n(41608),l=n(86397),o=n(59987),r=n(25581);const c={sidebar:"sidebar_brwN",sidebarItemTitle:"sidebarItemTitle_r4Q1",sidebarItemList:"sidebarItemList_QwSx",sidebarItem:"sidebarItem_lnhn",sidebarItemLink:"sidebarItemLink_yNGZ",sidebarItemLinkActive:"sidebarItemLinkActive_oSRm",backButton:"backButton_MCHS"};var d=n(86070);function m(e){let{sidebar:t}=e;return(0,d.jsx)(r.P.aside,{className:"col col--2 overflow-hidden",initial:{opacity:0,x:-100},animate:{opacity:1,x:0},transition:{type:"spring",stiffness:400,damping:20,duration:.3},children:(0,d.jsxs)("nav",{className:(0,a.A)(c.sidebar,"thin-scrollbar"),"aria-label":(0,o.T)({id:"theme.blog.sidebar.navAriaLabel",message:"Blog recent posts navigation",description:"The ARIA label for recent posts in the blog sidebar"}),children:[(0,d.jsx)("div",{className:c.backButton,onClick:()=>{window.history.back()},children:(0,d.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"32",height:"32",viewBox:"0 0 24 24",children:(0,d.jsx)("path",{fill:"currentColor",d:"M8 7v4L2 6l6-5v4h5a8 8 0 1 1 0 16H4v-2h9a6 6 0 0 0 0-12H8Z"})})}),(0,d.jsx)(l.A,{href:"/blog",className:(0,a.A)(c.sidebarItemTitle,"margin-bottom--sm"),children:t.title}),(0,d.jsx)("ul",{className:(0,a.A)(c.sidebarItemList,"clean-list"),children:t.items.map((e=>(0,d.jsx)("li",{className:c.sidebarItem,children:(0,d.jsx)(l.A,{isNavLink:!0,to:e.permalink,className:c.sidebarItemLink,activeClassName:c.sidebarItemLinkActive,children:e.title})},e.permalink)))})]})})}var h=n(7915);function g(e){let{sidebar:t}=e;return(0,d.jsx)("ul",{className:"menu__list",children:t.items.map((e=>(0,d.jsx)("li",{className:"menu__list-item",children:(0,d.jsx)(l.A,{isNavLink:!0,to:e.permalink,className:"menu__link",activeClassName:"menu__link--active",children:e.title})},e.permalink)))})}function u(e){return(0,d.jsx)(h.GX,{component:g,props:e})}function p(e){let{sidebar:t}=e;const n=(0,s.l)();return t?.items.length?"mobile"===n?(0,d.jsx)(u,{sidebar:t}):(0,d.jsx)(m,{sidebar:t}):null}function x(e){const{sidebar:t,toc:n,children:s,...l}=e,o=t&&t.items.length>0;return(0,d.jsx)(i.A,{...l,children:(0,d.jsx)("div",{className:"container-wrapper blog-container",children:(0,d.jsx)("div",{className:"container margin-vert--lg",children:(0,d.jsxs)("div",{className:"row",children:[(0,d.jsx)(p,{sidebar:t}),(0,d.jsx)("main",{className:(0,a.A)("col",{"col--8 overflow-hidden":o,"col--12":!o}),itemScope:!0,itemType:"http://schema.org/Blog",children:s}),n&&(0,d.jsx)("div",{className:"col col--2",children:n})]})})})})}},14292:(e,t,n)=>{n.r(t),n.d(t,{default:()=>C});var a=n(30758),i=n(68835),s=n(37145),l=n(68109),o=n(80806),r=n(19349),c=n(32032),d=n(18552),m=n(61259),h=n(86397),g=n(25581),u=n(86070);const p={hidden:{opacity:1,scale:0},visible:{opacity:1,scale:1,transition:{delayChildren:.3,staggerChildren:.2}}},x={hidden:{y:20,opacity:0},visible:{y:0,opacity:1}};function v(e){let{items:t}=e;return(0,u.jsx)(g.P.div,{className:"bloghome__posts-list",variants:p,initial:"hidden",animate:"visible",children:t.map(((e,t)=>{let{content:n}=e;const{metadata:i,frontMatter:s}=n,{title:l}=s,{permalink:o,date:r,tags:c}=i,d=new Date(r),m=d.getFullYear();let p=("0"+(d.getMonth()+1)).slice(-2);const v=("0"+d.getDate()).slice(-2);return(0,u.jsx)(a.Fragment,{children:(0,u.jsxs)(g.P.div,{className:"post__list-item",variants:x,children:[(0,u.jsx)(h.A,{to:o,className:"post__list-title",children:l}),(0,u.jsx)("div",{className:"post__list-tags",children:c.length>0&&c.slice(0,2).map(((e,t)=>{let{label:n,permalink:a}=e;return(0,u.jsx)(h.A,{className:"post__tags "+(t<c.length?"margin-right--sm":""),to:a,style:{fontSize:"0.75em",fontWeight:500},children:n},a)}))}),(0,u.jsxs)("div",{className:"post__list-date",children:[m,"-",p,"-",v]})]},i.permalink)},i.permalink)}))})}var j,f=n(59987);function b(){return b=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},b.apply(this,arguments)}const _=e=>{let{title:t,titleId:n,...i}=e;return a.createElement("svg",b({xmlns:"http://www.w3.org/2000/svg",width:24,height:24,fill:"none",viewBox:"0 0 24 24","aria-labelledby":n},i),t?a.createElement("title",{id:n},t):null,j||(j=a.createElement("path",{d:"M3 4h4v4H3zm6 1v2h12V5zm-6 5h4v4H3zm6 1v2h12v-2zm-6 5h4v4H3zm6 1v2h12v-2z"})))};var N;function w(){return w=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},w.apply(this,arguments)}const A=e=>{let{title:t,titleId:n,...i}=e;return a.createElement("svg",w({xmlns:"http://www.w3.org/2000/svg",width:24,height:24,fill:"none",viewBox:"0 0 24 24","aria-labelledby":n},i),t?a.createElement("title",{id:n},t):null,N||(N=a.createElement("path",{d:"M16 20h4v-4h-4zm0-6h4v-4h-4zm-6-6h4V4h-4zm6 0h4V4h-4zm-6 6h4v-4h-4zm-6 0h4v-4H4zm0 6h4v-4H4zm6 0h4v-4h-4zM4 8h4V4H4z"})))};function P(e){const{metadata:t}=e,{siteConfig:{title:n}}=(0,s.A)(),{blogDescription:a,blogTitle:i,permalink:o}=t,r="/"===o?n:i;return(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)(l.be,{title:r,description:a}),(0,u.jsx)(d.A,{tag:"blog_posts_list"})]})}function k(){return(0,u.jsxs)("h1",{className:"blog__section_title",id:"homepage_blogs",children:[(0,u.jsx)(f.A,{id:"theme.blog.newerPost",description:"latest blogs heading",children:"Latest blog"}),"\xa0",(0,u.jsx)("svg",{width:"31",height:"31",viewBox:"0 0 31 31",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:(0,u.jsx)("path",{d:"M25.8333 5.16666H5.16668C3.73293 5.16666 2.59626 6.31624 2.59626 7.74999L2.58334 23.25C2.58334 24.6837 3.73293 25.8333 5.16668 25.8333H25.8333C27.2671 25.8333 28.4167 24.6837 28.4167 23.25V7.74999C28.4167 6.31624 27.2671 5.16666 25.8333 5.16666ZM10.9792 19.375H9.42918L6.13543 14.8542V19.375H4.52084V11.625H6.13543L9.36459 16.1458V11.625H10.9792V19.375ZM17.4375 13.2525H14.2083V14.6992H17.4375V16.3267H14.2083V17.7604H17.4375V19.375H12.2708V11.625H17.4375V13.2525ZM26.4792 18.0833C26.4792 18.7937 25.8979 19.375 25.1875 19.375H20.0208C19.3104 19.375 18.7292 18.7937 18.7292 18.0833V11.625H20.3438V17.4504H21.8033V12.9037H23.4179V17.4375H24.8646V11.625H26.4792V18.0833Z",className:"newicon"})})]})}function y(e){const{metadata:t,items:n}=e,{viewType:i,toggleViewType:s}=function(){const[e,t]=(0,a.useState)("card");return(0,a.useEffect)((()=>{t(localStorage.getItem("viewType")||"card")}),[]),{viewType:e,toggleViewType:(0,a.useCallback)((e=>{t(e),localStorage.setItem("viewType",e)}),[])}}(),l="card"===i,o="list"===i;return(0,u.jsxs)(r.A,{children:[(0,u.jsx)(k,{}),(0,u.jsxs)("div",{className:"bloghome__swith-view",children:[(0,u.jsx)(A,{onClick:()=>s("card"),className:"card"===i?"bloghome__switch--selected":"bloghome__switch"}),(0,u.jsx)(_,{onClick:()=>s("list"),className:"list"===i?"bloghome__switch--selected":"bloghome__switch"})]}),(0,u.jsxs)("div",{className:"bloghome__posts",children:[l&&(0,u.jsx)("div",{className:"bloghome__posts-card",children:(0,u.jsx)(m.A,{items:n})}),o&&(0,u.jsx)(v,{items:n}),(0,u.jsx)(c.A,{metadata:t})]})]})}function C(e){return(0,u.jsxs)(l.e3,{className:(0,i.A)(o.G.wrapper.blogPages,o.G.page.blogListPage),children:[(0,u.jsx)(P,{...e}),(0,u.jsx)(y,{...e})]})}},32032:(e,t,n)=>{n.d(t,{A:()=>l});n(30758);var a=n(59987),i=n(41746),s=n(86070);function l(e){const{metadata:t}=e,{previousPage:n,nextPage:l}=t;return(0,s.jsxs)("nav",{className:"pagination-nav","aria-label":(0,a.T)({id:"theme.blog.paginator.navAriaLabel",message:"Blog list page navigation",description:"The ARIA label for the blog pagination"}),children:[n&&(0,s.jsx)(i.A,{permalink:n,title:(0,s.jsx)(a.A,{id:"theme.blog.paginator.newerEntries",description:"The label used to navigate to the newer blog posts page (previous page)",children:"Newer Entries"})}),l&&(0,s.jsx)(i.A,{permalink:l,title:(0,s.jsx)(a.A,{id:"theme.blog.paginator.olderEntries",description:"The label used to navigate to the older blog posts page (next page)",children:"Older Entries"}),isNext:!0})]})}},4095:(e,t,n)=>{n.d(t,{A:()=>V});n(30758);var a=n(68835),i=n(86546),s=n(48186),l=n(37145),o=n(86070);function r(e){let{children:t,className:n}=e;const{frontMatter:a,assets:r,metadata:{description:c,date:d},isBlogPostPage:m}=(0,i.e)(),{withBaseUrl:h}=(0,s.h)(),g=r.image??a.image,u=a.keywords??[],p=new Date(d),{i18n:{currentLocale:x}}=(0,l.A)(),v=p.getFullYear();let j=`${p.getMonth()+1}`;const f=p.getDate();let b=`${v}\u5e74${j}\u6708`;return"en"===x&&(j=p.toLocaleString("default",{month:"long"}),b=`${j}, ${v}`),(0,o.jsx)("div",{className:""+(m?"":"blog-list--box"),children:(0,o.jsxs)("div",{className:"row "+(m?"":"blog-list--item"),style:{margin:0},children:[!m&&(0,o.jsxs)("div",{className:"post__date-container col col--3 padding-right--lg margin-bottom--lg",children:[(0,o.jsxs)("div",{className:"post__date",children:[(0,o.jsx)("div",{className:"post__day",children:f}),(0,o.jsx)("div",{className:"post__year_month",children:b})]}),(0,o.jsx)("div",{className:"line__decor"})]}),(0,o.jsx)("div",{className:"col "+(m?"col--12 article__details article-bg":"col--9"),children:(0,o.jsxs)("article",{className:n,itemProp:"blogPost",itemScope:!0,itemType:"http://schema.org/BlogPosting",children:[c&&(0,o.jsx)("meta",{itemProp:"description",content:c}),g&&(0,o.jsx)("link",{itemProp:"image",href:h(g,{absolute:!0})}),u.length>0&&(0,o.jsx)("meta",{itemProp:"keywords",content:u.join(",")}),t]})})]})})}var c=n(86397);const d={blogPostTitle:"blogPostTitle_thoQ",blogPostTitleLink:"blogPostTitleLink_Mh8X",title:"title_xvU1"};function m(e){let{className:t}=e;const{metadata:n,isBlogPostPage:s}=(0,i.e)(),{permalink:l,title:r}=n,m=s?"h1":"h2";return(0,o.jsx)(m,{className:(0,a.A)(s?"margin-bottom--md":"margin-vert--md",d.blogPostTitle,s?"text--center":"",t,"post--titleLink"),itemProp:"headline",children:s?r:(0,o.jsx)("div",{className:d.blogPostTitleLink,children:(0,o.jsx)(c.A,{itemProp:"url",to:l,children:r})})})}var h=n(59987),g=n(17216);const u={"container-blog":"container-blog_SUY0"};function p(e){let{readingTime:t}=e;const n=function(){const{selectMessage:e}=(0,g.W)();return t=>{const n=Math.ceil(t);return e(n,(0,h.T)({id:"theme.blog.post.readingTime.plurals",description:'Pluralized label for "{readingTime} min read". Use as much plural forms (separated by "|") as your language support (see https://www.unicode.org/cldr/cldr-aux/charts/34/supplemental/language_plural_rules.html)',message:"One min read|{readingTime} min read"},{readingTime:n}))}}();return(0,o.jsx)(o.Fragment,{children:n(t)})}function x(e){let{date:t,formattedDate:n}=e;return(0,o.jsx)("time",{dateTime:t,itemProp:"datePublished",children:n})}function v(){return(0,o.jsx)(o.Fragment,{children:" \xb7 "})}function j(e){let{className:t}=e;const{metadata:n,isBlogPostPage:s}=(0,i.e)(),{date:l,formattedDate:r,readingTime:c}=n;return s?(0,o.jsxs)("div",{className:(0,a.A)(u.container,"margin-vert--md",t),children:[(0,o.jsx)(x,{date:l,formattedDate:r}),void 0!==c&&(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(v,{}),(0,o.jsx)(p,{readingTime:c})]})]}):null}function f(e){return e.href?(0,o.jsx)(c.A,{...e}):(0,o.jsx)(o.Fragment,{children:e.children})}function b(e){let{author:t,className:n}=e;const{name:i,title:s,url:l,imageURL:r,email:c}=t,d=l||c&&`mailto:${c}`||void 0;return(0,o.jsxs)("div",{className:(0,a.A)("avatar margin-bottom--sm",n),children:[r&&(0,o.jsx)(f,{href:d,className:"avatar__photo-link",children:(0,o.jsx)("img",{className:"avatar__photo",src:r,alt:i,itemProp:"image"})}),i&&(0,o.jsxs)("div",{className:"avatar__intro",itemProp:"author",itemScope:!0,itemType:"https://schema.org/Person",children:[(0,o.jsx)("div",{className:"avatar__name",children:(0,o.jsx)(f,{href:d,itemProp:"url",children:(0,o.jsx)("span",{itemProp:"name",children:i})})}),s&&(0,o.jsx)("small",{className:"avatar__subtitle",itemProp:"description",children:s})]})]})}const _={authorCol:"authorCol_q4o9",imageOnlyAuthorRow:"imageOnlyAuthorRow_lXe7",imageOnlyAuthorCol:"imageOnlyAuthorCol_cxD5"};function N(e){let{className:t}=e;const{metadata:{authors:n},assets:s}=(0,i.e)();if(0===n.length)return null;const l=n.every((e=>{let{name:t}=e;return!t}));return(0,o.jsx)("div",{className:(0,a.A)("margin-top--md margin-bottom--sm",l?_.imageOnlyAuthorRow:"row",t),children:n.map(((e,t)=>(0,o.jsx)("div",{className:(0,a.A)(!l&&"col col--6",l?_.imageOnlyAuthorCol:_.authorCol),children:(0,o.jsx)(b,{author:{...e,imageURL:s.authorsImageUrls[t]??e.imageURL}})},t)))})}function w(){const{metadata:e,isBlogPostPage:t}=(0,i.e)(),{tags:n,hasTruncateMarker:a}=e;return t||0===n.length?null:(n.length>0||a)&&(0,o.jsx)("div",{className:"post__tags-container margin-top--none margin-bottom--md",children:n.length>0&&(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)("svg",{"aria-hidden":"true",focusable:"false","data-prefix":"fas","data-icon":"tags",className:"svg-inline--fa fa-tags margin-right--md",role:"img",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 640 512",color:"#c4d3e0",children:(0,o.jsx)("path",{fill:"currentColor",d:"M497.941 225.941L286.059 14.059A48 48 0 0 0 252.118 0H48C21.49 0 0 21.49 0 48v204.118a48 48 0 0 0 14.059 33.941l211.882 211.882c18.744 18.745 49.136 18.746 67.882 0l204.118-204.118c18.745-18.745 18.745-49.137 0-67.882zM112 160c-26.51 0-48-21.49-48-48s21.49-48 48-48 48 21.49 48 48-21.49 48-48 48zm513.941 133.823L421.823 497.941c-18.745 18.745-49.137 18.745-67.882 0l-.36-.36L527.64 323.522c16.999-16.999 26.36-39.6 26.36-63.64s-9.362-46.641-26.36-63.64L331.397 0h48.721a48 48 0 0 1 33.941 14.059l211.882 211.882c18.745 18.745 18.745 49.137 0 67.882z"})}),n.slice(0,4).map(((e,t)=>{let{label:n,permalink:a}=e;return(0,o.jsx)(c.A,{className:"post__tags "+(t>0?"margin-horiz--sm":"margin-right--sm"),to:a,style:{fontSize:"0.75em",fontWeight:500},children:n},a)}))]})})}function A(){return(0,o.jsxs)("header",{children:[(0,o.jsx)(m,{}),(0,o.jsx)(j,{}),(0,o.jsx)(N,{}),(0,o.jsx)(w,{})]})}var P=n(30666),k=n(12309);function y(e){let{children:t,className:n}=e;const{isBlogPostPage:s}=(0,i.e)();return(0,o.jsx)("div",{id:s?P.blogPostContainerID:void 0,className:(0,a.A)("markdown",n),itemProp:"articleBody",children:(0,o.jsx)(k.A,{children:t})})}var C=n(5117);const L={readMore:"readMore_YoYl"};function T(){return(0,o.jsx)("b",{className:L.readMore,children:(0,o.jsx)(h.A,{id:"theme.blog.post.readMore",description:"The label used in blog post item excerpts to link to full blog posts",children:"Read More"})})}function M(e){const{blogPostTitle:t,...n}=e;return(0,o.jsx)(c.A,{"aria-label":(0,h.T)({message:"Read more about {title}",id:"theme.blog.post.readMoreLabel",description:"The ARIA label for the link to full blog posts from excerpts"},{title:t}),...n,children:(0,o.jsx)(T,{})})}var z=n(43348);const H={blogPostFooterDetailsFull:"blogPostFooterDetailsFull_Wr5y"};function B(){const{metadata:e,isBlogPostPage:t}=(0,i.e)(),{tags:n,title:s,editUrl:l,hasTruncateMarker:r}=e,c=!t&&r;if(!(c||l))return null;return(0,o.jsxs)("footer",{className:(0,a.A)("row docusaurus-mt-lg",t&&H.blogPostFooterDetailsFull),children:[(0,o.jsx)("div",{className:"post-footer",children:(()=>{if(!t)return null;const e=[];return n.length>0&&e.push((0,o.jsx)("div",{className:(0,a.A)("col",{"col--9":c}),children:(0,o.jsx)(z.A,{tags:n})},"tags")),l&&e.push((0,o.jsx)("div",{className:"col col-3 text--right",children:(0,o.jsx)(C.A,{editUrl:l})},"editUrl")),e})()}),c&&(0,o.jsx)("div",{className:(0,a.A)("col text--right"),children:(0,o.jsx)(M,{blogPostTitle:s,to:e.permalink})})]})}function V(e){let{children:t,className:n}=e;const s=function(){const{isBlogPostPage:e}=(0,i.e)();return e?void 0:"margin-bottom--xl"}();return(0,o.jsxs)(r,{className:(0,a.A)(s,n),children:[(0,o.jsx)(A,{}),(0,o.jsx)(y,{children:t}),(0,o.jsx)(B,{})]})}},61259:(e,t,n)=>{n.d(t,{A:()=>r});n(30758);var a=n(86546),i=n(4095),s=n(25581),l=n(86070);const o={from:{opacity:.01,y:100},to:e=>({opacity:1,y:0,transition:{type:"spring",damping:25,stiffness:100,bounce:.2,duration:.3,delay:.2*e}})};function r(e){let{items:t,component:n=i.A}=e;return(0,l.jsx)(l.Fragment,{children:t.map(((e,t)=>{let{content:i}=e;return(0,l.jsx)(a.i,{content:i,children:(0,l.jsx)(s.P.div,{initial:"from",animate:"to",custom:t,viewport:{once:!0,amount:.8},variants:o,children:(0,l.jsx)(n,{children:(0,l.jsx)(i,{})})})},i.metadata.permalink)}))})}},31350:(e,t,n)=>{n.d(t,{A:()=>o});n(30758);var a=n(68835),i=n(80806);const s={codeBlockContainer:"codeBlockContainer_APcc"};var l=n(86070);function o(e){let{as:t,...n}=e;return(0,l.jsx)(t,{...n,className:(0,a.A)(n.className,s.codeBlockContainer,i.G.common.codeBlock)})}},94526:(e,t,n)=>{n.d(t,{A:()=>r});n(30758);var a=n(68835),i=n(50202);const s={details:"details_r1OI"};var l=n(86070);const o="alert alert--info";function r(e){let{...t}=e;return(0,l.jsx)(i.B,{...t,className:(0,a.A)(o,s.details,t.className)})}},41746:(e,t,n)=>{n.d(t,{A:()=>o});n(30758);var a=n(68835),i=n(86397);const s={paginationNavLink:"paginationNavLink_UdUv","pagination-nav__link--next":"pagination-nav__link--next_UjCy",paginationNavLabel:"paginationNavLabel_YPzM",paginationNavContent:"paginationNavContent__3xr"};var l=n(86070);function o(e){const{permalink:t,title:n,subLabel:o,isNext:r}=e;return(0,l.jsxs)(i.A,{className:(0,a.A)("pagination-nav__link",r?"pagination-nav__link--next":"pagination-nav__link--prev",s.paginationNavLink),to:t,children:[!r&&(0,l.jsx)("svg",{width:"24",height:"25",viewBox:"0 0 24 25",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:(0,l.jsx)("path",{d:"M9.2751 19.175L10.3251 18.125L5.4501 13.25H21.6001V11.75H5.4501L10.3251 6.87501L9.2751 5.82501L2.5751 12.5L9.2751 19.175Z",fill:"currentColor"})}),(0,l.jsxs)("div",{className:s.paginationNavContent,children:[o&&(0,l.jsx)("div",{className:"pagination-nav__sublabel",children:o}),(0,l.jsx)("div",{className:(0,a.A)(s.paginationNavLabel,"pagination-nav__label"),children:n})]}),r&&(0,l.jsx)("svg",{width:"24",height:"25",viewBox:"0 0 24 25",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:(0,l.jsx)("path",{d:"M14.7249 19.175L13.6749 18.125L18.5499 13.25H2.3999V11.75H18.5499L13.6749 6.87501L14.7249 5.82501L21.4249 12.5L14.7249 19.175Z",fill:"currentColor"})})]})}}}]);