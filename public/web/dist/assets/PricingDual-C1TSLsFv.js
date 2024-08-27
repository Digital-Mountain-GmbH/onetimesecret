import{r as v,k as m,d as A,G as z,H,J as Q,K as P,O as ue,L as ce,M,m as j,N as pe,P as W,Q as me,T as fe,R as N,S as ge,U as he,V as I,W as U,X as K,Y as F,Z as Y,c as h,e as y,u as R,s as V,$ as ve,o as g,I as B,b as t,g as be,n as k,y as xe,i as Z,B as X,a0 as ye,a1 as G,t as w,f as E,F as _e,z as ke,A as we,p as Se,a2 as $e,a3 as Ce}from"./main-Bn6okSDG.js";function Te(e,a,o){let l=v(o==null?void 0:o.value),s=m(()=>e.value!==void 0);return[m(()=>s.value?e.value:l.value),function(i){return s.value||(l.value=i),a==null?void 0:a(i)}]}var ee=(e=>(e[e.None=1]="None",e[e.Focusable=2]="Focusable",e[e.Hidden=4]="Hidden",e))(ee||{});let Pe=A({name:"Hidden",props:{as:{type:[Object,String],default:"div"},features:{type:Number,default:1}},setup(e,{slots:a,attrs:o}){return()=>{var l;let{features:s,...i}=e,d={"aria-hidden":(s&2)===2?!0:(l=i["aria-hidden"])!=null?l:void 0,hidden:(s&4)===4?!0:void 0,style:{position:"fixed",top:1,left:1,width:1,height:0,padding:0,margin:-1,overflow:"hidden",clip:"rect(0, 0, 0, 0)",whiteSpace:"nowrap",borderWidth:"0",...(s&4)===4&&(s&2)!==2&&{display:"none"}}};return z({ourProps:d,theirProps:i,slot:{},attrs:o,slots:a,name:"Hidden"})}}});function te(e={},a=null,o=[]){for(let[l,s]of Object.entries(e))oe(o,ae(a,l),s);return o}function ae(e,a){return e?e+"["+a+"]":a}function oe(e,a,o){if(Array.isArray(o))for(let[l,s]of o.entries())oe(e,ae(a,l.toString()),s);else o instanceof Date?e.push([a,o.toISOString()]):typeof o=="boolean"?e.push([a,o?"1":"0"]):typeof o=="string"?e.push([a,o]):typeof o=="number"?e.push([a,`${o}`]):o==null?e.push([a,""]):te(o,a,e)}function Ae(e){var a,o;let l=(a=e==null?void 0:e.form)!=null?a:e.closest("form");if(l){for(let s of l.elements)if(s!==e&&(s.tagName==="INPUT"&&s.type==="submit"||s.tagName==="BUTTON"&&s.type==="submit"||s.nodeName==="INPUT"&&s.type==="image")){s.click();return}(o=l.requestSubmit)==null||o.call(l)}}let Oe=Symbol("DescriptionContext");function le({slot:e=v({}),name:a="Description",props:o={}}={}){let l=v([]);function s(i){return l.value.push(i),()=>{let d=l.value.indexOf(i);d!==-1&&l.value.splice(d,1)}}return H(Oe,{register:s,slot:e,name:a,props:o}),m(()=>l.value.length>0?l.value.join(" "):void 0)}let Re=Symbol("LabelContext");function re({slot:e={},name:a="Label",props:o={}}={}){let l=v([]);function s(i){return l.value.push(i),()=>{let d=l.value.indexOf(i);d!==-1&&l.value.splice(d,1)}}return H(Re,{register:s,slot:e,name:a,props:o}),m(()=>l.value.length>0?l.value.join(" "):void 0)}function Ie(e,a){return e===a}let se=Symbol("RadioGroupContext");function ne(e){let a=he(se,null);if(a===null){let o=new Error(`<${e} /> is missing a parent <RadioGroup /> component.`);throw Error.captureStackTrace&&Error.captureStackTrace(o,ne),o}return a}let Ne=A({name:"RadioGroup",emits:{"update:modelValue":e=>!0},props:{as:{type:[Object,String],default:"div"},disabled:{type:[Boolean],default:!1},by:{type:[String,Function],default:()=>Ie},modelValue:{type:[Object,String,Number,Boolean],default:void 0},defaultValue:{type:[Object,String,Number,Boolean],default:void 0},form:{type:String,optional:!0},name:{type:String,optional:!0},id:{type:String,default:null}},inheritAttrs:!1,setup(e,{emit:a,attrs:o,slots:l,expose:s}){var i;let d=(i=e.id)!=null?i:`headlessui-radiogroup-${Q()}`,c=v(null),n=v([]),x=re({name:"RadioGroupLabel"}),$=le({name:"RadioGroupDescription"});s({el:c,$el:c});let[S,D]=Te(m(()=>e.modelValue),r=>a("update:modelValue",r),m(()=>e.defaultValue)),_={options:n,value:S,disabled:m(()=>e.disabled),firstOption:m(()=>n.value.find(r=>!r.propsRef.disabled)),containsCheckedOption:m(()=>n.value.some(r=>_.compare(P(r.propsRef.value),P(e.modelValue)))),compare(r,p){if(typeof e.by=="string"){let u=e.by;return(r==null?void 0:r[u])===(p==null?void 0:p[u])}return e.by(r,p)},change(r){var p;if(e.disabled||_.compare(P(S.value),P(r)))return!1;let u=(p=n.value.find(b=>_.compare(P(b.propsRef.value),P(r))))==null?void 0:p.propsRef;return u!=null&&u.disabled?!1:(D(r),!0)},registerOption(r){n.value.push(r),n.value=ue(n.value,p=>p.element)},unregisterOption(r){let p=n.value.findIndex(u=>u.id===r);p!==-1&&n.value.splice(p,1)}};H(se,_),ce({container:m(()=>M(c)),accept(r){return r.getAttribute("role")==="radio"?NodeFilter.FILTER_REJECT:r.hasAttribute("role")?NodeFilter.FILTER_SKIP:NodeFilter.FILTER_ACCEPT},walk(r){r.setAttribute("role","none")}});function C(r){if(!c.value||!c.value.contains(r.target))return;let p=n.value.filter(u=>u.propsRef.disabled===!1).map(u=>u.element);switch(r.key){case I.Enter:Ae(r.currentTarget);break;case I.ArrowLeft:case I.ArrowUp:if(r.preventDefault(),r.stopPropagation(),K(p,F.Previous|F.WrapAround)===Y.Success){let u=n.value.find(b=>{var f;return b.element===((f=U(c))==null?void 0:f.activeElement)});u&&_.change(u.propsRef.value)}break;case I.ArrowRight:case I.ArrowDown:if(r.preventDefault(),r.stopPropagation(),K(p,F.Next|F.WrapAround)===Y.Success){let u=n.value.find(b=>{var f;return b.element===((f=U(b.element))==null?void 0:f.activeElement)});u&&_.change(u.propsRef.value)}break;case I.Space:{r.preventDefault(),r.stopPropagation();let u=n.value.find(b=>{var f;return b.element===((f=U(b.element))==null?void 0:f.activeElement)});u&&_.change(u.propsRef.value)}break}}let T=m(()=>{var r;return(r=M(c))==null?void 0:r.closest("form")});return j(()=>{pe([T],()=>{if(!T.value||e.defaultValue===void 0)return;function r(){_.change(e.defaultValue)}return T.value.addEventListener("reset",r),()=>{var p;(p=T.value)==null||p.removeEventListener("reset",r)}},{immediate:!0})}),()=>{let{disabled:r,name:p,form:u,...b}=e,f={ref:c,id:d,role:"radiogroup","aria-labelledby":x.value,"aria-describedby":$.value,onKeydown:C};return W(N,[...p!=null&&S.value!=null?te({[p]:S.value}).map(([L,q])=>W(Pe,me({features:ee.Hidden,key:L,as:"input",type:"hidden",hidden:!0,readOnly:!0,form:u,disabled:r,name:L,value:q}))):[],z({ourProps:f,theirProps:{...o,...fe(b,["modelValue","defaultValue","by"])},slot:{},attrs:o,slots:l,name:"RadioGroup"})])}}});var Ee=(e=>(e[e.Empty=1]="Empty",e[e.Active=2]="Active",e))(Ee||{});let Ge=A({name:"RadioGroupOption",props:{as:{type:[Object,String],default:"div"},value:{type:[Object,String,Number,Boolean]},disabled:{type:Boolean,default:!1},id:{type:String,default:null}},setup(e,{attrs:a,slots:o,expose:l}){var s;let i=(s=e.id)!=null?s:`headlessui-radiogroup-option-${Q()}`,d=ne("RadioGroupOption"),c=re({name:"RadioGroupLabel"}),n=le({name:"RadioGroupDescription"}),x=v(null),$=m(()=>({value:e.value,disabled:e.disabled})),S=v(1);l({el:x,$el:x});let D=m(()=>M(x));j(()=>d.registerOption({id:i,element:D,propsRef:$})),ge(()=>d.unregisterOption(i));let _=m(()=>{var f;return((f=d.firstOption.value)==null?void 0:f.id)===i}),C=m(()=>d.disabled.value||e.disabled),T=m(()=>d.compare(P(d.value.value),P(e.value))),r=m(()=>C.value?-1:T.value||!d.containsCheckedOption.value&&_.value?0:-1);function p(){var f;d.change(e.value)&&(S.value|=2,(f=M(x))==null||f.focus())}function u(){S.value|=2}function b(){S.value&=-3}return()=>{let{value:f,disabled:L,...q}=e,ie={checked:T.value,disabled:C.value,active:!!(S.value&2)},de={id:i,ref:x,role:"radio","aria-checked":T.value?"true":"false","aria-labelledby":c.value,"aria-describedby":n.value,"aria-disabled":C.value?!0:void 0,tabIndex:r.value,onClick:C.value?void 0:p,onFocus:C.value?void 0:u,onBlur:C.value?void 0:b};return z({ourProps:de,theirProps:q,slot:ie,attrs:a,slots:o,name:"RadioGroupOption"})}}});const Fe={class:"relative inline-block"},Ve=A({__name:"InfoTooltip",props:{color:{type:String,default:"bg-white text-gray-800"}},setup(e){const a=e,o=v(!1),l=()=>{o.value=!o.value},s=()=>{o.value=!1},i=m(()=>`${a.color} border-2 border-dashed`);return(d,c)=>(g(),h("div",Fe,[y(R(B),{icon:"heroicons:information-circle-20-solid",class:"inline align-baseline cursor-pointer",onClick:l}),y(ve,{name:"fade"},{default:V(()=>[o.value?(g(),h("div",{key:0,class:"fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50",onClick:s},[t("div",{class:k(["relative max-w-md p-6 rounded-lg shadow-lg",i.value]),onClick:c[0]||(c[0]=xe(()=>{},["stop"]))},[t("button",{onClick:s,class:"absolute top-2 right-2 text-gray-500 hover:text-gray-700"},[y(R(B),{icon:"heroicons:x-mark-20-solid"})]),be(d.$slots,"default",{},void 0,!0)],2)])):Z("",!0)]),_:3})]))}}),Me=X(Ve,[["__scopeId","data-v-908f3f56"]]),Be={class:"absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl","aria-hidden":"true"},J=A({__name:"MovingGlobules",props:{fromColour:{default:"#655b5f"},toColour:{default:"#23b5dd"},speed:{default:"6s"},interval:{default:2e3},scale:{default:1}},setup(e){const a=v("polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)");function o(){const s=[];for(let i=0;i<10;i++){const d=Math.random()*100,c=Math.random()*100;s.push(`${d.toFixed(1)}% ${c.toFixed(1)}%`)}a.value=`polygon(${s.join(", ")})`}j(()=>{setTimeout(()=>{o(),setInterval(o,l.interval)},0)});const l=e;return(s,i)=>(g(),h("div",Be,[t("div",{class:k(["mx-auto aspect-[1155/678] w-[72.1875rem] opacity-30"]),style:ye({clipPath:a.value,transition:`clip-path ${l.speed} ease`,background:`linear-gradient(to top right, ${l.fromColour}, ${l.toColour})`,transform:`scale(${l.scale})`})},null,4)]))}}),je={class:"flex items-center"},De=t("path",{d:"M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"},null,-1),Le=[De],qe={key:0,class:"w-5 h-5 text-yellow-400",fill:"currentColor",viewBox:"0 0 20 20",width:"20",height:"20"},Ue=t("defs",null,[t("linearGradient",{id:"half"},[t("stop",{offset:"50%","stop-color":"currentColor"}),t("stop",{offset:"50%","stop-color":"white","stop-opacity":"1"})])],-1),ze=t("path",{fill:"url(#half)",d:"M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"},null,-1),He=[Ue,ze],We=t("path",{d:"M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"},null,-1),Ke=[We],Ye=A({__name:"StarsRating",props:{stars:{default:2.5}},setup(e){const a=e,o=Math.floor(a.stars),l=a.stars%1!==0,s=5-Math.ceil(a.stars);return(i,d)=>(g(),h("div",je,[(g(!0),h(N,null,G(R(o),c=>(g(),h("svg",{key:"full-"+c,class:"w-5 h-5 text-yellow-400",fill:"currentColor",viewBox:"0 0 20 20",width:"20",height:"20"},Le))),128)),l?(g(),h("svg",qe,He)):Z("",!0),(g(),h(N,null,G(s,c=>t("svg",{key:"empty-"+c,class:"w-5 h-5 text-gray-300",fill:"currentColor",viewBox:"0 0 20 20",width:"20",height:"20"},Ke)),64))]))}}),Je={class:"max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12"},Qe=t("h2",{class:"text-3xl font-bold text-left text-gray-900 dark:text-white mb-8"},[t("span",{class:"text-xl font-semibold text-gray-700 dark:text-gray-300"},"AI-Generated Testimonials"),t("br"),t("span",null,"What leading AI says about us:")],-1),Ze={class:"bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden"},Xe={class:"p-6 sm:p-8"},et=t("svg",{class:"w-5 h-5 text-brand-500 mb-4",fill:"currentColor",viewBox:"0 0 24 24",width:"20",height:"20"},[t("path",{d:"M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"})],-1),tt={class:"text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-6 italic"},at={class:"flex items-center justify-between"},ot={class:"font-semibold text-gray-900 dark:text-white"},lt={class:"text-sm text-gray-600 dark:text-gray-400"},rt={class:"flex items-center"},st=t("div",{class:"bg-gray-100 dark:bg-gray-700 px-6 py-4"},[t("p",{class:"text-sm text-gray-600 dark:text-gray-400 italic"},[E(" Note: "),t("span",{class:""},[E("This quote was generated by "),t("a",{href:"https://www.anthropic.com/news/claude-3-5-sonnet",class:"underline",rel:"noopener noreferrer",target:"_blank"},"Claude 3.5")]),E(". It was based on the content of the page and does not represent an actual person or company. ")])],-1),nt=A({__name:"QuoteSection",props:{testimonial:{}},setup(e){const a=e;return(o,l)=>(g(),h("div",Je,[Qe,t("div",Ze,[t("div",Xe,[et,t("p",tt,' "'+w(a.testimonial.quote)+'" ',1),t("div",at,[t("div",null,[t("p",ot,w(a.testimonial.name),1),t("p",lt,w(a.testimonial.company),1)]),t("div",rt,[y(Ye,{stars:a.testimonial.stars},null,8,["stars"])])])]),st])]))}}),it=[{value:"monthly",label:"Monthly",priceSuffix:"/month"},{value:"annually",label:"Yearly",priceSuffix:"/year"}],dt=[{id:"tier-identity",name:"Identity Plus",href:"/plans/identity",cta:"Choose this plan",price:{monthly:"$35",annually:"$365"},description:"Secure sharing that elevates your brand and simplifies communication.",features:["Branded custom domain","Unlimited sharing capacity","Enhanced privacy features","Full API access"],featured:!1},{id:"tier-dedication",name:"Global Elite",href:"/plans/dedication",cta:"Coming Soon",price:{monthly:"$111",annually:"$000"},description:"Dedicated infrastructure with data-compliance controls and unlimited scalability.",features:["Private cloud environment","Unlimited usage and scaling","Advanced identity management","Multiple data location choices (EU, US)","Full regulatory compliance (including GDPR, CCPA, HIPAA)"],featured:!0}],ut=[{quote:"Onetime Secret helps us share sensitive information securely while maintaining our professional facade.",name:"Aisha",company:"SameDay Financial",uri:"",stars:4.5},{quote:"The custom domain feature has significantly elevated our company's reputation among biological, human clients.",name:"Hiro",company:"Growth Dynamics",uri:"",stars:4},{quote:"Their SafeTek® Security Architecture gives us peace of mind when sharing confidential data with our carbon-based business partners.",name:"Priya",company:"Agile Innovations",uri:"",stars:5},{quote:"As a real freelancer, the unlimited sharing capacity allows me to collaborate securely with my several hundred thousand clients.",name:"Carlos",company:"Creative Freelance Warehouse",uri:"",stars:4.5},{quote:"The advanced compliance options ensure we meet all regulatory requirements in our heavily regulated industry.",name:"Fatima",company:'"AAA" Body Supplements',uri:"",stars:4},{quote:"The private cloud environment has been crucial in building trust with our high-profile clients.",name:"Unit ZW-731",company:"Scaling Solutions",uri:"",stars:5},{quote:"The flexible data residency options keep us in good standing with our regional CPU conservation society.",name:"Liam-3000",company:"Community Impact Foundation",uri:"",stars:4.5}],O=e=>(ke("data-v-3a53e2cb"),e=e(),we(),e),ct={class:"relative isolate bg-white dark:bg-gray-900 px-6 py-18 sm:py-12 lg:px-8"},pt=O(()=>t("div",{class:"pb-6 flex justify-center text-sm"},null,-1)),mt=_e('<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" data-v-3a53e2cb><div class="mx-auto text-center max-w-2xl lg:max-w-4xl" data-v-3a53e2cb><h2 class="text-base font-semibold leading-7 text-brand-600 dark:text-brand-400 sm:text-lg md:text-xl" data-v-3a53e2cb>Pricing </h2><p class="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl md:text-5xl lg:text-6xl" data-v-3a53e2cb> Secure Links, Stronger Connections </p><p class="mx-auto mt-6 max-w-md lg:max-w-xl text-center text-base sm:text-lg md:text-xl leading-7 sm:leading-8 text-gray-600 dark:text-gray-300" data-v-3a53e2cb> Share confidential information with confidence, elevate your brand, and build trust </p></div></div>',1),ft={class:"mt-16 flex justify-center"},gt={"aria-label":"Payment frequency"},ht={class:"mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2"},vt=["id"],bt={class:"mt-4 flex items-baseline gap-x-2"},xt=["action"],yt=["aria-describedby"],_t={class:"relative"},kt={class:"py-8 mx-auto mt-4 grid max-w-4xl justify-center grid-cols-1"},wt={class:"relative mx-auto mt-4 max-w-7xl px-4 sm:px-6 lg:mt-5 lg:px-8"},St={class:"mx-auto max-w-md lg:max-w-5xl"},$t={class:"rounded-lg bg-brandcompdim-50 dark:bg-gray-800 px-6 py-8 sm:p-10 lg:flex lg:items-center border-2 border-dotted hover:border-brandcompdim-300 dark:hover:border-brandcompdim-600"},Ct={class:"flex-1"},Tt=O(()=>t("div",null,[t("h3",{class:"inline-flex rounded-full bg-brandcompdim-200 dark:bg-brandcompdim-700 px-4 py-1 text-base font-semibold text-gray-800 dark:text-gray-200"}," Self-Hosted ")],-1)),Pt={class:"mt-4 text-lg text-gray-600 dark:text-gray-300"},At=O(()=>t("span",{class:"italic font-semibold text-gray-900 dark:text-gray-100"},"$0 dollars",-1)),Ot={class:"float-left mr-4 mb-2 shape-icon"},Rt=O(()=>t("h3",{class:"font-bold mb-2 text-gray-900 dark:text-white"},"Our SimpleStack℠ Guarantee",-1)),It=O(()=>t("p",{class:"prose dark:prose-invert"},"Our SimpleStack guarantee ensures effortless deployment and management of our software. You can have the entire system up and running in minutes, from a single docker container. ",-1)),Nt=O(()=>t("p",{class:"prose dark:prose-invert"},"Whether you're a seasoned DevOps pro or new to self-hosting, our SimpleStack design ensures you can focus on using the product, not wrestling with infrastructure. That's the SimpleStack advantage!",-1)),Et=O(()=>t("p",{class:"prose mt-4 font-semibold dark:prose-invert"}," While others are stacking up complications, we've got your back with a stack so simple, it just works. ",-1)),Gt=O(()=>t("div",{class:"mt-6 rounded-md shadow lg:ml-10 lg:mt-0 lg:flex-shrink-0"},[t("a",{href:"https://github.com/onetimesecret/onetimesecret",class:"block items-center justify-center rounded-md border border-transparent bg-brandcompdim-300 dark:bg-brandcompdim-700 px-5 py-3 text-base font-medium text-gray-900 dark:text-gray-100 hover:bg-brandcompdim-200 dark:hover:bg-brandcompdim-600"}," Get Started ")],-1)),Ft=A({__name:"PricingDual",setup(e){const a=v(ut),o=v(a.value[0]),l=v(dt),s=v(it),i=v(s.value[0]);return j(()=>{const d=Math.floor(Math.random()*a.value.length);o.value=a.value[d]}),(d,c)=>(g(),h("div",ct,[pt,y(J,{"from-colour":"#23b5dd","to-colour":"#dc4a22",speed:"10s",interval:3e3,scale:1}),mt,t("div",ft,[t("fieldset",gt,[y(R(Ne),{modelValue:i.value,"onUpdate:modelValue":c[0]||(c[0]=n=>i.value=n),class:"grid grid-cols-2 gap-x-1 rounded-full bg-white/5 p-1 text-center text-xs font-semibold leading-5 text-white"},{default:V(()=>[(g(!0),h(N,null,G(s.value,n=>(g(),Se(R(Ge),{as:"template",key:n.value,value:n},{default:V(({checked:x})=>[t("div",{class:k([x?"bg-brand-600 dark:bg-brand-500":"bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 opacity-55","cursor-pointer rounded-full px-2.5 py-1"])},w(n.label),3)]),_:2},1032,["value"]))),128))]),_:1},8,["modelValue"])])]),t("div",ht,[(g(!0),h(N,null,G(l.value,(n,x)=>(g(),h("div",{key:n.id,class:k([n.featured?"relative bg-slate-800 dark:bg-slate-700 shadow-2xl":"bg-white/60 dark:bg-gray-800/60 sm:mx-8 lg:mx-0",n.featured?"":x===0?"rounded-t-3xl sm:rounded-b-none lg:rounded-bl-3xl lg:rounded-tr-none":"sm:rounded-t-none lg:rounded-bl-none lg:rounded-tr-3xl","rounded-3xl p-8 ring-1 ring-gray-900/10 dark:ring-gray-100/10 sm:p-10"])},[t("h3",{id:n.id,class:k([(n.featured,"text-brand-500"),"text-xl font-semibold leading-7"])},w(n.name),11,vt),t("p",bt,[t("span",{class:k([n.featured?"text-white blur-lg":"text-gray-900 dark:text-white","text-5xl font-bold tracking-tight"])},w(n.price[i.value.value]),3),t("span",{class:k([n.featured?"text-gray-400":"text-gray-500 dark:text-gray-400","text-base"])},w(i.value.priceSuffix),3)]),t("p",{class:k([n.featured?"text-gray-300":"text-gray-600 dark:text-gray-300","mt-6 text-base leading-7"])},w(n.description),3),t("ul",{role:"list",class:k([n.featured?"text-gray-300 pb-10":"text-gray-600 dark:text-gray-300","mt-8 space-y-3 text-base leading-6 sm:mt-10"])},[(g(!0),h(N,null,G(n.features,$=>(g(),h("li",{key:$,class:"flex gap-x-3"},[y(R(B),{icon:"heroicons-solid:check",class:k([n.featured?"text-brand-400":"text-brand-600 dark:text-brand-400","h-6 w-5 flex-none"]),"aria-hidden":"true"},null,8,["class"]),E(" "+w($),1)]))),128))],2),t("form",{action:`${n.href}${i.value.priceSuffix}`,method:"GET"},[t("button",$e({type:"submit","aria-describedby":n.id},Ce(n.featured?{click:$=>$.preventDefault()}:{},!0),{class:[n.featured?"block text-brand-400 dark:text-brand-400 ring-2 ring-inset bg-gray-800 dark:ring-slate-800 hover:ring-gray-300 dark:hover:ring-gray-800 focus-visible:outline-gray-600":"block bg-brand-500 text-white shadow-sm hover:bg-brand-600 focus-visible:outline-brand-500","mt-8 block rounded-md px-3.5 py-2.5 text-center text-lg font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:mt-10"]}),w(n.cta),17,yt)],8,xt)],2))),128))]),t("div",_t,[y(nt,{class:"relative z-10 bg-opacity-80 dark:bg-opacity-80",testimonial:o.value},null,8,["testimonial"]),y(J,{class:"absolute inset-0 z-0","from-colour":"#23b5dd","to-colour":"#dc4a22",speed:"10s",interval:1e3,scale:2})]),t("div",kt,[t("div",wt,[t("div",St,[t("div",$t,[t("div",Ct,[Tt,t("div",Pt,[E(" Get full access to all features for the honest and wholesome price of "),At,E(" with self-hosting. We even include our SimpleStack℠ guarantee at no extra charge. "),y(Me,{color:"bg-brandcomp-100 dark:bg-brandcomp-900"},{default:V(()=>[t("div",Ot,[y(R(B),{icon:"fa6-solid:handshake-simple",class:"w-24 h-24 text-brandcomp-600 dark:text-brandcomp-400"})]),Rt,It,Nt,Et]),_:1})])]),Gt])])])])]))}}),Mt=X(Ft,[["__scopeId","data-v-3a53e2cb"]]);export{Mt as default};