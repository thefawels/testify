export function clearTestProgress(state,id){
 const weak={...state.weak};delete weak[id];
 return {...state,history:state.history.filter(r=>r.testId!==id),weak};
}
export function removeTest(state,id){
 return {...clearTestProgress(state,id),tests:state.tests.filter(t=>t.id!==id)};
}
export function summarizeTest(state,id){
 const full=state.history.filter(r=>r.testId===id&&!r.review&&r.total>0);
 return {best:full.length?Math.max(...full.map(r=>Math.round(r.correct/r.total*100))):null,weak:(state.weak[id]||[]).length};
}

// Fisher–Yates on copies: retain IDs and complete answer objects.
export function shuffle(items,random=Math.random){
 const copy=[...items];
 for(let i=copy.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]]}
 return copy;
}
export function randomizeQuestions(questions,random=Math.random){
 return shuffle(questions,random).map(q=>({...q,options:shuffle(q.options,random)}));
}
