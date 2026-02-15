// Floating Hearts dengan optimasi performa
(function initFloatingHearts() {
  let heartInterval;
  const heartsContainer = document.getElementById('floatingHearts');
  
  function createHeart() {
    if (!heartsContainer) return;
    
    const heart = document.createElement('div');
    heart.classList.add('heart');
    heart.innerHTML = '❤️';
    heart.style.left = Math.random() * 100 + '%';
    heart.style.fontSize = Math.random() * 30 + 15 + 'px';
    heart.style.animationDuration = Math.random() * 5 + 5 + 's';
    heart.style.animationDelay = Math.random() * 5 + 's';
    heartsContainer.appendChild(heart);

    // Gunakan requestAnimationFrame untuk animasi yang lebih smooth
    requestAnimationFrame(() => {
      setTimeout(() => {
        if (heart && heart.parentNode) {
          heart.remove();
        }
      }, 13000);
    });
  }

  // Hentikan interval jika container tidak ada
  if (heartsContainer) {
    heartInterval = setInterval(createHeart, 800); // Sedikit lebih cepat untuk efek lebih romantis
  }

  // Bersihkan interval saat page unload
  window.addEventListener('beforeunload', () => {
    if (heartInterval) clearInterval(heartInterval);
  });
})();

// Audio Manager dengan error handling
const audioManager = {
  music: document.getElementById('bgMusic'),
  btn: document.getElementById('musicBtn'),
  isPlaying: false,
  
  init() {
    if (this.music) {
      this.music.volume = 0.3;
      this.music.addEventListener('error', (e) => {
        console.log('Audio error:', e);
        this.showAudioError();
      });
      
      // Handle when audio ends
      this.music.addEventListener('ended', () => {
        this.isPlaying = false;
        if (this.btn) this.btn.innerHTML = '🔇';
      });
    }
  },
  
  showAudioError() {
    if (this.btn) {
      this.btn.innerHTML = '⚠️';
      this.btn.title = 'Audio tidak tersedia';
    }
  },
  
  async play() {
    if (!this.music) return;
    
    try {
      this.music.muted = false;
      await this.music.play();
      this.isPlaying = true;
      if (this.btn) this.btn.innerHTML = '🔊';
    } catch (e) {
      console.log('Autoplay prevented:', e);
      this.isPlaying = false;
      if (this.btn) this.btn.innerHTML = '🔇';
    }
  },
  
  toggle() {
    if (!this.music) return;
    
    if (this.music.paused) {
      this.play();
    } else {
      this.music.pause();
      this.isPlaying = false;
      if (this.btn) this.btn.innerHTML = '🔇';
    }
  }
};

// Unlock function dengan validasi lebih baik
function unlock() {
  const passwordInput = document.getElementById('password');
  if (!passwordInput) return;
  
  const password = passwordInput.value.trim();
  // Format password yang valid (case insensitive)
  const validPasswords = [
    '22des2023', '22122023', '22-12-23', '22des23', '22-12-2023',
    '22DES2023', '22DES23', '22 Desember 2023', '22Desember2023'
  ];
  
  if (validPasswords.includes(password.toLowerCase().replace(/\s+/g, ''))) {
    const lockscreen = document.getElementById('lockscreen');
    const mainContent = document.getElementById('mainContent');
    
    if (lockscreen) {
      lockscreen.style.display = 'none';
    }
    
    if (mainContent) {
      mainContent.classList.add('visible');
      
      // Trigger scroll reveal setelah konten terlihat
      setTimeout(() => {
        revealOnScroll();
      }, 500);
    }
    
    // Play music
    audioManager.play();
    
    // Start countdown
    updateTimer();
    if (window.timerInterval) clearInterval(window.timerInterval);
    window.timerInterval = setInterval(updateTimer, 1000);
    
    // Initialize semua animasi
    initScrollAnimations();
    initPoemAnimations();
    
  } else {
    // Efek shake untuk password salah
    alert('Tanggal yang salah sayang... Coba ingat-ingat lagi ❤️');
    
    const lockbox = document.querySelector('.lockbox');
    if (lockbox) {
      lockbox.style.animation = 'none';
      lockbox.offsetHeight; // Trigger reflow
      lockbox.style.animation = 'shake 0.3s';
      
      setTimeout(() => {
        lockbox.style.animation = 'slideUp 1s ease-out';
      }, 300);
    }
    
    // Clear input
    passwordInput.value = '';
    passwordInput.focus();
  }
}

