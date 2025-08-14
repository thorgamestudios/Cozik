(function () {
  const READY_DELAY = 500; // 0,5 s zpoždění před prvním zobrazením hero

  const onReady = () => {
    const root = document.querySelector('main') || document.body;

    const blockSelectors =
      'h1,h2,h3,h4,h5,h6,p,li,blockquote,figure,article,section,.card,.btn,button,a,dt,dd';
    const excluded = ['header', 'nav', 'footer'];
    const isInExcluded = (el) => excluded.some((sel) => el.closest(sel));

    // Připrav všechny kandidáty (včetně hero) – na začátku neviditelné
    const candidates = Array.from(root.querySelectorAll(blockSelectors)).filter(
      (el) => !isInExcluded(el)
    );
    candidates.forEach((el) => el.classList.add('reveal'));

    // Najdi hero kontejner (kde je nadpis "Váš specialista..." a podnadpis "Objevte kouzlo...")
    const hero =
      root.querySelector('.hero') ||
      document.querySelector('[data-hero]') ||
      document.querySelector('header.hero') ||
      document.querySelector('.masthead') ||
      document.querySelector('.jumbotron') ||
      root.querySelector('section') ||
      null;

    const heroEls = hero ? Array.from(hero.querySelectorAll('.reveal')) : [];

    // Po 0,5 s plynule ukaž hero (stagger pro přirozené pořadí) a poté spusť globální pozorování
    setTimeout(() => {
      heroEls.forEach((el, i) => {
        setTimeout(() => el.classList.add('visible'), i * 80);
      });

      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add('visible');
              } else {
                entry.target.classList.remove('visible');
              }
            });
          },
          {
            root: null,
            threshold: 0.25,
            rootMargin: '0px 0px -10% 0px',
          }
        );

        // DŮLEŽITÉ: pozoruj *všechny* kandidáty, včetně hero prvků,
        // aby se efekt spouštěl znovu i po návratu do viewportu.
        candidates.forEach((el) => observer.observe(el));
      } else {
        // Fallback bez IO
        candidates.forEach((el) => el.classList.add('visible'));
      }
    }, READY_DELAY);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }
})();

