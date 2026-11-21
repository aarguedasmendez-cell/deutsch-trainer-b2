'use strict';
/* Deutsch Trainer B2+ — versión 0.2: sin dependencias ni servicios externos. */
const STORAGE_KEY='deutsch_trainer_b2_v1';
const PRONOUNS=['ich','du','er / sie / es','wir','ihr','sie / Sie'];
const CASES=[['Nom','Nominativ'],['Akk','Akkusativ'],['Dat','Dativ'],['Gen','Genitiv']];
const MODULES={
 verb:{label:'Verbos',icon:'↻',description:'Presente, Perfekt, reflexivos y preposiciones',short:'Conjugación completa'},
 noun:{label:'Declinaciones',icon:'Aa',description:'Artículos, adjetivos y singular/plural',short:'20 formas por ejercicio'},
 connector:{label:'Conectores',icon:'⇢',description:'Significado y orden en la oración',short:'B1–B2+'},
 preposition:{label:'Preposiciones',icon:'◈',description:'Verbos con preposición y caso',short:'Akkusativ y Dativ'}
};
const SEED=[
 {id:'v_erholen',type:'verb',de:'sich erholen',es:'recuperarse / descansar',infinitive:'sich erholen',present:['erhole mich','erholst dich','erholt sich','erholen uns','erholt euch','erholen sich'],reflexive:'Sí',auxiliary:'haben',participle:'erholt',preposition:'von',case:'Dativ',example:'Ich erhole mich von der Arbeit.',source:'Conversaciones y carta TELC B2'},
 {id:'v_beschweren',type:'verb',de:'sich beschweren',es:'quejarse',infinitive:'sich beschweren',present:['beschwere mich','beschwerst dich','beschwert sich','beschweren uns','beschwert euch','beschweren sich'],reflexive:'Sí',auxiliary:'haben',participle:'beschwert',preposition:'über',case:'Akkusativ',example:'Ich beschwere mich über den Lärm.',source:'Carta de reclamación TELC B2'},
 {id:'v_bewerben',type:'verb',de:'sich bewerben',es:'postularse / solicitar un puesto',infinitive:'sich bewerben',present:['bewerbe mich','bewirbst dich','bewirbt sich','bewerben uns','bewerbt euch','bewerben sich'],reflexive:'Sí',auxiliary:'haben',participle:'beworben',preposition:'um',case:'Akkusativ',example:'Ich bewerbe mich um eine Stelle.',source:'Consultas de vocabulario'},
 {id:'v_ankommen',type:'verb',de:'ankommen',es:'llegar',infinitive:'ankommen',present:['komme an','kommst an','kommt an','kommen an','kommt an','kommen an'],reflexive:'No',auxiliary:'sein',participle:'angekommen',preposition:'—',case:'Ninguno',example:'Der Zug kommt spät an.',source:'Consultas de vocabulario'},
 {id:'v_teilnehmen',type:'verb',de:'teilnehmen',es:'participar',infinitive:'teilnehmen',present:['nehme teil','nimmst teil','nimmt teil','nehmen teil','nehmt teil','nehmen teil'],reflexive:'No',auxiliary:'haben',participle:'teilgenommen',preposition:'an',case:'Dativ',example:'Ich nehme an einem Deutschkurs teil.',source:'Verbos con preposición'},
 {id:'v_verzichten',type:'verb',de:'verzichten',es:'renunciar / prescindir',infinitive:'verzichten',present:['verzichte','verzichtest','verzichtet','verzichten','verzichtet','verzichten'],reflexive:'No',auxiliary:'haben',participle:'verzichtet',preposition:'auf',case:'Akkusativ',example:'Ich verzichte auf Zucker.',source:'Verbos con preposición'},
 {id:'v_freuen',type:'verb',de:'sich freuen',es:'alegrarse / esperar con ilusión',infinitive:'sich freuen',present:['freue mich','freust dich','freut sich','freuen uns','freut euch','freuen sich'],reflexive:'Sí',auxiliary:'haben',participle:'gefreut',preposition:'auf',case:'Akkusativ',example:'Ich freue mich auf das Wochenende.',source:'Consultas de vocabulario'},
 {id:'v_bitten',type:'verb',de:'bitten',es:'pedir / solicitar',infinitive:'bitten',present:['bitte','bittest','bittet','bitten','bittet','bitten'],reflexive:'No',auxiliary:'haben',participle:'gebeten',preposition:'um',case:'Akkusativ',example:'Ich bitte um Hilfe.',source:'Verbos con preposición'},
 {id:'n_haus',type:'noun',de:'das Haus',es:'la casa bonita',singular:'Haus',gender:'n',plural:'Häuser',genitive:'Hauses',dativePlural:'Häusern',adjective:'schön',source:'Entrenador de declinaciones'},
 {id:'n_buch',type:'noun',de:'das Buch',es:'el libro entretenido',singular:'Buch',gender:'n',plural:'Bücher',genitive:'Buches',dativePlural:'Büchern',adjective:'unterhaltsam',source:'Entrenador de declinaciones'},
 {id:'n_stuhl',type:'noun',de:'der Stuhl',es:'la silla moderna (en alemán: der Stuhl)',singular:'Stuhl',gender:'m',plural:'Stühle',genitive:'Stuhls',dativePlural:'Stühlen',adjective:'modern',source:'Entrenador de declinaciones'},
 {id:'n_teller',type:'noun',de:'der Teller',es:'el plato de alta calidad',singular:'Teller',gender:'m',plural:'Teller',genitive:'Tellers',dativePlural:'Tellern',adjective:'hochwertig',source:'Entrenador de declinaciones'},
 {id:'n_hose',type:'noun',de:'die Hose',es:'el pantalón extraño',singular:'Hose',gender:'f',plural:'Hosen',genitive:'Hose',dativePlural:'Hosen',adjective:'ungewöhnlich',source:'Entrenador de declinaciones'},
 {id:'n_schrank',type:'noun',de:'der Schrank',es:'el armario viejo',singular:'Schrank',gender:'m',plural:'Schränke',genitive:'Schranks',dativePlural:'Schränken',adjective:'alt',source:'Consultas de vocabulario'},
 {id:'n_zimmer',type:'noun',de:'das Zimmer',es:'la habitación acogedora',singular:'Zimmer',gender:'n',plural:'Zimmer',genitive:'Zimmers',dativePlural:'Zimmern',adjective:'gemütlich',source:'Consultas de vocabulario'},
 {id:'n_wohnung',type:'noun',de:'die Wohnung',es:'el piso moderno',singular:'Wohnung',gender:'f',plural:'Wohnungen',genitive:'Wohnung',dativePlural:'Wohnungen',adjective:'modern',source:'Entrenador de declinaciones'},
 {id:'c_weil',type:'connector',de:'weil',es:'porque',sentence:'Ich schreibe eine Beschwerde, ___ das Zimmer laut war.',answer:'weil',alternatives:['da'],kind:'Subordinante: verbo conjugado al final.',source:'Carta TELC B2'},
 {id:'c_obwohl',type:'connector',de:'obwohl',es:'aunque',sentence:'___ das Hotel ruhige Zimmer versprochen hatte, war es sehr laut.',answer:'obwohl',kind:'Concesivo subordinante: verbo al final de su oración.',source:'Carta TELC B2'},
 {id:'c_deshalb',type:'connector',de:'deshalb',es:'por eso',sentence:'Die Baustelle war sehr laut. ___ konnte ich nicht schlafen.',answer:'deshalb',alternatives:['deswegen','daher'],kind:'Adverbio conector: ocupa posición 1 y el verbo va en posición 2.',source:'Conectores B2'},
 {id:'c_damit',type:'connector',de:'damit',es:'para que',sentence:'Ich lerne täglich, ___ ich die B2-Prüfung bestehe.',answer:'damit',kind:'Final subordinante: verbo conjugado al final.',source:'Conectores B2'},
 {id:'c_bevor',type:'connector',de:'bevor',es:'antes de que',sentence:'Ich prüfe die Rechnung, ___ ich sie bezahle.',answer:'bevor',kind:'Temporal subordinante: acción posterior en la subordinada.',source:'Conectores B2'},
 {id:'c_trotzdem',type:'connector',de:'trotzdem',es:'sin embargo / aun así',sentence:'Er war sehr müde. ___ hat er weitergelernt.',answer:'trotzdem',alternatives:['dennoch'],kind:'Adverbio conector concesivo, verbo en posición 2.',source:'Conectores B2'},
 {id:'c_sodass',type:'connector',de:'sodass',es:'de modo que',sentence:'Er hat sehr regelmäßig gelernt, ___ er seine Grammatik deutlich verbessert hat.',answer:'sodass',alternatives:['so dass'],kind:'Consecutivo subordinante: indica resultado.',source:'Conectores B2'},
 {id:'c_als',type:'connector',de:'als',es:'cuando (pasado único)',sentence:'___ ich gestern im Hotel ankam, war mein Zimmer noch nicht fertig.',answer:'als',kind:'Temporal: acontecimiento único en el pasado.',source:'Conectores B2'},
 {id:'p_beschweren',type:'preposition',de:'sich beschweren',es:'quejarse de algo',sentence:'Ich beschwere mich ___ den Lärm.',preposition:'über',case:'Akkusativ',source:'Verbos con preposiciones'},
 {id:'p_erholen',type:'preposition',de:'sich erholen',es:'recuperarse de algo',sentence:'Ich erhole mich ___ der Arbeit.',preposition:'von',case:'Dativ',source:'Verbos con preposiciones'},
 {id:'p_bitten',type:'preposition',de:'bitten',es:'pedir algo',sentence:'Ich bitte Sie ___ eine Antwort.',preposition:'um',case:'Akkusativ',source:'Verbos con preposiciones'},
 {id:'p_teilnehmen',type:'preposition',de:'teilnehmen',es:'participar en algo',sentence:'Wir nehmen ___ dem Kurs teil.',preposition:'an',case:'Dativ',source:'Verbos con preposiciones'},
 {id:'p_verzichten',type:'preposition',de:'verzichten',es:'prescindir de algo',sentence:'Er verzichtet ___ Zucker.',preposition:'auf',case:'Akkusativ',source:'Verbos con preposiciones'},
 {id:'p_zweifeln',type:'preposition',de:'zweifeln',es:'dudar de algo',sentence:'Ich zweifle ___ seiner Aussage.',preposition:'an',case:'Dativ',source:'Verbos con preposiciones'},
 {id:'p_beziehen',type:'preposition',de:'sich beziehen',es:'referirse a algo',sentence:'Ich beziehe mich ___ Ihre E-Mail.',preposition:'auf',case:'Akkusativ',source:'Verbos con preposiciones'},
 {id:'p_bestehen',type:'preposition',de:'bestehen',es:'insistir en algo',sentence:'Sie besteht ___ einer schriftlichen Antwort.',preposition:'auf',case:'Dativ',source:'Verbos con preposiciones'},
 {id:'p_wenden',type:'preposition',de:'sich wenden',es:'dirigirse a alguien',sentence:'Bitte wenden Sie sich ___ den Kundenservice.',preposition:'an',case:'Akkusativ',source:'Verbos con preposiciones'},
 {id:'p_aergern',type:'preposition',de:'sich ärgern',es:'enfadarse por algo',sentence:'Wir ärgern uns ___ den Fehler.',preposition:'über',case:'Akkusativ',source:'Verbos con preposiciones'},
 {id:'pending_erholung',type:'pending',de:'die Erholung',es:'el descanso / la recuperación',source:'Vocabulario consultado'},
 {id:'pending_nachspeise',type:'pending',de:'die Nachspeise',es:'el postre',source:'Vocabulario consultado'},
 {id:'pending_komfort',type:'pending',de:'der Komfort',es:'la comodidad',source:'Vocabulario consultado'},
 {id:'pending_fehler',type:'pending',de:'der Fehler',es:'el error',source:'Vocabulario consultado'}
];
let state=loadState();
let view='home', currentModule=null, wordQuery='';
const main=document.getElementById('main');
function freshState(){return {bank:structuredClone(SEED),index:{verb:0,noun:0,connector:0,preposition:0},drafts:{},lastChecks:{},history:[],createdAt:new Date().toISOString()};}
function loadState(){try{const raw=localStorage.getItem(STORAGE_KEY); if(!raw)return freshState();const d=JSON.parse(raw);if(!Array.isArray(d.bank)||!Array.isArray(d.history))return freshState();return {...freshState(),...d};}catch(e){return freshState();}}
function save(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));}catch(e){showToast('No se puede guardar. Libera almacenamiento y exporta una copia.');}}
function html(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function normalize(s){return String(s??'').trim().toLocaleLowerCase('de-DE').replace(/[.!,;:]+$/g,'').replace(/\s+/g,' ').replace(/’/g,"'");}
function itemBank(type){return state.bank.filter(i=>i.type===type);}
function currentItem(type){const bank=itemBank(type); if(!bank.length)return null;const index=Math.max(0,Math.min((state.index[type]||0),bank.length-1));state.index[type]=index;return bank[index];}
function qid(item){return item.type+'::'+item.id;}
function draftFor(item){return state.drafts[qid(item)]||{};}
function checkedFor(item){return state.lastChecks[qid(item)]||null;}
function moduleCount(){return Object.keys(MODULES).reduce((a,k)=>a+itemBank(k).length,0);}
function accuracy(){const total=state.history.reduce((n,r)=>n+(r.total||0),0);const right=state.history.reduce((n,r)=>n+(r.correct||0),0);return total?Math.round(right/total*100):0;}
function feedbackHTML(key,expected,check){if(!check)return '';const match=check.fields?.[key];if(match)return '<div class="feedback good">✓ Correcto</div>';return `<div class="feedback bad">✕ Revisa esta respuesta.<span class="correct-text">Respuesta: ${html(expected)}</span></div>`;}
/* Cada campo incluye un botón de avance apto para teclado táctil de iPad. */
function nextFieldButton(key,check){return check?'':`<button type="button" class="field-next" data-focus-next="${html(key)}" aria-label="Ir a la siguiente casilla" title="Siguiente casilla">→</button>`;}
function optionsField(key, label, options, answer, item, check){let val=draftFor(item)[key]??'';let cls=check?(check.fields?.[key]?' correct':' error'):'';
 return `<div class="field"><label for="f_${html(key)}">${html(label)}</label><div class="answer-entry"><select id="f_${html(key)}" class="select-answer${cls}" data-key="${html(key)}" ${check?'disabled':''}><option value="">Selecciona...</option>${options.map(x=>`<option value="${html(x)}" ${x===val?'selected':''}>${html(x)}</option>`).join('')}</select>${nextFieldButton(key,check)}</div>${feedbackHTML(key,answer,check)}</div>`;}
function textField(key,label,answer,item,check,placeholder='Escribe tu respuesta'){let val=draftFor(item)[key]??'';let cls=check?(check.fields?.[key]?' correct':' error'):'';
 return `<div class="field"><label for="f_${html(key)}">${html(label)}</label><div class="answer-entry"><input id="f_${html(key)}" class="answer${cls}" type="text" autocapitalize="off" autocomplete="off" autocorrect="off" enterkeyhint="next" spellcheck="false" data-key="${html(key)}" value="${html(val)}" placeholder="${html(placeholder)}" ${check?'readonly':''}>${nextFieldButton(key,check)}</div>${feedbackHTML(key,answer,check)}</div>`;}
function nounForm(item,caseKey,group){const g=item.gender;const sg=item.singular;const base=(caseKey==='Gen')?item.genitive:sg;const pl=(caseKey==='Dat')?item.dativePlural:item.plural;
 const art={
 def:{m:{Nom:'der',Akk:'den',Dat:'dem',Gen:'des'},f:{Nom:'die',Akk:'die',Dat:'der',Gen:'der'},n:{Nom:'das',Akk:'das',Dat:'dem',Gen:'des'}},
 indef:{m:{Nom:'ein',Akk:'einen',Dat:'einem',Gen:'eines'},f:{Nom:'eine',Akk:'eine',Dat:'einer',Gen:'einer'},n:{Nom:'ein',Akk:'ein',Dat:'einem',Gen:'eines'}}
 };
 const endings={
 def:{m:{Nom:'e',Akk:'en',Dat:'en',Gen:'en'},f:{Nom:'e',Akk:'e',Dat:'en',Gen:'en'},n:{Nom:'e',Akk:'e',Dat:'en',Gen:'en'}},
 indef:{m:{Nom:'er',Akk:'en',Dat:'en',Gen:'en'},f:{Nom:'e',Akk:'e',Dat:'en',Gen:'en'},n:{Nom:'es',Akk:'es',Dat:'en',Gen:'en'}},
 bare:{m:{Nom:'er',Akk:'en',Dat:'em',Gen:'en'},f:{Nom:'e',Akk:'e',Dat:'er',Gen:'er'},n:{Nom:'es',Akk:'es',Dat:'em',Gen:'en'}},
 plDef:{Nom:'en',Akk:'en',Dat:'en',Gen:'en'},plBare:{Nom:'e',Akk:'e',Dat:'en',Gen:'er'}
 };
 let article='',suffix='',noun='';
 if(group==='plDef'){article={Nom:'die',Akk:'die',Dat:'den',Gen:'der'}[caseKey];suffix=endings.plDef[caseKey];noun=pl;}
 else if(group==='plBare'){suffix=endings.plBare[caseKey];noun=pl;}
 else {article=art[group]?.[g]?.[caseKey]||'';suffix=endings[group]?.[g]?.[caseKey]||'';noun=base;}
 return `${article?article+' ':''}${item.adjective+suffix} ${noun}`;
}
function questionFields(item){if(item.type==='verb')return [
 {key:'inf',label:'Infinitivo en alemán',answer:item.infinitive},
 ...PRONOUNS.map((p,i)=>({key:'p'+i,label:p,answer:item.present[i]})),
 {key:'reflex',label:'¿Es reflexivo?',answer:item.reflexive,options:['Sí','No']},
 {key:'aux',label:'Auxiliar Perfekt',answer:item.auxiliary,options:['haben','sein']},
 {key:'part',label:'Partizip II',answer:item.participle},
 {key:'prep',label:'Preposición',answer:item.preposition,options:['—','an','auf','aus','bei','für','gegen','in','mit','nach','über','um','von','vor','zu']},
 {key:'case',label:'Caso de la preposición',answer:item.case,options:['Ninguno','Akkusativ','Dativ','Genitiv']}
 ];
 if(item.type==='noun')return [
 ...['def','indef','bare','plDef','plBare'].flatMap(group=>CASES.map(([c,label])=>({key:group+c,label:label,answer:nounForm(item,c,group),group})))
 ];
 if(item.type==='connector')return [{key:'connector',label:'Conector que falta',answer:item.answer,alternatives:item.alternatives||[]}];
 if(item.type==='preposition')return [
 {key:'prep',label:'Preposición que falta',answer:item.preposition},
 {key:'case',label:'Caso gramatical',answer:item.case,options:['Akkusativ','Dativ','Genitiv']}
 ];
 return [];
}
function setView(next,module){view=next;currentModule=module||null;render();window.scrollTo({top:0,behavior:'instant'});}
function renderNav(){document.querySelectorAll('[data-nav]').forEach(b=>{const on=b.dataset.nav===view;b.classList.toggle('active',on);b.setAttribute('aria-current',on?'page':'false');});}
function render(){renderNav(); if(view==='home')return renderHome();if(view==='practice')return currentModule?renderQuestion():renderModules();if(view==='words')return renderWords();if(view==='progress')return renderProgress();}
function renderHome(){const s=accuracy(),tries=state.history.length;
 main.innerHTML=`<section class="hero"><span class="eyebrow">DEUTSCH TRAINER · B1–B2+</span><h1>Un poco de alemán.<br>Todos los días.</h1><p>Practica con palabras de tus consultas, aprende de tus errores y continúa sin internet después de instalar la aplicación.</p><button class="btn primary-light" data-action="open-modules">Empezar a practicar <span>↗</span></button></section>
 <div class="section-heading"><div><h2>Tu espacio de estudio</h2><p>Elige qué quieres reforzar hoy</p></div><span class="pill warm">Versión 0.2</span></div><div class="modules">${moduleCards()}</div>
 <div class="section-heading"><div><h2>Tu progreso</h2><p>Los datos se guardan en este dispositivo</p></div></div>
 <div class="stat-grid"><div class="stat"><strong>${moduleCount()}</strong><small>Ejercicios disponibles</small></div><div class="stat"><strong>${tries}</strong><small>Fichas corregidas</small></div><div class="stat"><strong>${s}%</strong><small>Respuestas correctas</small></div></div>
 <div class="card" style="margin-top:16px"><strong>Tu biblioteca crece contigo</strong><p class="muted-sm">Puedes añadir palabras pendientes y cargar archivos JSON de vocabulario preparado en ChatGPT. No se recopilan datos en un servidor.</p><button class="btn secondary small" data-action="words">Abrir mi vocabulario</button></div>
 <p class="app-version">Deutsch Trainer B2+ · v0.2 · Funciona offline tras su primera instalación online</p>`;
}
function moduleCards(){return Object.entries(MODULES).map(([k,m])=>`<button type="button" class="module" data-module="${k}"><div class="module-icon">${m.icon}</div><div><h3>${m.label}</h3><p>${m.description}</p></div><span class="pill">${itemBank(k).length} fichas</span></button>`).join('');}
function renderModules(){main.innerHTML=`<h1 class="page-title">Elige tu entrenador</h1><p class="page-subtitle">No verás las soluciones hasta pulsar «Comprobar respuestas». Puedes cambiar de pantalla sin perder lo que escribes.</p><div class="modules">${moduleCards()}</div>`;}
function renderQuestion(){const item=currentItem(currentModule);if(!item){main.innerHTML=`<h1 class="page-title">${MODULES[currentModule].label}</h1><div class="empty">Todavía no hay ejercicios en este módulo. Importa fichas desde «Mi vocabulario».</div><button class="btn secondary" data-action="open-modules">Volver</button>`;return;}
 const list=itemBank(currentModule),index=state.index[currentModule]||0,check=checkedFor(item),fields=questionFields(item);
 let content='';
 if(item.type==='verb'){
   content=`<div class="exercise-grid">${fields.slice(0,1).map(f=>renderField(f,item,check)).join('')}</div><h3 class="minor-title">Presente · todas las personas</h3><div class="exercise-grid">${fields.slice(1,7).map(f=>renderField(f,item,check)).join('')}</div><h3 class="minor-title">Propiedades y Perfekt</h3><div class="exercise-grid">${fields.slice(7).map(f=>renderField(f,item,check)).join('')}</div>`;
 }else if(item.type==='noun'){
  const groups=[['def','Singular · artículo definido (der/die/das)'],['indef','Singular · artículo indefinido (ein/eine)'],['bare','Singular · sin artículo'],['plDef','Plural · artículo definido'],['plBare','Plural · sin artículo']];
  content=groups.map(([g,l])=>`<section class="case-group"><h3>${l}</h3><div class="exercise-grid">${fields.filter(f=>f.group===g).map(f=>renderField(f,item,check)).join('')}</div></section>`).join('');
 }else if(item.type==='connector'){
  content=`<div class="card" style="background:#f7f9fc"><p style="line-height:1.9;font-size:18px;margin:0">${html(item.sentence).replace('___','<strong style="color:#a76b21">________</strong>')}</p></div><div class="exercise-grid">${fields.map(f=>renderField(f,item,check)).join('')}</div>`;
 }else if(item.type==='preposition'){
  content=`<div class="card" style="background:#f7f9fc"><p style="line-height:1.9;font-size:18px;margin:0">${html(item.sentence).replace('___','<strong style="color:#a76b21">________</strong>')}</p></div><div class="exercise-grid">${fields.map(f=>renderField(f,item,check)).join('')}</div>`;
 }
 main.innerHTML=`<div class="practice-head"><button class="btn ghost small" data-action="open-modules">‹ Todos los entrenadores</button><div class="progress-track" aria-label="Posición en la lista"><div class="progress-fill" style="width:${Math.round((index+1)/list.length*100)}%"></div></div><span class="muted-sm">${index+1} de ${list.length}</span></div>
 <div class="card"><div class="row between"><span class="pill">${MODULES[currentModule].label}</span><span class="muted-sm">${html(item.source||'Mi biblioteca')}</span></div>
 <h1 class="problem-title">${html(item.es)}</h1><p class="problem-desc">${item.type==='noun'?'Completa las declinaciones con el adjetivo en alemán. Incluye el plural.':item.type==='verb'?'Completa el verbo entero. Incluye los pronombres reflexivos cuando corresponda.':item.type==='connector'?'Escribe el conector adecuado para que la oración tenga sentido.':'Completa la preposición fija del verbo y su caso.'}</p>
 ${check?'':`<div class="keyboard-tip">Pulsa <strong>Tab</strong> o <strong>Intro</strong> para avanzar. Si usas el teclado en pantalla, toca <strong>→</strong> junto a la casilla.</div>`}
 ${content}
 ${check?`<div class="score"><h3>${check.correct} de ${check.total} respuestas correctas (${Math.round(check.correct/check.total*100)}%)</h3><p>${item.kind?html(item.kind):'Los errores están en rojo y sus soluciones aparecen bajo cada campo.'}${item.example?' Ejemplo: '+html(item.example):''}</p></div>`:''}
 <div class="toolbar">${check?'<button class="btn secondary" data-action="retry">Intentar de nuevo</button>':'<button class="btn" data-action="check">Comprobar respuestas</button>'}<button class="btn ${check?'':'secondary'}" data-action="next">Siguiente ejercicio →</button></div></div>
 <p class="muted-sm" style="text-align:center">Las respuestas se conservan al escribir y cambiar de pantalla.</p>`;
}
function renderField(field,item,check){return field.options?optionsField(field.key,field.label,field.options,field.answer,item,check):textField(field.key,field.label,field.answer,item,check,item.type==='noun'?'Artículo + adjetivo + sustantivo':'Tu respuesta');}
function handleCheck(){const item=currentItem(currentModule);if(!item)return;const fields=questionFields(item),draft=draftFor(item);let correct=0;const map={};fields.forEach(f=>{const vals=[f.answer,...(f.alternatives||[])];const isRight=vals.some(v=>normalize(v)===normalize(draft[f.key]));map[f.key]=isRight;if(isRight)correct++;});const result={at:new Date().toISOString(),type:item.type,id:item.id,total:fields.length,correct};state.history.push(result);state.lastChecks[qid(item)]={fields:map,correct,total:fields.length};save();renderQuestion();}
function nextQuestion(){const item=currentItem(currentModule);if(item&&checkedFor(item)){delete state.drafts[qid(item)];delete state.lastChecks[qid(item)];}const bank=itemBank(currentModule);if(bank.length)state.index[currentModule]=((state.index[currentModule]||0)+1)%bank.length;save();renderQuestion();window.scrollTo({top:0,behavior:'instant'});}
function retryQuestion(){const item=currentItem(currentModule);if(item){delete state.lastChecks[qid(item)];save();renderQuestion();}}
function renderWords(){const list=state.bank.filter(i=>`${i.de} ${i.es} ${i.source||''}`.toLocaleLowerCase().includes(wordQuery.toLocaleLowerCase()));
 main.innerHTML=`<div class="row between" style="margin-bottom:16px"><div><h1 class="page-title">Mi vocabulario</h1><p class="page-subtitle" style="margin-bottom:0">${state.bank.length} registros · ${moduleCount()} fichas practicables</p></div><button class="btn secondary small" data-action="export">↓ Copia de seguridad</button></div>
 <div class="card"><h2 style="margin:0 0 10px;color:var(--navy);font-size:19px">Añadir una palabra pendiente</h2><p class="muted-sm">Puedes anotarla ahora y preparar más tarde su ficha completa en ChatGPT. Una palabra pendiente aún no genera ejercicios.</p><form id="addWord" class="form-grid"><div class="field"><label for="newde">Palabra en alemán</label><input class="text-input" id="newde" name="de" required placeholder="z. B. der Vertrag"></div><div class="field"><label for="newes">Significado en español</label><input class="text-input" id="newes" name="es" required placeholder="el contrato"></div><button class="btn" type="submit">+ Guardar palabra</button></form></div>
 <div class="card"><h2 style="margin:0 0 10px;color:var(--navy);font-size:19px">Importar vocabulario o restaurar copia</h2><p class="muted-sm">Acepta archivos .json preparados en nuestros chats. Un archivo de copia de seguridad también puede restaurar el progreso en este dispositivo.</p><label class="btn secondary" for="fileImport">↑ Elegir archivo JSON</label><input id="fileImport" type="file" accept=".json,application/json" style="display:none"><details class="collapse"><summary>Formato de importación</summary><p class="muted-sm">Admite un objeto con <code>"items"</code> o una lista de fichas. Las fichas completas deben incluir los campos gramaticales exigidos por su módulo. También puedes importar pendientes.</p></details></div>
 <div class="search-row"><input id="wordSearch" class="text-input" placeholder="Buscar en mi vocabulario…" value="${html(wordQuery)}" aria-label="Buscar palabras"><span class="pill">${list.length} resultados</span></div>
 <div class="word-list" id="wordResults">${list.map(wordHTML).join('')||'<div class="empty">Sin resultados.</div>'}</div><p class="app-version">Los archivos importados y el progreso se guardan en este dispositivo; no hay sincronización automática todavía.</p>`;
}
function wordHTML(i){const tags={verb:'Verbo',noun:'Sustantivo',connector:'Conector',preposition:'Preposición',pending:'Pendiente'};
 return `<article class="word"><strong>${html(i.de)}</strong><p>${html(i.es)}</p><footer><span>${html(tags[i.type]||'Palabra')}</span>${i.type==='pending'?`<button data-remove="${html(i.id)}" type="button">Eliminar</button>`:'<span>✓ Practicable</span>'}</footer></article>`;}
function renderProgress(){const byType=Object.entries(MODULES).map(([k,m])=>{const h=state.history.filter(r=>r.type===k);const total=h.reduce((a,r)=>a+r.total,0);const correct=h.reduce((a,r)=>a+r.correct,0);return {k,m,n:h.length,pct:total?Math.round(correct/total*100):null};});
 const recent=state.history.slice(-8).reverse();main.innerHTML=`<h1 class="page-title">Mi progreso</h1><p class="page-subtitle">Tus resultados permanecen en este dispositivo. Exporta una copia periódicamente, especialmente antes de cambiarlo.</p>
 <div class="stat-grid"><div class="stat"><strong>${state.history.length}</strong><small>Fichas completadas</small></div><div class="stat"><strong>${accuracy()}%</strong><small>Acierto global</small></div><div class="stat"><strong>${state.bank.length}</strong><small>Palabras y fichas</small></div></div>
 <div class="section-heading"><h2>Por entrenador</h2></div><div class="block-list">${byType.map(({k,m,n,pct})=>`<div class="line-card"><div><strong>${m.label}</strong><small>${n} fichas completadas</small></div><span class="pill">${pct===null?'Sin datos':pct+'% aciertos'}</span></div>`).join('')}</div>
 <div class="section-heading"><h2>Últimos intentos</h2></div>${recent.length?`<div class="block-list">${recent.map(r=>{const i=state.bank.find(i=>i.id===r.id);return `<div class="line-card"><div><strong>${html(i?.de||r.type)}</strong><small>${new Date(r.at).toLocaleString('es-ES')}</small></div><span class="pill">${r.correct}/${r.total}</span></div>`;}).join('')}</div>`:'<div class="empty">Todavía no hay intentos corregidos. ¡Empieza por el entrenador que prefieras!</div>'}
 <div class="card" style="margin-top:20px"><h2 style="margin-top:0">Protege tu progreso</h2><p class="muted-sm">Una copia JSON guarda vocabulario, respuestas pendientes y estadísticas. Podrás restaurarla en otro dispositivo manualmente.</p><button class="btn" data-action="export">Descargar copia de seguridad</button></div>`;
}
function showToast(message){const old=document.getElementById('noticeToast');if(old)old.remove();const node=document.createElement('div');node.id='noticeToast';node.textContent=message;node.setAttribute('role','status');node.style.cssText='position:fixed;z-index:20;bottom:85px;left:50%;transform:translateX(-50%);max-width:95%;padding:13px 19px;border-radius:13px;color:white;background:#17294b;box-shadow:0 5px 20px #0003;font-size:13px';document.body.appendChild(node);setTimeout(()=>node.remove(),4300);}
function exportData(){const backup={app:'Deutsch Trainer B2+',format:'backup',version:1,exportedAt:new Date().toISOString(),data:state};const file=new Blob([JSON.stringify(backup,null,2)],{type:'application/json'});const url=URL.createObjectURL(file);const link=document.createElement('a');link.href=url;link.download='deutsch-trainer-copia-'+new Date().toISOString().slice(0,10)+'.json';document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);showToast('Copia descargada. Guárdala en Archivos.');}
function isStr(v){return typeof v==='string'&&v.trim()!==''&&v.length<1000;}
function validRecord(r){if(!r||typeof r!=='object'||!['verb','noun','connector','preposition','pending'].includes(r.type)||!isStr(r.de)||!isStr(r.es))return false;
 if(r.type==='verb')return isStr(r.infinitive)&&Array.isArray(r.present)&&r.present.length===6&&r.present.every(isStr)&&['Sí','No'].includes(r.reflexive)&&['haben','sein'].includes(r.auxiliary)&&isStr(r.participle)&&isStr(r.preposition)&&isStr(r.case);
 if(r.type==='noun')return isStr(r.singular)&&['m','f','n'].includes(r.gender)&&['plural','genitive','dativePlural','adjective'].every(f=>isStr(r[f]));
 if(r.type==='connector')return isStr(r.sentence)&&r.sentence.includes('___')&&isStr(r.answer);
 if(r.type==='preposition')return isStr(r.sentence)&&r.sentence.includes('___')&&isStr(r.preposition)&&['Akkusativ','Dativ','Genitiv'].includes(r.case);
 return true;
}
function addRecords(list){let added=0,skipped=0;list.forEach((x,i)=>{if(!validRecord(x)){skipped++;return;}if(state.bank.some(item=>item.type===x.type&&normalize(item.de)===normalize(x.de)&&normalize(item.es)===normalize(x.es))){skipped++;return;}const type=x.type;const item={...x,id:'import_'+Date.now()+'_'+i,source:x.source||'Archivo importado'};state.bank.push(item);added++;});save();renderWords();showToast(`${added} fichas añadidas. ${skipped} omitidas o duplicadas.`);}
async function importFile(file){if(!file)return;try{if(file.size>3_000_000)throw Error('El archivo supera 3 MB.');const parsed=JSON.parse(await file.text());if(parsed?.format==='backup'&&parsed?.data){if(!Array.isArray(parsed.data.bank)||!parsed.data.bank.every(validRecord)||!Array.isArray(parsed.data.history))throw Error('Copia no válida.');if(!window.confirm('¿Restaurar esta copia? Sustituirá el vocabulario y los resultados actuales de ESTE dispositivo.'))return;state={...freshState(),...parsed.data};save();renderWords();showToast('Copia restaurada correctamente.');return;}
 const list=Array.isArray(parsed)?parsed:parsed?.items;if(!Array.isArray(list))throw Error('Formato incompatible. Usa una lista de fichas o {"items":[...]}');addRecords(list);
 }catch(err){showToast('No se pudo importar: '+err.message);}finally{const input=document.getElementById('fileImport');if(input)input.value='';}}
