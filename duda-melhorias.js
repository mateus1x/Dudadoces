/* Duda Doces – animações, interações e extras (arquivo único).
   Uso: <script src="duda-tudo.js"></script> antes de </body>, depois dos outros scripts. */

/* Duda Doces – camada de animações e interações.
   Uso: adicione <script src="duda-melhorias.js"></script> antes de </body>.
   Não altera cores nem estrutura: só soma movimento e interatividade. */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var CREAM = '#FCF9F6', PINK = '#E8C1C1', RED = '#8A2B2B', BROWN = '#3A201E', GOLD = '#B38B59';

  /* ---------- CSS ---------- */
  var css = `
  #scroll-bar{position:fixed;top:0;left:0;height:4px;width:0;z-index:60;background:linear-gradient(90deg,${PINK},${RED},${GOLD});transition:width .1s linear;border-radius:0 4px 4px 0}
  .reveal{opacity:0;transform:translateY(34px) scale(.97);transition:opacity .8s cubic-bezier(.165,.84,.44,1),transform .8s cubic-bezier(.165,.84,.44,1);transition-delay:var(--d,0s)}
  .reveal.in{opacity:1;transform:none}
  .reveal-left{transform:translateX(-50px)}.reveal-right{transform:translateX(50px)}
  /* chocolate escorrendo */
  .drip{position:absolute;left:0;right:0;bottom:-1px;width:100%;height:46px;z-index:5;pointer-events:none;display:block}
  .drip path{fill:${BROWN}}
  .drip .d{transform-origin:top;animation:dripGrow 4s ease-in-out infinite;animation-delay:var(--dl,0s)}
  @keyframes dripGrow{0%,100%{transform:scaleY(1)}50%{transform:scaleY(1.28)}}
  /* faixa deslizante */
  .marquee{background:${BROWN};color:${PINK};overflow:hidden;white-space:nowrap;padding:14px 0;border-top:0;border-bottom:2px solid ${GOLD}}
  .marquee-track{display:inline-flex;gap:3rem;animation:marq 28s linear infinite;font-family:'Playfair Display',serif;font-style:italic;font-size:1.05rem}
  .marquee:hover .marquee-track{animation-play-state:paused}
  @keyframes marq{to{transform:translateX(-50%)}}
  /* frutas flutuando no hero */
  .hero-float{position:absolute;inset:0;z-index:4;pointer-events:none;overflow:hidden}
  .hero-float span{position:absolute;bottom:-40px;font-size:var(--s,22px);opacity:.0;animation:riseUp var(--t,12s) linear infinite;animation-delay:var(--dl,0s)}
  @keyframes riseUp{0%{transform:translateY(0) rotate(0);opacity:0}10%{opacity:.85}90%{opacity:.7}100%{transform:translateY(-110vh) rotate(360deg);opacity:0}}
  /* entrada do texto do hero */
  .carousel-item .carousel-content>*{opacity:0;transform:translateY(24px)}
  .carousel-item.on .carousel-content>*{animation:heroIn .9s cubic-bezier(.165,.84,.44,1) forwards}
  .carousel-item.on .carousel-content>*:nth-child(2){animation-delay:.15s}
  .carousel-item.on .carousel-content>*:nth-child(3){animation-delay:.3s}
  .carousel-item.on .carousel-content>*:nth-child(4){animation-delay:.45s}
  @keyframes heroIn{to{opacity:1;transform:none}}
  .carousel-item img{transition:transform .2s ease-out;will-change:transform}
  .carousel-item.on img{animation:kenburns 9s ease-out forwards}
  @keyframes kenburns{from{scale:1.02}to{scale:1.12}}
  /* cards */
  .product-card{transform-style:preserve-3d;will-change:transform}
  .product-card .shine{position:absolute;inset:0;pointer-events:none;border-radius:inherit;opacity:0;transition:opacity .3s;background:radial-gradient(circle at var(--mx,50%) var(--my,50%),rgba(255,255,255,.35),transparent 55%)}
  .product-card:hover .shine{opacity:1}
  .product-card{position:relative}
  /* botões: ondinha */
  .ripple{position:absolute;border-radius:50%;background:rgba(255,255,255,.45);transform:scale(0);animation:rip .6s ease-out forwards;pointer-events:none}
  @keyframes rip{to{transform:scale(4);opacity:0}}
  /* prévia do bombom */
  #bombom-preview-img.pop{animation:popImg .55s cubic-bezier(.34,1.56,.64,1)}
  @keyframes popImg{0%{transform:scale(.75) rotate(-6deg);filter:brightness(1.3)}100%{transform:none;filter:none}}
  #bombom-preview-price-tag.pop,#custom-bombom-price-display.pop{animation:priceBump .45s cubic-bezier(.34,1.56,.64,1)}
  @keyframes priceBump{0%{transform:scale(1.5)}100%{transform:scale(1)}}
  .btn-fruta:hover,.btn-recheio:hover,.btn-cobertura:hover{box-shadow:0 10px 24px -10px rgba(138,43,43,.35)}
  /* sacola */
  .bump{animation:bagBump .5s cubic-bezier(.34,1.56,.64,1)}
  @keyframes bagBump{0%{transform:scale(1)}40%{transform:scale(1.35) rotate(-10deg)}100%{transform:scale(1)}}
  .fly{position:fixed;z-index:9990;pointer-events:none;font-size:28px;transition:transform .8s cubic-bezier(.5,-.3,.7,.4),opacity .8s;will-change:transform}
  .fly img{width:44px;height:44px;border-radius:50%;object-fit:cover;border:2px solid #fff;box-shadow:0 6px 16px rgba(0,0,0,.25)}
  .confetti{position:fixed;z-index:9995;pointer-events:none;width:9px;height:9px;border-radius:2px}
  .spark{position:fixed;z-index:9995;pointer-events:none;font-size:16px;transition:transform .7s ease-out,opacity .7s}
  /* títulos: sublinhado desenhando */
  .reveal.in+.w-24,.w-24.reveal.in{animation:lineGrow .9s ease-out}
  @keyframes lineGrow{from{transform:scaleX(0)}to{transform:scaleX(1)}}
  @media (prefers-reduced-motion:reduce){.reveal{opacity:1;transform:none;transition:none}.hero-float,.marquee-track,.drip .d,.carousel-item.on img{animation:none}.carousel-item .carousel-content>*{opacity:1;transform:none}}
  `;
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

  /* ---------- barra de progresso ---------- */
  var bar = document.createElement('div'); bar.id = 'scroll-bar'; document.body.appendChild(bar);
  window.addEventListener('scroll', function () {
    var h = document.documentElement.scrollHeight - innerHeight;
    bar.style.width = (h > 0 ? scrollY / h * 100 : 0) + '%';
  }, { passive: true });

  /* ---------- revelar ao rolar ---------- */
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: .12 }) : null;
  function reveal(el, cls, delay) {
    if (!el || el.dataset.rv) return;
    el.dataset.rv = 1; el.classList.add('reveal'); if (cls) el.classList.add(cls);
    el.style.setProperty('--d', (delay || 0) + 's');
    io ? io.observe(el) : el.classList.add('in');
  }
  function setupReveals() {
    $$('section h2, section > div > span.rounded-full, #monte .w-24, #catalogo .w-20').forEach(function (e) { reveal(e); });
    $$('#monte .grid > div').forEach(function (e, i) { reveal(e, null, i * .12); });
    reveal($('#monte .max-w-2xl')); reveal($('#encomendas .lg\\:w-1\\/2:first-child'), 'reveal-left');
    reveal($('#encomendas .lg\\:w-1\\/2:last-child'), 'reveal-right');
  }

  /* ---------- cards do catálogo (renderizados dinamicamente) ---------- */
  function setupCards() {
    $$('#products-container .product-card').forEach(function (c, i) {
      if (c.dataset.fx) return; c.dataset.fx = 1;
      var s = document.createElement('div'); s.className = 'shine'; c.appendChild(s);
      reveal(c, null, (i % 3) * .1);
      c.addEventListener('mousemove', function (e) {
        if (reduce || innerWidth < 768) return;
        var r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        c.style.transform = 'translateY(-10px) perspective(900px) rotateX(' + ((.5 - y) * 8) + 'deg) rotateY(' + ((x - .5) * 10) + 'deg) scale(1.02)';
        c.style.setProperty('--mx', x * 100 + '%'); c.style.setProperty('--my', y * 100 + '%');
      });
      c.addEventListener('mouseleave', function () { c.style.transform = ''; });
    });
  }
  var pc = $('#products-container');
  if (pc) new MutationObserver(setupCards).observe(pc, { childList: true });

  /* ---------- hero: frutas flutuando, gota de chocolate, parallax ---------- */
  function setupHero() {
    var hero = $('.hero-carousel'); if (!hero) return;
    if (!reduce) {
      var f = document.createElement('div'); f.className = 'hero-float';
      var em = ['🍓', '🍫', '🍇', '✨', '🍓', '🤍'];
      for (var i = 0; i < 12; i++) {
        var sp = document.createElement('span'); sp.textContent = em[i % em.length];
        sp.style.left = (4 + i * 8) + '%'; sp.style.setProperty('--s', (16 + Math.random() * 20) + 'px');
        sp.style.setProperty('--t', (9 + Math.random() * 8) + 's'); sp.style.setProperty('--dl', (-Math.random() * 12) + 's');
        f.appendChild(sp);
      }
      hero.appendChild(f);
    }
    var d = '<svg class="drip" viewBox="0 0 1200 46" preserveAspectRatio="none"><path d="M0 46V24Q50 2 100 24T200 24T300 24T400 24T500 24T600 24T700 24T800 24T900 24T1000 24T1100 24T1200 24V46Z"/></svg>';
    hero.insertAdjacentHTML('beforeend', d);
    hero.addEventListener('mousemove', function (e) {
      if (reduce || innerWidth < 768) return;
      var x = (e.clientX / innerWidth - .5) * -14, y = (e.clientY / innerHeight - .5) * -10;
      $$('.carousel-item img', hero).forEach(function (im) { im.style.transform = 'translate(' + x + 'px,' + y + 'px)'; });
    });
    markActiveSlide();
  }
  function markActiveSlide() {
    var items = $$('.carousel-item'); var idx = (typeof currentSlide === 'number') ? currentSlide : 0;
    items.forEach(function (it, i) { it.classList.toggle('on', i === idx); });
  }
  var _show = window.showSlide;
  if (typeof _show === 'function') window.showSlide = function (i) { _show(i); markActiveSlide(); };

  /* ---------- faixa deslizante ---------- */
  function setupMarquee() {
    var m = $('#monte'); if (!m) return;
    var items = ['🍓 Brownie crocante por fora, cremoso por dentro', '🍫 Chocolate nobre', '🍇 Bombom sob encomenda', '🥛 Recheio de Leite Ninho', '✨ Feito à mão no Estoril'];
    var t = items.concat(items).map(function (x) { return '<span>' + x + '</span>'; }).join('');
    m.insertAdjacentHTML('beforebegin', '<div class="marquee" aria-hidden="true"><div class="marquee-track">' + t + t + '</div></div>');
  }

  /* ---------- efeitos pontuais ---------- */
  function confetti(x, y, n) {
    if (reduce) return; var cols = [PINK, RED, GOLD, '#fff', BROWN];
    for (var i = 0; i < (n || 28); i++) {
      var c = document.createElement('div'); c.className = 'confetti';
      c.style.left = x + 'px'; c.style.top = y + 'px'; c.style.background = cols[i % cols.length];
      document.body.appendChild(c);
      var a = Math.random() * Math.PI * 2, v = 60 + Math.random() * 140;
      c.animate([{ transform: 'translate(0,0) rotate(0)', opacity: 1 },
        { transform: 'translate(' + Math.cos(a) * v + 'px,' + (Math.sin(a) * v + 140) + 'px) rotate(' + (Math.random() * 720) + 'deg)', opacity: 0 }],
        { duration: 900 + Math.random() * 500, easing: 'cubic-bezier(.2,.7,.4,1)' }).onfinish = (function (el) { return function () { el.remove(); }; })(c);
    }
  }
  function sparkle(el) {
    if (reduce || !el) return; var r = el.getBoundingClientRect();
    for (var i = 0; i < 6; i++) {
      var s = document.createElement('span'); s.className = 'spark'; s.textContent = ['✨', '🍓', '💖'][i % 3];
      s.style.left = (r.left + r.width / 2) + 'px'; s.style.top = (r.top + r.height / 2) + 'px'; document.body.appendChild(s);
      requestAnimationFrame(function (el2, a) { return function () {
        el2.style.transform = 'translate(' + Math.cos(a) * 50 + 'px,' + Math.sin(a) * 50 + 'px) scale(1.4)'; el2.style.opacity = 0;
        setTimeout(function () { el2.remove(); }, 750); }; }(s, (i / 6) * Math.PI * 2));
    }
  }
  var lastClick = { x: innerWidth / 2, y: innerHeight / 2, img: null };
  document.addEventListener('click', function (e) {
    lastClick.x = e.clientX; lastClick.y = e.clientY;
    var card = e.target.closest && e.target.closest('.product-card');
    lastClick.img = card ? $('img', card) : null;
    var b = e.target.closest && e.target.closest('.btn-glow, button');
    if (b && getComputedStyle(b).position !== 'static') {
      var r = b.getBoundingClientRect(), rp = document.createElement('span'), sz = Math.max(r.width, r.height);
      rp.className = 'ripple'; rp.style.width = rp.style.height = sz + 'px';
      rp.style.left = (e.clientX - r.left - sz / 2) + 'px'; rp.style.top = (e.clientY - r.top - sz / 2) + 'px';
      b.appendChild(rp); setTimeout(function () { rp.remove(); }, 650);
    }
  }, true);

  function flyToBag(srcImg) {
    if (reduce) return;
    var target = (innerWidth < 768 ? $('#mobile-cart-count') : $('#cart-count')); if (!target) return;
    var t = target.getBoundingClientRect(), f = document.createElement('div'); f.className = 'fly';
    f.innerHTML = srcImg ? '<img src="' + srcImg.src + '">' : '🍫';
    f.style.left = (lastClick.x - 22) + 'px'; f.style.top = (lastClick.y - 22) + 'px'; document.body.appendChild(f);
    requestAnimationFrame(function () {
      f.style.transform = 'translate(' + (t.left - lastClick.x + 6) + 'px,' + (t.top - lastClick.y) + 'px) scale(.3)'; f.style.opacity = .4;
    });
    setTimeout(function () { f.remove(); $$('#cart-count,#mobile-cart-count').forEach(function (c) { c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump'); }); }, 820);
  }

  /* ---------- ganchos nas funções da loja ---------- */
  var _add = window.addToCart;
  if (typeof _add === 'function') window.addToCart = function (id) { flyToBag(lastClick.img); _add(id); };
  var _addC = window.addCustomBombomToCart;
  if (typeof _addC === 'function') window.addCustomBombomToCart = function () {
    flyToBag($('#bombom-preview-img')); confetti(lastClick.x, lastClick.y, 36); _addC();
  };
  var _sel = window.selectCustomOption;
  if (typeof _sel === 'function') window.selectCustomOption = function (c, v) {
    _sel(c, v);
    var img = $('#bombom-preview-img'), tag = $('#bombom-preview-price-tag'), pr = $('#custom-bombom-price-display');
    [img, tag, pr].forEach(function (el) { if (el) { el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop'); } });
    sparkle(document.getElementById(typeof obterIdSeguroBotao === 'function' ? obterIdSeguroBotao(c, customBombom[c]) : ''));
  };
  window.addEventListener('load', function () {
    var _fin = window.finalizeOrderWpp;
    if (typeof _fin === 'function') window.finalizeOrderWpp = async function () {
      var n = cart.length; var r = await _fin.apply(this, arguments);
      if (n && cart.length === 0) { confetti(innerWidth / 2, innerHeight / 2, 80); }
      return r;
    };
  });

  /* ---------- init ---------- */
  function init() { setupHero(); setupMarquee(); setupReveals(); setupCards(); }
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
})();

;

/* Duda Doces – extras: modal de produto, filtro, bombom desenhado, meta da sacola,
   depoimentos e contagem de datas. Carregue DEPOIS do duda-melhorias.js. */
(function () {
  'use strict';

  /* ======== CONFIGURAÇÕES (edite aqui) ======== */
  var META = { ativo: true, valor: 50, brinde: 'um brinde surpresa' };   // meta da sacola
  var DEPOIMENTOS = [                                                    // prints dos elogios
    { img: 'depoimento1.png' }, { img: 'depoimento2.png' },
    { img: 'depoimento3.png' }, { img: 'depoimento4.png' }
  ];
  /* ============================================ */

  var CREAM = '#FCF9F6', PINK = '#E8C1C1', RED = '#8A2B2B', BROWN = '#3A201E', GOLD = '#B38B59';
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function money(v) { return Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); }

  var css = `
  /* modal */
  .pm{position:fixed;inset:0;z-index:9000;display:none;align-items:center;justify-content:center;padding:16px;background:rgba(58,32,30,.7);backdrop-filter:blur(6px)}
  .pm.open{display:flex;animation:pmFade .3s ease}
  @keyframes pmFade{from{opacity:0}to{opacity:1}}
  .pm-box{position:relative;background:#fff;border-radius:28px;max-width:880px;width:100%;max-height:92vh;overflow:auto;display:grid;grid-template-columns:1fr;box-shadow:0 40px 90px -20px rgba(0,0,0,.5);animation:pmIn .5s cubic-bezier(.34,1.56,.64,1)}
  @keyframes pmIn{from{opacity:0;transform:translateY(40px) scale(.9)}to{opacity:1;transform:none}}
  @media(min-width:768px){.pm-box{grid-template-columns:1.1fr 1fr}}
  .pm-img{overflow:hidden;background:${CREAM};min-height:260px}
  .pm-img img{width:100%;height:100%;object-fit:cover;display:block;animation:pmZoom 8s ease-out forwards}
  @keyframes pmZoom{from{transform:scale(1)}to{transform:scale(1.12)}}
  .pm-body{padding:28px;display:flex;flex-direction:column;justify-content:center;gap:12px}
  .pm-cat{align-self:flex-start;background:${PINK}55;color:${RED};font-weight:700;font-size:11px;letter-spacing:.12em;text-transform:uppercase;padding:6px 14px;border-radius:99px}
  .pm-body h3{font-family:'Playfair Display',serif;font-size:1.9rem;font-weight:700;color:${BROWN};line-height:1.15}
  .pm-body p{color:#6b7280;line-height:1.7;font-size:.95rem}
  .pm-foot{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:8px;flex-wrap:wrap}
  .pm-price{font-size:2rem;font-weight:700;color:${RED}}
  .pm-add{background:${BROWN};color:#fff;font-weight:700;padding:14px 26px;border-radius:99px;border:0;cursor:pointer;transition:all .3s}
  .pm-add:hover{background:${RED};transform:scale(1.05)}
  .pm-x{position:absolute;top:12px;right:12px;z-index:2;width:40px;height:40px;border-radius:50%;border:0;background:rgba(255,255,255,.9);color:${BROWN};font-size:22px;cursor:pointer;transition:all .3s}
  .pm-x:hover{background:${RED};color:#fff;transform:rotate(90deg)}
  #products-container .product-card{cursor:pointer}
  /* filtro */
  .cat-filter{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin:0 0 28px}
  .cat-chip{border:2px solid ${PINK};background:#fff;color:${BROWN};font-weight:600;font-size:.85rem;padding:9px 22px;border-radius:99px;cursor:pointer;transition:all .3s}
  .cat-chip:hover{border-color:${RED};transform:translateY(-2px)}
  .cat-chip.on{background:${RED};border-color:${RED};color:#fff;box-shadow:0 10px 22px -10px ${RED}}
  .card-pop{animation:cardPop .55s cubic-bezier(.34,1.56,.64,1) both;animation-delay:var(--pd,0s)}
  @keyframes cardPop{from{opacity:0;transform:translateY(24px) scale(.88)}to{opacity:1;transform:none}}
  /* meta da sacola */
  #cart-goal{margin-bottom:14px;background:${CREAM};border:1px solid ${PINK}88;border-radius:16px;padding:10px 14px}
  #cart-goal p{font-size:12px;font-weight:700;color:${BROWN};margin-bottom:7px}
  #cart-goal .tr{height:9px;background:${PINK}66;border-radius:9px;overflow:hidden}
  #cart-goal .fl{height:100%;width:0;border-radius:9px;background:linear-gradient(90deg,${PINK},${RED});transition:width .7s cubic-bezier(.34,1.56,.64,1)}
  #cart-goal.ok .fl{background:linear-gradient(90deg,${GOLD},${RED})}
  /* contador */
  .cd{background:linear-gradient(135deg,${BROWN},#1F100F);color:#fff;padding:56px 16px;text-align:center;position:relative;overflow:hidden}
  .cd::before{content:'🍓 🍫 🍇 🍓 🍫 🍇 🍓 🍫';position:absolute;inset:auto 0 8px;font-size:22px;opacity:.12;letter-spacing:34px;white-space:nowrap;animation:cdSlide 30s linear infinite}
  @keyframes cdSlide{to{transform:translateX(-300px)}}
  .cd h2{font-family:'Playfair Display',serif;font-size:clamp(1.6rem,4.5vw,2.8rem);font-weight:700;margin:8px 0 6px}
  .cd small{color:${PINK};letter-spacing:.14em;text-transform:uppercase;font-size:11px;font-weight:600}
  .cd p{color:#e5d5d2;font-weight:300;max-width:520px;margin:0 auto 22px;font-size:.95rem}
  .cd-grid{display:flex;justify-content:center;gap:10px;margin-bottom:26px;position:relative}
  .cd-box{background:#ffffff14;border:1px solid #ffffff30;border-radius:18px;min-width:70px;padding:12px 8px}
  .cd-box b{display:block;font-size:1.9rem;font-family:'Playfair Display',serif;color:${PINK}}
  .cd-box i{font-style:normal;font-size:10px;letter-spacing:.12em;text-transform:uppercase;opacity:.75}
  .cd-box b.tick{animation:tick .35s ease}
  @keyframes tick{from{transform:translateY(-8px);opacity:.3}to{transform:none;opacity:1}}
  .cd-btn{background:${RED};color:#fff;font-weight:700;border:0;border-radius:99px;padding:15px 34px;cursor:pointer;transition:all .3s;position:relative}
  .cd-btn:hover{background:#6b1f1f;transform:scale(1.06)}
  /* clima de natal */
  .cd.natal::before{display:none}
  .cd.natal>*:not(.snow):not(.cd-lights):not(.cd-tree){position:relative;z-index:3}
  .cd-lights{position:absolute;top:0;left:0;right:0;height:40px;display:flex;justify-content:space-around;z-index:2;pointer-events:none}
  .cd-lights::before{content:'';position:absolute;top:2px;left:-2%;right:-2%;height:16px;border-bottom:2px solid #ffffff55;border-radius:0 0 50% 50%}
  .cd-lights i{width:12px;height:18px;margin-top:12px;background:var(--bc);border-radius:50% 50% 50% 50%/60% 60% 40% 40%;animation:bulb 1.6s ease-in-out infinite;animation-delay:var(--bd)}
  @keyframes bulb{0%,100%{opacity:.35;box-shadow:none}50%{opacity:1;box-shadow:0 0 14px 4px var(--bc)}}
  .snow{position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:1}
  .snow span{position:absolute;top:-20px;left:var(--sl);font-size:var(--ss);color:#fff;opacity:.85;animation:snowFall var(--st) linear infinite;animation-delay:var(--sd)}
  @keyframes snowFall{0%{transform:translate(0,0) rotate(0)}50%{transform:translate(24px,230px) rotate(180deg)}100%{transform:translate(-12px,470px) rotate(360deg)}}
  .cd-tree{position:absolute;bottom:12px;font-size:46px;z-index:2;transform-origin:bottom;animation:treeSway 4s ease-in-out infinite}
  .cd-tree.l{left:6%}.cd-tree.r{right:6%;animation-delay:-2s}
  @media(max-width:640px){.cd-tree{display:none}}
  @keyframes treeSway{0%,100%{transform:rotate(-4deg)}50%{transform:rotate(4deg)}}
  .cd.natal h2 .ho{display:inline-block;animation:hoho 2.4s ease-in-out infinite}
  @keyframes hoho{0%,100%{transform:rotate(-10deg) scale(1)}50%{transform:rotate(10deg) scale(1.2)}}
  .cd.natal .cd-btn{animation:giftPulse 2s ease-in-out infinite}
  @keyframes giftPulse{0%,100%{box-shadow:0 0 0 0 #8A2B2Baa}50%{box-shadow:0 0 0 14px #8A2B2B00}}
  @media(prefers-reduced-motion:reduce){.snow,.cd-lights i,.cd-tree,.cd.natal h2 .ho,.cd.natal .cd-btn{animation:none}}
  /* depoimentos */
  .dp{padding:64px 0;background:${CREAM}}
  .dp-head{text-align:center;margin-bottom:28px;padding:0 16px}
  .dp-head span{color:${RED};background:${PINK}4d;font-weight:600;font-size:12px;letter-spacing:.14em;text-transform:uppercase;padding:6px 16px;border-radius:99px;display:inline-block;margin-bottom:12px}
  .dp-head h2{font-family:'Playfair Display',serif;font-size:clamp(1.8rem,5vw,3rem);color:${BROWN};font-weight:700}
  .dp-wrap{position:relative;max-width:1100px;margin:0 auto}
  .dp-track{display:flex;gap:18px;overflow-x:auto;scroll-snap-type:x mandatory;padding:10px 24px 24px;scrollbar-width:none}
  .dp-track::-webkit-scrollbar{display:none}
  .dp-card{flex:0 0 min(260px,72vw);scroll-snap-align:center;background:#fff;border:1px solid ${PINK}88;border-radius:22px;padding:10px;box-shadow:0 20px 40px -20px ${RED}44;transition:transform .4s}
  .dp-card:hover{transform:translateY(-8px) rotate(-1deg)}
  .dp-card img{width:100%;display:block;border-radius:14px}
  .dp-nav{position:absolute;top:50%;transform:translateY(-50%);width:42px;height:42px;border-radius:50%;border:0;background:#fff;color:${RED};font-size:20px;box-shadow:0 8px 20px rgba(0,0,0,.15);cursor:pointer;z-index:2;display:none}
  @media(min-width:768px){.dp-nav{display:block}}
  .dp-nav:hover{background:${RED};color:#fff}
  `;
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  /* ============ 1. MODAL DO PRODUTO ============ */
  var pm = document.createElement('div'); pm.className = 'pm';
  pm.innerHTML = '<div class="pm-box"><button class="pm-x" aria-label="Fechar">×</button><div class="pm-img"><img alt=""></div><div class="pm-body"><span class="pm-cat"></span><h3></h3><p></p><div class="pm-foot"><strong class="pm-price"></strong><button class="pm-add">Adicionar à sacola</button></div></div></div>';
  document.body.appendChild(pm);
  var pmId = null;
  function closePm() { pm.classList.remove('open'); document.body.style.overflow = ''; }
  function openPm(id) {
    var p = (typeof products !== 'undefined' ? products : []).filter(function (x) { return String(x.id) === String(id); })[0];
    if (!p) return; pmId = id;
    var im = $('.pm-img img', pm); im.src = p.image; im.alt = p.name; im.style.animation = 'none'; void im.offsetWidth; im.style.animation = '';
    $('.pm-cat', pm).textContent = p.category || 'Doces'; $('h3', pm).textContent = p.name;
    $('p', pm).textContent = p.description; $('.pm-price', pm).textContent = money(p.price);
    pm.classList.add('open'); document.body.style.overflow = 'hidden';
  }
  pm.addEventListener('click', function (e) { if (e.target === pm || e.target.closest('.pm-x')) closePm(); });
  $('.pm-add', pm).addEventListener('click', function () { var id = pmId; closePm(); if (id) window.addToCart(id); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closePm(); });
  document.addEventListener('click', function (e) {
    var card = e.target.closest && e.target.closest('#products-container .product-card');
    if (!card || e.target.closest('button')) return;
    var b = $('button[onclick^="addToCart"]', card); if (!b) return;
    var m = b.getAttribute('onclick').match(/addToCart\('([^']+)'\)/); if (m) openPm(m[1]);
  });

  /* ============ 2. FILTRO POR CATEGORIA ============ */
  var pc = $('#products-container'), active = 'Todos';
  function applyFilter() {
    var n = 0;
    $$('.product-card', pc).forEach(function (c) {
      var cat = ($('span.uppercase', c) || {}).textContent; cat = (cat || '').trim();
      var show = active === 'Todos' || cat === active;
      c.style.display = show ? '' : 'none';
      if (show) { c.classList.remove('card-pop'); void c.offsetWidth; c.style.setProperty('--pd', (n++ * .07) + 's'); c.classList.add('card-pop'); }
    });
  }
  function buildFilter() {
    if (!pc) return;
    var cats = []; $$('.product-card span.uppercase', pc).forEach(function (s) { var t = s.textContent.trim(); if (t && cats.indexOf(t) < 0) cats.push(t); });
    var bar = $('#cat-filter'); if (!bar) { bar = document.createElement('div'); bar.id = 'cat-filter'; bar.className = 'cat-filter'; pc.parentNode.insertBefore(bar, pc); }
    if (cats.length < 2) { bar.innerHTML = ''; return; }
    if (cats.indexOf(active) < 0) active = 'Todos';
    bar.innerHTML = ['Todos'].concat(cats).map(function (c) { return '<button class="cat-chip' + (c === active ? ' on' : '') + '" data-c="' + c + '">' + c + '</button>'; }).join('');
    $$('.cat-chip', bar).forEach(function (b) { b.onclick = function () { active = b.dataset.c; $$('.cat-chip', bar).forEach(function (x) { x.classList.toggle('on', x === b); }); applyFilter(); }; });
  }
  if (pc) new MutationObserver(function () { buildFilter(); if (active !== 'Todos') applyFilter(); }).observe(pc, { childList: true });

  /* ============ 4. META DA SACOLA ============ */
  function setupGoal() {
    if (!META.ativo) return;
    var sub = $('#cart-subtotal'); if (!sub) return;
    var box = sub.parentElement.parentElement, g = document.createElement('div'); g.id = 'cart-goal';
    g.innerHTML = '<p></p><div class="tr"><div class="fl"></div></div>'; box.parentNode.insertBefore(g, box);
    function upd() {
      var t = (typeof cart !== 'undefined' ? cart : []).reduce(function (a, i) { return a + i.price * i.quantity; }, 0);
      g.style.display = t > 0 ? '' : 'none';
      var falta = META.valor - t; g.classList.toggle('ok', falta <= 0);
      $('p', g).textContent = falta > 0 ? '🎁 Faltam ' + money(falta) + ' para ganhar ' + META.brinde : '🎉 Parabéns! Você ganhou ' + META.brinde + '!';
      $('.fl', g).style.width = Math.min(100, t / META.valor * 100) + '%';
    }
    new MutationObserver(upd).observe(sub, { childList: true, characterData: true, subtree: true }); upd();
  }

  /* ============ 5. CONTAGEM DE DATAS ============ */
  function pascoa(y) {
    var a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3),
      h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451),
      mes = Math.floor((h + l - 7 * m + 114) / 31), dia = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(y, mes - 1, dia, 23, 59, 59);
  }
  function maes(y) { var w = new Date(y, 4, 1).getDay(); return new Date(y, 4, 1 + (7 - w) % 7 + 7, 23, 59, 59); }
  function proxima() {
    var now = new Date(), y = now.getFullYear(), L = [];
    [y, y + 1].forEach(function (a) { L.push({ n: 'Dia das Mães', d: maes(a) }, { n: 'Páscoa', d: pascoa(a) }, { n: 'Natal', d: new Date(a, 11, 25, 23, 59, 59) }); });
    return L.filter(function (e) { return e.d > now; }).sort(function (a, b) { return a.d - b.d; })[0];
  }
  function setupCountdown() {
    var anchor = $('#encomendas'); if (!anchor) return; var ev = proxima();
    var s = document.createElement('section'); s.className = 'cd';
    var art = ev.n === 'Natal' ? 'o' : (ev.n === 'Páscoa' ? 'a' : 'o');
    s.innerHTML = '<small>Datas especiais</small><h2>Já pensou n' + art + ' ' + ev.n + '?</h2><p>Reserve seus doces com antecedência e deixe tudo pronto para a data.</p>' +
      '<div class="cd-grid"><div class="cd-box"><b data-k="d">0</b><i>dias</i></div><div class="cd-box"><b data-k="h">0</b><i>horas</i></div><div class="cd-box"><b data-k="m">0</b><i>min</i></div><div class="cd-box"><b data-k="s">0</b><i>seg</i></div></div>' +
      '<button class="cd-btn">Encomendar para ' + (ev.n === 'Páscoa' ? 'a ' : 'o ') + ev.n + '</button>';
    anchor.parentNode.insertBefore(s, anchor);
    if (ev.n === 'Natal') {
      s.classList.add('natal');
      $('small', s).textContent = 'Clima de Natal';
      $('h2', s).innerHTML += ' <span class="ho">🎄</span>';
      $('p', s).textContent = 'Brownies e bombons para a ceia, para presentear ou para adoçar o Natal de alguém. Reserve com antecedência.';
      var cores = ['#E8C1C1', '#B38B59', '#ffffff', '#d9534f'], lz = '', nv = '';
      for (var i = 0; i < 18; i++) lz += '<i style="--bc:' + cores[i % 4] + ';--bd:' + (i % 4) * .4 + 's"></i>';
      for (var j = 0; j < 36; j++) nv += '<span style="--sl:' + (Math.random() * 100) + '%;--ss:' + (10 + Math.random() * 14) + 'px;--st:' + (7 + Math.random() * 7) + 's;--sd:' + (-Math.random() * 12) + 's">' + ['❄', '❅', '•'][j % 3] + '</span>';
      s.insertAdjacentHTML('afterbegin', '<div class="snow">' + nv + '</div><div class="cd-lights">' + lz + '</div><span class="cd-tree l">🎄</span><span class="cd-tree r">🎁</span>');
    }
    function tick() {
      var df = Math.max(0, ev.d - new Date()), v = { d: Math.floor(df / 864e5), h: Math.floor(df / 36e5) % 24, m: Math.floor(df / 6e4) % 60, s: Math.floor(df / 1e3) % 60 };
      $$('b', s).forEach(function (b) { var t = String(v[b.dataset.k]); if (b.textContent !== t) { b.textContent = t; if (b.dataset.k === 's') { b.classList.remove('tick'); void b.offsetWidth; b.classList.add('tick'); } } });
    }
    tick(); setInterval(tick, 1000);
    $('.cd-btn', s).onclick = function () {
      var dt = ev.d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });
      window.open('https://wa.me/' + WPP_NUMBER + '?text=' + encodeURIComponent('Olá Duda Doces! Quero encomendar doces para ' + (ev.n === 'Páscoa' ? 'a ' : 'o ') + ev.n + ' (' + dt + '). Pode me ajudar?'), '_blank', 'noopener,noreferrer');
    };
  }

  /* ============ 6. DEPOIMENTOS ============ */
  function setupDepoimentos() {
    var anchor = $('#encomendas'); if (!anchor || !DEPOIMENTOS.length) return;
    var s = document.createElement('section'); s.className = 'dp';
    s.innerHTML = '<div class="dp-head"><span>Carinho de quem provou</span><h2>O que dizem sobre nós</h2></div><div class="dp-wrap"><button class="dp-nav" style="left:-8px" aria-label="Anterior">‹</button><div class="dp-track"></div><button class="dp-nav" style="right:-8px" aria-label="Próximo">›</button></div>';
    var tr = $('.dp-track', s);
    DEPOIMENTOS.forEach(function (d) {
      var c = document.createElement('div'); c.className = 'dp-card';
      var im = new Image(); im.alt = 'Elogio de cliente da Duda Doces'; im.loading = 'lazy';
      im.onerror = function () { c.remove(); if (!tr.children.length) s.remove(); };
      im.src = d.img; c.appendChild(im); tr.appendChild(c);
    });
    anchor.parentNode.insertBefore(s, anchor);
    var step = function (dir) { tr.scrollBy({ left: dir * 280, behavior: 'smooth' }); };
    var nav = $$('.dp-nav', s); nav[0].onclick = function () { step(-1); }; nav[1].onclick = function () { step(1); };
    var hover = false; s.onmouseenter = function () { hover = true; }; s.onmouseleave = function () { hover = false; };
    setInterval(function () {
      if (hover || !s.isConnected) return;
      if (tr.scrollLeft + tr.clientWidth >= tr.scrollWidth - 10) tr.scrollTo({ left: 0, behavior: 'smooth' }); else step(1);
    }, 4500);
  }

  function init() { setupGoal(); setupCountdown(); setupDepoimentos(); buildFilter(); }
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
})();
