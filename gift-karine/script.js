(function(){
  const text = `Hoje celebramos 5 meses desde aquele dia em que nossos caminhos se cruzaram na escola — e, desde então, tudo em mim encontrou um novo sentido no teu olhar.
Cada detalhe seu me conquista de novo: teu sorriso no corredor, tua voz que me acalma, teu jeito de me ouvir como se o tempo parasse só para nós dois.

Entre o silêncio da noite e o brilho roxo dos nossos sonhos, descobri que amar você é a melhor parte dos meus dias. Aprendi que felicidade é andar de mãos dadas na saída da escola e sentir que o mundo cabe no abraço que a gente dá.

Obrigado por ser minha paz e minha coragem, por acreditar em mim e por fazer da rotina um lugar mágico. Você é a razão do meu cuidado, do meu riso fácil e da minha vontade de ser melhor a cada dia.

Prometo ser teu porto seguro, teu abraço preferido e o motivo de mais sorrisos. Prometo cuidar do que temos com carinho, respeito e verdade, porque o nosso amor é a minha escolha de todos os dias.

Hoje e sempre, eu te escolho. Eu te amo, Karine — muito, intensamente, declaradamente, do jeitinho que o coração pede: inteiro e sem medo.`;

  const els = {
    intro: document.getElementById('intro'),
    autoplayHint: document.getElementById('autoplayHint'),
    startBtn: document.getElementById('startBtn'),
    letter: document.getElementById('letter'),
    hearts: document.getElementById('hearts'),
    typed: document.getElementById('typed'),
    showAllBtn: document.getElementById('showAllBtn'),
    playPauseBtn: document.getElementById('playPauseBtn'),
    loopBtn: document.getElementById('loopBtn'),
    motionBtn: document.getElementById('motionBtn'),
    audioStatus: document.getElementById('audioStatus'),
    contentSection: document.querySelector('.content')
  };

  const state = {
    audio: null,
    typingTimer: null,
    typingIndex: 0,
    typingSpeed: 26 + Math.floor(Math.random()*12), // 26–38ms/letra
    reducedMotion: false,
    heartsCount: window.matchMedia('(min-width: 768px)').matches ? 24 : 18,
    started: false,
    finishedTyping: false
  };

  // Reduced motion initial according to system preference
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  state.reducedMotion = !!prefersReduced.matches;
  if(state.reducedMotion){ document.body.classList.add('reduced-motion'); els.motionBtn.setAttribute('aria-pressed','true'); }
  prefersReduced.addEventListener?.('change', (e)=>{
    // Do not auto-toggle if user explicitly chose a setting after start
    if(!state.started){
      state.reducedMotion = e.matches;
      document.body.classList.toggle('reduced-motion', state.reducedMotion);
      els.motionBtn.setAttribute('aria-pressed', String(state.reducedMotion));
    }
  });

  // Setup hearts
  function rand(min,max){ return Math.random()*(max-min)+min }
  function spawnHearts(count){
    els.hearts.innerHTML = '';
    for(let i=0;i<count;i++){
      const heart = document.createElement('i');
      heart.className = 'heart';
      const size = Math.round(rand(10, 22));
      const x = Math.round(rand(2, 98));
      const delay = rand(0, 12).toFixed(2)+'s';
      const dur = rand(6, 14).toFixed(2)+'s';
      const scale = (size/16).toFixed(2);
      const o = rand(0.35, 0.9).toFixed(2);
      heart.style.setProperty('--s', size+'px');
      heart.style.setProperty('--x', x+'%');
      heart.style.setProperty('--d', delay);
      heart.style.setProperty('--t', dur);
      heart.style.setProperty('--scale', scale);
      heart.style.setProperty('--o', o);
      els.hearts.appendChild(heart);
    }
  }

  // Audio
  function setupAudio(){
    if(state.audio) return state.audio;
    const audio = new Audio('assets/audio/musica.m4a');
    audio.preload = 'metadata';
    audio.volume = 0.8;
    audio.loop = false;

    audio.addEventListener('playing', ()=>{
      updatePlayPauseUI(true);
      announce('Reproduzindo');
    });
    audio.addEventListener('pause', ()=>{
      updatePlayPauseUI(false);
      announce('Pausado');
    });
    audio.addEventListener('ended', ()=>{
      updatePlayPauseUI(false);
      announce('Áudio finalizado');
    });
    audio.addEventListener('error', ()=>{
      announce('Não foi possível carregar o áudio. Você pode continuar sem som.');
    });
    state.audio = audio;
    return audio;
  }
  function announce(msg){
    if(els.audioStatus){ els.audioStatus.textContent = msg; }
  }
  function updatePlayPauseUI(playing){
    els.playPauseBtn.textContent = playing ? '⏸️' : '▶️';
    els.playPauseBtn.setAttribute('aria-pressed', String(playing));
    els.playPauseBtn.setAttribute('aria-label', playing ? 'Pausar música' : 'Tocar música');
  }

  // Typing
  function measureAndReserveHeight(){
    const measure = document.createElement('div');
    measure.style.cssText = 'position:absolute;visibility:hidden;white-space:pre-wrap;left:-9999px;top:-9999px;width:'+els.typed.clientWidth+'px;';
    measure.className = 'typed';
    measure.textContent = text;
    document.body.appendChild(measure);
    const h = measure.scrollHeight;
    document.body.removeChild(measure);
    els.typed.style.minHeight = h+'px';
  }
  function typeNext(){
    if(state.reducedMotion){
      els.typed.textContent = text;
      doneTyping();
      return;
    }
    if(state.typingIndex >= text.length){
      doneTyping();
      return;
    }
    els.typed.textContent = text.slice(0, state.typingIndex+1);
    state.typingIndex++;
    const jitter = Math.random()*10 - 5; // +/- 5ms
    state.typingTimer = window.setTimeout(typeNext, Math.max(12, state.typingSpeed + jitter));
  }
  function startTyping(){
    state.finishedTyping = false;
    state.typingIndex = 0;
    measureAndReserveHeight();
    typeNext();
  }
  function doneTyping(){
    state.finishedTyping = true;
    els.typed.style.minHeight = '';
    els.showAllBtn.style.display = 'none';
  }

  // Start experience
  async function startExperience(){
    if(state.started) return;
    state.started = true;

    const audio = setupAudio();
    try{
      await audio.play();
      onReadyToShow();
    }catch(err){
      // Autoplay blocked or audio missing; show hint and allow retry
      state.started = false; // allow another attempt
      els.autoplayHint.hidden = false;
      announce('Toque novamente para iniciar o áudio.');
    }
  }
  function onReadyToShow(){
    // Hide overlay, show letter
    els.autoplayHint.hidden = true;
    els.intro.classList.add('fade-out');
    els.intro.addEventListener('transitionend', ()=>{
      els.intro.hidden = true;
      els.letter.hidden = false;
      els.contentSection.focus();
    }, { once:true });
    // Hearts and typing
    spawnHearts(state.heartsCount);
    startTyping();
  }

  // Controls events
  els.startBtn.addEventListener('pointerdown', startExperience);
  els.startBtn.addEventListener('click', startExperience);
  els.startBtn.addEventListener('keydown', (e)=>{
    if(e.key === 'Enter' || e.key === ' '){
      e.preventDefault();
      startExperience();
    }
  });

  els.playPauseBtn.addEventListener('click', async ()=>{
    const audio = setupAudio();
    try{
      if(audio.paused){ await audio.play(); } else { audio.pause(); }
    }catch(err){ announce('Não foi possível iniciar o áudio.'); }
  });

  els.loopBtn.addEventListener('click', ()=>{
    const audio = setupAudio();
    audio.loop = !audio.loop;
    els.loopBtn.setAttribute('aria-pressed', String(audio.loop));
    els.loopBtn.setAttribute('aria-label', audio.loop ? 'Desativar loop' : 'Ativar loop');
    announce(audio.loop ? 'Loop ativado' : 'Loop desativado');
  });

  els.motionBtn.addEventListener('click', ()=>{
    state.reducedMotion = !state.reducedMotion;
    document.body.classList.toggle('reduced-motion', state.reducedMotion);
    els.motionBtn.setAttribute('aria-pressed', String(state.reducedMotion));
    announce(state.reducedMotion ? 'Animações reduzidas' : 'Animações normais');
    if(state.reducedMotion && !state.finishedTyping){
      // finish instantly to avoid flashing
      els.typed.textContent = text;
      doneTyping();
    }else if(!state.reducedMotion && state.finishedTyping){
      // user may want to see typing again: allow restart
      els.showAllBtn.style.display = '';
    }
  });

  els.showAllBtn.addEventListener('click', ()=>{
    if(state.typingTimer) window.clearTimeout(state.typingTimer);
    els.typed.textContent = text;
    doneTyping();
  });

  // Resize observer to re-measure reserved height before typing starts
  const ro = new ResizeObserver(()=>{
    if(!state.started || state.typingIndex>0) return;
    measureAndReserveHeight();
  });
  ro.observe(document.body);

  // Spawn hearts initially (behind intro) for ambiance
  spawnHearts(Math.floor(state.heartsCount*0.8));

})();
