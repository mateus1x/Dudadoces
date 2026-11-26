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
  .drip path{fill:${CREAM}}
  .drip .d{transform-origin:top;animation:dripGrow 4s ease-in-out infinite;animation-delay:var(--dl,0s)}
  @keyframes dripGrow{0%,100%{transform:scaleY(1)}50%{transform:scaleY(1.28)}}
  /* faixa deslizante */
  .marquee{background:${BROWN};color:${PINK};overflow:hidden;white-space:nowrap;padding:14px 0;border-block:2px solid ${GOLD}}
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
    var d = '<svg class="drip" viewBox="0 0 1200 46" preserveAspectRatio="none"><path d="M0 46V8Q30 0 60 8T120 8V30Q120 38 128 38T136 30V8Q200 0 260 8T380 8V22Q380 30 388 30T396 22V8Q470 0 540 8T660 8V34Q660 44 670 44T680 34V8Q760 0 830 8T950 8V26Q950 34 958 34T966 26V8Q1040 0 1100 8T1200 8V46Z"/><path class="d" style="--dl:.4s" d="M0 0"/></svg>';
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