// Handle enter key
function handleKeyPress(event) {
  if (event.key === 'Enter') {
    unlock();
  }
}

// Countdown timer dengan caching dan performa
const timerElements = {
  timer: document.getElementById('timer'),
  days: document.getElementById('days'),
  hours: document.getElementById('hours'),
  minutes: document.getElementById('minutes'),
  seconds: document.getElementById('seconds')
};

function updateTimer() {
  const startDate = new Date('2023-12-22T00:00:00');
  const now = new Date();
  const diff = now - startDate;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  // Format dengan leading zeros
  const formattedDays = days.toString().padStart(3, '0');
  const formattedHours = hours.toString().padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedSeconds = seconds.toString().padStart(2, '0');

  // Batch DOM updates untuk performa
  requestAnimationFrame(() => {
    if (timerElements.timer) {
      timerElements.timer.innerHTML = `${formattedDays} Hari, ${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    }
    if (timerElements.days) timerElements.days.innerHTML = formattedDays;
    if (timerElements.hours) timerElements.hours.innerHTML = formattedHours;
    if (timerElements.minutes) timerElements.minutes.innerHTML = formattedMinutes;
    if (timerElements.seconds) timerElements.seconds.innerHTML = formattedSeconds;
  });
}

// Toggle music (global function untuk onclick)
function toggleMusic() {
  audioManager.toggle();
}

// Scroll Animation dengan Intersection Observer
function initScrollAnimations() {
  const sections = document.querySelectorAll('section');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal');
        
        // Tambahkan efek khusus untuk section tertentu
        if (entry.target.classList.contains('poem-section') || 
            entry.target.classList.contains('poem-section-alt')) {
          animatePoemLines(entry.target);
        }
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
  });
  
  sections.forEach(section => observer.observe(section));
}

// Reveal on scroll (panggil setelah unlock)
function revealOnScroll() {
  const sections = document.querySelectorAll('section');
  sections.forEach(section => {
    const rect = section.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    if (rect.top < windowHeight - 100) {
      section.classList.add('reveal');
      
      if (section.classList.contains('poem-section') || 
          section.classList.contains('poem-section-alt')) {
        animatePoemLines(section);
      }
    }
  });
}

// Animasi untuk baris-baris puisi
function animatePoemLines(section) {
  const poemLines = section.querySelectorAll('.poem-line, .poem-line-alt');
  
  poemLines.forEach((line, index) => {
    line.style.animation = 'none';
    line.offsetHeight; // Trigger reflow
    line.style.animation = `fadeInUp 0.5s ease forwards ${index * 0.1}s`;
  });
}

// Inisialisasi animasi puisi saat halaman dimuat
function initPoemAnimations() {
  const poemSections = document.querySelectorAll('.poem-section, .poem-section-alt');
  
  poemSections.forEach(section => {
    if (section.classList.contains('reveal')) {
      animatePoemLines(section);
    }
  });
}

// Marquee animation dengan pause on hover
function initMarquee() {
  const marquees = document.querySelectorAll('.marquee');
  
  marquees.forEach(marquee => {
    marquee.addEventListener('mouseenter', () => {
      marquee.style.animationPlayState = 'paused';
    });
    
    marquee.addEventListener('mouseleave', () => {
      marquee.style.animationPlayState = 'running';
    });
  });
}

// Gallery item click untuk preview (opsional)
function initGallery() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img) {
        const src = img.src;
        const alt = img.alt;
        
        // Buat modal sederhana untuk preview
        showImagePreview(src, alt);
      }
    });
  });
}

// Image preview modal
function showImagePreview(src, alt) {
  // Hapus modal lama jika ada
  const oldModal = document.querySelector('.image-modal');
  if (oldModal) oldModal.remove();
  
  // Buat modal baru
  const modal = document.createElement('div');
  modal.className = 'image-modal';
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-modal">&times;</span>
      <img src="${src}" alt="${alt}">
      <p class="modal-caption">${alt} ❤️</p>
    </div>
  `;
  
  // Styling modal (inline karena tidak di CSS)
  modal.style.position = 'fixed';
  modal.style.top = '0';
  modal.style.left = '0';
  modal.style.width = '100%';
  modal.style.height = '100%';
  modal.style.backgroundColor = 'rgba(0,0,0,0.9)';
  modal.style.zIndex = '2000';
  modal.style.display = 'flex';
  modal.style.justifyContent = 'center';
  modal.style.alignItems = 'center';
  modal.style.cursor = 'pointer';
  
  const modalContent = modal.querySelector('.modal-content');
  modalContent.style.position = 'relative';
  modalContent.style.maxWidth = '90%';
  modalContent.style.maxHeight = '90%';
  
  const modalImg = modal.querySelector('img');
  modalImg.style.maxWidth = '100%';
  modalImg.style.maxHeight = '80vh';
  modalImg.style.borderRadius = '10px';
  modalImg.style.border = '3px solid #ff4d6d';
  
  const closeBtn = modal.querySelector('.close-modal');
  closeBtn.style.position = 'absolute';
  closeBtn.style.top = '-40px';
  closeBtn.style.right = '0';
  closeBtn.style.color = '#fff';
  closeBtn.style.fontSize = '40px';
  closeBtn.style.cursor = 'pointer';
  closeBtn.style.fontWeight = 'bold';
  
  const caption = modal.querySelector('.modal-caption');
  caption.style.textAlign = 'center';
  caption.style.color = '#ff8fab';
  caption.style.fontSize = '20px';
  caption.style.marginTop = '20px';
  caption.style.fontFamily = 'Dancing Script, cursive';
  
  // Close modal saat klik di background atau tombol close
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target === closeBtn) {
      modal.remove();
    }
  });
  
  document.body.appendChild(modal);
  
  // Animasi fade in
  modal.style.animation = 'fadeIn 0.3s';
  
  // Tambahkan keyframes jika belum ada
  if (!document.querySelector('#modal-animation')) {
    const style = document.createElement('style');
    style.id = 'modal-animation';
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }
}

