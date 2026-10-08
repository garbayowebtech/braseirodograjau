/* ============================================================
   BRASEIRO DO GRAJAÚ - MAIN.JS
   Scripts: Header fixo / scrolled, menu mobile, animações de scroll,
            tabs do cardápio, lightbox da galeria, scrollspy,
            botão voltar ao topo e cookie banner.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* --- 0. HELPERS (SAFE STORAGE & WHATSAPP CENTRALIZATION) --- */
  const safeStore = {
    get: (key) => {
      try { return localStorage.getItem(key); } catch (e) { return null; }
    },
    set: (key, val) => {
      try { localStorage.setItem(key, val); } catch (e) {}
    }
  };

  const getWhatsAppNumber = () => document.body.dataset.wa || '55219XXXXXXXX';
  const getWhatsAppUrl = (text) => `https://wa.me/${getWhatsAppNumber()}?text=${encodeURIComponent(text)}`;

  const syncWhatsAppLinks = () => {
    const num = getWhatsAppNumber();
    document.querySelectorAll('a[href*="wa.me/"]').forEach(link => {
      link.href = link.href.replace(/wa\.me\/[0-9X]+/, `wa.me/${num}`);
    });
  };
  syncWhatsAppLinks();

  
  /* --- FOCUS TRAP HELPER (ACERVO ACESSIBILIDADE WCAG) --- */
  function setupFocusTrap(modalEl) {
    let cleanup = null;
    return {
      activate: () => {
        const focusable = modalEl.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        const handleKeyDown = (e) => {
          if (e.key !== 'Tab') return;
          if (e.shiftKey) {
            if (document.activeElement === first) {
              e.preventDefault();
              last.focus();
            }
          } else {
            if (document.activeElement === last) {
              e.preventDefault();
              first.focus();
            }
          }
        };

        modalEl.addEventListener('keydown', handleKeyDown);
        cleanup = () => modalEl.removeEventListener('keydown', handleKeyDown);
      },
      deactivate: () => {
        if (cleanup) { cleanup(); cleanup = null; }
      }
    };
  }

