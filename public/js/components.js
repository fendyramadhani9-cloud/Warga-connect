/**
 * WargaKonek Desa Pajerukan - Shared UI Components & Layout Initializer
 */

function initLayout() {
  const path = window.location.pathname;
  const isAdmin = path.startsWith('/admin');

  // Highlight active links
  const links = document.querySelectorAll('.nav-link');
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    
    // Normalize path
    if (href === path || 
        (href === '/' && (path === '' || path === '/index.html')) ||
        (href === '/admin' && (path === '/admin/' || path === '/admin/index.html')) ||
        (href !== '/' && href !== '/admin' && path.startsWith(href))) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Setup Mobile Hamburger Menu
  const mobileToggle = document.getElementById('mobile-nav-toggle');
  const mobileDrawer = document.getElementById('mobile-nav-drawer');
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      mobileDrawer.classList.toggle('is-open');
      const isExpanded = mobileDrawer.classList.contains('is-open');
      mobileToggle.setAttribute('aria-expanded', isExpanded);
    });
  }

  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// Re-run icon initialization whenever content is dynamically updated
window.refreshIcons = function() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  initLayout();
});
