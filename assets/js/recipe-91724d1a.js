class r{constructor(r,t){if(this.val=0,this.destination=null,this.origin=null,"number"==typeof t&&(this.val=t),"object"!=typeof r)throw new Error("Measures cannot be blank");this.measureData=r}from(r){if(null!=this.destination)throw new Error(".from must be called before .to");return this.origin=this.getUnit(r),null==this.origin&&this.throwUnsupportedUnitError(r),this}to(r){var t,e;if(null==this.origin)throw new Error(".to must be called after .from");this.destination=this.getUnit(r),null==this.destination&&this.throwUnsupportedUnitError(r);const n=this.destination,a=this.origin;if(a.abbr===n.abbr)return this.val;if(n.measure!=a.measure)throw new Error(`Cannot convert incompatible measures of ${n.measure} and ${a.measure}`);let s=this.val*a.unit.to_anchor;if(a.unit.anchor_shift&&(s-=a.unit.anchor_shift),a.system!=n.system){const r=this.measureData[a.measure].anchors;if(null==r)throw new Error(`Unable to convert units. Anchors are missing for "${a.measure}" and "${n.measure}" measures.`);const i=r[a.system];if(null==i)throw new Error(`Unable to find anchor for "${a.measure}" to "${n.measure}". Please make sure it is defined.`);const o=null===(t=i[n.system])||void 0===t?void 0:t.transform,l=null===(e=i[n.system])||void 0===e?void 0:e.ratio;if("function"==typeof o)s=o(s);else{if("number"!=typeof l)throw new Error("A system anchor needs to either have a defined ratio number or a transform function.");s*=l}}return n.unit.anchor_shift&&(s+=n.unit.anchor_shift),s/n.unit.to_anchor}toBest(r){var t,e,n;if(null==this.origin)throw new Error(".toBest must be called after .from");const a=this.val<0;let s=[],i=a?-1:1,o=this.origin.system;"object"==typeof r&&(s=null!==(t=r.exclude)&&void 0!==t?t:[],i=null!==(e=r.cutOffNumber)&&void 0!==e?e:i,o=null!==(n=r.system)&&void 0!==n?n:this.origin.system);let l=null;for(const u of this.possibilities()){const r=this.describe(u);if(-1===s.indexOf(u)&&r.system===o){const t=this.to(u);if(a?t>i:t<i)continue;(null===l||(a?t<=i&&t>l.val:t>=i&&t<l.val))&&(l={val:t,unit:u,singular:r.singular,plural:r.plural})}}return l}getUnit(r){for(const[t,e]of Object.entries(this.measureData))for(const[n,a]of Object.entries(e.systems))for(const[e,s]of Object.entries(a))if(e==r)return{abbr:r,measure:t,system:n,unit:s};return null}describe(r){const t=this.getUnit(r);if(null!=t)return this.describeUnit(t);this.throwUnsupportedUnitError(r)}describeUnit(r){return{abbr:r.abbr,measure:r.measure,system:r.system,singular:r.unit.name.singular,plural:r.unit.name.plural}}list(r){const t=[];if(null==r)for(const[e,n]of Object.entries(this.measureData))for(const[r,a]of Object.entries(n.systems))for(const[n,s]of Object.entries(a))t.push(this.describeUnit({abbr:n,measure:e,system:r,unit:s}));else{if(!(r in this.measureData))throw new Error(`Meausre "${r}" not found.`);{const e=this.measureData[r];for(const[n,a]of Object.entries(e.systems))for(const[e,s]of Object.entries(a))t.push(this.describeUnit({abbr:e,measure:r,system:n,unit:s}))}}return t}throwUnsupportedUnitError(r){let t=[];for(const e of Object.values(this.measureData))for(const r of Object.values(e.systems))t=t.concat(Object.keys(r));throw new Error(`Unsupported unit ${r}, use one of: ${t.join(", ")}`)}possibilities(r){let t=[],e=[];"string"==typeof r?e.push(r):null!=this.origin?e.push(this.origin.measure):e=Object.keys(this.measureData);for(const n of e){const r=this.measureData[n].systems;for(const e of Object.values(r))t=[...t,...Object.keys(e)]}return t}measures(){return Object.keys(this.measureData)}}const t=(e={mass:{systems:{metric:{mcg:{name:{singular:"Microgram",plural:"Micrograms"},to_anchor:1e-6},mg:{name:{singular:"Milligram",plural:"Milligrams"},to_anchor:.001},g:{name:{singular:"Gram",plural:"Grams"},to_anchor:1},kg:{name:{singular:"Kilogram",plural:"Kilograms"},to_anchor:1e3},mt:{name:{singular:"Metric Tonne",plural:"Metric Tonnes"},to_anchor:1e6}},imperial:{oz:{name:{singular:"Ounce",plural:"Ounces"},to_anchor:1/16},lb:{name:{singular:"Pound",plural:"Pounds"},to_anchor:1},t:{name:{singular:"Ton",plural:"Tons"},to_anchor:2e3}}},anchors:{metric:{imperial:{ratio:1/453.592}},imperial:{metric:{ratio:453.592}}}},volume:{systems:{metric:{mm3:{name:{singular:"Cubic Millimeter",plural:"Cubic Millimeters"},to_anchor:1e-6},cm3:{name:{singular:"Cubic Centimeter",plural:"Cubic Centimeters"},to_anchor:.001},ml:{name:{singular:"Millilitre",plural:"Millilitres"},to_anchor:.001},cl:{name:{singular:"Centilitre",plural:"Centilitres"},to_anchor:.01},dl:{name:{singular:"Decilitre",plural:"Decilitres"},to_anchor:.1},l:{name:{singular:"Litre",plural:"Litres"},to_anchor:1},kl:{name:{singular:"Kilolitre",plural:"Kilolitres"},to_anchor:1e3},Ml:{name:{singular:"Megalitre",plural:"Megalitres"},to_anchor:1e6},Gl:{name:{singular:"Gigalitre",plural:"Gigalitres"},to_anchor:1e9},m3:{name:{singular:"Cubic meter",plural:"Cubic meters"},to_anchor:1e3},km3:{name:{singular:"Cubic kilometer",plural:"Cubic kilometers"},to_anchor:1e12},krm:{name:{singular:"Kryddmått",plural:"Kryddmått"},to_anchor:.001},tsk:{name:{singular:"Tesked",plural:"Teskedar"},to_anchor:.005},msk:{name:{singular:"Matsked",plural:"Matskedar"},to_anchor:.015},kkp:{name:{singular:"Kaffekopp",plural:"Kaffekoppar"},to_anchor:.15},glas:{name:{singular:"Glas",plural:"Glas"},to_anchor:.2},kanna:{name:{singular:"Kanna",plural:"Kannor"},to_anchor:2.617}},imperial:{tsp:{name:{singular:"Teaspoon",plural:"Teaspoons"},to_anchor:1/6},Tbs:{name:{singular:"Tablespoon",plural:"Tablespoons"},to_anchor:.5},in3:{name:{singular:"Cubic inch",plural:"Cubic inches"},to_anchor:.55411},"fl-oz":{name:{singular:"Fluid Ounce",plural:"Fluid Ounces"},to_anchor:1},cup:{name:{singular:"Cup",plural:"Cups"},to_anchor:8},pnt:{name:{singular:"Pint",plural:"Pints"},to_anchor:16},qt:{name:{singular:"Quart",plural:"Quarts"},to_anchor:32},gal:{name:{singular:"Gallon",plural:"Gallons"},to_anchor:128},ft3:{name:{singular:"Cubic foot",plural:"Cubic feet"},to_anchor:957.506},yd3:{name:{singular:"Cubic yard",plural:"Cubic yards"},to_anchor:25852.7}}},anchors:{metric:{imperial:{ratio:33.8140226}},imperial:{metric:{ratio:1/33.8140226}}}}},t=>new r(e,t));var e;const n=["krm","tsk","msk","kkp","glas","kanna","dl"];function a(r,e,a){if(!r.checkValidity())return;const s=Math.max(r.valueAsNumber,1)||e;for(const i of a){const r=Number.parseInt(i.dataset.d);let a=Math.round(100*(r*s/e+Number.EPSILON))/100,o=i.dataset.m||"";if(i.dataset.m)try{const r=t(a).from(o).toBest({system:"metric",exclude:n});a=Math.round(100*r.val)/100,o=r.unit}catch{o=` ${a>=2?i.dataset.p:i.dataset.m}`}i.innerHTML=`${a}`,i.nextElementSibling.innerHTML=o}}!function(){const r=document.querySelector(".ingredient-form"),t=[...document.querySelectorAll(".list-ingredients li div output")],e=r.querySelector("input"),n=Number.parseInt(e.dataset.default);e.addEventListener("input",(r=>{a(r.target,n,t)})),a(e,n,t)}();