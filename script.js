/**
 * ==========================================================================
 * SCRIPT LOGIKA UTAMA & ANIMASI INTERAKTIF
 * Portfolio: Dinda Alexa Nabila Utomo
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. ANIMASI LATAR BELAKANG BERGERAK (CANVAS PARTICLES & CONSTELLATION)
  // ==========================================================================
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    const numberOfParticles = 55; // Kerapatan partikel optimal

    // Penyesuaian ukuran canvas ke ukuran jendela browser
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Deteksi posisi mouse untuk interaktivitas kursor
    const mouse = {
      x: null,
      y: null,
      radius: 120
    };

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.x;
      mouse.y = e.y;
    });

    window.addEventListener('mouseout', () => {
      mouse.x = null;
      mouse.y = null;
    });

    // Definisi Objek Partikel
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 0.7 - 0.35;
        this.speedY = Math.random() * 0.7 - 0.35;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Memantul jika mengenai tepi layar
        if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
        if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;

        // Efek interaksi mouse (partikel menghindar halus)
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouse.radius) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (mouse.radius - distance) / mouse.radius;
            this.x -= forceDirectionX * force * 1.5;
            this.y -= forceDirectionY * force * 1.5;
          }
        }
      }

      draw() {
        ctx.fillStyle = 'rgba(179, 207, 229, 0.75)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Inisialisasi Kumpulan Partikel
    function initParticles() {
      particlesArray = [];
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
      }
    }
    initParticles();

    // Hubungkan partikel yang berdekatan dengan garis neon lembut
    function connectParticles() {
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a + 1; b < particlesArray.length; b++) {
          const dx = particlesArray[a].x - particlesArray[b].x;
          const dy = particlesArray[a].y - particlesArray[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 130) {
            const opacity = 1 - (distance / 130);
            ctx.strokeStyle = `rgba(74, 127, 167, ${opacity * 0.35})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }
      }
    }

    // Loop Animasi 60 FPS
    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }
      connectParticles();
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  // ==========================================================================
  // 2. NAVBAR SCROLL EFFECT
  // ==========================================================================
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // ==========================================================================
  // 3. RESPONSIVE MOBILE MENU
  // ==========================================================================
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.querySelector('.nav-links');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        if (navLinks.classList.contains('active')) {
          icon.classList.remove('fa-bars');
          icon.classList.add('fa-xmark');
        } else {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      }
    });

    // Menutup menu mobile ketika salah satu tautan diklik
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      });
    });
  }

  // ==========================================================================
  // 4. TAB NAVIGASI PENGALAMAN (ORGANISASI / KEPANITIAAN / VOLUNTEER)
  // ==========================================================================
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-tab');

      // Perbarui status tombol aktif
      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      // Tampilkan panel yang bersangkutan
      tabPanels.forEach(panel => {
        if (panel.id === targetId) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });
    });
  });

  // ==========================================================================
  // 5. FILTER PORTFOLIO SHOWCASE
  // ==========================================================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Perbarui status tombol filter aktif
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const itemCategories = item.getAttribute('data-category') || '';
        if (filterValue === 'all' || itemCategories.includes(filterValue)) {
          item.classList.remove('hide');
        } else {
          item.classList.add('hide');
        }
      });
    });
  });

  // ==========================================================================
  // 6. SALIN EMAIL INSTAN (CLIPBOARD)
  // ==========================================================================
  const copyBtn = document.getElementById('copyEmailBtn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const email = 'alexadinda56@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        const icon = copyBtn.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-copy');
          icon.classList.add('fa-check');
        }
        copyBtn.title = 'Tersalin!';

        setTimeout(() => {
          if (icon) {
            icon.classList.remove('fa-check');
            icon.classList.add('fa-copy');
          }
          copyBtn.title = 'Salin Email';
        }, 2000);
      }).catch(err => {
        console.error('Gagal menyalin email:', err);
      });
    });
  }

});

// ==========================================================================
// 7. LIGHTBOX MODAL PREVIEW (GLOBAL SCOPE)
// ==========================================================================
function openLightbox(element, title) {
  const modal = document.getElementById('lightboxModal');
  const modalTitle = document.getElementById('lightboxTitle');
  const modalView = document.querySelector('.lightbox-view');

  if (modal && modalTitle && modalView) {
    modalTitle.textContent = title;

    // Cari tag <img> di dalam elemen yang diklik
    const img = element.querySelector('img');
    if (img && img.src && !img.src.includes('undefined')) {
      modalView.innerHTML = `<img src="${img.src}" alt="${title}" class="lightbox-img">`;
    } else {
      modalView.innerHTML = `<i class="fa-solid fa-image lightbox-placeholder-icon"></i>`;
    }

    modal.classList.add('active');
  }
}

function closeLightbox() {
  const modal = document.getElementById('lightboxModal');
  if (modal) {
    modal.classList.remove('active');
  }
}

// Menutup modal dengan menekan tombol ESC di keyboard
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeLightbox();
  }
});
