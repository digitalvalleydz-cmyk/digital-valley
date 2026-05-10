// ===== Dark Mode =====
const html = document.documentElement;
const darkToggleBtns = document.querySelectorAll('.dark-toggle');

function setDark(on) {
  html.classList.toggle('dark', on);
  localStorage.setItem('darkMode', on ? 'true' : 'false');
  darkToggleBtns.forEach(btn => {
    const icon = btn.querySelector('i');
    if (icon) icon.className = on ? 'fas fa-sun text-yellow-400' : 'fas fa-moon';
  });
}
if (localStorage.getItem('darkMode') === 'true' ||
  (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme:dark)').matches)) {
  setDark(true);
}
darkToggleBtns.forEach(btn => btn.addEventListener('click', () => setDark(!html.classList.contains('dark'))));

// ===== Mobile Menu =====
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const menuClose = document.getElementById('menu-close');
if (menuBtn && mobileMenu) {
  menuBtn.addEventListener('click', () => { mobileMenu.classList.add('active'); document.body.style.overflow = 'hidden'; });
  const closeMenu = () => { mobileMenu.classList.remove('active'); document.body.style.overflow = ''; };
  if (menuClose) menuClose.addEventListener('click', closeMenu);
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
}

// ===== Tab Switching =====
document.querySelectorAll('[data-tabs]').forEach(container => {
  const btns = container.querySelectorAll('.tab-btn');
  const parent = container.closest('section') || container.parentElement.closest('main') || container.parentElement;
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const target = btn.dataset.tab;
      parent.querySelectorAll('.tab-content').forEach(tc => {
        if (tc.id === target) {
          tc.style.display = 'block';
          tc.querySelectorAll('.product-card').forEach((card, i) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
              card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, i * 80);
          });
        } else {
          tc.style.display = 'none';
        }
      });
    });
  });
});

// ===== Form Validation =====
document.querySelectorAll('form[data-validate]').forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;
    form.querySelectorAll('[required]').forEach(field => {
      const err = field.parentElement.querySelector('.field-error');
      if (!field.value.trim()) {
        valid = false;
        field.style.borderColor = '#EF4444';
        if (err) err.textContent = 'This field is required';
      } else {
        field.style.borderColor = '';
        if (err) err.textContent = '';
      }
    });
    form.querySelectorAll('input[type="email"]').forEach(field => {
      if (field.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
        valid = false;
        field.style.borderColor = '#EF4444';
        const err = field.parentElement.querySelector('.field-error');
        if (err) err.textContent = 'Enter a valid email';
      }
    });
    const pw = form.querySelector('#password');
    const cpw = form.querySelector('#confirm-password');
    if (pw && cpw && pw.value !== cpw.value) {
      valid = false;
      cpw.style.borderColor = '#EF4444';
      const err = cpw.parentElement.querySelector('.field-error');
      if (err) err.textContent = 'Passwords do not match';
    }
    if (valid) showToast('✓ Form submitted successfully!');
  });
  // Live validation clear
  form.querySelectorAll('[required]').forEach(field => {
    field.addEventListener('input', () => {
      if (field.value.trim()) {
        field.style.borderColor = '';
        const err = field.parentElement.querySelector('.field-error');
        if (err) err.textContent = '';
      }
    });
  });
});

// ===== Toast =====
function showToast(msg) {
  document.querySelectorAll('.toast').forEach(t => t.remove());
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity 0.4s'; setTimeout(() => t.remove(), 400); }, 2800);
}

// ===== Cart (localStorage) =====
function getCart() { return JSON.parse(localStorage.getItem('cart') || '[]'); }
function saveCart(c) { localStorage.setItem('cart', JSON.stringify(c)); updateCartCount(); }
function addToCart(item) {
  const c = getCart();
  if (c.find(i => i.id === item.id)) return showToast('Already in cart');
  c.push(item);
  saveCart(c);
  showToast('🛒 Added to cart!');
}
function removeFromCart(id) { saveCart(getCart().filter(i => i.id !== id)); }
function updateCartCount() {
  const count = getCart().length;
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}
document.addEventListener('DOMContentLoaded', updateCartCount);

