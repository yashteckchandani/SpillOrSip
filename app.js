const questions = [
  "What is the most ridiculous lie you've ever told to get out of a situation?",
  "Have you ever stalked someone's social media so deeply that you accidentally liked an old post? Who was it?",
  "What is the stupidest thing you've ever done to impress someone?",
  "If everyone in this room could see your Google search history, what would be the most embarrassing thing they'd find?",
  "What is your most embarrassing story that you've never told this group?",
  "How many times have you asked someone out or proposed to someone, and out of those, how many times have you received a yes?",
  "Have you ever had a crush on someone in this room? If yes, who?",
  "What is something you've done while drunk that you still regret or cringe about?",
  "Have you ever been caught doing something you absolutely shouldn't have been doing? Tell us the story.",
  "If you had to date one person in this room (excluding your current partner), who would you choose and why?",
  "What is your life's biggest regret, and if you could go back, what would you do differently?",
  "Have you ever liked two people at the same time? How did that situation end?",
  "What is the biggest secret you've kept from your parents or family?",
  "Have you ever been rejected by someone you really liked? What exactly happened?",
  "What is one thing about your past relationships or dating life that nobody in this room knows?",
  "Who in this room do you think has the worst taste in romantic partners, and why?",
  "Have you ever lied to someone in this room? What was the lie?",
  "What is the most desperate or embarrassing thing you've ever done for love or attention?",
  "If you could erase one person from your romantic past and never have met them, who would it be and why?",
  "What is one question you're desperately hoping nobody asks you tonight? And now, answer it!"
];
const rounds = ['Breaking the Ice', 'Things Are Getting Interesting', 'Getting Personal', 'No More Hiding'];
const colors = ['#f6ca55','#edb4b6','#bfcc9d','#f28e6d','#dac4e5','#a8ccca','#eabf89','#e3a7a4'];
const app = document.querySelector('#app');
let mode = 'group', players = [], index = 0, selected = '', rotation = 0, spinTimer;
const escapeHTML = s => s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function home(){
  clearTimeout(spinTimer);
  app.innerHTML = `<section class="home"><div class="hero"><div><div class="eyebrow">THE FRIENDS EDITION</div><h1>Spill it<br><em>or sip it.</em></h1><p class="hero-copy">Good friends, great stories, and a few things you probably shouldn't say out loud.</p></div><div class="hero-art" aria-hidden="true"><div class="art-circle"></div><div class="art-card"><span class="glass">🍸</span><strong>THE TRUTH<br>IS FUN.</strong></div><span class="art-spark">✳</span><span class="art-caption">A LITTLE GAME FOR BIG CONFESSIONS ↗</span></div></div><div class="section-head"><div><div class="eyebrow">LET'S GET INTO IT</div><h2>Pick your kind of chaos.</h2></div><p>20 QUESTIONS. ENDLESS STORIES.</p></div><div class="modes"><button class="mode group" id="group"><div class="mode-top"><span class="mode-icon">✺</span><span class="mode-arrow">↗</span></div><h3>Whole group</h3><p>One question. Everyone gets a turn.</p></button><button class="mode wheel-mode" id="wheel-mode"><div class="mode-top"><span class="mode-icon">◉</span><span class="mode-arrow">↗</span></div><h3>Spin the wheel</h3><p>Let fate decide who's in the hot seat.</p></button></div><div class="rules"><strong>THE ONLY RULES ↗</strong><span>Answer honestly or take a sip. Everyone decides what they're comfortable sharing. Non-alcoholic drinks work too!</span></div></section>`;
  document.querySelector('#group').onclick = () => { mode='group'; index=0; question(); };
  document.querySelector('#wheel-mode').onclick = () => { mode='wheel'; index=0; players=[]; setup(); };
}
function setup(){
  app.innerHTML = `<section class="screen"><button class="back" id="back">← BACK TO MODES</button><div class="screen-head"><div class="eyebrow">SPIN THE WHEEL</div><h1>Who's playing?</h1><p>Add your people and let the wheel pick the hot seat.<br>You'll need at least two players.</p></div><div class="panel"><form class="input-row" id="player-form"><input id="player-name" aria-label="Player name" placeholder="Enter a name" maxlength="24" autocomplete="off"><button class="btn" type="submit">Add +</button></form><div class="players-title"><span class="label">THE LINEUP</span><span class="label" id="player-count"></span></div><div class="players" id="players"></div><p class="hint" id="hint">Add at least 2 players to get started.</p><button class="btn wide" id="start" disabled>Let's play →</button></div></section>`;
  document.querySelector('#back').onclick=home;
  const input=document.querySelector('#player-name');
  const update=()=>{document.querySelector('#player-count').textContent=`${players.length} PLAYER${players.length===1?'':'S'}`;document.querySelector('#players').innerHTML=players.map((p,i)=>`<span class="player">${escapeHTML(p)} <button type="button" data-remove="${i}" aria-label="Remove ${escapeHTML(p)}">×</button></span>`).join('');document.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{players.splice(Number(b.dataset.remove),1);update();});document.querySelector('#start').disabled=players.length<2;document.querySelector('#hint').textContent=players.length<2?'Add at least 2 players to get started.':'Everyone in? Let’s get this party started.';};
  document.querySelector('#player-form').onsubmit=e=>{e.preventDefault();const name=input.value.trim();if(!name)return;if(players.some(p=>p.toLowerCase()===name.toLowerCase())){document.querySelector('#hint').textContent='Please use a different name for each player.';return;}if(players.length>=12){document.querySelector('#hint').textContent='The wheel fits up to 12 players.';return;}players.push(name);input.value='';update();input.focus();};
  document.querySelector('#start').onclick=()=>{index=0;rotation=0;wheel();}; update();
}
function progress(){return `<div class="progress"><span>QUESTION ${String(index+1).padStart(2,'0')} / 20</span><span>ROUND ${Math.floor(index/5)+1} / 4</span></div><div class="progress-track"><div class="progress-fill" style="width:${index/20*100}%"></div></div>`;}
function question(){
  const round=Math.floor(index/5);
  app.innerHTML=`<section class="screen"><button class="back" id="back">← BACK TO MODES</button>${progress()}<div class="question-card round-${round}"><div class="question-top"><span class="round-tag">ROUND ${round+1} · ${rounds[round].toUpperCase()}</span><span class="question-mark">✳</span></div><h2>${escapeHTML(questions[index])}</h2><div class="question-bottom"><span>${mode==='wheel'?`${escapeHTML(selected.toUpperCase())}, IT'S YOUR TURN`:'EVERYONE GETS A TURN'}</span><span>↗</span></div></div><div class="actions"><span class="tiny">SPILL IT OR SIP IT.</span><button class="btn" id="next">${index===19?'Finish game':'Next question'} →</button></div></section>`;
  document.querySelector('#back').onclick=home;document.querySelector('#next').onclick=()=>{index++;if(index===20)finish();else if(mode==='wheel')wheel();else question();};
}
function wheel(){
  selected=''; const step=360/players.length;
  const gradient=players.map((_,i)=>`${colors[i%colors.length]} ${i*step}deg ${(i+1)*step}deg`).join(',');
  app.innerHTML=`<section class="screen"><button class="back" id="back">← BACK TO MODES</button>${progress()}<div class="screen-head"><div class="eyebrow">QUESTION ${index+1} IS UP NEXT</div><h1>Who's it gonna be?</h1><p>Give the wheel a spin to pick your player.</p></div><div class="wheel-wrap"><div class="pointer"></div><div class="wheel" id="wheel" style="background:conic-gradient(${gradient});transform:rotate(${rotation}deg)">${players.map((p,i)=>`<span class="wheel-label" style="transform:rotate(${-90+(i+.5)*step}deg)">${escapeHTML(p)}</span>`).join('')}<span class="wheel-hub">✳</span></div></div><div class="wheel-status" id="status"><p>Fate is waiting...</p></div><button class="btn wide" id="spin">Spin the wheel ↻</button></section>`;
  document.querySelector('#back').onclick=home;
  document.querySelector('#spin').onclick=()=>{const button=document.querySelector('#spin');button.disabled=true;const winner=Math.floor(Math.random()*players.length);const target=(360-(winner+.5)*step)%360;rotation+=1800+((target-(rotation%360)+360)%360);document.querySelector('#wheel').style.transform=`rotate(${rotation}deg)`;document.querySelector('#status').innerHTML='<p>Round and round we go...</p>';spinTimer=setTimeout(()=>{selected=players[winner];document.querySelector('#status').innerHTML=`<strong>${escapeHTML(selected)}, you're up!</strong><p>Ready for your question?</p>`;button.textContent='Show question →';button.disabled=false;button.onclick=question;},window.matchMedia('(prefers-reduced-motion: reduce)').matches?50:3500);};
}
function finish(){app.innerHTML=`<section class="screen"><div class="screen-head"><div class="eyebrow">THAT'S A WRAP</div><div class="end-icon">✳</div><h1>Well, that was revealing.</h1><p>20 questions, countless stories, and hopefully no regrets.<br>Cheers to good company.</p><div class="end-actions"><button class="btn" id="again">Play again →</button><button class="btn btn-light" id="home">Back to modes</button></div></div></section>`;document.querySelector('#again').onclick=()=>{index=0;if(mode==='wheel')wheel();else question();};document.querySelector('#home').onclick=home;}
document.querySelector('#home-button').onclick=home;
home();
