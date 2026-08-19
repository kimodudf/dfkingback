/* =========================================================
   SAGE WATERCOLOR — SCRIPT
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Guest name from URL (?to=Nama) ---------- */
  const params = new URLSearchParams(window.location.search);
  const guest = params.get('to');
  if (guest) {
    document.getElementById('guestName').textContent = decodeURIComponent(guest.replace(/\+/g, ' '));
  }

  /* ---------- Opening screen ---------- */
  const opening = document.getElementById('opening');
  const openBtn = document.getElementById('openBtn');
  const mainContent = document.getElementById('mainContent');
  const bgMusic = document.getElementById('bgMusic');
  const musicToggle = document.getElementById('musicToggle');

  openBtn.addEventListener('click', () => {
    opening.classList.add('is-hidden');
    mainContent.classList.add('is-visible');
    document.body.style.overflow = 'auto';
    revealOnScroll();

    bgMusic.play().then(() => {
      musicToggle.classList.add('is-playing');
    }).catch(() => {
      /* autoplay blocked — user can toggle manually */
    });
  });

  document.body.style.overflow = 'hidden';

  /* ---------- Music toggle ---------- */
  musicToggle.addEventListener('click', () => {
    if (bgMusic.paused) {
      bgMusic.play().catch(() => {});
      musicToggle.classList.add('is-playing');
    } else {
      bgMusic.pause();
      musicToggle.classList.remove('is-playing');
    }
  });

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  function revealOnScroll() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => observer.observe(el));
  }

  /* ---------- Countdown ---------- */
  const eventDate = new Date('2026-06-20T08:00:00');

  function updateCountdown() {
    const now = new Date();
    let diff = eventDate - now;
    if (diff < 0) diff = 0;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    document.getElementById('cd-days').textContent = String(days).padStart(2, '0');
    document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('cd-minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('cd-seconds').textContent = String(seconds).padStart(2, '0');
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ---------- RSVP (terhubung ke Google Sheet via Apps Script) ---------- */
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxucWVFFkMwdLzmsn5wUWdQsh003zOGeaORZf3wlNWZa_pZCxIwZh3xw8P41fQZyVmuoA/exec';

  const rsvpForm = document.getElementById('rsvpForm');
  const rsvpList = document.getElementById('rsvpList');
  const rsvpSubmitBtn = rsvpForm.querySelector('button[type="submit"]');

  function addRSVPToList(entry, prepend = false) {
    const li = document.createElement('li');
    // Normalisasi value dari select box/form
    const isHadir = String(entry.attendance).toLowerCase() === 'hadir';
    const status = isHadir ? 'Akan hadir' : 'Tidak dapat hadir';
    
    li.innerHTML = `<b>${escapeHTML(entry.name)}</b> — ${status}${entry.message ? `<br>"${escapeHTML(entry.message)}"` : ''}`;
    if (prepend) {
      rsvpList.insertBefore(li, rsvpList.firstChild);
    } else {
      rsvpList.appendChild(li);
    }
  }

  function escapeHTML(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  async function loadRSVP() {
    try {
      const res = await fetch(GOOGLE_SCRIPT_URL);
      const entries = await res.json();
      rsvpList.innerHTML = '';
      // Balik urutan agar data terbaru muncul di paling atas
      entries.slice().reverse().forEach(entry => addRSVPToList(entry));
    } catch (err) {
      console.error('Gagal memuat data RSVP:', err);
    }
  }

  rsvpForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(rsvpForm);
    const entry = {
      name: formData.get('name').trim(),
      attendance: formData.get('attendance'),
      message: formData.get('message').trim()
    };

    rsvpSubmitBtn.disabled = true;
    rsvpSubmitBtn.textContent = 'Mengirim...';

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(entry)
      });
      
      addRSVPToList(entry, true);
      rsvpForm.reset();
    } catch (err) {
      alert('Gagal mengirim RSVP. Coba lagi.');
      console.error(err);
    } finally {
      rsvpSubmitBtn.disabled = false;
      rsvpSubmitBtn.textContent = 'Kirim';
    }
  });

  loadRSVP();

  /* ---------- Copy account number ---------- */
  const copyBtn = document.getElementById('copyBtn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const number = copyBtn.dataset.copy;
      navigator.clipboard.writeText(number).then(() => {
        const original = copyBtn.textContent;
        copyBtn.textContent = 'Tersalin!';
        setTimeout(() => { copyBtn.textContent = original; }, 1800);
      });
    });
  }

  /* ---------- Share invitation ---------- */
  const shareBtn = document.getElementById('shareBtn');
  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      const shareData = {
        title: document.title,
        text: 'Anda diundang ke pernikahan kami',
        url: window.location.href
      };
      if (navigator.share) {
        try { await navigator.share(shareData); } catch (err) { /* user cancelled */ }
      } else {
        navigator.clipboard.writeText(window.location.href).then(() => {
          alert('Link undangan disalin ke clipboard!');
        });
      }
    });
  }

});
