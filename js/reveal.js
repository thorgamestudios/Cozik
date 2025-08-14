(function () {
  const onReady = () => {
    const root = document.querySelector('main') || document.body;

    // vyber kandidáty (text a běžný obsah), ale ne uvnitř header/nav/footer
    const blockSelectors = 'h1,h2,h3,h4,h5,h6,p,li,blockquote,figure,article,section,.card,.btn,button,a,dt,dd';
    const excluded = ['header', 'nav', 'footer'];
    const isInExcluded = (el) => excluded.some(sel => el.closest(sel));

    const candidates = Array.from(root.querySelectorAll(blockSelectors))
      .filter(el => !isInExcluded(el));

    // přidej .reveal všem kandidátům
    candidates.forEach(el => el.classList.add('reveal'));

    // HERO: nad hlavičkou stránky – zkus najít hero kontejner
    const hero =
      root.querySelector('.hero') ||
      document.querySelector('[data-hero]') ||
      document.querySelector('header.hero') ||
      document.querySelector('.masthead') ||
      document.querySelector('.jumbotron') ||
      // fallback: první viditelná sekce
      root.querySelector('section') ||
      null;

    const heroEls = hero
      ? Array.from(hero.querySelectorAll('.reveal'))
      : [];

    // nejdřív je všechno neviditelné; po 0,5 s začni zobrazovat hero (trvá 0,5 s)
    setTimeout(() => {
      heroEls.forEach((el, i) => {
        // malý „stagger“, aby šel nejdřív nadpis, pak podnadpis atd.
        setTimeout(() => el.classList.add('visible'), i * 80);
      });
    }, 500);

    // IO pro zbytek stránky (zobrazit pokaždé, když vstoupí do/odejde z viewportu)
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          } else {
            entry.target.classList.remove('visible');
          }
        });
      }, {
        root: null,
        threshold: 0.25,
        rootMargin: '0px 0px -10% 0px'
      });

      // nepozoruj hero prvky (ty už řešíme výše)
      const toObserve = candidates.filter(el => !hero || !hero.contains(el));
      toObserve.forEach(el => observer.observe(el));
    } else {
      // fallback bez IO: vše rovnou viditelné (krom zpožděného hero)
      candidates
        .filter(el => !hero || !hero.contains(el))
        .forEach(el => el.classList.add('visible'));
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }
})();

