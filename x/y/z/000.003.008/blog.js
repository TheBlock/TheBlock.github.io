webpackJsonp([1],{0:function(e,t){e.exports=React},12:function(e,t){e.exports=ReactDOM},152:function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}var r=n(0),a=o(r),u=n(12),l=o(u),i=n(3);n(28);var d=n(153),s=o(d),f=n(157),c=o(f),m=n(29),h=o(m),p=(0,h.default)(s.default);l.default.render(a.default.createElement(i.I18nextProvider,{i18n:p},a.default.createElement(c.default,{summaries:"20170626-0915,20170522-0950".split(",")})),document.getElementById("content"))},153:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(154),r=function(e){return e&&e.__esModule?e:{default:e}}(o);t.default={en:r.default}},154:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(155),r=function(e){return e&&e.__esModule?e:{default:e}}(o),a="20170626-0915,20170522-0950".split(",").reduce(function(e,t){return e[t]={intro:n(156)("./"+t+"/en/intro.md")},e},{});t.default=Object.assign(a,{summary:r.default})},155:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={readMore:"read more ..."}},156:function(e,t,n){function o(e){return n(r(e))}function r(e){var t=a[e];if(!(t+1))throw new Error("Cannot find module '"+e+"'.");return t}var a={"./20170522-0950/en/intro.md":54,"./20170626-0915/en/intro.md":55};o.keys=function(){return Object.keys(a)},o.resolve=r,e.exports=o,o.id=156},157:function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}function r(e){var t=e.className,n=e.summaries;return n?i.default.createElement("div",{className:(0,u.default)([h.default.root,t]).join(" ")},i.default.createElement(s.default,null),i.default.createElement("main",null,n.map(function(e){return i.default.createElement(c.default,{link:e})}))):null}Object.defineProperty(t,"__esModule",{value:!0}),t.default=r;var a=n(1),u=o(a),l=n(0),i=o(l),d=n(37),s=o(d),f=n(189),c=o(f),m=n(192),h=o(m)},189:function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}function r(e){var t=e.className,n=e.link,o=e.t;return i.default.createElement("article",{className:(0,u.default)([p.default.root,t]).join(" ")},i.default.createElement(m.default,{className:p.default.content,html:o(n+":intro")}),i.default.createElement("div",{className:p.default.more},i.default.createElement(f.default,{href:"/x/blog/"+n,isInternal:!0,value:o("summary:readMore")})))}Object.defineProperty(t,"__esModule",{value:!0});var a=n(1),u=o(a),l=n(0),i=o(l),d=n(3),s=n(38),f=o(s),c=n(79),m=o(c),h=n(191),p=o(h);t.default=(0,d.translate)([])(r)},191:function(e,t){e.exports={root:"summary_root_8590vi",content:"summary_content_48gxsv",more:"summary_more_eyzm52"}},192:function(e,t){e.exports={root:"blog_root_ep92n4"}},21:function(e,t){e.exports=i18next},4:function(e,t){e.exports=mobxReact},5:function(e,t){e.exports=mobx},54:function(e,t){e.exports='<p><time>22 May 2017</time></p>\n<h2 id="hello-world">Hello World</h2>\n<p>I guess no blog would be complete without a first &quot;Hello World&quot; entry. So here we go - <strong>Hello World</strong>.</p>\n<p>While here, we may as well get around to getting to know each other. So get comfortable and let us start the process. First off, why did we do this?</p>\n'},55:function(e,t){e.exports='<p><time>26 June 2017</time></p>\n<h2 id="soft-launching">Soft launching</h2>\n<p>Well, at some point you need to take the training wheel off. And that day has come, the training wheels has just been taken off. Nothing much have changed, we have not throw open the doors and invited external use from anywhere, rather our invited alpha users now will just be able to find the wallet by not having to go to a &quot;hidden url&quot;.</p>\n<p>So what does this mean? So where to now? What is next?</p>\n'}},[152]);
//# sourceMappingURL=blog.js.map