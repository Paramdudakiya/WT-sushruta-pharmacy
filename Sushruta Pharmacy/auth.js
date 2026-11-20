(() => {
  const SESSION_KEY = 'sushrutaPharmacySession';
  const credentials = {
    admin: { email: 'param@gmail.com', password: 'admin123' },
    customer: { email: 'param@gmail.com', password: 'customer123' }
  };

  function getSession() {
    try {
      const session = JSON.parse(sessionStorage.getItem(SESSION_KEY));
      return session && credentials[session.role] && session.email === credentials[session.role].email ? session : null;
    } catch {
      return null;
    }
  }

  function login(role, email, password) {
    const account = credentials[role];
    if (!account || account.email !== email.trim().toLowerCase() || account.password !== password) return false;
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ role, email: account.email, loggedInAt: Date.now() }));
    return true;
  }

  function pathTo(file) {
    return window.location.pathname.toLowerCase().includes('/admin/') ? `../${file}` : file;
  }

  function dashboardFor(role) {
    return role === 'admin' ? pathTo('admin/dashboard.html') : pathTo('index.html');
  }

  function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    window.location.replace(pathTo('signin.html'));
  }

  function requireRole(role) {
    const session = getSession();
    if (!session) {
      window.location.replace(pathTo('signin.html'));
      return false;
    }
    if (session.role !== role) {
      window.location.replace(dashboardFor(session.role));
      return false;
    }
    return true;
  }

  function updateCustomerHeader() {
    const session = getSession();
    if (!session || session.role !== 'customer') return;

    document.querySelectorAll('.login-btn').forEach((button) => {
      button.href = '#';
      button.title = 'Log out';
      button.setAttribute('aria-label', 'Log out');
      button.innerHTML = '<span>Logout</span><i class="bi bi-box-arrow-right"></i>';
      button.addEventListener('click', (event) => {
        event.preventDefault();
        logout();
      });
    });
  }

  window.SushrutaAuth = { getSession, login, logout, requireRole, dashboardFor };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateCustomerHeader);
  } else {
    updateCustomerHeader();
  }
})();