// ===== Price Range Slider =====
document.querySelectorAll('input[type="range"]').forEach(r => {
  const display = document.getElementById(r.id + '-val');
  const updateSlider = () => {
    const pct = ((r.value - r.min) / (r.max - r.min)) * 100;
    r.style.background = `linear-gradient(90deg, var(--primary) ${pct}%, var(--border) ${pct}%)`;
    if (display) {
      const curr = localStorage.getItem('currency') || 'USD';
      const lang = localStorage.getItem('lang') || 'en';
      const rate = curr === 'DZD' ? 132 : 1;
      const symbol = curr === 'DZD' ? (lang === 'ar' ? 'د.ج' : 'DZD') : '$';
      const val = parseInt(r.value) * rate;
      if (curr === 'DZD') {
        display.textContent = lang === 'ar' ? val.toLocaleString('ar-DZ') + ' ' + symbol : val.toLocaleString() + ' ' + symbol;
      } else {
        display.textContent = symbol + val;
      }
    }
  };
  r.addEventListener('input', updateSlider);
  updateSlider();
});

// ===== Currency Switcher =====
window.currencies = {
  USD: { symbol: '$', rate: 1 },
  DZD: { symbol: 'دج', rate: 132 }
};

window.setCurrency = function(curr) {
  if (!window.currencies[curr]) curr = 'USD';
  localStorage.setItem('currency', curr);
  const lang = localStorage.getItem('lang') || 'en';
  const c = {...window.currencies[curr]};
  
  // Dynamic DZD symbol based on language
  if (curr === 'DZD') {
    c.symbol = (lang === 'ar') ? 'د.ج' : 'DZD';
  }
  
  document.querySelectorAll('[data-price]').forEach(el => {
    const usdPrice = parseFloat(el.dataset.price);
    if (isNaN(usdPrice)) return;
    const converted = usdPrice * c.rate;
    
    if (curr === 'DZD') {
      if (lang === 'ar') {
        el.textContent = Math.round(converted).toLocaleString('ar-DZ') + ' ' + c.symbol;
      } else {
        el.textContent = Math.round(converted).toLocaleString() + ' ' + c.symbol;
      }
    } else {
      el.textContent = c.symbol + usdPrice.toFixed(2).replace(/\.00$/, '');
    }
  });

  // Update switcher UI
  document.querySelectorAll('.curr-btn').forEach(btn => {
    if (btn.dataset.curr === curr) {
      btn.classList.add('text-primary', 'font-bold');
      btn.classList.remove('text-[var(--text-secondary)]');
    } else {
      btn.classList.remove('text-primary', 'font-bold');
      btn.classList.add('text-[var(--text-secondary)]');
    }
  });

  // Update slider if present
  document.querySelectorAll('input[type="range"]').forEach(r => {
    r.dispatchEvent(new Event('input'));
  });

  // Update sell.html price symbol
  const symbolEl = document.getElementById('curr-symbol');
  if (symbolEl) {
    symbolEl.textContent = c.symbol;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const currentCurr = localStorage.getItem('currency') || 'USD';
  window.setCurrency(currentCurr);

  document.addEventListener('click', e => {
    const btn = e.target.closest('.curr-btn');
    if (btn) {
      e.preventDefault();
      window.setCurrency(btn.dataset.curr);
    }
  });
});

// ===== Intersection Observer for Animations =====
const observerOptions = { threshold: 0.08, rootMargin: '0px 0px -40px 0px' };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.transition = 'opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)';
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);
document.querySelectorAll('.observe').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  observer.observe(el);
});

// ===== Card Stagger Animation =====
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const cards = entry.target.querySelectorAll('.product-card, .card-animate');
      cards.forEach((card, i) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(24px)';
        setTimeout(() => {
          card.style.transition = 'opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, i * 100);
      });
      cardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.05 });
document.querySelectorAll('.card-grid').forEach(grid => cardObserver.observe(grid));

