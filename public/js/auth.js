/**
 * WargaKonek Desa Pajerukan - Role & Session Handler (Mock Auth)
 */

const Auth = {
  getRole() {
    return localStorage.getItem('wargakonek_role') || 'warga';
  },

  setRole(role) {
    if (role === 'admin' || role === 'warga') {
      localStorage.setItem('wargakonek_role', role);
      window.dispatchEvent(new Event('auth-role-changed'));
    }
  },

  getCurrentUser() {
    const role = this.getRole();
    if (role === 'admin') {
      return {
        role: 'admin',
        name: 'Administrator Desa',
        id: 'admin-01'
      };
    }
    return {
      role: 'warga',
      name: 'Budi Santoso',
      contact: '081234567890',
      id: 'warga-01'
    };
  },

  initRoleSwitcher() {
    const switcherBtns = document.querySelectorAll('[data-switch-role]');
    switcherBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetRole = btn.getAttribute('data-switch-role');
        this.setRole(targetRole);
        
        Toast.show(`Beralih peran sebagai: ${targetRole === 'admin' ? 'Administrator Desa' : 'Warga Desa'}`);
        
        setTimeout(() => {
          if (targetRole === 'admin' && !window.location.pathname.startsWith('/admin')) {
            window.location.href = '/admin';
          } else if (targetRole === 'warga' && window.location.pathname.startsWith('/admin')) {
            window.location.href = '/laporan';
          } else {
            window.location.reload();
          }
        }, 600);
      });
    });

    this.updateRoleUI();
  },

  updateRoleUI() {
    const currentRole = this.getRole();
    const roleDisplays = document.querySelectorAll('.current-role-label');
    roleDisplays.forEach(el => {
      el.textContent = currentRole === 'admin' ? 'Administrator Desa' : 'Warga (Budi Santoso)';
    });

    const adminNavLinks = document.querySelectorAll('.admin-only-link');
    adminNavLinks.forEach(el => {
      el.style.display = currentRole === 'admin' ? 'inline-flex' : 'none';
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Auth.initRoleSwitcher();
});
