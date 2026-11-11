/* =========================================================
   미래연 그룹 — 디자인 시안 v1 인터랙션
   GSAP + ScrollTrigger (스크롤 애니메이션), Lenis (부드러운 스크롤)
   ========================================================= */
(function () {
  'use strict';

  var root = document.documentElement;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGsap = !!(window.gsap && window.ScrollTrigger);
  var lenis = null;

  /* ---------- 공통: 메뉴 · 안내 메시지 · 버튼 빛 ---------- */
  var header = $('.site-header');
  var toggle = $('.nav-toggle');

  function setMenu(open) {
    header.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
    if (lenis) { if (open) lenis.stop(); else lenis.start(); }
  }
  toggle.addEventListener('click', function () { setMenu(!header.classList.contains('is-open')); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  var toastEl = $('.toast');
  var toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('is-on'); }, 2200);
  }

  $$('.btn-sun').forEach(function (b) {
    b.addEventListener('pointermove', function (e) {
      var r = b.getBoundingClientRect();
      b.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      b.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  // 메뉴 링크: 시안에 없는 섹션은 안내만 띄운다
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var target = document.querySelector(id);
      e.preventDefault();
      setMenu(false);
      if (!target) { toast('이 섹션은 본 작업에서 추가됩니다'); return; }
      if (lenis) lenis.scrollTo(target, { duration: 1.0 });
      else target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    });
  });

  /* ---------- 애니메이션 없이 보여주기 (움직임 줄이기 설정 / 라이브러리 로딩 실패) ---------- */
  function staticState() {
    root.classList.remove('is-loading');
    $$('.stage').forEach(function (s) { s.classList.add('is-lit'); });
    $$('.lane').forEach(function (l) { l.style.setProperty('--p', 1); });
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) header.dataset.theme = entry.target.dataset.header || 'dark';
        });
      }, { rootMargin: '-64px 0px -85% 0px' });
      $$('[data-header]').forEach(function (section) { observer.observe(section); });
      observer.observe($('.hero'));
    }
  }
  if (!hasGsap || reduce) { staticState(); return; }

  gsap.registerPlugin(ScrollTrigger);

  /* ---------- 부드러운 스크롤 ---------- */
  if (typeof window.Lenis === 'function') {
    lenis = new Lenis({ duration: 0.9, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); } });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  function setHeader(theme) { if (header.dataset.theme !== theme) header.dataset.theme = theme; }

  /* =========================================================
     ① 첫 화면 — 해돋이
     ========================================================= */
  var hero = $('.hero');

  // 제목을 글자 단위로 쪼갠다 (한 글자씩 떠오르게)
  function splitNode(node) {
    Array.prototype.slice.call(node.childNodes).forEach(function (child) {
      if (child.nodeType === 3) {
        var frag = document.createDocumentFragment();
        Array.from(child.textContent).forEach(function (ch) {
          var outer = document.createElement('span');
          var inner = document.createElement('span');
          outer.className = 'ch';
          inner.textContent = ch;
          outer.appendChild(inner);
          frag.appendChild(outer);
        });
        node.replaceChild(frag, child);
      } else if (child.nodeType === 1) {
        splitNode(child);
      }
    });
  }
  $$('.hero-title > .line').forEach(splitNode);

  root.classList.remove('is-loading');

  // 글자는 1초 안에 다 읽히게 먼저 띄우고, 해는 그 뒤로 천천히 떠오른다
  var intro = gsap.timeline({ defaults: { ease: 'expo.out' } });
  intro
    .fromTo(hero, { '--ri': 0 }, { '--ri': 1, duration: 3.2, ease: 'power2.out' }, 0)
    .from('.hero .horizon', { scaleX: 0, duration: 2.4 }, 0.1)
    .from(header, { y: -20, autoAlpha: 0, duration: 1, clearProps: 'transform,opacity,visibility' }, 0.1)
    .from('.hero-kicker', { y: 14, autoAlpha: 0, duration: 1 }, 0.2)
    .from('.hero-title .ch > span', { yPercent: 118, duration: 1.2, stagger: 0.03 }, 0.3)
    .from(['.hero-sub', '.hero-services', '.hero-actions'], { y: 20, autoAlpha: 0, duration: 1.1, stagger: 0.1 }, 0.75)
    .from('.hero .creds li', { y: 16, autoAlpha: 0, duration: 1, stagger: 0.05 }, 1.0)
    .from('.scroll-cue > *', { autoAlpha: 0, y: 10, duration: 1, stagger: 0.1 }, 1.6)
    .fromTo('.hero-sheen .line',
      { backgroundPosition: '130% 0' },
      { backgroundPosition: '-30% 0', duration: 2.2, ease: 'power2.inOut', stagger: 0.16 }, 1.3);

  // 스크롤하면 해가 높이 떠오르고 하늘이 한낮으로 밝아진다
  gsap.timeline({
    scrollTrigger: {
      trigger: hero, start: 'top top', end: '+=100%', pin: true, scrub: 0.7,
      refreshPriority: 3, // 화면 고정 구간을 먼저 계산해야 아래 구간들의 위치가 맞는다
      onUpdate: function (self) { setHeader(self.progress > 0.5 ? 'light' : 'dark'); }
    }
  })
    .fromTo(hero, { '--rs': 0 }, { '--rs': 1, ease: 'power1.inOut', duration: 1 }, 0)
    // 그룹 소개가 아래에서 겹쳐 올라오기 전에(약 60%) 한낮이 완성되어야 이음매가 안 보인다
    .fromTo(hero, { '--noon': 0 }, { '--noon': 1, ease: 'power1.inOut', duration: 0.4 }, 0.2)
    .to('.hero-content', { yPercent: -16, autoAlpha: 0, ease: 'power2.in', duration: 0.42 }, 0.04)
    .to(['.creds-wrap', '.scroll-cue'], { autoAlpha: 0, y: 24, ease: 'power1.in', duration: 0.25 }, 0);

  /* =========================================================
     ② 그룹 소개 — 해가 지나가면 글자 그림자가 따라 돈다
     ========================================================= */
  var group = $('.group');
  var groupSun = $('.group-sun');
  var groupSvg = $('.group-path');
  var groupPath = $('.group-path path');
  var gW = 0;
  var gTop = window.matchMedia('(max-width: 860px)').matches ? 56 : 72;
  var gAmp = window.matchMedia('(max-width: 860px)').matches ? 50 : 84;

  function groupArc(p) {
    return { x: gW * (0.05 + 0.9 * p), y: gTop + gAmp * (1 - Math.sin(Math.PI * p)) };
  }
  function measureGroup() {
    var mobile = window.matchMedia('(max-width: 860px)').matches;
    gTop = mobile ? 56 : 72;
    gAmp = mobile ? 50 : 84;
    gW = group.clientWidth;
    groupSvg.setAttribute('viewBox', '0 0 ' + gW + ' ' + (gTop + gAmp + 20));
    groupSvg.style.height = (gTop + gAmp + 20) + 'px';
    var d = '';
    for (var i = 0; i <= 64; i++) {
      var pt = groupArc(i / 64);
      d += (i ? 'L' : 'M') + pt.x.toFixed(1) + ',' + pt.y.toFixed(1);
    }
    groupPath.setAttribute('d', d);
  }
  function renderGroup(p) {
    var pt = groupArc(p);
    var fade = clamp(p / 0.08, 0, 1);  // 첫 화면의 큰 해가 사라진 뒤에 작은 해가 나타난다
    groupSun.style.transform = 'translate(' + pt.x.toFixed(1) + 'px,' + pt.y.toFixed(1) + 'px)';
    groupSun.style.opacity = fade;
    groupSvg.style.opacity = fade;
    var a = (0.5 - p) * 2;              // +1: 해가 왼쪽, -1: 해가 오른쪽
    group.style.setProperty('--skew', (a * 56).toFixed(2) + 'deg');
    group.style.setProperty('--len', (0.32 + Math.abs(a) * 0.4).toFixed(3));
    group.style.setProperty('--sop', ((0.14 - Math.abs(a) * 0.04) * fade).toFixed(3));
    group.style.setProperty('--shx', (a * 18).toFixed(1));
  }
  measureGroup();
  renderGroup(0);

  var groupProxy = { p: 0 };
  gsap.to(groupProxy, {
    p: 1, ease: 'none',
    scrollTrigger: {
      trigger: '.group-statement', start: 'top 58%', end: 'bottom top', scrub: 0.6,
      onRefresh: function () { measureGroup(); renderGroup(groupProxy.p); }
    },
    onUpdate: function () { renderGroup(groupProxy.p); }
  });

  // 문장은 빛이 훑고 지나가듯 왼쪽부터 드러난다
  gsap.from('.cast-line', {
    clipPath: 'inset(-30% 100% -90% -30%)', duration: 1.8, ease: 'power3.inOut', stagger: 0.2,
    scrollTrigger: { trigger: '.cast', start: 'top 80%' }
  });
  gsap.from('.group-statement .section-tag', {
    autoAlpha: 0, x: -14, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: '.group-statement', start: 'top 85%' }
  });

  var meaningTl = gsap.timeline({ scrollTrigger: { trigger: '.meaning', start: 'top 78%' } });
  meaningTl
    .from('.glyph-sol', { autoAlpha: 0, scale: 0.86, duration: 1.4, ease: 'expo.out' }, 0)
    .from('.glyph-two', { autoAlpha: 0, x: -40, duration: 1.8, ease: 'expo.out' }, 0.2)
    .from('.meaning p', { autoAlpha: 0, y: 18, duration: 1.1, stagger: 0.12, ease: 'power3.out' }, 0.15);

  $$('.entity').forEach(function (el) {
    gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 86%' } })
      .from(el, { '--line': 0, duration: 1.4, ease: 'expo.out' }, 0)
      .from(el.children, { y: 22, autoAlpha: 0, duration: 1.1, stagger: 0.08, ease: 'power3.out' }, 0.1);
  });

  /* =========================================================
     ③ 9단계 사업화 로드맵 — 해가 단계를 따라 이동
     ========================================================= */
  var stagesEl = $('.stages');
  var stages = $$('.stage');
  var lanes = $$('.lane');
  var sky = $('.rm-sky');
  var svg = $('.rm-arc');
  var arcBase = $('.arc-base');
  var arcLit = $('.arc-lit');
  var clipRect = $('.arc-clip');
  var rmSun = $('.rm-sun');
  var nowNum = $('.now-num span');
  var nowName = $('.now-name span');
  var names = stages.map(function (s) { return $('.st-t', s).firstChild.textContent.trim(); });

  var W = 0, H = 0, centers = [], laneBox = [], current = 0;

  // 해가 지나가는 길: 왼쪽 수평선에서 떠올라 오른쪽 위(한낮)로
  function arcY(x) { return H - (H - 12) * Math.sin((x / W) * Math.PI / 2); }

  function measureRoad() {
    W = sky.clientWidth;
    H = sky.clientHeight;
    if (!W || !H) return;
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    var d = '';
    for (var i = 0; i <= 80; i++) {
      var x = (i / 80) * W;
      d += (i ? 'L' : 'M') + x.toFixed(1) + ',' + arcY(x).toFixed(1);
    }
    arcBase.setAttribute('d', d);
    arcLit.setAttribute('d', d);
    var left = sky.getBoundingClientRect().left;
    centers = stages.map(function (s) { var r = s.getBoundingClientRect(); return r.left - left + r.width / 2; });
    laneBox = lanes.map(function (l) { var r = l.getBoundingClientRect(); return [r.left - left, r.width]; });
  }

  function setNow(i) {
    if (i === current) return;
    var dir = i > current ? 1 : -1;
    current = i;
    nowNum.textContent = String(i + 1).padStart(2, '0');
    nowName.textContent = names[i];
    gsap.fromTo([nowNum, nowName],
      { yPercent: 80 * dir, autoAlpha: 0 },
      { yPercent: 0, autoAlpha: 1, duration: 0.6, ease: 'power3.out', stagger: 0.04, overwrite: true });
  }

  function renderRoad(p) {
    if (!W) return;
    var x = p * W;
    var y = arcY(x);
    rmSun.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)';
    clipRect.setAttribute('width', Math.max(0, x).toFixed(1));

    var cur = 0;
    for (var i = 0; i < stages.length; i++) {
      var c = centers[i];
      var lit = x >= c - 2;
      stages[i].classList.toggle('is-lit', lit);
      if (lit) cur = i;
      // 해의 위치에 따라 단계 이름의 그림자 방향과 길이를 바꾼다
      var dx = c - x;
      var hh = (H - y) + 40;
      var skew = clamp(Math.atan2(dx, hh) * 57.2958, -60, 60);
      var len = clamp(0.35 + Math.abs(dx) / (hh * 2.2), 0.35, 0.95);
      stages[i].style.setProperty('--skew', skew.toFixed(1) + 'deg');
      stages[i].style.setProperty('--len', len.toFixed(3));
    }
    for (var j = 0; j < lanes.length; j++) {
      var lp = clamp((x - laneBox[j][0]) / laneBox[j][1], 0, 1);
      lanes[j].style.setProperty('--p', lp.toFixed(3));
    }
    setNow(cur);
  }

  function resetRoad() {
    stages.forEach(function (s) {
      s.classList.remove('is-lit');
      s.style.removeProperty('--skew');
      s.style.removeProperty('--len');
    });
    lanes.forEach(function (l) { l.style.removeProperty('--p'); });
  }

  var mm = gsap.matchMedia();

  // PC: 화면을 고정해 두고, 스크롤하는 동안 해가 1단계부터 9단계까지 지나간다
  mm.add('(min-width: 861px)', function () {
    var proxy = { p: 0 };
    measureRoad();
    renderRoad(0);

    gsap.from('.process-head > *', {
      y: 30, autoAlpha: 0, duration: 1.2, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: '.process', start: 'top 72%' }
    });
    gsap.from('.now', {
      autoAlpha: 0, x: 30, duration: 1.2, ease: 'power3.out',
      scrollTrigger: { trigger: '.process', start: 'top 60%' }
    });

    gsap.to(proxy, {
      p: 1, ease: 'none',
      scrollTrigger: {
        trigger: '.process', start: 'top top',
        end: function () { return '+=' + Math.round(window.innerHeight * 1.7); },
        pin: true, scrub: 0.45, invalidateOnRefresh: true, refreshPriority: 2,
        onRefresh: function () { measureRoad(); renderRoad(proxy.p); }
      },
      onUpdate: function () { renderRoad(proxy.p); }
    });

    return resetRoad;
  });

  // 모바일: 세로로 늘어선 단계를 따라 해가 내려간다
  mm.add('(max-width: 860px)', function () {
    var vSun = $('.v-sun');
    var vLit = $('.v-lit');
    var proxy = { p: 0 };

    function renderV(p) {
      var h = stagesEl.offsetHeight;
      var y = p * h;
      vSun.style.transform = 'translateY(' + y.toFixed(1) + 'px)';
      vLit.style.transform = 'scaleY(' + p.toFixed(4) + ')';
      stages.forEach(function (s) { s.classList.toggle('is-lit', y >= s.offsetTop + 20); });
    }
    renderV(0);

    gsap.from('.process-head > *', {
      y: 26, autoAlpha: 0, duration: 1.1, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: '.process', start: 'top 75%' }
    });
    gsap.to(proxy, {
      p: 1, ease: 'none',
      scrollTrigger: { trigger: '.stages', start: 'top 70%', end: 'bottom 45%', scrub: 0.5 },
      onUpdate: function () { renderV(proxy.p); }
    });
    gsap.fromTo('.lane', { '--p': 0 }, {
      '--p': 1, duration: 1.4, ease: 'power2.out', stagger: 0.12,
      scrollTrigger: { trigger: '.lanes', start: 'top 82%' }
    });

    return function () {
      resetRoad();
      vSun.style.removeProperty('transform');
      vLit.style.removeProperty('transform');
    };
  });

  /* =========================================================
     ④ 상담 문의 — 노을
     ========================================================= */
  gsap.fromTo('.dusk-stage', { '--set': 0 }, {
    '--set': 1, ease: 'none',
    scrollTrigger: { trigger: '.dusk-stage', start: 'top 85%', end: 'bottom bottom', scrub: 0.8 }
  });
  gsap.from('.dusk-content > *', {
    y: 28, autoAlpha: 0, duration: 1.2, stagger: 0.1, ease: 'power3.out',
    scrollTrigger: { trigger: '.dusk-content', start: 'top 60%' }
  });
  gsap.from('.dusk-info > div', {
    y: 16, autoAlpha: 0, duration: 1, stagger: 0.08, ease: 'power3.out',
    scrollTrigger: { trigger: '.dusk-info', start: 'top 95%' }
  });

  /* ---------- 헤더 색: 지금 보이는 섹션이 밝은지 어두운지에 맞춘다 ---------- */
  $$('[data-header]').forEach(function (sec) {
    ScrollTrigger.create({
      trigger: sec, start: 'top 64px', end: 'bottom 64px',
      onEnter: function () { setHeader(sec.dataset.header); },
      onEnterBack: function () { setHeader(sec.dataset.header); }
    });
  });

  ScrollTrigger.sort();

  /* ---------- 글꼴이 늦게 들어오면 위치를 다시 잰다 ---------- */
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
  }
  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
