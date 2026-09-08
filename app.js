(() => {
  'use strict';
  const all = window.CV_CONTENT;
  const langKeys = ['ru', 'en', 'az'];
  const EMAIL = '1zic.rs1@gmail.com';
  const PHONE = '+994 70 844 29 04';
  const root = document.documentElement;
  const main = document.querySelector('main');
  const nav = document.querySelector('#primary-nav');
  const picker = document.querySelector('.language-picker');
  const menu = document.querySelector('.menu-toggle');
  const theme = document.querySelector('.theme-toggle');
  const announcer = document.querySelector('#announcer');
  let lang = 'ru';
  let revealObserver, navObserver, copyTimer, framePending = false;
  const stored = key => { try { return localStorage.getItem(key); } catch (_) { return null; } };
  const save = (key, value) => { try { localStorage.setItem(key, value); } catch (_) {} };
  const queryLang = new URLSearchParams(location.search).get('lang');
  if (langKeys.includes(queryLang)) lang = queryLang;
  else if (langKeys.includes(stored('ramin-language'))) lang = stored('ramin-language');
  const escape = value => String(value).replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
  const lines = value => escape(value).replace(/\n/g, '<br>');
  const icon = type => `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">${({arrow:'<path d="M5 19 19 5M5 5h14v14"/>',down:'<path d="M12 3v13m-5-5 5 5 5-5M4 17v4h16v-4"/>',scroll:'<path d="M12 3v18m-6-6 6 6 6-6"/>',up:'<path d="M12 21V3m-6 6 6-6 6 6"/>',copy:'<rect x="8" y="8" width="12" height="13" rx="2"/><path d="M15 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3"/>',check:'<path d="m5 12 4 4L19 6"/>'})[type]}</svg>`;
  const pdfPath = () => `downloads/Ramin-Cavadov-CV-${lang.toUpperCase()}.pdf`;
  const certificatePath = () => 'downloads/A1QA-Ramin-Cavadov-Certificate.pdf';
  const download = d => `<a class="button download" href="${pdfPath()}" download><span>${escape(d.ui.pdf)}</span>${icon('down')}</a>`;
  const heading = (data) => `<div class="section-heading reveal"><p class="eyebrow">${escape(data.eyebrow)}</p><h2>${lines(data.title)}</h2>${data.intro ? `<p>${escape(data.intro)}</p>` : ''}</div>`;
  const personalProject = d => `<section class="section personal-section" id="kidsmap" aria-labelledby="kidsmap-title"><div class="section-inner">
    <p class="eyebrow reveal">${escape(d.personal.eyebrow)}</p>
    <div class="personal-layout">
      <div class="personal-copy reveal">
        <div class="kids-brand"><img src="assets/kidsmap-logo.svg" alt="" width="70" height="83" loading="lazy"><h2 id="kidsmap-title">KidsMap</h2></div>
        <p class="development-status"><span aria-hidden="true"></span>${escape(d.personal.status)}</p>
        <h3>${escape(d.personal.subtitle)}</h3><p class="personal-description">${escape(d.personal.description)}</p>
        <p class="personal-contribution">${escape(d.personal.contribution)}</p>
        <a class="button kids-cta" href="https://kidsmap.az/" target="_blank" rel="noopener noreferrer">${escape(d.personal.cta)}${icon('arrow')}</a>
        <details class="personal-details"><summary>${escape(d.personal.more)}<span class="detail-symbol" aria-hidden="true">+</span></summary><p>${escape(d.personal.detail)}</p></details>
      </div>
      <div class="kids-showcase reveal" data-kids-state="0">
        <div class="kids-map-visual" role="img" aria-label="${escape(d.personal.mapLabel)}">
          <svg class="map-drawing" viewBox="0 0 560 390" fill="none" aria-hidden="true">
            <rect width="560" height="390" rx="26" fill="var(--map-paper)" stroke="none"/>
            <path d="M-35 100 134 10 257 26 110 224-35 254Z" fill="var(--map-park)" stroke="none"/><path d="M385 211 556 145 605 273 447 427 337 364Z" fill="var(--map-park)" stroke="none"/>
            <path d="M-20 320C115 255 105 395 242 272S405 255 590 152" stroke="var(--map-water)" stroke-width="31"/>
            <path d="M-20 35 580 380M68-30 370 410M370-20 128 410M-30 214 585 53" stroke="var(--map-road-border)" stroke-width="25"/>
            <path d="M-20 35 580 380M68-30 370 410M370-20 128 410M-30 214 585 53" stroke="var(--map-road)" stroke-width="21"/>
            <path class="map-route" d="M127 108 237 170 321 155 414 232" stroke="var(--kids-accent)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="237" cy="170" r="7" fill="var(--kids-accent)" stroke="var(--map-road)" stroke-width="4"/>
          </svg>
          ${[0,1,2].map(index=>`<span class="map-pin map-pin-${index}" aria-hidden="true"><img src="assets/kidsmap-logo.svg" alt="" width="36" height="43" loading="lazy"></span>`).join('')}
          <span class="map-wordmark" aria-hidden="true">KidsMap<span>.az</span></span>
        </div>
        <div class="kids-feature-tabs" role="tablist" aria-label="${escape(d.personal.featureLabel)}">${d.personal.features.map((feature,index)=>`<button type="button" role="tab" class="kids-feature-tab" id="kids-tab-${index}" data-kids-feature="${index}" aria-selected="${index===0}" aria-controls="kids-panel-${index}" tabindex="${index===0?'0':'-1'}">${escape(feature.title)}</button>`).join('')}</div>
        <div class="kids-feature-panels">${d.personal.features.map((feature,index)=>`<div id="kids-panel-${index}" role="tabpanel" aria-labelledby="kids-tab-${index}" tabindex="0" ${index?'hidden':''}><span class="feature-number" aria-hidden="true">0${index+1}</span><p>${escape(feature.description)}</p></div>`).join('')}</div>
      </div>
    </div>
  </div></section>`;
  const languageProfiles = d => `<div class="languages reveal"><h3>${escape(d.education.languagesTitle)}</h3><p class="language-hint">${escape(d.education.languageHint)}</p>${d.education.languages.map(([name,level],index)=>`<details class="language-profile" ${index===2?'open':''}><summary><span>${escape(name)}</span><span class="language-level-label">${escape(level)}</span><span class="language-chevron" aria-hidden="true">+</span></summary><div class="language-description"><p>${escape(d.education.languageDetails[index])}</p>${index===2?`<div class="cefr-scale" aria-hidden="true">${['A1','A2','B1','B2','C1','C2'].map((label,step)=>`<span class="cefr-step ${step<3?'completed':''} ${step===2?'current':''}"><i></i>${label}</span>`).join('')}</div>`:''}</div></details>`).join('')}</div>`;
  function updateThemeLabel() {
    theme.setAttribute('aria-label', all[lang].ui[root.dataset.theme === 'dark' ? 'light' : 'dark']);
    document.querySelector('meta[name="theme-color"]').content = root.dataset.theme === 'dark' ? '#1b201c' : '#f6f4ee';
  }
  function closeMenu(returnFocus = false) {
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', all[lang].ui.menuOpen);
    nav.classList.remove('is-open');
    if (returnFocus) menu.focus();
  }
  function render(announce = false) {
    const d = all[lang];
    clearTimeout(copyTimer);
    root.lang = lang;
    document.title = 'Ramin Cavadov — Manual QA Engineer';
    document.querySelector('meta[name="description"]').content = d.meta;
    document.querySelector('meta[property="og:description"]').content = d.meta;
    document.querySelector('.skip-link').textContent = d.ui.skip;
    document.querySelector('.wordmark').setAttribute('aria-label', `Ramin Cavadov — ${d.ui.home}`);
    nav.setAttribute('aria-label', d.ui.nav);
    nav.innerHTML = ['experience','kidsmap','projects','skills','contact'].map((id, i) => `<a href="#${id}">${escape(d.nav[i])}</a>`).join('');
    document.querySelector('.current-language').textContent = lang.toUpperCase();
    picker.querySelector('summary').setAttribute('aria-label', d.ui.language);
    picker.querySelector('.language-options').setAttribute('aria-label', d.ui.language);
    document.querySelectorAll('[data-lang]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.lang === lang)));
    closeMenu();
    updateThemeLabel();
    main.innerHTML = `
      <section class="hero" id="home" aria-labelledby="hero-name">
        <div class="hero-grid">
          <div class="hero-copy">
            <p class="eyebrow"><span class="location-dot" aria-hidden="true"></span>${escape(d.hero.eyebrow)}</p>
            <h1 id="hero-name"><span>Ramin</span><span>Cavadov<span class="accent-dot">.</span></span></h1>
            <p class="hero-role">${escape(d.hero.role)}</p>
            <p class="hero-statement">${lines(d.hero.line)}</p>
            <p class="hero-intro">${escape(d.hero.intro)}</p>
            <div class="hero-actions"><a class="button" href="mailto:${EMAIL}">${escape(d.ui.contact)}${icon('arrow')}</a><a class="text-link" href="${pdfPath()}" download>${escape(d.ui.pdf)}${icon('down')}</a></div>
          </div>
          <figure class="hero-visual"><span class="portrait-cross" aria-hidden="true">+</span><div class="portrait-frame"><img src="assets/portrait.jpg" width="2560" height="2383" alt="${escape(d.ui.portrait)}" fetchpriority="high"></div><figcaption class="portrait-caption"><span>${lines(d.hero.caption)}</span><span>R.C.</span></figcaption></figure>
        </div>
        <div class="hero-bottom"><span class="micro">${escape(d.hero.note)}</span><a href="#experience">${escape(d.hero.scroll)}${icon('scroll')}</a></div>
      </section>
      <section class="section experience-section" id="experience"><div class="section-inner">
        ${heading(d.experience)}
        <article class="job reveal"><div><p class="tag">${escape(d.experience.tag)}</p><h3>${escape(d.experience.company)}</h3><p class="job-role">${escape(d.experience.role)}</p><p class="date">${escape(d.experience.date)}</p></div><p class="job-summary">${escape(d.experience.summary)}</p><details class="job-details"><summary>${escape(d.ui.more)}<span class="detail-symbol" aria-hidden="true">+</span></summary><ul class="responsibilities">${d.experience.bullets.map(item => `<li>${escape(item)}</li>`).join('')}</ul></details></article>
        <article class="a1qa-experience reveal"><div><p class="date">${escape(d.experience.a1qa.date)}</p><h3>A1QA</h3><p class="job-role">QA Trainee</p></div><div><p>${escape(d.experience.a1qa.description)}</p><a class="text-link" href="${certificatePath()}" download="A1QA-Ramin-Cavadov-Certificate.pdf">${escape(d.ui.certificate)}${icon('down')}</a></div></article>
        <div class="previous-block reveal"><div><h3>${escape(d.experience.previous)}</h3><p>${escape(d.experience.previousIntro)}</p></div><div>${d.experience.previousJobs.map(job => `<article class="previous-job"><p class="date">${escape(job.date)}</p><h4>${escape(job.title)}</h4><p>${escape(job.company)}</p>${job.description ? `<p>${escape(job.description)}</p>` : ''}</article>`).join('')}</div></div>
      </div></section>
      ${personalProject(d)}
      <section class="section projects-section" id="projects"><div class="section-inner">${heading(d.projects)}
        <div class="project-list">${d.projects.items.map((project, i) => `<article class="project-row reveal"><span class="section-number" aria-hidden="true">0${i+1}</span><div><h3><a class="project-name" href="${escape(project.url)}" target="_blank" rel="noopener noreferrer">${escape(project.name)}</a></h3><p class="project-platforms">${escape(project.platforms)}</p></div><div class="project-detail"><p class="project-description">${escape(project.description)}</p><p class="project-scope">${escape(project.scope)}</p>${project.links.length ? `<div class="project-links">${project.links.map(([label, url]) => `<a href="${escape(url)}" target="_blank" rel="noopener noreferrer" aria-label="${escape(project.name)} — ${label}">${label} ↗</a>`).join('')}</div>` : ''}</div><a class="project-arrow" href="${escape(project.url)}" target="_blank" rel="noopener noreferrer" aria-label="${escape(d.ui.projectLink)} — ${escape(project.name)}">${icon('arrow')}</a></article>`).join('')}</div>
      </div></section>
      <section class="section skills-section" id="skills"><div class="section-inner">${heading(d.skills)}
        <div class="skills-grid">${d.skills.groups.map((group, i) => `<article class="skill-group reveal"><span class="skill-index" aria-hidden="true">0${i+1}</span><h3>${escape(group.title)}</h3><p class="skill-note">${escape(group.note)}</p><ul>${group.items.map(item => `<li>${escape(item)}</li>`).join('')}</ul></article>`).join('')}</div>
        <div class="ai-workflow reveal"><div><h3>${escape(d.skills.ai.title)}</h3><ul class="ai-tools">${d.skills.ai.tools.map(tool=>`<li>${escape(tool)}</li>`).join('')}</ul></div><div><p>${escape(d.skills.ai.intro)}</p><p class="ai-note">${escape(d.skills.ai.note)}</p></div></div>
        <div class="workflow reveal"><span>${escape(d.skills.workflowLabel)}</span><p>${escape(d.skills.workflow)}</p></div>
      </div></section>
      <section class="section education-section" id="education"><div class="section-inner">${heading(d.education)}
        <div class="education-layout"><div>${d.education.items.map(item => `<article class="education-row reveal"><p class="date">${escape(item.date)}</p><div><h3>${escape(item.title)}</h3><p>${escape(item.description)}</p>${item.certificate ? `<a class="text-link certificate-link" href="${certificatePath()}" download="A1QA-Ramin-Cavadov-Certificate.pdf">${escape(d.ui.certificate)}${icon("down")}</a>` : ""}</div></article>`).join('')}</div>${languageProfiles(d)}</div>
      </div></section>
      <section class="section contact-section" id="contact"><div class="section-inner">${heading(d.contact)}
        <div class="contact-email-row reveal"><a class="contact-email" href="mailto:${EMAIL}">${EMAIL}</a><button class="icon-button copy-email" type="button" aria-label="${escape(d.ui.copy)}">${icon('copy')}</button></div><p class="copy-feedback" aria-live="polite"></p>
        <div class="contact-bottom reveal"><div class="contact-info"><div><span class="micro">${escape(d.ui.phone)}</span><a href="tel:+994708442904">${PHONE}</a></div><div><span class="micro">${escape(d.ui.location)}</span><p>${escape(d.contact.location)}</p></div></div><div class="download-wrap"><div>${download(d)}<p class="download-note">${escape(d.ui.downloadHint)}</p></div></div></div>
      </div></section>`;
    document.querySelector('.site-footer').innerHTML = `<span class="footer-signature">© ${new Date().getFullYear()} Ramin Cavadov</span><span class="footer-message">${escape(d.contact.footer)}</span><a class="footer-back" href="#home">${escape(d.ui.back)}${icon('up')}</a>`;
    observeSections();
    updateProgress();
    if (announce) announcer.textContent = d.ui.changed;
  }
  function observeSections() {
    revealObserver?.disconnect();
    navObserver?.disconnect();
    if (!('IntersectionObserver' in window)) return;
    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduceMotion) {
      root.classList.add('motion-ready');
      revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); }
      }), {threshold: .08});
      document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));
    }
    navObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        nav.querySelectorAll('a').forEach(link => {
          const current = link.hash === `#${entry.target.id}`;
          link.classList.toggle('active', current);
          if (current) link.setAttribute('aria-current','location'); else link.removeAttribute('aria-current');
        });
      }
    }), {rootMargin:'-15% 0px -65% 0px', threshold:0});
    document.querySelectorAll('main>section').forEach(section => navObserver.observe(section));
  }
  function updateProgress() {
    const maxScroll = root.scrollHeight - innerHeight;
    document.querySelector('.reading-progress').style.transform = `scaleX(${maxScroll > 0 ? Math.min(1, Math.max(0, scrollY/maxScroll)) : 0})`;
    framePending = false;
  }
  function selectKidsFeature(index, focus = false) {
    const showcase = document.querySelector('.kids-showcase');
    if (!showcase || index < 0 || index > 2) return;
    showcase.dataset.kidsState = String(index);
    showcase.querySelectorAll('[data-kids-feature]').forEach((button,i)=>{
      button.setAttribute('aria-selected',String(i===index));
      button.tabIndex=i===index?0:-1;
      document.querySelector(`#kids-panel-${i}`).hidden=i!==index;
      if(focus && i===index) button.focus();
    });
  }
  picker.addEventListener('click', event => {
    const button = event.target.closest('[data-lang]');
    if (!button) return;
    lang = button.dataset.lang;
    save('ramin-language',lang);
    const url = new URL(location.href);
    url.searchParams.set('lang',lang);
    try { history.replaceState(null,'',url); } catch (_) {}
    picker.open = false;
    render(true);
    picker.querySelector('summary').focus({preventScroll:true});
  });
  theme.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    save('ramin-theme',root.dataset.theme);
    updateThemeLabel();
  });
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded',String(open));
    menu.setAttribute('aria-label',all[lang].ui[open ? 'menuClose' : 'menuOpen']);
    nav.classList.toggle('is-open',open);
    picker.open = false;
  });
  nav.addEventListener('click', event => { if(event.target.closest('a')) closeMenu(); });
  document.addEventListener('click', event => {
    if (!picker.contains(event.target)) picker.open = false;
    if (!nav.contains(event.target) && !menu.contains(event.target)) closeMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    if (picker.open) {picker.open=false;picker.querySelector('summary').focus();}
    if (menu.getAttribute('aria-expanded') === 'true') closeMenu(true);
  });
  main.addEventListener('click', async event => {
    const feature = event.target.closest('[data-kids-feature]');
    if (feature) {selectKidsFeature(Number(feature.dataset.kidsFeature));return;}
    const button = event.target.closest('.copy-email');
    if (!button) return;
    const feedback = document.querySelector('.copy-feedback');
    const activeLang = lang;
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(EMAIL);
      else {
        const input=document.createElement('textarea');input.value=EMAIL;input.style.cssText='position:fixed;left:-10000px;top:0';document.body.append(input);input.select();const copied=document.execCommand('copy');input.remove();button.focus({preventScroll:true});if(!copied) throw new Error('Clipboard unavailable');
      }
      if (!button.isConnected || activeLang !== lang) return;
      button.innerHTML=icon('check');feedback.textContent=all[lang].ui.copied;button.setAttribute('aria-label',all[lang].ui.copied);
      copyTimer=setTimeout(()=>{if(button.isConnected){button.innerHTML=icon('copy');button.setAttribute('aria-label',all[lang].ui.copy);feedback.textContent='';}},3000);
    } catch (_) { if(feedback.isConnected) feedback.textContent=all[lang].ui.copyError; }
  });
  main.addEventListener('keydown',event=>{
    const feature=event.target.closest('[data-kids-feature]');
    if(!feature || !['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
    event.preventDefault();
    const current=Number(feature.dataset.kidsFeature);
    const next=event.key==='Home'?0:event.key==='End'?2:(current+(event.key==='ArrowRight'?1:2))%3;
    selectKidsFeature(next,true);
  });
  addEventListener('scroll',()=>{if(!framePending){framePending=true;requestAnimationFrame(updateProgress);}}, {passive:true});
  addEventListener('resize',()=>{updateProgress();if(innerWidth>680)closeMenu();}, {passive:true});
  matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', () => {
    root.classList.remove('motion-ready');observeSections();
  });
  render();
  if(location.hash) requestAnimationFrame(()=>document.getElementById(location.hash.slice(1))?.scrollIntoView({behavior:'instant'}));
})();
