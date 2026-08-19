/**
 * WargaKonek Desa Pajerukan - Agenda Page JS
 */

document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('events-full-list');

  try {
    const res = await Api.get('/events');
    const events = res.data || [];

    if (events.length === 0) {
      container.innerHTML = Utils.renderEmpty('Belum ada agenda kegiatan yang terdaftar.', 'calendar');
      return;
    }

    const months = ['JANUARI', 'FEBRUARI', 'MARET', 'APRIL', 'MEI', 'JUNI', 'JULI', 'AGUSTUS', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DESEMBER'];

    container.innerHTML = events.map(evt => {
      const d = new Date(evt.date);
      const day = isNaN(d.getDate()) ? '20' : d.getDate();
      const monthStr = isNaN(d.getMonth()) ? 'AGUSTUS' : months[d.getMonth()];
      const year = isNaN(d.getFullYear()) ? '2026' : d.getFullYear();

      return `
        <div class="agenda-card">
          <div class="agenda-date-box">
            <div class="agenda-day">${day}</div>
            <div class="agenda-month">${monthStr.slice(0, 3)}</div>
          </div>
          <div class="agenda-details">
            <h3 class="agenda-title">${evt.title}</h3>
            
            <div class="agenda-meta-row">
              <span class="agenda-meta-item">
                <i data-lucide="calendar" class="icon icon-sm"></i>
                ${day} ${monthStr} ${year}
              </span>
              <span class="agenda-meta-item">
                <i data-lucide="clock" class="icon icon-sm"></i>
                ${evt.time}
              </span>
              <span class="agenda-meta-item">
                <i data-lucide="map-pin" class="icon icon-sm"></i>
                ${evt.location}
              </span>
            </div>

            <p style="font-size:0.9rem; color:var(--text-main); line-height:1.5; margin-bottom:0.75rem;">
              ${evt.description}
            </p>

            <div style="font-size:0.8rem; color:var(--text-muted); display:inline-flex; align-items:center; gap:0.35rem;">
              <i data-lucide="users" class="icon icon-sm"></i>
              <span>Penyelenggara: <strong>${evt.organizer}</strong></span>
            </div>
          </div>
        </div>
      `;
    }).join('');

    window.refreshIcons();
  } catch (error) {
    container.innerHTML = Utils.renderError('Gagal memuat daftar agenda kegiatan desa.');
  }
});
