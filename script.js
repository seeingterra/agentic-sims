// Small enhancements only; the page works fully without this file.
document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
  // Solid navigation bar once the page scrolls.
  const nav = document.querySelector('.nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Fade sections in as they arrive.
  const items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const seen = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) { entry.target.classList.add('shown'); seen.unobserve(entry.target); }
    }, { rootMargin: '0px 0px -8% 0px' });
    items.forEach(item => seen.observe(item));
  } else {
    items.forEach(item => item.classList.add('shown'));
  }

  // Tour: tabs swap the screenshot; arrow keys move between tabs.
  const tabs = [...document.querySelectorAll('.tabs [role="tab"]')];
  const viewer = document.getElementById('shot');
  if (!viewer || !tabs.length) return;
  const image = viewer.querySelector('img');
  const caption = viewer.querySelector('figcaption');
  const select = tab => {
    tabs.forEach(t => { const on = t === tab; t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1; });
    image.classList.add('swap');
    const next = new Image();
    next.onload = () => {
      viewer.dataset.kind = tab.dataset.kind;
      image.src = tab.dataset.src;
      image.alt = tab.dataset.alt;
      image.width = next.naturalWidth; image.height = next.naturalHeight;
      caption.textContent = tab.dataset.caption;
      requestAnimationFrame(() => image.classList.remove('swap'));
    };
    next.src = tab.dataset.src;
  };
  tabs.forEach((tab, index) => {
    tab.tabIndex = index === 0 ? 0 : -1;
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', event => {
      const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[event.key];
      if (!step) return;
      event.preventDefault();
      const target = tabs[(index + step + tabs.length) % tabs.length];
      target.focus(); select(target);
    });
  });
  // Warm the cache so switching tabs is instant.
  window.addEventListener('load', () => tabs.forEach(tab => { const warm = new Image(); warm.src = tab.dataset.src; }));
});