/* --- 1. HEADER SCROLL & BACK-TO-TOP VISIBILITY ------------- */
  const header = document.getElementById('header') || document.querySelector('.header');
  const backToTopBtn = document.getElementById('back-to-top');

  const onScroll = () => {
    const currentY = window.pageYOffset || document.documentElement.scrollTop || window.scrollY || 0;
    
    // Header sólido ao rolar
    if (header) {
      if (currentY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Botão Voltar ao Topo
    if (backToTopBtn) {
      backToTopBtn.classList.toggle('visible', currentY > 400);
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Executa imediatamente ao carregar

  /* --- 2. MENU MOBILE HAMBURGER ----- */
  const hamburger = document.getElementById('hamburger');
  const navLinksContainer = document.getElementById('navLinks');

  const closeMenu = () => {
    if (hamburger && navLinksContainer) {
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      navLinksContainer.classList.remove('active');
      if (header) header.classList.remove('menu-open');
      document.body.style.overflow = '';
    }
  };

  if (hamburger && navLinksContainer) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      navLinksContainer.classList.toggle('active', isOpen);
      if (header) header.classList.toggle('menu-open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Fechar menu ao clicar em qualquer link
    navLinksContainer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Fechar menu com a tecla Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinksContainer.classList.contains('active')) {
        closeMenu();
      }
    });

    // Fechar menu se redimensionar para tela desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && navLinksContainer.classList.contains('active')) {
        closeMenu();
      }
    });
  }

  /* --- 3. SCROLLSPY (IntersectionObserver de alto desempenho) --- */
  const spySections = document.querySelectorAll('main > section[id], section[id]');
  const spyNavLinks = document.querySelectorAll('.nav-links a:not(.btn)');

  if ('IntersectionObserver' in window && spySections.length) {
    const visibleSections = new Map();
    const spyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          visibleSections.set(entry.target.id, entry.intersectionRatio);
        } else {
          visibleSections.delete(entry.target.id);
        }
      });

      let bestId = null;
      let maxRatio = -1;
      visibleSections.forEach((ratio, id) => {
        if (ratio > maxRatio) {
          maxRatio = ratio;
          bestId = id;
        }
      });

      if (bestId) {
        spyNavLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${bestId}`);
        });
      }
    }, {
      rootMargin: '-20% 0px -40% 0px',
      threshold: [0, 0.2, 0.5, 0.8]
    });

    spySections.forEach(s => spyObserver.observe(s));
  }

  /* --- 4. HERO BG PARALLAX LOAD EFFECT ----------------------- */
  const hero = document.querySelector('.hero');
  if (hero) {
    setTimeout(() => hero.classList.add('loaded'), 100);
  }

  /* --- 4.5. HERO TITLE TYPING EFFECT (LOOP) ------------------- */
  const typedEl = document.getElementById('heroTypedText');
  const heroTitleEl = document.getElementById('heroTitle');
  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (typedEl && !prefersReducedMotion) {
    // Quebras de linha fixas (somente mobile): '|' vira <br class="hero-br">,
    // que fica oculto no desktop. Só é emitido quando o próximo caractere já foi digitado.
    const BR = '<br class="hero-br">';
    function sliceMarked(str, n) {
      let out = '';
      let c = 0;
      for (const ch of str) {
        if (c >= n) break;
        if (ch === '|') { out += BR; continue; }
        out += ch;
        c++;
      }
      return out;
    }

    const phrases = [
      {
        prefix: "Churrasco de |verdade é feito |na ",
        highlight: "Brasa",
        suffix: ".",
        length: 38,
        render: function(count) {
          const pLen = 32;
          const hLen = 5;
          if (count <= pLen) {
            return sliceMarked(this.prefix, count);
          } else if (count <= pLen + hLen) {
            const hPart = this.highlight.slice(0, count - pLen);
            return sliceMarked(this.prefix, pLen) + '<span class="highlight fire-text">' + hPart + '</span>';
          } else {
            const sPart = this.suffix.slice(0, count - pLen - hLen);
            return sliceMarked(this.prefix, pLen) + '<span class="highlight fire-text">' + this.highlight + '</span>' + sPart;
          }
        },
        holdTime: 2600
      },
      {
        text: "Chama todo |mundo e vem |pra cá!",
        length: 31,
        render: function(count) {
          return sliceMarked(this.text, count);
        },
        holdTime: 2800
      }
    ];

    // Estabilizador Dinâmico de Altura (impede que a tagline se desloque)
    function syncHeroTitleHeight() {
      if (!heroTitleEl) return;
      const tester = document.createElement('div');
      const comp = window.getComputedStyle(heroTitleEl);

      tester.style.position = 'absolute';
      tester.style.visibility = 'hidden';
      tester.style.pointerEvents = 'none';
      tester.style.left = '-9999px';
      tester.style.top = '-9999px';
      tester.style.width = heroTitleEl.clientWidth + 'px';
      tester.style.fontFamily = comp.fontFamily;
      tester.style.fontSize = comp.fontSize;
      tester.style.fontWeight = comp.fontWeight;
      tester.style.lineHeight = comp.lineHeight;
      tester.style.letterSpacing = comp.letterSpacing;
      tester.style.wordBreak = 'break-word';
      tester.style.whiteSpace = comp.whiteSpace;
      tester.style.boxSizing = 'border-box';
      document.body.appendChild(tester);

      tester.innerHTML = 'Churrasco de ' + BR + 'verdade é feito ' + BR + 'na <span class="highlight fire-text">Brasa</span>.';
      const h1 = tester.offsetHeight;
      tester.innerHTML = 'Chama todo ' + BR + 'mundo e vem ' + BR + 'pra cá!';
      const h2 = tester.offsetHeight;
      document.body.removeChild(tester);

      const maxH = Math.max(h1, h2);
      if (maxH > 0) {
        heroTitleEl.style.minHeight = maxH + 'px';
      }
    }

    syncHeroTitleHeight();
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(syncHeroTitleHeight);
    }
    window.addEventListener('resize', () => {
      clearTimeout(window.__heroTitleResizeTimer);
      window.__heroTitleResizeTimer = setTimeout(syncHeroTitleHeight, 100);
    });

    let phraseIdx = 0;
    let charIdx = phrases[0].length;
    let isDeleting = false;
    let typingTimer = null;

    function stepTypewriter() {
      const current = phrases[phraseIdx];

      if (isDeleting) {
        charIdx--;
        typedEl.innerHTML = current.render(charIdx);

        if (charIdx <= 0) {
          isDeleting = false;
          phraseIdx = (phraseIdx + 1) % phrases.length;
          typingTimer = setTimeout(stepTypewriter, 450);
          return;
        }

        typingTimer = setTimeout(stepTypewriter, 30);
      } else {
        charIdx++;
        typedEl.innerHTML = current.render(charIdx);

        if (charIdx >= current.length) {
          isDeleting = true;
          typingTimer = setTimeout(stepTypewriter, current.holdTime);
          return;
        }

        const naturalDelay = 50 + Math.floor(Math.random() * 25);
        typingTimer = setTimeout(stepTypewriter, naturalDelay);
      }
    }

    // Inicia a primeira troca após tempo de leitura da frase inicial
    typingTimer = setTimeout(() => {
      isDeleting = true;
      stepTypewriter();
    }, phrases[0].holdTime);
  }

  /* --- 5. SCROLL ANIMATIONS (IntersectionObserver) ----------- */
  const animEls = document.querySelectorAll('.animate-fade-up');
  if (animEls.length) {
    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('in-view');
            obs.unobserve(e.target);
          }
        });
      }, { threshold: 0.05, rootMargin: '0px 0px 80px 0px' });

      animEls.forEach(el => obs.observe(el));
    } else {
      // Fallback para navegadores sem IntersectionObserver
      animEls.forEach(el => el.classList.add('in-view'));
    }

    // Fallback de segurança: garante que nenhum conteúdo fique permanentemente invisível
    setTimeout(() => {
      animEls.forEach(el => el.classList.add('in-view'));
    }, 2500);
  }

    /* --- 6. SISTEMA DE CARROSSEL UNIFICADO & FILTRO DE CATEGORIAS --- */
  function setupCarousel({ track, getCards, dotsContainer }) {
    if (!track) return null;

    function getVisibleCards() {
      return Array.from(getCards()).filter(card => card.style.display !== 'none');
    }

    function getMetrics() {
      const cards = getVisibleCards();
      if (!cards.length) return { cardWidth: 0, visibleCount: 1, maxScroll: 0 };
      const firstCard = cards[0];
      const gap = parseFloat(window.getComputedStyle(track).gap) || 24;
      const cardWidth = firstCard.offsetWidth + gap;
      const visibleCount = Math.max(1, Math.round((track.clientWidth + gap * 0.4) / cardWidth));
      const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
      return { cardWidth, visibleCount, maxScroll, gap };
    }

    function updateControls() {
      const cards = getVisibleCards();
      if (!cards.length || !dotsContainer) return;
      cards.forEach(card => card.classList.add('in-view'));

      const { cardWidth, visibleCount, maxScroll } = getMetrics();
      if (maxScroll <= 8) {
        dotsContainer.style.visibility = 'hidden';
        dotsContainer.innerHTML = '';
        return;
      }

      dotsContainer.style.visibility = 'visible';
      dotsContainer.style.display = 'flex';

      const totalPages = Math.max(1, Math.ceil(cards.length / visibleCount));
      dotsContainer.innerHTML = '';

      const currentScroll = track.scrollLeft;
      const currentPage = Math.min(
        totalPages - 1,
        Math.round(currentScroll / (visibleCount * cardWidth || 1))
      );

      for (let i = 0; i < totalPages; i++) {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot' + (i === currentPage ? ' active' : '');
        dot.type = 'button';
        dot.setAttribute('aria-label', `Ir para slide ${i + 1}`);
        dot.addEventListener('click', () => {
          const targetLeft = Math.min(i * visibleCount * cardWidth, maxScroll);
          track.scrollTo({ left: targetLeft, behavior: 'smooth' });
        });
        dotsContainer.appendChild(dot);
      }
    }

    function syncActiveDot() {
      if (!dotsContainer || dotsContainer.style.display === 'none') return;
      const { cardWidth, visibleCount, maxScroll } = getMetrics();
      const totalPages = dotsContainer.children.length;
      if (!totalPages || cardWidth === 0) return;

      let pageIndex;
      if (track.scrollLeft >= maxScroll - 10) {
        pageIndex = totalPages - 1;
      } else {
        pageIndex = Math.min(
          totalPages - 1,
          Math.round(track.scrollLeft / (visibleCount * cardWidth))
        );
      }

      Array.from(dotsContainer.children).forEach((dot, idx) => {
        dot.classList.toggle('active', idx === pageIndex);
      });
    }

    let isDown = false;
    let startX = 0;
    let scrollStart = 0;
    let hasDragged = false;

    track.addEventListener('mousedown', (e) => {
      isDown = true;
      hasDragged = false;
      track.classList.add('active-drag');
      startX = e.pageX - track.offsetLeft;
      scrollStart = track.scrollLeft;
    });

    window.addEventListener('mouseup', () => {
      if (!isDown) return;
      isDown = false;
      track.classList.remove('active-drag');
    });

    track.addEventListener('mouseleave', () => {
      if (!isDown) return;
      isDown = false;
      track.classList.remove('active-drag');
    });

    track.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      const x = e.pageX - track.offsetLeft;
      const walk = (x - startX) * 1.4;
      if (Math.abs(walk) > 6) hasDragged = true;
      track.scrollLeft = scrollStart - walk;
    });

    track.addEventListener('scroll', syncActiveDot, { passive: true });

    track.addEventListener('keydown', (e) => {
      const { cardWidth, visibleCount } = getMetrics();
      const step = visibleCount * cardWidth;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        track.scrollBy({ left: step, behavior: 'smooth' });
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        track.scrollBy({ left: -step, behavior: 'smooth' });
      }
    });

    window.addEventListener('resize', () => {
      updateControls();
    });

    updateControls();

    return {
      updateControls,
      getHasDragged: () => hasDragged,
      resetScroll: () => { track.scrollLeft = 0; }
    };
  }

  // Cardápio: Carrossel e Filtro de Categorias sem duplicação de DOM
  const menuTrack = document.getElementById('track-cardapio');
  const menuDots = document.getElementById('dots-cardapio');
  const menuCards = menuTrack ? menuTrack.querySelectorAll('.menu-card') : [];
  const tabBtns = document.querySelectorAll('.tab-btn');

  let cardapioCarousel = null;
  if (menuTrack) {
    cardapioCarousel = setupCarousel({
      track: menuTrack,
      getCards: () => menuTrack.querySelectorAll('.menu-card'),
      dotsContainer: menuDots
    });

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = btn.dataset.tab;

        tabBtns.forEach(b => {
          b.classList.toggle('active', b === btn);
          b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
        });

        menuCards.forEach(card => {
          if (cat === 'tudo' || card.dataset.category === cat) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });

        if (cardapioCarousel) {
          cardapioCarousel.resetScroll();
          setTimeout(() => cardapioCarousel.updateControls(), 40);
        }
      });
    });
  }

  // Galeria: Carrossel
  const galeriaTrack = document.getElementById('track-galeria');
  const galeriaDots = document.querySelector('.galeria-dots');
  let galeriaCarousel = null;
  if (galeriaTrack) {
    galeriaCarousel = setupCarousel({
      track: galeriaTrack,
      getCards: () => galeriaTrack.querySelectorAll('.galeria__item'),
      dotsContainer: galeriaDots
    });
  }

  /* --- 7. GALERIA LIGHTBOX COM FOCUS TRAP -------------------- */
  const galItems = document.querySelectorAll('.galeria__item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  let lastActiveGalleryItem = null;
  const lbTrap = lightbox ? setupFocusTrap(lightbox) : null;

  if (lightbox && lightboxImg) {
    const openLightbox = (item) => {
      if (galeriaCarousel && galeriaCarousel.getHasDragged()) return;
      const img = item.querySelector('img');
      if (img) {
        lastActiveGalleryItem = item;
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || 'Foto do Braseiro do Grajaú em tamanho ampliado';
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
        if (lbTrap) lbTrap.activate();
        if (lightboxClose) lightboxClose.focus();
      }
    };

    galItems.forEach(item => {
      item.addEventListener('click', () => openLightbox(item));
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(item);
        }
      });
    });

    const closeLb = () => {
      if (lbTrap) lbTrap.deactivate();
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
      setTimeout(() => {
        lightboxImg.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E";
      }, 350);
      if (lastActiveGalleryItem && typeof lastActiveGalleryItem.focus === 'function') {
        lastActiveGalleryItem.focus();
      }
    };

    if (lightboxClose) lightboxClose.addEventListener('click', closeLb);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLb(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLb();
    });
  }

  /* --- 7.5. MODAL CARDÁPIO COMPLETO (FRENTE E VERSO) ---------- */
    /* --- 7.5. MODAL CARDÁPIO COMPLETO (FRENTE E VERSO) ---------- */
  function initModalCardapio() {
    const openBtn = document.getElementById('btn-abrir-cardapio-completo');
    const modal = document.getElementById('modal-cardapio');
    const closeBtn = document.getElementById('modal-cardapio-close');
    const zoomBtn = document.getElementById('modal-cardapio-zoom');
    const tabs = document.querySelectorAll('.modal-cardapio__tab');
    const viewFrente = document.getElementById('view-cardapio-frente');
    const viewVerso = document.getElementById('view-cardapio-verso');
    const prevBtn = document.getElementById('btn-cardapio-prev');
    const nextBtn = document.getElementById('btn-cardapio-next');
    const indicator = document.getElementById('cardapio-page-indicator');
    const modalBody = document.querySelector('.modal-cardapio__body');
    let lastActiveCardapioTrigger = null;
    const modalTrap = modal ? setupFocusTrap(modal) : null;

    if (!modal) return;

    let currentPage = 'frente';
    let isZoomed = false;

    function updateZoom(zoomed) {
      isZoomed = zoomed;
      if (modalBody) {
        modalBody.classList.toggle('is-zoomed', isZoomed);
      }
      if (zoomBtn) {
        const icon = zoomBtn.querySelector('i');
        if (icon) {
          icon.className = isZoomed ? 'fas fa-search-minus' : 'fas fa-search-plus';
        }
        zoomBtn.setAttribute('title', isZoomed ? 'Ajustar à tela' : 'Ampliar cardápio');
        zoomBtn.setAttribute('aria-label', isZoomed ? 'Ajustar à tela' : 'Ampliar cardápio');
      }
      if (!isZoomed && modalBody) {
        modalBody.scrollTop = 0;
      }
    }

    function toggleZoom() {
      updateZoom(!isZoomed);
    }

    function setPage(page) {
      currentPage = page;
      updateZoom(false);

      if (page === 'frente') {
        if (viewFrente) viewFrente.classList.remove('modal-cardapio__view--hidden');
        if (viewVerso) viewVerso.classList.add('modal-cardapio__view--hidden');
        if (prevBtn) prevBtn.disabled = true;
        if (nextBtn) nextBtn.disabled = false;
        if (indicator) indicator.textContent = 'Página 1 de 2 (Frente)';
      } else {
        if (viewFrente) viewFrente.classList.add('modal-cardapio__view--hidden');
        if (viewVerso) viewVerso.classList.remove('modal-cardapio__view--hidden');
        if (prevBtn) prevBtn.disabled = false;
        if (nextBtn) nextBtn.disabled = true;
        if (indicator) indicator.textContent = 'Página 2 de 2 (Verso)';
      }

      tabs.forEach(tab => {
        const isMatch = tab.dataset.page === page;
        tab.classList.toggle('active', isMatch);
        tab.setAttribute('aria-selected', isMatch ? 'true' : 'false');
      });

      if (modalBody) modalBody.scrollTop = 0;
    }

    function loadModalImages() {
      const pendingImgs = modal.querySelectorAll('.modal-cardapio__img[data-src]');
      pendingImgs.forEach(img => {
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
      });
    }

    function openModal() {
      lastActiveCardapioTrigger = document.activeElement;
      loadModalImages();
      setPage('frente');
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
      if (modalTrap) modalTrap.activate();
      if (closeBtn) closeBtn.focus();
    }

    function closeModal() {
      if (modalTrap) modalTrap.deactivate();
      modal.classList.remove('open');
      updateZoom(false);
      document.body.style.overflow = '';
      if (lastActiveCardapioTrigger && typeof lastActiveCardapioTrigger.focus === 'function') {
        lastActiveCardapioTrigger.focus();
      }
    }

    if (openBtn) openBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (zoomBtn) zoomBtn.addEventListener('click', toggleZoom);

    tabs.forEach(tab => {
      tab.addEventListener('click', () => setPage(tab.dataset.page));
    });

    if (prevBtn) prevBtn.addEventListener('click', () => setPage('frente'));
    if (nextBtn) nextBtn.addEventListener('click', () => setPage('verso'));

    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.classList.contains('modal-cardapio__backdrop')) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (!modal.classList.contains('open')) return;
      if (e.key === 'Escape') {
        closeModal();
      } else if (e.key === 'ArrowLeft') {
        setPage('frente');
      } else if (e.key === 'ArrowRight') {
        setPage('verso');
      }
    });
  }

  initModalCardapio();

/* --- 8. BOTÃO VOLTAR AO TOPO ------------------------------- */
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* --- 9. COOKIE BANNER -------------------------------------- */
  const banner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept');
  const cookiePolicyLink = document.getElementById('cookiePolicyLink');

  if (banner) {
    if (!safeStore.get('braseiro_cookies_accepted')) {
      setTimeout(() => { banner.style.display = 'block'; }, 1800);
    }
    if (acceptBtn) {
      acceptBtn.addEventListener('click', () => {
        safeStore.set('braseiro_cookies_accepted', '1');
        banner.style.display = 'none';
      });
    }
  }

  // cookiePolicyLink navega normalmente para privacidade.html

  /* --- 10. CARREGAMENTO SOB DEMANDA DOS VÍDEOS DE FUNDO (INTERSECTION OBSERVER) --- */
  const lazyVideos = document.querySelectorAll('video[data-src]');

  const initLazyVideo = (video) => {
    const src = video.dataset.src;
    if (!src || video.querySelector('source')) return;

    const source = document.createElement('source');
    source.src = src;
    source.type = 'video/mp4';
    video.appendChild(source);
    video.load();

    if (prefersReducedMotion) return;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        const onUserInteract = () => {
          video.play().catch(() => {});
          window.removeEventListener('click', onUserInteract);
          window.removeEventListener('touchstart', onUserInteract);
          window.removeEventListener('scroll', onUserInteract);
        };
        window.addEventListener('click', onUserInteract, { once: true, passive: true });
        window.addEventListener('touchstart', onUserInteract, { once: true, passive: true });
        window.addEventListener('scroll', onUserInteract, { once: true, passive: true });
      });
    }
  };

  if ('IntersectionObserver' in window) {
    const videoObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          initLazyVideo(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '300px 0px' });

    lazyVideos.forEach(v => videoObserver.observe(v));
  } else {
    // Fallback para navegadores legados
    lazyVideos.forEach(initLazyVideo);
  }

    /* --- 11. FORMULÁRIO DE RESERVAS (COM FEEDBACK INLINE E VALIDAÇÃO DINÂMICA) --- */
  const formReserva = document.getElementById('formReserva');
  const dataInput = document.getElementById('reserva-data');
  const horarioInput = document.getElementById('reserva-horario');
  const feedbackEl = document.getElementById('reserva-feedback');

  const showFeedback = (msg, isError = true) => {
    if (!feedbackEl) return;
    feedbackEl.textContent = msg;
    feedbackEl.className = 'form-feedback ' + (isError ? 'error' : 'success');
    feedbackEl.style.display = 'block';
  };

  const clearFeedback = () => {
    if (feedbackEl) {
      feedbackEl.style.display = 'none';
      feedbackEl.textContent = '';
    }
  };

  if (dataInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    dataInput.min = `${yyyy}-${mm}-${dd}`;

    dataInput.addEventListener('change', () => {
      clearFeedback();
      if (!dataInput.value) return;
      const [ano, mes, dia] = dataInput.value.split('-').map(Number);
      const dataObj = new Date(ano, mes - 1, dia);
      const diaSemana = dataObj.getDay(); // 0 = Domingo, 5 = Sexta, 6 = Sábado

      if (horarioInput) {
        if (diaSemana === 0) {
          horarioInput.max = '23:00';
        } else if (diaSemana === 5 || diaSemana === 6) {
          horarioInput.max = '23:59';
        } else {
          horarioInput.max = '23:59';
        }
      }
    });
  }

  if (formReserva) {
    formReserva.addEventListener('submit', (e) => {
      e.preventDefault();
      clearFeedback();

      const nomeInput = document.getElementById('reserva-nome');
      const pessoasInput = document.getElementById('reserva-pessoas');
      const obsInput = document.getElementById('reserva-obs');

      const nome = nomeInput ? nomeInput.value.trim().slice(0, 100) : '';
      const data = dataInput ? dataInput.value : '';
      const horario = horarioInput ? horarioInput.value : '';
      const pessoas = pessoasInput ? pessoasInput.value : '';
      const obs = obsInput ? obsInput.value.trim().slice(0, 200) : '';

      if (!nome) {
        showFeedback('Por favor, informe seu nome completo.');
        if (nomeInput) nomeInput.focus();
        return;
      }

      if (!data) {
        showFeedback('Por favor, selecione a data desejada para a reserva.');
        if (dataInput) dataInput.focus();
        return;
      }

      if (!horario) {
        showFeedback('Por favor, selecione o horário pretendido.');
        if (horarioInput) horarioInput.focus();
        return;
      }

      if (!pessoas) {
        showFeedback('Por favor, selecione a quantidade de pessoas.');
        if (pessoasInput) pessoasInput.focus();
        return;
      }

      // Validação de horário no passado para reservas no próprio dia
      const now = new Date();
      const hojeIso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      if (data === hojeIso && horario) {
        const [hora, minuto] = horario.split(':').map(Number);
        const agoraMinutos = now.getHours() * 60 + now.getMinutes();
        const reservaMinutos = hora * 60 + (minuto || 0);
        if (reservaMinutos < agoraMinutos) {
          showFeedback('O horário selecionado já passou para o dia de hoje. Escolha um horário futuro.');
          if (horarioInput) horarioInput.focus();
          return;
        }
      }

      let dataFormatada = data;
      if (data && data.includes('-')) {
        const parts = data.split('-');
        if (parts.length === 3) {
          dataFormatada = `${parts[2]}/${parts[1]}/${parts[0]}`;
        }
      }

      const linhas = [
        '🔥 *SOLICITAÇÃO DE RESERVA - BRASEIRO DO GRAJAÚ* 🔥',
        '',
        `👤 *Nome:* ${nome}`,
        `📅 *Data:* ${dataFormatada}`,
        `⏰ *Horário:* ${horario}`,
        `👥 *Número de convidados:* ${pessoas}`
      ];

      if (obs) {
        linhas.push(`📝 *Observações:* ${obs}`);
      }

      linhas.push('');
      linhas.push('Olá! Gostaria de verificar a disponibilidade para esta reserva. Aguardo confirmação!');

      const mensagemPronta = linhas.join('\n');
      const whatsappUrl = getWhatsAppUrl(mensagemPronta);

      showFeedback('Pronto! Redirecionando para o WhatsApp oficial...', false);

      setTimeout(() => {
        const openedWindow = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
        if (!openedWindow || openedWindow.closed || typeof openedWindow.closed === 'undefined') {
          window.location.href = whatsappUrl;
        }
      }, 300);
    });
  }

  /* --- 12. ATUALIZAÇÃO AUTOMÁTICA DO ANO NO RODAPÉ --- */
  const footerYearEl = document.getElementById('footer-year');
  if (footerYearEl) {
    footerYearEl.textContent = new Date().getFullYear();
  }

});
