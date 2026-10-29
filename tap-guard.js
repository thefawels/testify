// Preserve native taps (and native switch haptics), reject drag-generated clicks.
export function installTapGuard(doc, now=()=>performance.now()){
 let gesture=null,lastScroll=-Infinity,lastTouch=-Infinity,forwarding=false;
 const button=t=>t?.closest?.('button[data-action]');
 doc.addEventListener('touchstart',e=>{lastTouch=now();const t=e.touches[0];gesture=t?{id:t.identifier,x:t.clientX,y:t.clientY,target:button(e.target),blocked:e.touches.length!==1||now()-lastScroll<200,ended:false}:null},{capture:true,passive:true});
 doc.addEventListener('touchmove',e=>{if(!gesture)return;const t=Array.from(e.touches).find(t=>t.identifier===gesture.id);if(!t||e.touches.length!==1||Math.hypot(t.clientX-gesture.x,t.clientY-gesture.y)>8)gesture.blocked=true},{capture:true,passive:true});
 doc.addEventListener('scroll',()=>{lastScroll=now();if(gesture)gesture.blocked=true},{capture:true,passive:true});
 doc.addEventListener('touchcancel',()=>{lastTouch=now();if(gesture)gesture.blocked=true},{capture:true,passive:true});
 doc.addEventListener('touchend',e=>{lastTouch=now();if(!gesture)return;const t=Array.from(e.changedTouches).find(t=>t.identifier===gesture.id);gesture.ended=true;if(!t||e.touches.length||Math.hypot(t.clientX-gesture.x,t.clientY-gesture.y)>8||button(doc.elementFromPoint(t.clientX,t.clientY))!==gesture.target)gesture.blocked=true;if(gesture.blocked&&gesture.target&&e.cancelable)e.preventDefault()},{capture:true,passive:false});
 doc.addEventListener('keydown',()=>{lastTouch=-Infinity;gesture=null},{capture:true});
 doc.addEventListener('click',e=>{const b=button(e.target);if(!b||forwarding)return;if(now()-lastTouch<1200&&(!gesture?.ended||gesture.blocked||gesture.target!==b)){e.preventDefault();e.stopImmediatePropagation()}},true);
 return b=>{forwarding=true;try{b.click()}finally{forwarding=false}};
}
