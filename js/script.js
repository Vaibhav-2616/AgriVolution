/* script.js
   Shared scripts for navigation, pages and chatbot.
*/

(function(){
  // helper to set active nav link
  function setActiveNav(){
    const path = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav a').forEach(a=>{
      const href = a.getAttribute('href') || '';
      if(href.endsWith(path) || (href === 'index.html' && path === 'index.html')) {
        a.classList.add('active');
      } else a.classList.remove('active');
    });
  }
  // run on load
  if(document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else init();

  function init(){
    setActiveNav();
    attachChatbot();
    initTheme();
    createThemeToggle();
    // language selector and initial translations
    if(typeof createLanguageSelector === 'function') createLanguageSelector();
    if(window.I18N) applyTranslations(window.I18N.lang);
    runPageScripts();
    // translate dynamic content created by page scripts
    if(window.I18N) applyTranslations(window.I18N.lang);
    // If the user previously selected a language, attempt to apply it on page load
    if(typeof tryAutoTranslateOnLoad === 'function') tryAutoTranslateOnLoad();
    // smooth anchor
    document.querySelectorAll('a[href^="#"]').forEach(a=>{
      a.addEventListener('click', e=>{
        e.preventDefault();
        document.querySelector(a.getAttribute('href')).scrollIntoView({behavior:'smooth'});
      });
    });
  }

  /* Theme handling: light/dark toggle */
  function initTheme(){
    try{
      const saved = localStorage.getItem('agri-theme');
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const theme = saved || (prefersDark ? 'dark' : 'light');
      applyTheme(theme);
    }catch(e){ console.warn('theme init failed', e); }
  }

  function applyTheme(theme){
    if(theme === 'dark') document.documentElement.setAttribute('data-theme','dark');
    else document.documentElement.removeAttribute('data-theme');
    try{ localStorage.setItem('agri-theme', theme); }catch(e){}
    // update toggle if present
    const tbtn = document.querySelector('.theme-toggle');
    if(tbtn) updateToggleButton(tbtn, theme);
  }

  function toggleTheme(){
    const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
  }

  function createThemeToggle(){
    const nav = document.querySelector('.nav');
    if(!nav) return;
    // don't create twice
    if(document.querySelector('.theme-toggle')) return;
    const btn = document.createElement('button');
    btn.className = 'theme-toggle';
    btn.type = 'button';
    btn.title = 'Toggle light / dark theme';
    btn.addEventListener('click', ()=> toggleTheme());
    nav.appendChild(btn);
    // set initial label/icon
    const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    updateToggleButton(btn, theme);
  }

  function updateToggleButton(btn, theme){
    if(!btn) return;
    if(theme === 'dark'){
      btn.innerHTML = '🌙 Dark';
    } else {
      btn.innerHTML = '☀️ Light';
    }
  }

  // Language selector and translation helpers
  function createLanguageSelector(){
    const nav = document.querySelector('.nav');
    if(!nav) return;
    if(document.getElementById('lang-select')) return;
    const wrap = document.createElement('div'); wrap.className = 'lang-select';
    const sel = document.createElement('select'); sel.id = 'lang-select'; sel.title = 'Change language';
    const opts = [ {val:'en', label:'English'}, {val:'hi', label:'हिन्दी'}, {val:'or', label:'ଓଡ଼ିଆ'} ];
    opts.forEach(o=>{ const op = document.createElement('option'); op.value = o.val; op.textContent = o.label; sel.appendChild(op); });
    sel.value = localStorage.getItem('agri-lang') || (window.I18N && window.I18N.lang) || 'en';
    sel.addEventListener('change', (e)=>{
      const v = e.target.value;
      // Prefer using Google Translate / browser realtime translation when available.
      if(v === 'en'){
        // revert to original language
        if(window.I18N) window.I18N.setLang('en');
        // also reset google translate if present
        if(typeof autoTranslateTo === 'function') autoTranslateTo('en');
        // re-render and apply our internal translations as fallback
        if(typeof renderPriceToday === 'function') renderPriceToday();
        if(typeof renderCommunityTeasers === 'function') renderCommunityTeasers();
        if(typeof renderMarketplace === 'function') renderMarketplace();
        applyTranslations('en');
        updateChatTexts();
        return;
      }

      // try to use Google Translate widget for realtime full-page translation
      autoTranslateTo(v).then(()=>{
        // Google did the translation; still update dynamic widgets like chart labels if needed
        updateChatTexts();
      }).catch(()=>{
        // fallback to internal dictionary translation
        if(window.I18N) window.I18N.setLang(v);
        if(typeof renderPriceToday === 'function') renderPriceToday();
        if(typeof renderCommunityTeasers === 'function') renderCommunityTeasers();
        if(typeof renderMarketplace === 'function') renderMarketplace();
        applyTranslations(v);
        updateChatTexts();
      });
    });
    wrap.appendChild(sel);
    nav.appendChild(wrap);
  }

  function applyTranslations(lang){
    const use = (window.I18N && (lang || window.I18N.lang)) || 'en';
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const key = el.getAttribute('data-i18n');
      const txt = (window.I18N && window.I18N.t(key, use)) || key;
      el.textContent = txt;
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>{
      const key = el.getAttribute('data-i18n-placeholder');
      const txt = (window.I18N && window.I18N.t(key, use)) || '';
      el.placeholder = txt;
    });
    document.querySelectorAll('[data-i18n-email]').forEach(el=>{ el.textContent = (window.I18N && window.I18N.t('footer.email', use)) || 'hello@agrivolution.example'; });
  }

  function updateChatTexts(){
    const input = document.getElementById('chat-input');
    if(input) input.placeholder = (window.I18N && window.I18N.t('chat.placeholder')) || input.placeholder;
    const bot = document.querySelector('#chat-body .bot-msg');
    if(bot) bot.textContent = (window.I18N && window.I18N.t('chat.greeting')) || bot.textContent;
  }

  // --- Google Translate / Browser realtime translate helpers ---
  function ensureGoogleTranslateLoaded(){
    return new Promise((resolve, reject)=>{
      if(window.google && window.google.translate){
        resolve();
        return;
      }
      // prepare callback first
      window.googleTranslateElementInit = function(){
        try{
          // initialize with included languages
          new window.google.translate.TranslateElement({pageLanguage: 'en', includedLanguages: 'hi,or,en', autoDisplay: false}, 'google_translate_element');
        }catch(e){/*ignore*/}
        resolve();
      };
      // inject script
      const s = document.createElement('script');
      s.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      s.async = true; s.defer = true;
      s.onerror = ()=> reject(new Error('Google Translate failed to load'));
      document.head.appendChild(s);
    });
  }

  function getGoogleSelect(){
    return document.querySelector('.goog-te-combo');
  }

  function autoTranslateTo(lang){
    // lang should be e.g. 'hi' or 'or' or 'en'
    return new Promise((resolve, reject)=>{
      ensureGoogleTranslateLoaded().then(()=>{
        // show invisible container (widget will create its controls)
        let container = document.getElementById('google_translate_element');
        if(!container){ container = document.createElement('div'); container.id = 'google_translate_element'; container.style.display='none'; document.body.appendChild(container); }
        // small delay to let widget populate
        setTimeout(()=>{
          const combo = getGoogleSelect();
          if(combo){
            combo.value = lang;
            combo.dispatchEvent(new Event('change'));
            resolve();
          } else {
            // try to locate inside iframe (older widget structure) by searching for select
            const sel = document.querySelector('select.goog-te-combo');
            if(sel){ sel.value = lang; sel.dispatchEvent(new Event('change')); resolve(); }
            else reject(new Error('Google Translate control not found'));
          }
        }, 600);
      }).catch(reject);
    });
  }

  function tryAutoTranslateOnLoad(){
    try{
      const saved = localStorage.getItem('agri-lang');
      if(saved && saved !== 'en'){
        autoTranslateTo(saved).then(()=>{
          // Google translate applied
        }).catch(()=>{
          // fallback: use local dictionary translations if available
          if(window.I18N){
            window.I18N.setLang(saved);
            if(typeof renderPriceToday === 'function') renderPriceToday();
            if(typeof renderCommunityTeasers === 'function') renderCommunityTeasers();
            if(typeof renderMarketplace === 'function') renderMarketplace();
            applyTranslations(saved);
            updateChatTexts();
          }
        });
      }
    }catch(e){/* ignore */}
  }

  // Attach chatbot behavior
  function attachChatbot(){
    const chatBtn = document.getElementById('chat-btn');
    const chatWindow = document.getElementById('chat-window');
    const chatClose = document.getElementById('chat-close');
    const chatSend = document.getElementById('chat-send');
    const chatInput = document.getElementById('chat-input');
    const chatBody = document.getElementById('chat-body');

    if(!chatBtn || !chatWindow) return;

    chatBtn.addEventListener('click', ()=> chatWindow.style.display = 'flex');
    chatClose.addEventListener('click', ()=> chatWindow.style.display = 'none');
    chatSend && chatSend.addEventListener('click', sendMessage);
    chatInput && chatInput.addEventListener('keydown', (e)=>{ if(e.key==='Enter') sendMessage(); });

    // preload bot greeting (translated when possible)
    const greeting = (window.I18N && window.I18N.t('chat.greeting')) || "Namaste! I am Arnak, your AI farming assistant. How can I help you today?";
    appendBot(greeting);
    function appendBot(text){
      if(!chatBody) return;
      const d = document.createElement('div'); d.className='bot-msg'; d.textContent = text;
      chatBody.appendChild(d); chatBody.scrollTop = chatBody.scrollHeight;
    }
    function appendUser(text){
      if(!chatBody) return;
      const d = document.createElement('div'); d.className='user-msg'; d.textContent = text;
      chatBody.appendChild(d); chatBody.scrollTop = chatBody.scrollHeight;
    }

    function sendMessage(){
      const v = chatInput.value && chatInput.value.trim();
      if(!v) return;
      appendUser(v);
      chatInput.value = '';
      // simulate thinking
      const loading = document.createElement('div'); loading.className = 'bot-msg'; loading.textContent='Typing...'; chatBody.appendChild(loading); chatBody.scrollTop = chatBody.scrollHeight;
      setTimeout(()=>{
        loading.remove();
        const lower = v.toLowerCase();
        let res = window.AGRI.CHAT_RESPONSES.default;
        if(lower.includes('pest')||lower.includes('insect')||lower.includes('bug')) res = window.AGRI.CHAT_RESPONSES.pest;
        else if(lower.includes('crop')||lower.includes('plant')||lower.includes('sow')) res = window.AGRI.CHAT_RESPONSES.crop;
        else if(lower.includes('price')||lower.includes('rate')||lower.includes('cost')) res = window.AGRI.CHAT_RESPONSES.price;
        appendBot(res);
      }, 900);
    }
  }

  // Page-specific scripts (chart placeholders, lists)
  function runPageScripts(){
    const page = location.pathname.split('/').pop() || 'index.html';
    if(page === '' || page === 'index.html'){
      renderPriceToday();
      renderCommunityTeasers();
    }
    if(page === 'marketplace.html'){
      renderMarketplace();
      attachSearchMarketplace();
    }
    if(page === 'community.html'){
      renderCommunityFeed();
      attachCreatePost();
    }
    if(page === 'learning.html'){
      renderLearning();
    }
    if(page === 'mandi.html'){
      attachMandiSearch();
    }
    if(page === 'auth.html'){
      attachAuthForm();
    }
  }

  /* Home: Price Today */
  function renderPriceToday(){
    const container = document.getElementById('price-container');
    if(!container) return;
    container.innerHTML = '';
    window.AGRI.VEGETABLE_PRICES.forEach(item=>{
      const diff = item.today - item.yesterday;
      const up = diff > 0;
      const displayName = (window.I18N && window.I18N.t('veg.'+item.name)) || item.name;
      const unitLabel = (window.I18N && window.I18N.t('unit.'+item.unit)) || item.unit;
      const fromY = (window.I18N && window.I18N.t('prices.fromYest')) || 'from yest.';
      const itemEl = document.createElement('div'); itemEl.className = 'price-item card';
      itemEl.innerHTML = `
        <div class="meta">
          <div class="letter">${displayName[0]}</div>
          <div>
            <div style="font-weight:700">${displayName}</div>
            <div style="font-size:13px;color:var(--muted)">per ${unitLabel}</div>
          </div>
        </div>
        <div class="right">
          <div style="font-weight:800;color:var(--primary)">₹${item.today}</div>
          <div style="font-size:13px;color:${up?'#dc2626':'#059669'}">${up?'+':''}${diff} ${fromY}</div>
        </div>
      `;
      container.appendChild(itemEl);
    });

    // Render a clear SVG chart showing today's prices and up/down markers
    const chart = document.getElementById('price-chart');
    if(chart){
      // prepare data
      const data = window.AGRI.VEGETABLE_PRICES.map((p, i)=>({
        name: p.name,
        today: p.today,
        diff: p.today - p.yesterday,
        up: p.today - p.yesterday > 0
      }));
      // clear and render
      chart.innerHTML = '';
      renderPriceChart(chart, data);
      // redraw on resize for responsiveness
      let resizeTimer = null;
      window.addEventListener('resize', ()=>{
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(()=> renderPriceChart(chart, data), 150);
      });
    }
  }

  // draw a simple, clean SVG chart inside the given container
  function renderPriceChart(container, data){
    // layout
    const pad = {top:18,right:18,bottom:36,left:40};
    const rect = container.getBoundingClientRect();
    const w = Math.max(360, Math.floor(rect.width)) - pad.left - pad.right;
    const h = Math.max(160, Math.floor(rect.height)) - pad.top - pad.bottom;
    // scales
    const values = data.map(d=>d.today);
    const max = Math.max(...values) * 1.12;
    const min = Math.min(...values) * 0.88;
    const xStep = w / Math.max(1, data.length - 1);

    // create svg
    const xmlns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(xmlns, 'svg');
    svg.setAttribute('width', (w + pad.left + pad.right));
    svg.setAttribute('height', (h + pad.top + pad.bottom));
    svg.setAttribute('viewBox', `0 0 ${w + pad.left + pad.right} ${h + pad.top + pad.bottom}`);
    svg.setAttribute('role','img');

    // background group
    const g = document.createElementNS(xmlns,'g');
    g.setAttribute('transform', `translate(${pad.left},${pad.top})`);
    svg.appendChild(g);

    // horizontal grid + labels
    const gridLines = 4;
    for(let i=0;i<=gridLines;i++){
      const y = h - (i*(h/gridLines));
      const line = document.createElementNS(xmlns,'line');
      line.setAttribute('x1',0); line.setAttribute('x2',w); line.setAttribute('y1',y); line.setAttribute('y2',y);
      line.setAttribute('stroke','#e6eef0'); line.setAttribute('stroke-width','1');
      g.appendChild(line);
      // label
      const val = Math.round(min + (i*( (max-min)/gridLines )));
      const lab = document.createElementNS(xmlns,'text');
      lab.setAttribute('x', -8); lab.setAttribute('y', y+4); lab.setAttribute('text-anchor','end');
      lab.setAttribute('fill','#6b7280'); lab.setAttribute('font-size','12'); lab.textContent = '₹'+val;
      g.appendChild(lab);
    }

    // compute points
    const points = data.map((d,i)=>{
      const x = i * xStep;
      const y = h - ((d.today - min) / (max - min) * h);
      return {x,y, d};
    });

    // area under line (slight translucent fill)
    const areaPath = points.map((p,i)=> `${i===0? 'M':'L'} ${p.x} ${p.y}`).join(' ');
    const area = document.createElementNS(xmlns,'path');
    area.setAttribute('d', areaPath + ` L ${w} ${h} L 0 ${h} Z`);
    area.setAttribute('fill','rgba(47,142,68,0.08)');
    g.appendChild(area);

    // polyline for line
    const pl = document.createElementNS(xmlns,'polyline');
    pl.setAttribute('points', points.map(p=>`${p.x},${p.y}`).join(' '));
    pl.setAttribute('fill','none');
    pl.setAttribute('stroke','var(--primary)');
    pl.setAttribute('stroke-width','3');
    pl.setAttribute('stroke-linejoin','round');
    pl.setAttribute('stroke-linecap','round');
    g.appendChild(pl);

    // points and labels
    points.forEach((pt, i)=>{
      const circle = document.createElementNS(xmlns,'circle');
      circle.setAttribute('cx', pt.x); circle.setAttribute('cy', pt.y); circle.setAttribute('r', 6);
      circle.setAttribute('fill', pt.d.up? '#059669':'#dc2626');
      circle.setAttribute('stroke','#fff'); circle.setAttribute('stroke-width','2');
      circle.setAttribute('cursor','default');
      g.appendChild(circle);

      // value label above point
      const t = document.createElementNS(xmlns,'text');
      t.setAttribute('x', pt.x); t.setAttribute('y', pt.y - 12); t.setAttribute('text-anchor','middle');
      t.setAttribute('fill','#07421a'); t.setAttribute('font-size','12'); t.setAttribute('font-weight','700');
      t.textContent = '₹'+pt.d.today;
      g.appendChild(t);

      // diff label with arrow
      const diff = pt.d.diff;
      const diffText = (pt.d.up? '▲ ':'▼ ')+Math.abs(diff);
      const dlab = document.createElementNS(xmlns,'text');
      dlab.setAttribute('x', pt.x); dlab.setAttribute('y', pt.y + 20); dlab.setAttribute('text-anchor','middle');
      dlab.setAttribute('fill', pt.d.up? '#059669':'#dc2626'); dlab.setAttribute('font-size','11');
      const fromYText = (window.I18N && window.I18N.t('prices.fromYest')) || 'from yest.';
      dlab.textContent = diffText + ' ' + fromYText;
      g.appendChild(dlab);

      // x-axis label
      const xl = document.createElementNS(xmlns,'text');
      xl.setAttribute('x', pt.x); xl.setAttribute('y', h + 22); xl.setAttribute('text-anchor','middle');
      xl.setAttribute('fill','#6b7280'); xl.setAttribute('font-size','12'); xl.textContent = (window.I18N && window.I18N.t('veg.'+pt.d.name)) || pt.d.name;
      g.appendChild(xl);
    });

    // clear container and append
    container.appendChild(svg);
  }

  /* Home: Community teasers */
  function renderCommunityTeasers(){
    const cont = document.getElementById('community-teasers');
    if(!cont) return;
    cont.innerHTML = '';
    window.AGRI.COMMUNITY_POSTS.slice(0,3).forEach(post=>{
      const el = document.createElement('div'); el.className='post card';
      el.innerHTML = `
        <div class="post-header">
          <div class="avatar"><img src="${post.avatar}" style="width:100%;height:100%;object-fit:cover;border-radius:999px" /></div>
          <div>
            <div style="font-weight:700">${post.user}</div>
            <div style="font-size:12px;color:var(--muted)">${post.time}</div>
          </div>
        </div>
        <img class="post-image" src="${post.image}" alt="post" />
        <div class="post-body">
          <div style="font-weight:700;margin-bottom:6px">${post.likes} likes</div>
          <div style="font-size:14px">${post.caption}</div>
        </div>
      `;
      cont.appendChild(el);
    });
  }

  /* Marketplace */
  function renderMarketplace(){
    const grid = document.getElementById('market-grid');
    if(!grid) return;
    grid.innerHTML = '';
    window.AGRI.MARKETPLACE_LISTINGS.forEach(item=>{
      const card = document.createElement('div'); card.className='card';
      card.innerHTML = `
        <div style="position:relative;overflow:hidden;border-radius:10px;height:160px">
          <img src="${item.image}" style="width:100%;height:100%;object-fit:cover" />
          <div class="grade-badge">${item.grade}</div>
        </div>
        <div style="padding-top:12px">
          <div style="display:flex;justify-content:space-between;align-items:flex-start">
            <div>
              <div style="font-weight:800">${item.crop}</div>
              <div style="font-size:13px;color:var(--muted)">${item.location}</div>
            </div>
            <div style="text-align:right">
              <div style="font-weight:900;color:var(--primary)">₹${item.price}</div>
              <div style="font-size:13px;color:var(--muted)">${item.quantity} ${item.unit}</div>
            </div>
          </div>
          <div style="margin-top:10px;display:flex;gap:8px">
            <button class="btn btn-muted" data-i18n="btn.view">View</button>
            <button class="btn" data-i18n="btn.buyNow" style="background:var(--primary);color:white;border-radius:8px">Buy Now</button>
          </div>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  function attachSearchMarketplace(){
    const form = document.getElementById('market-search-form');
    if(!form) return;
    form.addEventListener('submit', function(e){
      e.preventDefault();
      const q = (document.getElementById('market-search')||{}).value.toLowerCase();
      const grid = document.getElementById('market-grid');
      grid.innerHTML = '';
      const list = window.AGRI.MARKETPLACE_LISTINGS.filter(item=> item.crop.toLowerCase().includes(q) || item.location.toLowerCase().includes(q));
      (list.length?list:window.AGRI.MARKETPLACE_LISTINGS).forEach(item=>{
        const card = document.createElement('div'); card.className='card';
        card.innerHTML = `
          <div style="position:relative;overflow:hidden;border-radius:10px;height:160px">
            <img src="${item.image}" style="width:100%;height:100%;object-fit:cover" />
            <div class="grade-badge">${item.grade}</div>
          </div>
          <div style="padding-top:12px">
            <div style="display:flex;justify-content:space-between;align-items:flex-start">
              <div>
                <div style="font-weight:800">${item.crop}</div>
                <div style="font-size:13px;color:var(--muted)">${item.location}</div>
              </div>
              <div style="text-align:right">
                <div style="font-weight:900;color:var(--primary)">₹${item.price}</div>
                <div style="font-size:13px;color:var(--muted)">${item.quantity} ${item.unit}</div>
              </div>
            </div>
            <div style="margin-top:10px;display:flex;gap:8px">
              <button class="btn btn-muted" data-i18n="btn.view">View</button>
              <button class="btn" data-i18n="btn.buyNow" style="background:var(--primary);color:white;border-radius:8px">Buy Now</button>
            </div>
          </div>
        `;
        grid.appendChild(card);
      });
    });
  }

  /* Community feed */
  function renderCommunityFeed(){
    const grid = document.getElementById('community-grid');
    if(!grid) return;
    grid.innerHTML = '';
    window.AGRI.COMMUNITY_POSTS.forEach(post=>{
      const card = document.createElement('div'); card.className='post';
      card.innerHTML = `
        <div class="post-header">
          <div class="avatar"><img src="${post.avatar}" style="width:100%;height:100%;object-fit:cover;border-radius:999px" /></div>
          <div>
            <div style="font-weight:700">${post.user}</div>
            <div style="font-size:12px;color:var(--muted)">${post.time}</div>
          </div>
        </div>
        <img class="post-image" src="${post.image}" />
        <div class="post-body">
          <div style="display:flex;gap:10px;margin-bottom:8px">
            <button class="btn" style="background:transparent">♡</button>
            <button class="btn" style="background:transparent">💬</button>
            <button class="btn" style="background:transparent">↗</button>
          </div>
          <div style="font-weight:700">${post.likes} likes</div>
          <div style="margin-top:8px">${post.caption}</div>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  function attachCreatePost(){
    const form = document.getElementById('post-form');
    if(!form) return;
    form.addEventListener('submit', e=>{
      e.preventDefault();
      const txt = (document.getElementById('post-text')||{}).value;
      if(!txt) return alert('Write something!');
      // naive add to top
      const newPost = { id:Date.now(), user:'You', avatar:'https://i.pravatar.cc/150?u=you', image:'https://images.unsplash.com/photo-1544947320-23b0f2d46cda?auto=format&fit=crop&q=80&w=1200', caption:txt, likes:0, time:'Just now' };
      window.AGRI.COMMUNITY_POSTS.unshift(newPost);
      renderCommunityFeed();
      form.reset();
      alert('Posted (local only)');
    });
  }

  /* Learning hub */
  function renderLearning(){
    const grid = document.getElementById('learning-grid');
    if(!grid) return;
    grid.innerHTML = '';
    window.AGRI.LEARNING_MODULES.forEach(m=>{
      const card = document.createElement('div'); card.className='card';
      card.innerHTML = `
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px">
          <div style="width:44px;height:44px;border-radius:10px;background:var(--primary);display:flex;align-items:center;justify-content:center;color:white;font-weight:700">${m.category[0]}</div>
          <div>
            <div style="font-size:13px;font-weight:800">${m.title}</div>
            <div style="font-size:12px;color:var(--muted)">${m.category}</div>
          </div>
        </div>
        <div style="margin-top:8px">${m.description}</div>
        <div style="margin-top:12px"><button class="btn" style="background:transparent;border:1px solid rgba(15,23,42,0.05);border-radius:10px;padding:8px 12px">Start Learning</button></div>
      `;
      grid.appendChild(card);
    });
  }

  /* Mandi locator */
  function attachMandiSearch(){
    const f = document.getElementById('mandi-form');
    if(!f) return;
    f.addEventListener('submit', e=>{
      e.preventDefault();
      const q = (document.getElementById('mandi-q')||{}).value;
      if(!q) return alert('Enter location (city or village)');
      const url = `https://www.openstreetmap.org/search?query=${encodeURIComponent(q+' mandi')}`;
      window.open(url,'_blank');
    });
  }

  /* Auth */
  function attachAuthForm(){
    const f = document.getElementById('auth-form');
    if(!f) return;
    f.addEventListener('submit', e=>{
      e.preventDefault();
      const email = (document.getElementById('auth-email')||{}).value;
      if(!email) return alert('Enter email');
      // fake OTP flow
      alert('OTP sent (demo). You will be redirected to home.');
      setTimeout(()=> location.href = 'index.html', 1000);
    });
  }

})();