// ===== Marketplace Filters =====
function initMarketplaceFilters() {
  const searchInput = document.getElementById('search-input');
  const categoryFilter = document.getElementById('category-filter');
  const priceRange = document.getElementById('price-range');
  const sortFilter = document.getElementById('sort-filter');
  if (!searchInput && !categoryFilter) return;

  function filterCards() {
    const query = (searchInput?.value || '').toLowerCase();
    const cat = categoryFilter?.value || '';
    const maxPrice = priceRange ? parseInt(priceRange.value) : 9999;
    const sort = sortFilter?.value || '';

    document.querySelectorAll('.tab-content').forEach(tab => {
      if (tab.style.display === 'none') return;
      const cards = Array.from(tab.querySelectorAll('.product-card'));
      let visibleCards = [];

      cards.forEach(card => {
        const title = (card.dataset.title || card.querySelector('.card-title')?.textContent || '').toLowerCase();
        const cardCat = (card.dataset.category || '').toLowerCase();
        const cardPrice = parseInt(card.dataset.price || '0');

        const matchSearch = !query || title.includes(query);
        const matchCat = !cat || cardCat === cat.toLowerCase();
        const matchPrice = cardPrice <= maxPrice;

        if (matchSearch && matchCat && matchPrice) {
          card.style.display = '';
          visibleCards.push(card);
        } else {
          card.style.display = 'none';
        }
      });

      // Sort
      if (sort && visibleCards.length > 1) {
        const parent = visibleCards[0].parentElement;
        visibleCards.sort((a, b) => {
          const pa = parseInt(a.dataset.price || '0');
          const pb = parseInt(b.dataset.price || '0');
          const ra = parseFloat(a.dataset.rating || '0');
          const rb = parseFloat(b.dataset.rating || '0');
          const da = parseInt(a.dataset.order || '0');
          const db = parseInt(b.dataset.order || '0');
          if (sort === 'price-low') return pa - pb;
          if (sort === 'price-high') return pb - pa;
          if (sort === 'rating') return rb - ra;
          return db - da; // newest
        });
        visibleCards.forEach(c => parent.appendChild(c));
      }

      // Animate visible cards
      visibleCards.forEach((card, i) => {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95) translateY(10px)';
        setTimeout(() => {
          card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          card.style.opacity = '1';
          card.style.transform = 'scale(1) translateY(0)';
        }, i * 60);
      });

      // Show empty message
      const emptyMsg = tab.querySelector('.empty-results');
      if (emptyMsg) emptyMsg.style.display = visibleCards.length === 0 ? 'block' : 'none';
    });
  }

  searchInput?.addEventListener('input', filterCards);
  categoryFilter?.addEventListener('change', filterCards);
  priceRange?.addEventListener('input', filterCards);
  sortFilter?.addEventListener('change', filterCards);

  // Apply button
  document.getElementById('apply-filters')?.addEventListener('click', filterCards);
  // Reset
  document.getElementById('reset-filters')?.addEventListener('click', () => {
    if (searchInput) searchInput.value = '';
    if (categoryFilter) categoryFilter.value = '';
    if (priceRange) { priceRange.value = priceRange.max; priceRange.dispatchEvent(new Event('input')); }
    if (sortFilter) sortFilter.value = 'newest';
    filterCards();
  });
}
document.addEventListener('DOMContentLoaded', initMarketplaceFilters);

// ===== Counter Animation =====
function animateCounters() {
  document.querySelectorAll('.counter').forEach(el => {
    const target = parseInt(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const duration = 2000;
    const start = performance.now();
    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = prefix + Math.floor(target * eased).toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  });
}
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) { animateCounters(); counterObserver.unobserve(entry.target); }
  });
}, { threshold: 0.3 });
const statsSection = document.getElementById('stats-bar');
if (statsSection) counterObserver.observe(statsSection);

// ===== Cookie Consent Banner =====
function initCookieBanner() {
  if (localStorage.getItem('cookieConsent')) return;

  const bannerHtml = `
    <div id="cookie-banner" class="fixed bottom-6 left-6 right-6 md:left-auto md:max-w-md bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 shadow-xl z-[9999] animate-fade-in-up">
        <div class="flex items-start gap-4">
            <div class="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-primary text-xl shrink-0">
                <i class="fas fa-cookie-bite"></i>
            </div>
            <div class="flex-1">
                <h3 class="font-bold mb-1" data-i18n="footer_cookie">Cookie Policy</h3>
                <p class="text-sm text-[var(--text-secondary)] mb-4 leading-relaxed" data-i18n="cookie_banner_text">
                    We use cookies to improve your experience. By continuing to browse, you agree to our cookie policy.
                </p>
                <div class="flex items-center gap-3">
                    <button id="accept-cookies" class="btn-primary py-2 px-6 text-sm" data-i18n="btn_accept">Accept</button>
                    <button id="decline-cookies" class="btn-ghost py-2 px-6 text-sm" data-i18n="btn_decline">Decline</button>
                </div>
            </div>
        </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', bannerHtml);

  // Translate banner
  if (typeof setLanguage === 'function') {
    setLanguage(localStorage.getItem('lang') || 'en');
  }

  document.getElementById('accept-cookies').addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'accepted');
    const banner = document.getElementById('cookie-banner');
    banner.style.opacity = '0';
    banner.style.transform = 'translateY(20px)';
    banner.style.transition = 'all 0.4s ease';
    setTimeout(() => banner.remove(), 400);
  });

  document.getElementById('decline-cookies').addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'declined');
    const banner = document.getElementById('cookie-banner');
    banner.style.opacity = '0';
    banner.style.transform = 'translateY(20px)';
    banner.style.transition = 'all 0.4s ease';
    setTimeout(() => banner.remove(), 400);
  });
}
document.addEventListener('DOMContentLoaded', initCookieBanner);
