/* script.js
   Basic interactivity for Apex Furnishings:
   - Mobile nav toggle
   - Product filtering + live search
   - Contact form handler
   - Small helpers (close mobile menu on nav click, smooth scroll)
*/

/* -------------------------
   Mobile Menu Toggle
   ------------------------- */
function toggleMenu() {
  const nav = document.querySelector('.nav-links');
  if (!nav) return;
  nav.classList.toggle('active');
}

/* Close mobile menu when a nav link is clicked (improves UX on small screens) */
document.addEventListener('click', (e) => {
  // if a nav link is clicked, close the menu
  if (e.target.matches('.nav-links a') || e.target.closest('.nav-links a')) {
    const nav = document.querySelector('.nav-links');
    if (nav && nav.classList.contains('active')) nav.classList.remove('active');
  }
});

/* -------------------------
   Product Filters + Search
   ------------------------- */

/**
 * filterProducts(category)
 * Shows only products whose data-category matches `category`.
 * Use 'all' to show everything.
 */
function filterProducts(category = 'all') {
  const cards = document.querySelectorAll('.product-card');
  const filterBtns = document.querySelectorAll('.filter-btn');

  // update active button UI
  filterBtns.forEach(btn => {
    btn.classList.toggle('active', btn.textContent.trim().toLowerCase() === (category === 'all' ? 'all' : category));
  });

  cards.forEach(card => {
    const cat = (card.dataset.category || '').toLowerCase();
    if (category === 'all' || cat === category.toLowerCase()) {
      card.style.display = ''; // show (use CSS default)
    } else {
      card.style.display = 'none';
    }
  });
}

/**
 * searchProducts()
 * Live-search products by name or description.
 * Input element expected: #searchInput
 */
function searchProducts() {
  const qEl = document.getElementById('searchInput');
  if (!qEl) return;
  const q = qEl.value.trim().toLowerCase();
  const cards = document.querySelectorAll('.product-card');

  cards.forEach(card => {
    const name = (card.dataset.name || '').toLowerCase();
    const desc = (card.querySelector('p') ? card.querySelector('p').textContent : '').toLowerCase();
    const matches = name.includes(q) || desc.includes(q);
    // If there is an active filter (not All), honor both search & filter
    const currentFilterBtn = document.querySelector('.filter-btn.active');
    const currentFilter = currentFilterBtn ? currentFilterBtn.textContent.trim().toLowerCase() : 'all';
    const catMatch = (currentFilter === 'all') || (card.dataset.category === currentFilter);

    card.style.display = (matches && catMatch) ? '' : 'none';
  });
}

/* If page loads with a query param ?cat=office etc, apply filter */
(function applyInitialFilterFromQuery() {
  try {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('cat');
    if (cat) {
      // try to find matching filter button label; normalize to lowercase
      const normalized = cat.toLowerCase();
      // apply filter after DOM is ready
      document.addEventListener('DOMContentLoaded', () => filterProducts(normalized));
    }
  } catch (e) { /* ignore */ }
})();

/* -------------------------
   Contact Form Handler
   ------------------------- */

/**
 * handleContact(event)
 * Called on contact form submit. Validates minimal fields, shows an alert,
 * and (optionally) could POST to an API. For now it resets the form.
 */
function handleContact(event) {
  event.preventDefault();
  const form = event.target;

  // basic validation
  const name = (form.querySelector('#name') || {}).value || '';
  const email = (form.querySelector('#email') || {}).value || '';
  const phone = (form.querySelector('#phone') || {}).value || '';
  const message = (form.querySelector('#message') || {}).value || '';

  if (!name.trim() || !email.trim() || !phone.trim() || !message.trim()) {
    alert('Please fill all fields before submitting the form.');
    return;
  }

  // In a real site you would send this data to a server here.
  // For now we'll show a friendly message and reset the form.
  alert('Thank you, ' + name + '! Your message has been received. We will contact you soon.');
  form.reset();
}

/* Also expose handler for contact.html form in case it uses a different name */
window.handleContact = handleContact;

/* -------------------------
   Smooth anchor scrolling
   ------------------------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    // If it's an in-page anchor and the element exists, smooth scroll
    if (href.length > 1 && document.querySelector(href)) {
      e.preventDefault();
      document.querySelector(href).scrollIntoView({ behavior: 'smooth', block: 'start' });
      // close mobile menu after click
      const nav = document.querySelector('.nav-links');
      if (nav && nav.classList.contains('active')) nav.classList.remove('active');
    }
  });
});

/* -------------------------
   Small UX: on DOMContentLoaded set up initial states
   ------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  // ensure there is always one active filter button (default to 'All')
  const anyActive = document.querySelector('.filter-btn.active');
  if (!anyActive) {
    const first = document.querySelector('.filter-btn');
    if (first) first.classList.add('active');
  }

  // If products page and no search, ensure filter 'all' visible
  if (document.querySelector('.product-grid')) {
    // show all by default
    filterProducts('all');
  }
});