// Handle visibility change untuk pause musik saat tab tidak aktif
document.addEventListener('visibilitychange', () => {
  if (document.hidden && audioManager.isPlaying) {
    audioManager.music.pause();
  } else if (!document.hidden && audioManager.isPlaying) {
    audioManager.music.play().catch(() => {});
  }
});

// Add shake animation keyframes jika belum ada
if (!document.querySelector('#shake-animation')) {
  const style = document.createElement('style');
  style.id = 'shake-animation';
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
      20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
  `;
  document.head.appendChild(style);
}

// Initialize saat DOM loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize audio
  audioManager.init();
  
  // Set default volume
  if (audioManager.music) {
    audioManager.music.volume = 0.3;
  }
  
  // Initialize marquee
  initMarquee();
  
  // Initialize gallery
  initGallery();
  
  // Check if content is already visible (for debugging)
  const mainContent = document.getElementById('mainContent');
  if (mainContent && mainContent.classList.contains('visible')) {
    updateTimer();
    setInterval(updateTimer, 1000);
    initScrollAnimations();
  }
  
  // Add smooth scroll for better UX
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
  
  console.log('❤️ Website for Wulan is ready! ❤️');
});

// Handle window scroll untuk efek parallax ringan
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const hearts = document.querySelector('.floating-hearts');
  
  if (hearts) {
    // Efek parallax sangat ringan untuk floating hearts
    hearts.style.transform = `translateY(${scrolled * 0.1}px)`;
  }
});

// Prevent right click untuk melindungi konten (opsional)
document.addEventListener('contextmenu', (e) => {
  // Hanya prevent di gambar
  if (e.target.tagName === 'IMG') {
    e.preventDefault();
  }
});

// Export functions untuk debugging (opsional)
if (typeof window !== 'undefined') {
  window.unlock = unlock;
  window.handleKeyPress = handleKeyPress;
  window.toggleMusic = toggleMusic;
  window.showImagePreview = showImagePreview; // Untuk debugging
}

// Bersihkan interval saat page unload
window.addEventListener('beforeunload', () => {
  if (window.timerInterval) {
    clearInterval(window.timerInterval);
  }
});