function updateStatus(){const online=navigator.onLine;const lbl=document.getElementById('connectionLabel');const dot=document.getElementById('connectionDot');dot.classList.toggle('off',!online);lbl.textContent=online?'En línea':'Sin internet';}
/* Delegación de eventos: escribir nunca vuelve a dibujar campos anteriores. */
document.addEventListener('input',ev=>{
 if(ev.target.dataset.key&&currentModule){const item=currentItem(currentModule);if(item){const key=qid(item);state.drafts[key]??={};state.drafts[key][ev.target.dataset.key]=ev.target.value;save();}}
 if(ev.target.id==='wordSearch'){wordQuery=ev.target.value;const list=state.bank.filter(i=>`${i.de} ${i.es} ${i.source||''}`.toLocaleLowerCase().includes(wordQuery.toLocaleLowerCase()));document.getElementById('wordResults').innerHTML=list.map(wordHTML).join('')||'<div class="empty">Sin resultados.</div>';}
});
document.addEventListener('change',ev=>{if(ev.target.dataset.key&&currentModule){const item=currentItem(currentModule);if(item){const key=qid(item);state.drafts[key]??={};state.drafts[key][ev.target.dataset.key]=ev.target.value;save();}}if(ev.target.id==='fileImport')importFile(ev.target.files?.[0]);});
document.addEventListener('submit',ev=>{if(ev.target.id==='addWord'){ev.preventDefault();const fd=new FormData(ev.target);const de=String(fd.get('de')||'').trim();const es=String(fd.get('es')||'').trim();if(!de||!es)return;addRecords([{type:'pending',de,es,source:'Anotada por mí'}]);}});
/* Navegación fiable: Tab, Mayús+Tab, Intro y botones →. Nunca se redibuja mientras escribes. */
function focusAdjacentField(origin, direction){
 const fields=Array.from(main.querySelectorAll('input[data-key]:not([readonly]):not([disabled]),select[data-key]:not([disabled])'));
 const index=fields.indexOf(origin);
 if(index<0)return false;
 const target=fields[index+direction];
 if(target){target.focus();target.scrollIntoView({block:'nearest'});return true;}
 if(direction===1){const checkBtn=main.querySelector('[data-action="check"]');if(checkBtn){checkBtn.focus();checkBtn.scrollIntoView({block:'nearest'});return true;}}
 return false;
}
document.addEventListener('keydown',ev=>{
 if(!currentModule||!ev.target.matches('input[data-key],select[data-key]')||ev.isComposing)return;
 if(ev.key==='Tab'){
  if(focusAdjacentField(ev.target,ev.shiftKey?-1:1))ev.preventDefault();
 }else if(ev.key==='Enter'&&ev.target.matches('input[data-key]')){
  if(focusAdjacentField(ev.target,1))ev.preventDefault();
 }
});
document.addEventListener('click',ev=>{const advance=ev.target.closest('[data-focus-next]');if(advance){const origin=Array.from(main.querySelectorAll('[data-key]')).find(field=>field.dataset.key===advance.dataset.focusNext);if(origin)focusAdjacentField(origin,1);return;}const nav=ev.target.closest('[data-nav]');if(nav){setView(nav.dataset.nav);return;}if(ev.target.closest('#brand')){setView('home');return;}const mod=ev.target.closest('[data-module]');if(mod){setView('practice',mod.dataset.module);return;}const rm=ev.target.closest('[data-remove]');if(rm){const id=rm.dataset.remove;const item=state.bank.find(i=>i.id===id);if(item?.type==='pending'&&confirm(`¿Eliminar ${item.de} de tus palabras pendientes?`)){state.bank=state.bank.filter(i=>i.id!==id);save();renderWords();}return;}const a=ev.target.closest('[data-action]');if(!a)return;switch(a.dataset.action){case 'open-modules':setView('practice');break;case 'words':setView('words');break;case 'check':handleCheck();break;case 'next':nextQuestion();break;case 'retry':retryQuestion();break;case 'export':exportData();break;}});
window.addEventListener('online',updateStatus);window.addEventListener('offline',updateStatus);
updateStatus();render();
if('serviceWorker' in navigator&&location.protocol==='https:'||('serviceWorker' in navigator&&location.hostname==='localhost')){
 window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(err=>console.info('No se pudo registrar el modo sin conexión:',err)));
}
