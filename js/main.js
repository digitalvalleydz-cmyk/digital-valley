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
    if (display) display.textContent = '$' + r.value;
  };
  r.addEventListener('input', updateSlider);
  updateSlider();
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
