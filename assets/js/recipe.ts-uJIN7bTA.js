class t{constructor(t,e){if(this.val=0,this.destination=null,this.origin=null,"number"==typeof e&&(this.val=e),"object"!=typeof t)throw new Error("Measures cannot be blank");this.measureData=t}from(t){if(null!=this.destination)throw new Error(".from must be called before .to");return this.origin=this.getUnit(t),null==this.origin&&this.throwUnsupportedUnitError(t),this}to(t){var e,r;if(null==this.origin)throw new Error(".to must be called after .from");this.destination=this.getUnit(t),null==this.destination&&this.throwUnsupportedUnitError(t);const n=this.destination,a=this.origin;if(a.abbr===n.abbr)return this.val;if(n.measure!=a.measure)throw new Error(`Cannot convert incompatible measures of ${n.measure} and ${a.measure}`);let s=this.val*a.unit.to_anchor;if(a.unit.anchor_shift&&(s-=a.unit.anchor_shift),a.system!=n.system){const t=this.measureData[a.measure].anchors;if(null==t)throw new Error(`Unable to convert units. Anchors are missing for "${a.measure}" and "${n.measure}" measures.`);const i=t[a.system];if(null==i)throw new Error(`Unable to find anchor for "${a.measure}" to "${n.measure}". Please make sure it is defined.`);const o=null===(e=i[n.system])||void 0===e?void 0:e.transform,l=null===(r=i[n.system])||void 0===r?void 0:r.ratio;if("function"==typeof o)s=o(s);else{if("number"!=typeof l)throw new Error("A system anchor needs to either have a defined ratio number or a transform function.");s*=l}}return n.unit.anchor_shift&&(s+=n.unit.anchor_shift),s/n.unit.to_anchor}toBest(t){var e,r,n;if(null==this.origin)throw new Error(".toBest must be called after .from");const a=this.val<0;let s=[],i=a?-1:1,o=this.origin.system;"object"==typeof t&&(s=null!==(e=t.exclude)&&void 0!==e?e:[],i=null!==(r=t.cutOffNumber)&&void 0!==r?r:i,o=null!==(n=t.system)&&void 0!==n?n:this.origin.system);let l=null;for(const u of this.possibilities()){const t=this.describe(u);if(-1===s.indexOf(u)&&t.system===o){const e=this.to(u);if(a?e>i:e<i)continue;(null===l||(a?e<=i&&e>l.val:e>=i&&e<l.val))&&(l={val:e,unit:u,singular:t.singular,plural:t.plural})}}return l}getUnit(t){for(const[e,r]of Object.entries(this.measureData))for(const[n,a]of Object.entries(r.systems))for(const[r,s]of Object.entries(a))if(r==t)return{abbr:t,measure:e,system:n,unit:s};return null}describe(t){const e=this.getUnit(t);if(null!=e)return this.describeUnit(e);this.throwUnsupportedUnitError(t)}describeUnit(t){return{abbr:t.abbr,measure:t.measure,system:t.system,singular:t.unit.name.singular,plural:t.unit.name.plural}}list(t){const e=[];if(null==t)for(const[r,n]of Object.entries(this.measureData))for(const[t,a]of Object.entries(n.systems))for(const[n,s]of Object.entries(a))e.push(this.describeUnit({abbr:n,measure:r,system:t,unit:s}));else{if(!(t in this.measureData))throw new Error(`Meausre "${t}" not found.`);{const r=this.measureData[t];for(const[n,a]of Object.entries(r.systems))for(const[r,s]of Object.entries(a))e.push(this.describeUnit({abbr:r,measure:t,system:n,unit:s}))}}return e}throwUnsupportedUnitError(t){let e=[];for(const r of Object.values(this.measureData))for(const t of Object.values(r.systems))e=e.concat(Object.keys(t));throw new Error(`Unsupported unit ${t}, use one of: ${e.join(", ")}`)}possibilities(t){let e=[],r=[];"string"==typeof t?r.push(t):null!=this.origin?r.push(this.origin.measure):r=Object.keys(this.measureData);for(const n of r){const t=this.measureData[n].systems;for(const r of Object.values(t))e=[...e,...Object.keys(r)]}return e}measures(){return Object.keys(this.measureData)}}const e=(r={mass:{systems:{metric:{mcg:{name:{singular:"Microgram",plural:"Micrograms"},to_anchor:1e-6},mg:{name:{singular:"Milligram",plural:"Milligrams"},to_anchor:.001},g:{name:{singular:"Gram",plural:"Grams"},to_anchor:1},kg:{name:{singular:"Kilogram",plural:"Kilograms"},to_anchor:1e3},mt:{name:{singular:"Metric Tonne",plural:"Metric Tonnes"},to_anchor:1e6}},imperial:{oz:{name:{singular:"Ounce",plural:"Ounces"},to_anchor:1/16},lb:{name:{singular:"Pound",plural:"Pounds"},to_anchor:1},t:{name:{singular:"Ton",plural:"Tons"},to_anchor:2e3}}},anchors:{metric:{imperial:{ratio:1/453.592}},imperial:{metric:{ratio:453.592}}}},volume:{systems:{metric:{mm3:{name:{singular:"Cubic Millimeter",plural:"Cubic Millimeters"},to_anchor:1e-6},cm3:{name:{singular:"Cubic Centimeter",plural:"Cubic Centimeters"},to_anchor:.001},ml:{name:{singular:"Millilitre",plural:"Millilitres"},to_anchor:.001},cl:{name:{singular:"Centilitre",plural:"Centilitres"},to_anchor:.01},dl:{name:{singular:"Decilitre",plural:"Decilitres"},to_anchor:.1},l:{name:{singular:"Litre",plural:"Litres"},to_anchor:1},kl:{name:{singular:"Kilolitre",plural:"Kilolitres"},to_anchor:1e3},Ml:{name:{singular:"Megalitre",plural:"Megalitres"},to_anchor:1e6},Gl:{name:{singular:"Gigalitre",plural:"Gigalitres"},to_anchor:1e9},m3:{name:{singular:"Cubic meter",plural:"Cubic meters"},to_anchor:1e3},km3:{name:{singular:"Cubic kilometer",plural:"Cubic kilometers"},to_anchor:1e12},krm:{name:{singular:"Kryddmått",plural:"Kryddmått"},to_anchor:.001},tsk:{name:{singular:"Tesked",plural:"Teskedar"},to_anchor:.005},msk:{name:{singular:"Matsked",plural:"Matskedar"},to_anchor:.015},kkp:{name:{singular:"Kaffekopp",plural:"Kaffekoppar"},to_anchor:.15},glas:{name:{singular:"Glas",plural:"Glas"},to_anchor:.2},kanna:{name:{singular:"Kanna",plural:"Kannor"},to_anchor:2.617}},imperial:{tsp:{name:{singular:"Teaspoon",plural:"Teaspoons"},to_anchor:1/6},Tbs:{name:{singular:"Tablespoon",plural:"Tablespoons"},to_anchor:.5},in3:{name:{singular:"Cubic inch",plural:"Cubic inches"},to_anchor:.55411},"fl-oz":{name:{singular:"Fluid Ounce",plural:"Fluid Ounces"},to_anchor:1},cup:{name:{singular:"Cup",plural:"Cups"},to_anchor:8},pnt:{name:{singular:"Pint",plural:"Pints"},to_anchor:16},qt:{name:{singular:"Quart",plural:"Quarts"},to_anchor:32},gal:{name:{singular:"Gallon",plural:"Gallons"},to_anchor:128},ft3:{name:{singular:"Cubic foot",plural:"Cubic feet"},to_anchor:957.506},yd3:{name:{singular:"Cubic yard",plural:"Cubic yards"},to_anchor:25852.7}}},anchors:{metric:{imperial:{ratio:33.8140226}},imperial:{metric:{ratio:1/33.8140226}}}}},e=>new t(r,e));var r;const n=["krm","tsk","msk","kkp","glas","kanna","dl"],a=75*Math.random()+25;let s=!1;function i(t,r,i){if(!t.checkValidity())return;const o=Math.max(t.valueAsNumber,1)||r;o>a&&!s&&(document.querySelector(".ingredient-form").insertAdjacentHTML("beforebegin",'\n    <div class="notification info a-lot-of-food">\n    Wow, that\'s a lot of food! Am I invited to the party?\n    </div>'),s=!0),o<=a&&s&&(document.querySelector(".a-lot-of-food").remove(),s=!1);for(const a of i){const t=Number.parseInt(a.dataset.d);let s=Math.round(100*(t*o/r+Number.EPSILON))/100,i=a.dataset.m||"";if(a.dataset.m)try{const t=e(s).from(i).toBest({system:"metric",exclude:n});s=Math.round(100*t.val)/100,i=t.unit}catch{i=` ${s>=2?a.dataset.p:a.dataset.m}`}a.innerHTML=`${s}`,a.nextElementSibling.innerHTML=i}}!function(){const t=document.querySelector(".ingredient-form"),e=[...document.querySelectorAll(".list-ingredients li div output")],r=t.querySelector("input"),n=Number.parseInt(r.dataset.default);r.addEventListener("input",(t=>{i(t.target,n,e)})),i(r,n,e)}();