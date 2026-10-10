'use strict';
let practiceSaved={sessions:{},results:{}};
try{const v=JSON.parse(localStorage.getItem('grammar-atlas-tests-v1')||'null');if(v&&v.sessions&&v.results)practiceSaved=v;}catch{}
function savePractice(){try{localStorage.setItem('grammar-atlas-tests-v1',JSON.stringify(practiceSaved));}catch{toast('Chưa lưu được bài test trong trình duyệt này.');}}
function topicSession(id){
 const bank=TOPIC_TESTS[id],s=practiceSaved.sessions[id];
 if(!s||!Array.isArray(s.ids)||!s.ids.length||!s.ids.every(qid=>bank.some(q=>q.id===qid))||!s.answers||!Number.isInteger(s.index)){
  practiceSaved.sessions[id]={ids:bank.map(q=>q.id),answers:{},index:0,submitted:false};
 }
 const result=practiceSaved.sessions[id];result.index=Math.min(Math.max(0,result.index),result.ids.length-1);return result;
}
function practiceQuestions(id,s){return s.ids.map(qid=>TOPIC_TESTS[id].find(q=>q.id===qid));}
function startTopicTest(id,ids){
 if(!TOPIC_TESTS[id])return;
 practiceSaved.sessions[id]={ids:ids||TOPIC_TESTS[id].map(q=>q.id),answers:{},index:0,submitted:false};savePractice();
 const hash='#/practice/'+id;if(location.hash===hash)renderTopicTest(id);else location.hash=hash;scrollTop();
}
function renderTestCatalog(levelId){
 const level=getLevel(levelId);state.level=level.id;nav('learn');
 const list=LESSONS.filter(l=>l.level===level.id),done=list.filter(l=>practiceSaved.results[l.id]).length;
 $('#main').innerHTML=`<div class="breadcrumbs">Grammar Atlas / Bài test theo chủ điểm / ${level.name}</div><div class="section-head"><div><div class="eyebrow">20 CÂU CHO MỖI CHỦ ĐIỂM</div><h2>Luyện chắc từng cấu trúc.</h2><p>${list.length} bài test · ${list.length*20} câu · ${done}/${list.length} bài đã nộp đầy đủ</p></div><a class="secondary" href="#/${level.id}">Về bài học</a></div><div class="test-level-links">${LEVELS.map(l=>`<a class="${l.id===level.id?'active':''}" href="#/tests/${l.id}">${l.name} · 10 bài</a>`).join('')}</div><div class="topic-test-grid">${list.map(l=>{const r=practiceSaved.results[l.id],s=practiceSaved.sessions[l.id],answered=s?Object.keys(s.answers||{}).length:0;return `<article class="topic-test-card"><span class="tag">${level.name} · 20 câu</span><h3>${esc(l.title)}</h3><p>${esc(l.vi)}</p><div class="topic-test-status">${r?`Lần nộp đầy đủ gần nhất: <strong>${r.score}/20</strong>`:'Chưa nộp bài đầy đủ'}${s&&!s.submitted&&answered?`<br>Đang làm: ${answered}/${s.ids.length} câu`:''}</div><a class="primary" href="#/practice/${l.id}">${s?'Mở bài test':'Bắt đầu làm bài'} →</a><a class="tiny" href="#/${l.level}/${l.id}">Ôn lý thuyết</a></article>`;}).join('')}</div><div class="level-note">Chọn một đáp án cho mỗi câu. Bài đang làm được lưu trong trình duyệt này. Bài tổng hợp 10 câu theo cấp độ vẫn có ở đầu trang bài học.</div>`;
}
function renderTopicTest(id){
 const l=getLesson(id);id=l.id;state.level=l.level;state.lesson=id;nav('learn');
 const s=topicSession(id),qs=practiceQuestions(id,s),q=qs[s.index];
 if(s.submitted){renderTopicResults(l,s,qs);return;}
 const count=qs.filter(x=>Number.isInteger(s.answers[x.id])).length,selected=s.answers[q.id];
 $('#main').innerHTML=`<div class="breadcrumbs">Grammar Atlas / ${getLevel(l.level).name} / Test ${esc(l.title)}</div><div class="topic-exam-layout"><section class="topic-exam-main"><div class="section-head"><div><span class="tag">${getLevel(l.level).name} · ${qs.length===20?'Bài test 20 câu':'Luyện lại câu sai'}</span><h2>${esc(l.title)}</h2><p>${esc(l.vi)} · ${count}/${qs.length} câu đã trả lời</p></div></div><div class="quiz-card"><div class="question-counter">Câu ${s.index+1}/${qs.length}</div><h3 class="topic-question">${esc(q.q).replace('___','<strong>_____</strong>')}</h3><fieldset class="topic-options"><legend class="screen-reader-only">Chọn một đáp án cho câu ${s.index+1}</legend>${q.options.map((o,i)=>`<label class="topic-option ${selected===i?'selected':''}"><input type="radio" name="topic-answer" value="${i}" data-topic-answer="${i}" ${selected===i?'checked':''}><span><b>${letters[i]}.</b> ${esc(o)}</span></label>`).join('')}</fieldset><div class="topic-exam-actions"><button class="secondary" id="practice-prev" ${s.index===0?'disabled':''}>← Câu trước</button><button class="${s.index===qs.length-1?'primary':'secondary'}" id="practice-next">${s.index===qs.length-1?'Nộp bài & chấm điểm':'Câu tiếp →'}</button></div><div class="small-note" role="status" id="practice-save-status">Đáp án được giữ khi chuyển câu. Nộp cả bài để xem lời giải.</div></div></section><aside class="practice-map"><h3>Phiếu trả lời</h3><div class="question-map">${qs.map((x,i)=>`<button data-practice-jump="${i}" class="${i===s.index?'current':''} ${Number.isInteger(s.answers[x.id])?'answered':''}" aria-label="Câu ${i+1}${Number.isInteger(s.answers[x.id])?', đã trả lời':''}" ${i===s.index?'aria-current="step"':''}>${i+1}</button>`).join('')}</div><p class="small-note">Ô xanh: đã trả lời. Chạm số câu để xem lại.</p><button class="primary" id="practice-submit">Nộp bài (${count}/${qs.length})</button><a class="secondary" href="#/tests/${l.level}">Danh sách bài test</a><a class="tiny" href="#/${l.level}/${l.id}">Ôn lại lý thuyết →</a></aside></div>`;
 document.querySelectorAll('[data-topic-answer]').forEach(input=>input.onchange=()=>{s.answers[q.id]=Number(input.value);savePractice();renderTopicTest(id);document.querySelector(`[data-topic-answer="${input.value}"]`)?.focus?.();});
 document.querySelectorAll('[data-practice-jump]').forEach(b=>b.onclick=()=>{s.index=Number(b.dataset.practiceJump);savePractice();renderTopicTest(id);scrollTop();});
 $('#practice-prev').onclick=()=>{if(s.index>0){s.index--;savePractice();renderTopicTest(id);scrollTop();}};
 $('#practice-next').onclick=()=>{if(s.index===qs.length-1)submitTopicTest(id);else{s.index++;savePractice();renderTopicTest(id);scrollTop();}};
 $('#practice-submit').onclick=()=>submitTopicTest(id);
}
function submitTopicTest(id){
 const s=topicSession(id),qs=practiceQuestions(id,s),missing=qs.findIndex(q=>!Number.isInteger(s.answers[q.id]));
 if(missing!==-1){s.index=missing;savePractice();renderTopicTest(id);scrollTop();toast('Còn câu '+(missing+1)+' chưa trả lời.');return;}
 s.submitted=true;s.at=new Date().toISOString();
 const score=qs.filter(q=>s.answers[q.id]===q.answer).length;
 if(qs.length===20){const previous=practiceSaved.results[id];practiceSaved.results[id]={score,total:20,at:s.at,first:previous?.first||{score,at:s.at},attempts:(previous?.attempts||0)+1};}
 savePractice();renderTopicTest(id);scrollTop();
}
function renderTopicResults(l,s,qs){
 const score=qs.filter(q=>s.answers[q.id]===q.answer).length,wrong=qs.filter(q=>s.answers[q.id]!==q.answer),r=practiceSaved.results[l.id];
 $('#main').innerHTML=`<div class="breadcrumbs">Grammar Atlas / ${getLevel(l.level).name} / Kết quả ${esc(l.title)}</div><div class="practice-results"><section class="wide-panel"><div class="test-results"><div class="eyebrow">${qs.length===20?'KẾT QUẢ BÀI TEST 20 CÂU':'KẾT QUẢ LUYỆN LẠI CÂU SAI'}</div><h2>${esc(l.title)}</h2><div class="score">${score}<span>/${qs.length}</span></div><p>${score===qs.length?'Bạn đã trả lời đúng tất cả câu trong lượt này.':`Có ${wrong.length} câu cần luyện lại. Xem lý do bên dưới rồi thử lại.`}</p>${qs.length===20&&r?`<p class="small-note">Điểm lần đầu: ${r.first.score}/20 · ${r.attempts} lượt nộp đầy đủ</p>`:''}<div class="result-actions">${wrong.length?'<button class="primary" id="practice-retry-wrong">Luyện lại '+wrong.length+' câu sai</button>':''}<button class="secondary" id="practice-retry-all">Làm lại 20 câu</button><a class="secondary" href="#/tests/${l.level}">Bài test khác →</a></div></div><div class="section-head"><div><h2>Đáp án & giải thích</h2><p>Cả ${qs.length} câu của lượt làm này.</p></div></div>${qs.map((q,i)=>{const ok=s.answers[q.id]===q.answer;return `<article class="practice-feedback ${ok?'correct':'wrong'}"><div class="question-counter">Câu ${i+1} · ${ok?'✓ Đúng':'↺ Cần xem lại'}</div><h3>${esc(q.q)}</h3><p>Bạn chọn <strong>${letters[s.answers[q.id]]}. ${esc(q.options[s.answers[q.id]])}</strong></p><p>Đáp án: <strong>${letters[q.answer]}. ${esc(q.options[q.answer])}</strong></p><div class="practice-explanation">${esc(q.explain)}</div></article>`;}).join('')}<div class="level-note">Điểm chỉ phản ánh lượt ôn này, không quy đổi thành CEFR hay band IELTS. <a href="#/${l.level}/${l.id}">Đọc lại bài học ${esc(l.title)}</a>.</div></section></div>`;
 if(wrong.length)$('#practice-retry-wrong').onclick=()=>startTopicTest(l.id,wrong.map(q=>q.id));
 $('#practice-retry-all').onclick=()=>startTopicTest(l.id);
}

function practiceErrorsHTML(){const list=LESSONS.filter(l=>{const s=practiceSaved.sessions[l.id];return s?.submitted&&practiceQuestions(l.id,s).some(q=>s.answers[q.id]!==q.answer);});return list.length?`<div class="section-head"><div><h2>Bài test 20 câu cần ôn lại</h2><p>Lượt nộp gần nhất trong từng bài test.</p></div></div><div class="topic-test-grid">${list.map(l=>{const s=practiceSaved.sessions[l.id],qs=practiceQuestions(l.id,s),wrong=qs.filter(q=>s.answers[q.id]!==q.answer).length;return `<article class="topic-test-card"><span class="tag">${getLevel(l.level).name}</span><h3>${esc(l.title)}</h3><p>${wrong} câu sai trong lượt ${qs.length} câu.</p><a class="primary" href="#/practice/${l.id}">Xem lời giải & luyện lại →</a></article>`;}).join('')}</div>`:'';}
