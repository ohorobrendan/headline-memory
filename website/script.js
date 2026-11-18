'use strict';
const $ = (s) => document.querySelector(s);
const app = $('#app');
const cfg = window.STUDY_CONFIG;
const stories = window.STORIES;
const STORE = 'between-lines-session-v1';
let state = null;
let previousTick = performance.now();
let lastStored = 0;
let timer = null;
let hiddenAt = null;
const esc = (s) => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const shuffle = (arr) => { const a = [...arr]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
function random(){ const a=new Uint32Array(1); crypto.getRandomValues(a); return a[0]/4294967296; }
function newId(){ return 'bl-'+crypto.randomUUID(); }
function save(){ if(!state)return; try{sessionStorage.setItem(STORE,JSON.stringify(state));}catch{} }
function stored(){try{const s=JSON.parse(sessionStorage.getItem(STORE));return s?.version===cfg.version&&Array.isArray(s.order)&&s.order.length===3?s:null;}catch{return null;} }
function clearSaved(){try{sessionStorage.removeItem(STORE);}catch{} }
function show(html, active=false){
  if(timer){clearInterval(timer);timer=null;}
  app.innerHTML=html;
  $('#exit').hidden=!active;
  $('.edition').hidden=active;
  app.focus({preventScroll:true}); window.scrollTo(0,0);
  previousTick=performance.now();
}
function screen(html){return `<section class="screen"><div class="narrow">${html}</div></section>`;}
function progress(step, amount){return `<div class="study-progress"><span class="${step===1?'active':''}">01 Read</span><div class="progress-track"><i style="width:${step>1?100:amount}%"></i></div><span class="${step===2?'active':''}">02 Reset</span><div class="progress-track"><i style="width:${step>2?100:step===2?amount:0}%"></i></div><span class="${step===3?'active':''}">03 Recall</span><div class="progress-track"><i style="width:${step===4?100:step===3?amount:0}%"></i></div><span class="${step===4?'active':''}">04 Reflect</span></div>`;}
function home(){
  state=null;
  const pending=stored();
  show(`<section class="home-hero"><div><p class="eyebrow">A SMALL EXPERIMENT IN WHAT WE REMEMBER</p><h1>There’s more<br>between<br>the <em>lines.</em></h1><p class="hero-copy">Three real stories. A short pause. A test of what stayed with you. Explore how we remember the news we read.</p><button class="button" id="begin">Enter the reading room <span class="arrow">↗</span></button><div class="hero-notes micro"><span>About 6–8 minutes</span><span>No names or emails</span></div></div><div class="editorial" aria-hidden="true"><div class="news-paper"><div class="paper-top"><span>THE DAILY DETAIL</span><span>No. 001</span></div><div class="paper-title">You read<br>the <span>story.</span><br>What stays?</div><div class="paper-lines"></div><div class="paper-lines short"></div></div><div class="memory-note"><b>A little reading.<br>A little remembering.</b>The details have a story, too.</div><span class="editorial-index">FIG. 01 / THE SPACE BETWEEN READING & RECALL</span></div></section><section class="home-bottom"><div class="section-rule"><span>YOUR READING ROOM, IN THREE PARTS</span><span>01—03</span></div><div class="steps"><div class="step"><span class="step-number">01</span><div><h3>Read the stories</h3><p>Take in each headline, then read the short article underneath it at your own pace.</p></div></div><div class="step"><span class="step-number">02</span><div><h3>Change your focus</h3><p>A one-minute number task gives you a brief break before the memory questions.</p></div></div><div class="step"><span class="step-number">03</span><div><h3>See what stayed</h3><p>Answer nine questions, then explore your results and the sources behind the stories.</p></div></div></div><div class="home-utility"><span class="micro">An interactive classroom project in memory & cognition.</span><button class="text-button" id="research">Researcher workspace ↗</button></div>${pending?`<div class="note"><strong>${pending.phase==='results'?'A completed session is available.':'You have an unfinished session in this tab.'}</strong><div class="actions"><button id="resume" class="button secondary">${pending.phase==='results'?'View saved results':'Resume session'}</button><button id="discard" class="text-button">Clear saved session</button></div></div>`:''}</section>`);
  $('#begin').onclick=()=>{
    if(pending){$('#begin').disabled=true;$('#begin').textContent='Resume or clear the saved session below';$('#resume').focus();return;}
    consent();
  };
  $('#research').onclick=researchGate;
  if(pending){$('#resume').onclick=()=>{state=pending;state.resumed=true;state.tabHiddenMs+=0;renderPhase();};$('#discard').onclick=()=>{clearSaved();home();};}
}
function consent(){
 show(screen(`<p class="eyebrow">BEFORE YOU BEGIN</p><h1>A few details<br>for the reading room.</h1><p class="lede">You’ll read three short news adaptations, complete a one-minute number task, and answer questions from memory.</p><div class="card"><h3>Taking part is your choice.</h3><ul class="consent-list"><li>Answer on your own, without notes, screenshots, or reopening articles. You can leave whenever you want.</li><li>We record an anonymous session ID, your answers, confidence, reading times, task responses, and time away from the tab.</li><li>No name or email is requested. Research-credit information should be collected separately.</li><li>${cfg.dataPipeExperimentId?'If you finish, your anonymous responses can be submitted to the class study through DataPipe.':'This version is in local demo mode. Your session stays in this browser tab unless you download and share it. No study responses are uploaded.'}</li><li>Article text is shortened and paraphrased for this classroom task. Original reports and research will be available after the quiz.</li></ul></div><label class="check"><input id="agree" type="checkbox"><span>I have read this information and choose to take part.</span></label><div class="actions"><button class="button" id="start" disabled>Start reading <span class="arrow">→</span></button><button class="text-button" id="back">Back to start</button></div>`));
 $('#agree').onchange=e=>$('#start').disabled=!e.target.checked;
 $('#back').onclick=home;
 $('#start').onclick=startSession;
}
function startSession(){
 const order=shuffle(stories.map(s=>s.id));
 state={version:cfg.version,id:newId(),condition:random()<.5?'original':'precise',startedAt:new Date().toISOString(),completedAt:null,phase:'reading',order,rIndex:0,articleShown:false,stageActiveMs:0,reading:{},questions:shuffle(stories.flatMap(s=>s.questions.map(q=>({storyId:s.id,id:q.id,optionOrder:shuffle(q.options.map(o=>o.id))})))),qIndex:0,answers:[],selected:null,confidence:null,questionActiveMs:0,distractorActiveMs:0,distractorResponses:[],problem:null,tabHiddenMs:0,hiddenCount:0,resumed:false,uploadStatus:'not_sent'};
 save();reading();
}
function currentStory(){return stories.find(s=>s.id===state.order[state.rIndex]);}
function reading(){
 const story=currentStory();
 if(!state.reading[story.id])state.reading[story.id]={headlineMs:0,articleMs:0,position:state.rIndex+1};
 const head=state.condition==='original'?story.originalHeadline:story.preciseHeadline;
 show(`<section class="screen">${progress(1,(state.rIndex+(state.articleShown?.5:0))/3*100)}<div class="article-shell"><aside class="article-aside"><strong>0${state.rIndex+1}</strong><p>STORY ${state.rIndex+1} OF 3<br>${esc(story.topic)}</p><p class="aside-extra">Read at your own pace.<br>Move forward when<br>you’re ready.</p></aside><article><div class="article-header"><div class="article-kicker">${story.kicker}</div><h1 class="article-title">${esc(head)}</h1><div class="byline">${esc(story.publisher)} <span class="divider">/</span> ${esc(story.date)}</div></div>${state.articleShown?`<div class="article-body">${story.paragraphs.map(p=>`<p>${esc(p)}</p>`).join('')}</div><p class="adapted">Adapted news brief · Condensed and paraphrased from the report and source research. Original sources follow the memory quiz.</p><div class="actions"><button id="read-next" class="button" disabled>${state.rIndex===2?'Finish reading':'Next story'} <span class="arrow">→</span></button><span class="wait-hint" id="read-wait" aria-live="polite"></span></div>`:`<div class="article-gate"><p>Take a moment with the headline.<br>The story continues below.</p><button id="reveal" class="button secondary" disabled>Read the article <span class="arrow">↓</span></button><p class="wait-hint" id="read-wait" aria-live="polite"></p></div>`}</article></div></section>`,true);
 const button=state.articleShown?$('#read-next'):$('#reveal');
 button.onclick=()=>{
  if(button.disabled)return;
  if(!state.articleShown){state.articleShown=true;state.stageActiveMs=0;save();reading();}
  else if(state.rIndex<2){state.rIndex++;state.articleShown=false;state.stageActiveMs=0;save();reading();}
  else{state.phase='distractor-intro';save();renderPhase();}
 };
 const update=()=>{
  const minimum=(state.articleShown?cfg.articleMinimumSeconds:cfg.headlineMinimumSeconds)*1000;
  const remain=Math.max(0,Math.ceil((minimum-state.stageActiveMs)/1000));
  button.disabled=remain>0;
  $('#read-wait').textContent=remain?`${state.articleShown?'Continue available':'Article available'} in ${remain}s`:'Continue whenever you’re ready.';
 };
 update();timer=setInterval(()=>{const dt=tick();state.stageActiveMs+=dt;state.reading[story.id][state.articleShown?'articleMs':'headlineMs']+=dt;update();periodicSave();},200);
}
function tick(){const now=performance.now(),dt=Math.min(now-previousTick,1500);previousTick=now;return document.hidden||$('#exit-dialog').open?0:dt;}
function periodicSave(){if(performance.now()-lastStored>1000){save();lastStored=performance.now();}}
function distractorIntro(){
 show(screen(`${progress(2,0)}<p class="eyebrow">A CHANGE OF PACE</p><h1>Give the stories<br>a little space.</h1><p class="lede">For the next ${cfg.distractorSeconds} seconds, solve simple subtraction problems. Try to be accurate; this part is not included in your memory score.</p><div class="card"><h3>Keep this tab open and active.</h3><p>The timer pauses when the tab is hidden. When the minute is up, you’ll move on to the memory questions.</p></div><button id="begin-reset" class="button">Start the one-minute task <span class="arrow">→</span></button>`),true);
 $('#begin-reset').onclick=()=>{state.phase='distractor';makeProblem();save();distractor();};
}
function makeProblem(){const a=35+Math.floor(random()*60),b=3+Math.floor(random()*17);state.problem={a,b,activeStart:state.distractorActiveMs};}
function distractor(){
 if(!state.problem)makeProblem();
 show(screen(`${progress(2,state.distractorActiveMs/(cfg.distractorSeconds*10))}<p class="eyebrow">THE ONE-MINUTE RESET</p><h1>A quick numbers break.</h1><div class="timer-layout"><div class="timer" id="seconds" aria-label="Seconds remaining"></div><div><p class="micro">SOLVE THE SUBTRACTION</p><div class="equation" id="equation"></div><form id="number-form"><label class="sr-only" for="number-answer">Your answer</label><input id="number-answer" class="number-input" type="number" inputmode="numeric" autocomplete="off" required><div class="actions"><button class="button secondary" type="submit">Submit answer <span class="arrow">→</span></button></div></form><p class="task-feedback" id="task-feedback" aria-live="polite"></p></div></div><p class="micro">Work steadily. The memory questions begin when the timer ends.</p>`),true);
 const updateProblem=()=>{$('#equation').textContent=`${state.problem.a} − ${state.problem.b} = ?`;$('#number-answer').value='';};updateProblem();
 $('#number-form').onsubmit=e=>{
  e.preventDefault();const value=$('#number-answer').value;if(!value||!Number.isFinite(Number(value)))return;
  const p=state.problem,correct=Number(value)===p.a-p.b;
  state.distractorResponses.push({a:p.a,b:p.b,response:Number(value),correct,rtMs:Math.round(state.distractorActiveMs-p.activeStart)});
  $('#task-feedback').textContent=correct?'Correct. Here’s the next one.':'Keep going. Try the next one.';makeProblem();updateProblem();save();$('#number-answer').focus();
 };
 const update=()=>{$('#seconds').textContent=Math.max(0,Math.ceil(cfg.distractorSeconds-state.distractorActiveMs/1000));};update();
 timer=setInterval(()=>{state.distractorActiveMs+=tick();update();periodicSave();if(state.distractorActiveMs>=cfg.distractorSeconds*1000){state.phase='quiz-intro';save();renderPhase();}},200);
}
function quizIntro(){
 show(screen(`${progress(3,0)}<p class="eyebrow">FROM HERE, IT’S MEMORY</p><h1>What stayed<br>with you?</h1><p class="lede">Answer nine questions about the stories you read. Choose the best answer based on what the article reported, and tell us how confident you feel.</p><div class="note">Please do not go back to the articles or use notes. “I do not remember” is always an option. Answers and explanations appear after all nine questions.</div><div class="actions"><button class="button" id="begin-quiz">Begin memory questions <span class="arrow">→</span></button></div>`),true);
 $('#begin-quiz').onclick=()=>{state.phase='quiz';state.questionActiveMs=0;save();quiz();};
}
function getQuestion(item){return stories.find(s=>s.id===item.storyId).questions.find(q=>q.id===item.id);}
function quiz(){
 const item=state.questions[state.qIndex],q=getQuestion(item),story=stories.find(s=>s.id===item.storyId);
 show(screen(`${progress(3,state.qIndex/9*100)}<div class="question-top"><span>QUESTION ${String(state.qIndex+1).padStart(2,'0')} / 09</span><span>${esc(story.topic)}</span></div><h1>${esc(q.text)}</h1><div class="options" role="group" aria-label="Answer choices">${item.optionOrder.map((id,i)=>{const o=q.options.find(o=>o.id===id);return `<button class="option ${state.selected===id?'selected':''}" data-option="${id}" aria-pressed="${state.selected===id}"><span class="option-letter">${String.fromCharCode(65+i)}</span><span>${esc(o.text)}</span></button>`;}).join('')}</div><div class="confidence"><p>How confident are you in your answer?</p><div class="confidence-buttons" role="group" aria-label="Answer confidence">${[25,50,75,100].map(n=>`<button data-confidence="${n}" class="${state.confidence===n?'selected':''}" aria-pressed="${state.confidence===n}">${n}%${n===25?' · guessing':n===100?' · very sure':''}</button>`).join('')}</div></div><div class="actions"><button class="button" id="answer-next" ${state.selected&&state.confidence?'':'disabled'}>${state.qIndex===8?'Finish & see results':'Save & continue'} <span class="arrow">→</span></button><span class="micro">Choose an answer and confidence level.</span></div>`),true);
 const update=()=>{$('#answer-next').disabled=!(state.selected&&state.confidence);};
 document.querySelectorAll('[data-option]').forEach(b=>b.onclick=()=>{state.selected=b.dataset.option;document.querySelectorAll('[data-option]').forEach(el=>{el.classList.toggle('selected',el===b);el.setAttribute('aria-pressed',el===b);});update();save();});
 document.querySelectorAll('[data-confidence]').forEach(b=>b.onclick=()=>{state.confidence=Number(b.dataset.confidence);document.querySelectorAll('[data-confidence]').forEach(el=>{el.classList.toggle('selected',el===b);el.setAttribute('aria-pressed',el===b);});update();save();});
 $('#answer-next').onclick=()=>{
  if(!state.selected||!state.confidence)return;
  state.answers.push({storyId:item.storyId,questionId:q.id,type:q.type,answer:state.selected,confidence:state.confidence,correct:state.selected==='fact',lure:q.type==='target'&&state.selected==='lure',rtMs:Math.round(state.questionActiveMs),position:state.qIndex+1,optionOrder:item.optionOrder});
  state.selected=null;state.confidence=null;state.questionActiveMs=0;
  if(state.qIndex<8){state.qIndex++;save();quiz();}else{state.phase='results';state.completedAt=new Date().toISOString();save();results();}
 };
 timer=setInterval(()=>{state.questionActiveMs+=tick();periodicSave();},200);
}
function metrics(){const a=state.answers,t=a.filter(x=>x.type==='target'),d=a.filter(x=>x.type==='detail');return{correct:a.filter(x=>x.correct).length,targetCorrect:t.filter(x=>x.correct).length,detailCorrect:d.filter(x=>x.correct).length,lures:t.filter(x=>x.lure).length,confidence:Math.round(a.reduce((n,x)=>n+x.confidence,0)/a.length)};}
function bar(label,value,max,orange=false){return `<div class="chart-row"><span>${esc(label)}</span><div class="bar-track"><div class="bar-fill ${orange?'orange':''}" style="width:${Math.max(0,Math.min(100,value/max*100))}%"></div></div><strong>${value}/${max}</strong></div>`;}
function results(){
 const m=metrics();
 show(screen(`${progress(4,100)}<p class="eyebrow">YOUR READING ROOM, REVISITED</p><h1>The story you remembered.</h1><div class="results-banner"><div><div class="big-score">${m.correct}<small>/9</small></div><span class="score-label">Article-based answers</span></div><p class="lede">${m.correct===9?'Every answer matched the article details.':m.correct>=6?'Many of the details stayed with you. Now take a look at the ones that shifted.':'Some details were harder to retrieve. Let’s look at what the stories actually said.'}</p></div><div class="chart" aria-label="Memory results">${bar('All article-based answers',m.correct,9)}${bar('Headline-sensitive items',m.targetCorrect,6)}${bar('Other article details',m.detailCorrect,3)}${bar('Headline-consistent errors',m.lures,6,true)}</div><div class="note"><strong>What was this testing?</strong> You were randomly shown ${state.condition==='original'?'the original published headlines':'more precise headlines written for this experiment'}. Another group sees ${state.condition==='original'?'the more precise versions':'the original published versions'} above the same article text. A headline can suggest an interpretation that the story does not establish.<br><br>Your ${m.lures} headline-consistent ${m.lures===1?'error is':'errors are'} a description of your answers, not proof that a headline caused a false memory. Comparing groups can help test whether the headline condition changes responses.</div><h2>Go back to the details.</h2><p class="micro">Open each story for your answers, the evidence, and the original sources.</p>${state.order.map(id=>reviewStory(stories.find(s=>s.id===id))).join('')}<h2>Take your results with you.</h2><p class="micro">The response file contains nine question rows. The summary file contains one session row. No names or emails are included.</p><div class="result-tools"><button class="button" id="download-trials">Download responses (.csv) <span>↓</span></button><button class="button secondary" id="download-summary">Download summary (.csv) <span>↓</span></button></div><div class="card"><h3>Study data</h3><p id="upload-status" class="status" aria-live="polite"></p>${cfg.dataPipeExperimentId?'<button class="button secondary" id="upload">Submit anonymous responses</button>':''}<p class="micro">Session: ${esc(state.id)}</p></div><div class="note">These historical stories were selected to illustrate gaps between headlines and evidence. They are not recommendations about drinking alcohol or coffee. The briefs are condensed adaptations, rather than full publisher articles.</div><div class="actions"><button id="restart" class="button secondary">Finish session</button><button id="research-result" class="text-button">Researcher workspace ↗</button></div>`));
 $('#download-trials').onclick=()=>download(csv(trialRows()),`${state.id}-responses.csv`);
 $('#download-summary').onclick=()=>download(csv([summaryRow()]),`${state.id}-summary.csv`);
 $('#restart').onclick=()=>{clearSaved();home();};
 $('#research-result').onclick=()=>researcher();
 if($('#upload'))$('#upload').onclick=uploadData;
 updateUploadStatus();
}
function reviewStory(story){
 const a=state.answers.filter(a=>a.storyId===story.id),correct=a.filter(a=>a.correct).length;
 return `<details class="review"><summary><span>${esc(story.topic)}</span><span class="badge ${correct<3?'error':''}">${correct}/3 ARTICLE-BASED</span></summary><div class="review-content"><p><b>Headline you saw:</b> ${esc(state.condition==='original'?story.originalHeadline:story.preciseHeadline)}</p><p><b>Article takeaway:</b> ${esc(story.takeaway)}</p>${a.map(a=>{const q=story.questions.find(q=>q.id===a.questionId);return `<div class="answer-review"><b>${esc(q.text)}</b><p>Your answer: ${esc(q.options.find(o=>o.id===a.answer).text)} <span class="badge ${a.correct?'':'error'}">${a.correct?'CORRECT':a.lure?'HEADLINE-CONSISTENT ERROR':'OTHER RESPONSE'}</span></p><p>Article-based answer: ${esc(q.options.find(o=>o.id==='fact').text)}</p><p>${esc(q.explanation)} Your confidence: ${a.confidence}%.</p></div>`;}).join('')}<details><summary>Read the adapted brief again</summary>${story.paragraphs.map(p=>`<p>${esc(p)}</p>`).join('')}</details><div class="source-links">${story.sources.map(s=>`<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.label)} ↗</a>`).join('')}</div></div></details>`;
}
function trialRows(){return state.answers.map(a=>{const story=stories.find(s=>s.id===a.storyId),q=story.questions.find(q=>q.id===a.questionId),reading=state.reading[a.storyId];return{session_id:state.id,version:state.version,started_at:state.startedAt,completed_at:state.completedAt,condition:state.condition,story_id:a.storyId,story_position:reading.position,question_id:a.questionId,question_type:a.type,question_position:a.position,selected_option:a.answer,selected_text:q.options.find(o=>o.id===a.answer).text,correct_option:'fact',correct:Number(a.correct),headline_lure:Number(a.lure),confidence_pct:a.confidence,response_active_ms:a.rtMs,headline_active_ms:Math.round(reading.headlineMs),article_active_ms:Math.round(reading.articleMs),option_order:a.optionOrder.join('|'),story_order:state.order.join('|'),distractor_active_ms:Math.round(state.distractorActiveMs),distractor_attempts:state.distractorResponses.length,distractor_correct:state.distractorResponses.filter(x=>x.correct).length,tab_hidden_ms:Math.round(state.tabHiddenMs),tab_hidden_count:state.hiddenCount,resumed:Number(state.resumed)};});}
function summaryRow(){const m=metrics();return{session_id:state.id,version:state.version,condition:state.condition,started_at:state.startedAt,completed_at:state.completedAt,correct_total:m.correct,total_questions:9,target_correct:m.targetCorrect,target_total:6,headline_lures:m.lures,detail_correct:m.detailCorrect,detail_total:3,mean_confidence_pct:m.confidence,story_order:state.order.join('|'),distractor_active_ms:Math.round(state.distractorActiveMs),distractor_attempts:state.distractorResponses.length,distractor_correct:state.distractorResponses.filter(x=>x.correct).length,tab_hidden_ms:Math.round(state.tabHiddenMs),tab_hidden_count:state.hiddenCount,resumed:Number(state.resumed)};}
function csv(rows){const keys=Object.keys(rows[0]);const cell=v=>'"'+String(v??'').replace(/"/g,'""')+'"';return keys.map(cell).join(',')+'\r\n'+rows.map(r=>keys.map(k=>cell(r[k])).join(',')).join('\r\n')+'\r\n';}
function download(data,name){const u=URL.createObjectURL(new Blob([data],{type:'text/csv;charset=utf-8;'})),a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}
function updateUploadStatus(){
 if(!$('#upload-status'))return;
 const messages={not_sent:cfg.dataPipeExperimentId?'Ready to submit. You can also keep a CSV copy.':'Local demo mode: no study responses have been uploaded. Add your class DataPipe experiment ID in config.js to enable collection.',sending:'Submitting your anonymous responses…',sent:'DataPipe confirmed that your responses were stored.',queued:'DataPipe accepted your responses and queued delivery. Do not submit again.',uncertain:'We could not confirm the upload. Keep your CSV and ask the researcher to check DataPipe before trying again.',rejected:'DataPipe rejected the submission. Keep a CSV copy and contact the researcher.'};
 $('#upload-status').textContent=messages[state.uploadStatus]||messages.not_sent;
 const b=$('#upload');if(b){b.disabled=state.uploadStatus!=='not_sent';b.textContent=['sent','queued'].includes(state.uploadStatus)?'Submission accepted':state.uploadStatus==='sending'?'Submitting…':'Submit anonymous responses';}
}
async function uploadData(){
 if(!cfg.dataPipeExperimentId||state.uploadStatus!=='not_sent')return;
 state.uploadStatus='sending';save();updateUploadStatus();
 try{
  const res=await fetch('https://pipe.jspsych.org/api/data/',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({experimentID:cfg.dataPipeExperimentId,filename:state.id+'-responses.csv',data:csv(trialRows())}),signal:AbortSignal.timeout(60000)});
  // 202 is accepted and queued: never resubmit. A network/5xx failure is ambiguous.
  if(res.status===202)state.uploadStatus='queued';
  else if(res.status===201)state.uploadStatus='sent';
  else if(res.status>=400&&res.status<500)state.uploadStatus='rejected';
  else state.uploadStatus='uncertain';
 }catch{state.uploadStatus='uncertain';}
 save();updateUploadStatus();
}
function researchGate(){
 show(screen(`<p class="eyebrow">FOR THE PROJECT TEAM</p><h1>Researcher workspace.</h1><p class="lede">This space reveals the headline conditions, questions, and correct answers. If you plan to take part, complete the reading task first.</p><div class="actions"><button class="button" id="open-research">Open researcher materials <span class="arrow">→</span></button><button class="button secondary" id="return-home">Back to the reading room</button></div>`));
 $('#open-research').onclick=researcher;$('#return-home').onclick=home;
}
function researcher(){
 show(screen(`<div class="research-header"><div><p class="eyebrow">STUDY DESIGN & RESULTS</p><h1>Behind the lines.</h1></div><button id="research-home" class="button secondary">Back to start</button></div><p class="lede">A browser-based classroom pilot testing whether headline framing changes later article-based answers.</p><div class="research-grid"><div class="card"><h3>The comparison</h3><p>Each session has a 50/50 chance of receiving all original headlines or all precise headlines. Both groups read identical adapted briefs. Story order, question order, and option order are randomized.</p></div><div class="card"><h3>The measures</h3><p>Primary: headline-consistent errors out of six target questions. Secondary: target accuracy, three detail questions, confidence, and active reading/response time. The six lures are plausible inferences, not necessarily literal headline statements.</p></div></div><h2>One flow. Two headline conditions.</h2><p class="micro">Consent → 3 headlines & briefs → 60-second number task → 9 memory questions → feedback & sources.</p><div class="note"><strong>Interpretation matters.</strong> This task measures recognition after a short delay. Errors may reflect inference, guessing, comprehension, or memory. A single score does not establish a false memory. The original-versus-precise contrast also varies headline length and content; it does not isolate misinformation as the only mechanism. With three science stories, generalization is limited.</div><h2>Combine your participant CSVs.</h2><p class="micro">Import response files, not summary files. Processing happens in your browser. Only complete, compatible nine-question sessions are included; duplicates are ignored.</p><label class="upload">Choose one or more response CSV files<input type="file" id="csv-import" accept=".csv,text/csv" multiple></label><div id="import-output" class="import-results"><p class="empty">No participant data loaded. Results will appear here after import.</p></div><h2>Stories & answer key.</h2><p class="micro">Original headlines are quoted from published coverage. Precise alternatives were written for this experiment. Every brief is an original, shortened paraphrase combining the report and source research, rather than the full original article.</p>${stories.map(s=>`<details class="review"><summary><span>${esc(s.topic)}</span><span class="badge">3 QUESTIONS</span></summary><div class="review-content"><p><b>Published headline:</b> ${esc(s.originalHeadline)}</p><p><b>Precise alternative:</b> ${esc(s.preciseHeadline)}</p>${s.paragraphs.map(p=>`<p>${esc(p)}</p>`).join('')}<table class="source-table"><thead><tr><th>Question</th><th>Article answer</th><th>Headline-consistent lure</th></tr></thead><tbody>${s.questions.map(q=>`<tr><td>${esc(q.text)}<br><small>${q.type}</small></td><td>${esc(q.options.find(o=>o.id==='fact').text)}</td><td>${q.type==='target'?esc(q.options.find(o=>o.id==='lure').text):'— detail control'}</td></tr>`).join('')}</tbody></table><div class="source-links">${s.sources.map(x=>`<a href="${esc(x.url)}" target="_blank" rel="noopener noreferrer">${esc(x.label)} ↗</a>`).join('')}</div></div></details>`).join('')}<h2>Ready for GitHub Pages.</h2><div class="card"><h3>Same setup as your earlier GitHub experiment</h3><ol class="consent-list"><li>Create a new public repository, such as <b>headline-memory</b>, so the earlier encoding demo remains available.</li><li>Upload the files from the package’s <b>website</b> folder directly into the repository root. Keep their names unchanged.</li><li>Open Settings → Pages → Deploy from a branch → main → /(root), then save.</li><li>Add your teammates and <b>sonyper</b> as collaborators through Settings → Collaborators.</li><li>For the class study, add your approved DataPipe experiment ID in <b>config.js</b>, commit the change, then verify a pilot submission in the DataPipe dashboard.</li></ol><p>Current collection: <b>${cfg.dataPipeExperimentId?'DataPipe configured':'local demo only; DataPipe ID not configured'}</b>. Do not upload participant datasets to the public repository.</p></div><h2>Evidence & pilot plan.</h2><p class="micro">Ecker, Lewandowsky, Chang, & Pillai (2014), “The effects of subtle misinformation in news headlines,” Journal of Experimental Psychology: Applied, 20(4), 323–335. <a href="https://doi.org/10.1037/xap0000028" target="_blank" rel="noopener noreferrer">Research reference ↗</a></p><p class="micro">Predefine headline-lure rate as the primary outcome. Compare participant-level means across headline conditions, report group sizes and uncertainty, and inspect detail accuracy and reading times. Run a small usability pilot first. Repeated demos by the same person are not independent participants. Random assignment is probabilistic, so small group sizes can differ.</p><p class="micro">The handout calls for instructor-approved collection. Add the DataPipe ID and verify your class consent and recruitment wording before recruiting participants. The app includes no research-credit collection.</p><div class="actions"><button class="button secondary" id="research-bottom-home">Return to reading room</button></div>`));
 $('#research-home').onclick=home;$('#research-bottom-home').onclick=home;
 $('#csv-import').onchange=async e=>{
  const output=$('#import-output');output.textContent='Reading files…';
  try{const files=[...e.target.files];if(!files.length){output.textContent='No files selected.';return;}const texts=await Promise.all(files.map(f=>f.text()));renderImport(texts.flatMap(parseCSV),output);}
  catch{output.innerHTML='<p class="error-message">These files could not be read. Choose response CSVs exported by this app.</p>';}
 };
}
function parseCSV(text){
 const rows=[];let row=[],cell='',quoted=false;
 for(let i=0;i<text.length;i++){
  const c=text[i];if(c==='"'){if(quoted&&text[i+1]==='"'){cell+='"';i++;}else quoted=!quoted;}
  else if(c===','&&!quoted){row.push(cell);cell='';}
  else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&text[i+1]==='\n')i++;row.push(cell);if(row.some(x=>x!==''))rows.push(row);row=[];cell='';}
  else cell+=c;
 }
 if(quoted)throw Error('Unclosed CSV field');if(cell||row.length){row.push(cell);rows.push(row);}
 if(rows.length<2)throw Error('No data');const headers=rows.shift().map(x=>x.replace(/^\uFEFF/,''));
 if(!['session_id','question_id','selected_option','condition','version'].every(k=>headers.includes(k)))throw Error('Wrong schema');
 return rows.map(r=>Object.fromEntries(headers.map((h,i)=>[h,r[i]??''])));
}
function aggregateRows(rows){
 const groups=new Map(),expected=stories.flatMap(s=>s.questions.map(q=>q.id));let duplicates=0,conflicts=new Set();
 for(const r of rows){if(!r.session_id)continue;if(!groups.has(r.session_id))groups.set(r.session_id,new Map());const g=groups.get(r.session_id);if(g.has(r.question_id)){duplicates++;if(JSON.stringify(g.get(r.question_id))!==JSON.stringify(r))conflicts.add(r.session_id);}else g.set(r.question_id,r);}
 const included=[],excluded=[];
 for(const [id,g] of groups){const a=[...g.values()];if(conflicts.has(id)||a.length!==9||!expected.every(k=>g.has(k))||a.some(r=>r.version!==cfg.version||!r.completed_at||!['original','precise'].includes(r.condition)||r.condition!==a[0].condition)){excluded.push(id);continue;}
 let invalid=false;for(const r of a){const q=stories.flatMap(s=>s.questions).find(q=>q.id===r.question_id);if(!q.options.some(o=>o.id===r.selected_option)||!Number.isFinite(Number(r.confidence_pct))||![25,50,75,100].includes(Number(r.confidence_pct))){invalid=true;break;}}
 if(invalid){excluded.push(id);continue;}
 const target=a.filter(r=>stories.flatMap(s=>s.questions).find(q=>q.id===r.question_id).type==='target'),detail=a.filter(r=>!target.includes(r));
 included.push({id,condition:a[0].condition,lureRate:target.filter(r=>r.selected_option==='lure').length/6,targetAccuracy:target.filter(r=>r.selected_option==='fact').length/6,detailAccuracy:detail.filter(r=>r.selected_option==='fact').length/3});
 }
 return {included,excluded,duplicates};
}
function renderImport(rows,out){
 const {included,excluded,duplicates}=aggregateRows(rows);
 if(!included.length){out.innerHTML=`<p class="error-message">No complete compatible sessions found. ${excluded.length} session(s) excluded. Import nine-row response files from version ${esc(cfg.version)}.</p>`;return;}
 const mean=(a,k)=>a.reduce((n,x)=>n+x[k],0)/a.length;
 out.innerHTML=`<p class="micro">${included.length} complete session(s) · ${duplicates} duplicate row(s) ignored · ${excluded.length} incompatible/incomplete session(s) excluded.</p><h3>Headline-consistent errors</h3><p class="micro">Mean participant error percentage across six target questions. Lower means fewer headline-consistent errors. All bars use 0–100%.</p>${['original','precise'].map(c=>{const a=included.filter(x=>x.condition===c);return `<div class="card"><div class="condition-title"><b>${c==='original'?'Original headlines':'Precise headlines'}</b><span>n = ${a.length}</span></div>${a.length?`<div class="chart-row"><span>Headline-lure rate</span><div class="bar-track"><div class="bar-fill ${c==='original'?'orange':''}" style="width:${mean(a,'lureRate')*100}%"></div></div><strong>${Math.round(mean(a,'lureRate')*100)}%</strong></div><p class="micro">Target accuracy: ${Math.round(mean(a,'targetAccuracy')*100)}% · Detail accuracy: ${Math.round(mean(a,'detailAccuracy')*100)}%</p>`:'<p class="micro">No complete sessions in this group yet.</p>'}</div>`;}).join('')}<p class="note">These are descriptive group means. A difference in a small pilot is not, by itself, reliable evidence of an effect. Use each participant as the unit of analysis and report uncertainty in your final report.</p>`;
}
function renderPhase(){
 if(state.uploadStatus==='sending')state.uploadStatus='uncertain';
 switch(state.phase){case'reading':reading();break;case'distractor-intro':distractorIntro();break;case'distractor':distractor();break;case'quiz-intro':quizIntro();break;case'quiz':quiz();break;case'results':results();break;default:clearSaved();home();}
}
$('#exit').onclick=async()=>{$('#exit-dialog').showModal();};
$('#exit-dialog').addEventListener('close',()=>{if($('#exit-dialog').returnValue==='leave'){save();home();}});
window.addEventListener('pagehide',save);
document.addEventListener('visibilitychange',()=>{
 previousTick=performance.now();
 if(!state||state.phase==='results')return;
 if(document.hidden){hiddenAt=Date.now();state.hiddenCount++;save();}
 else if(hiddenAt){state.tabHiddenMs+=Date.now()-hiddenAt;hiddenAt=null;save();}
});
home();
