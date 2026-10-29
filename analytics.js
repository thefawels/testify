const dayKey=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const shift=(d,n)=>new Date(d.getFullYear(),d.getMonth(),d.getDate()+n);
const accuracy=h=>{const total=h.reduce((n,r)=>n+r.total,0);return total?Math.round(h.reduce((n,r)=>n+r.correct,0)/total*100):null};
export function analytics(state,period='30',now=new Date()){
 const ids=new Set(state.tests.map(t=>t.id));
 const all=state.history.filter(r=>ids.has(r.testId)&&r.total>0&&Number.isFinite(Date.parse(r.date))&&new Date(r.date)<=now).sort((a,b)=>new Date(b.date)-new Date(a.date));
 const start=period==='all'?null:shift(now,1-Number(period));
 const h=all.filter(r=>!start||new Date(r.date)>=start),full=h.filter(r=>!r.review);
 const total=h.reduce((n,r)=>n+r.total,0),correct=h.reduce((n,r)=>n+r.correct,0),seconds=h.reduce((n,r)=>n+Math.max(0,r.seconds||0),0);
 const active=new Set(all.map(r=>dayKey(new Date(r.date))));let streak=0,cursor=active.has(dayKey(now))?shift(now,0):shift(now,-1);
 while(active.has(dayKey(cursor))){streak++;cursor=shift(cursor,-1)}
 const days=Array.from({length:28},(_,i)=>{const d=shift(now,i-27),key=dayKey(d);return {key,label:d.toLocaleDateString('ru-RU',{day:'numeric',month:'long'}),count:h.filter(r=>dayKey(new Date(r.date))===key).length}});
 const recent=full.slice(0,5),previous=full.slice(5,10);const trend=recent.length===5&&previous.length===5?accuracy(recent)-accuracy(previous):null;
 const rows=state.tests.map(t=>{const attempts=h.filter(r=>r.testId===t.id),complete=attempts.filter(r=>!r.review);return {test:t,count:attempts.length,accuracy:accuracy(attempts),best:complete.length?Math.max(...complete.map(r=>Math.round(r.correct/r.total*100))):null,weak:(state.weak[t.id]||[]).length}});
 return {h,full,total,correct,seconds,accuracy:accuracy(h),streak,days,trend,rows,activeDays:new Set(h.map(r=>dayKey(new Date(r.date)))).size,perfect:full.filter(r=>r.correct===r.total).length,reviews:h.length-full.length,covered:rows.filter(r=>r.count).length,weak:rows.reduce((n,r)=>n+r.weak,0),chart:full.slice(0,10).reverse()};
}
