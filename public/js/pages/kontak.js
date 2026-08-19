/**
 * WargaKonek Desa Pajerukan - Contact Form JS
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  const btnSubmit = document.getElementById('btn-submit-contact');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name').value.trim();
    const contact = document.getElementById('contact-info').value.trim();
    const subject = document.getElementById('contact-subject').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    if (!name || !contact || !message) {
      Toast.show('Mohon lengkapi seluruh kolom yang bertanda bintang (*).', 'error');
      return;
    }

    btnSubmit.disabled = true;
    btnSubmit.innerHTML = `
      <div class="loading-spinner" style="width:16px; height:16px; margin:0; border-width:2px;"></div>
      <span>Mengirim Pesan...</span>
    `;

    try {
      const res = await Api.post('/contact', { name, contact, subject, message });
      Toast.show(res.message || 'Pesan aspirasi berhasil dikirimkan ke kantor desa!', 'success');
      form.reset();
    } catch (error) {
      Toast.show(error.message || 'Gagal mengirimkan pesan. Silakan coba beberapa saat lagi.', 'error');
    } finally {
      btnSubmit.disabled = false;
      btnSubmit.innerHTML = `
        <i data-lucide="send" class="icon icon-sm"></i>
        <span>Kirim Pesan ke Desa</span>
      `;
      window.refreshIcons();
    }
  });
});
