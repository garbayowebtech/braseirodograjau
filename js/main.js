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

  /* --- 2. MENU MOBILE HAMBURGER (Schmidt-Villares style) ----- */
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

  /* --- 3. SCROLLSPY (Link ativo na navegação) --------------- */
  const spySections = document.querySelectorAll('main > section[id], section[id]');
  const spyNavLinks = document.querySelectorAll('.nav-links a:not(.btn)');

  const updateActiveNav = () => {
    const scrollPos = (window.pageYOffset || document.documentElement.scrollTop || 0) + 140;
    spySections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        spyNavLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

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
    const phrases = [
      {
        prefix: "Churrasco de verdade é feito na ",
        highlight: "Brasa",
        suffix: ".",
        length: 38,
        render: function(count) {
          const pLen = 32;
          const hLen = 5;
          if (count <= pLen) {
            return this.prefix.slice(0, count);
          } else if (count <= pLen + hLen) {
            const hPart = this.highlight.slice(0, count - pLen);
            return this.prefix + '<span class="highlight fire-text">' + hPart + '</span>';
          } else {
            const sPart = this.suffix.slice(0, count - pLen - hLen);
            return this.prefix + '<span class="highlight fire-text">' + this.highlight + '</span>' + sPart;
          }
        },
        holdTime: 2600
      },
      {
        text: "Chama todo mundo e vem pra cá!",
        length: 31,
        render: function(count) {
          return this.text.slice(0, count);
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
      tester.style.boxSizing = 'border-box';
      document.body.appendChild(tester);

      tester.innerHTML = 'Churrasco de verdade é feito na <span class="highlight fire-text">Brasa</span>.';
      const h1 = tester.offsetHeight;
      tester.innerHTML = 'Chama todo mundo e vem pra cá!';
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

  /* --- 6. CARDÁPIO TABS & CAROUSELS --------------------------- */
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  function initCardapioCarousels() {
    tabPanels.forEach(panel => {
      const track = panel.querySelector('.cardapio__carousel-track');
      const prevBtn = panel.querySelector('.carousel-btn--prev');
      const nextBtn = panel.querySelector('.carousel-btn--next');
      const dotsContainer = panel.querySelector('.carousel-dots');
      if (!track) return;

      const cards = track.querySelectorAll('.menu-card');
      if (!cards.length) return;

      // Garante que todos os cards fiquem visíveis imediatamente
      cards.forEach(card => card.classList.add('in-view'));

      function getMetrics() {
        const firstCard = cards[0];
        const gap = parseFloat(window.getComputedStyle(track).gap) || 24;
        const cardWidth = firstCard.offsetWidth + gap;
        const visibleCards = Math.max(1, Math.round((track.clientWidth + gap * 0.4) / cardWidth));
        const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
        return { cardWidth, visibleCards, maxScroll, gap };
      }

      function updateControls() {
        if (!panel.classList.contains('active')) return;
        const { cardWidth, visibleCards, maxScroll } = getMetrics();

        // Se todo o conteúdo couber na tela sem rolar, oculta controles mantendo altura
        if (maxScroll <= 8) {
          if (prevBtn) prevBtn.style.display = 'none';
          if (nextBtn) nextBtn.style.display = 'none';
          if (dotsContainer) {
            dotsContainer.style.visibility = 'hidden';
            dotsContainer.innerHTML = '';
          }
          return;
        }

        if (prevBtn) prevBtn.style.display = 'flex';
        if (nextBtn) nextBtn.style.display = 'flex';
        if (dotsContainer) {
          dotsContainer.style.visibility = 'visible';
          dotsContainer.style.display = 'flex';
        }

        // Reconstrução dos indicadores (dots) por bloco/página
        const totalPages = Math.max(1, Math.ceil(cards.length / visibleCards));
        dotsContainer.innerHTML = '';

        const currentScroll = track.scrollLeft;
        const currentPage = Math.min(
          totalPages - 1,
          Math.round(currentScroll / (visibleCards * cardWidth))
        );

        for (let i = 0; i < totalPages; i++) {
          const dot = document.createElement('button');
          dot.className = 'carousel-dot' + (i === currentPage ? ' active' : '');
          dot.type = 'button';
          dot.setAttribute('aria-label', `Ir para slide ${i + 1}`);
          dot.addEventListener('click', () => {
            const targetLeft = Math.min(i * visibleCards * cardWidth, maxScroll);
            track.scrollTo({ left: targetLeft, behavior: 'smooth' });
          });
          dotsContainer.appendChild(dot);
        }
      }

      function syncActiveDot() {
        if (!dotsContainer || dotsContainer.style.display === 'none') return;
        const { cardWidth, visibleCards, maxScroll } = getMetrics();
        const totalPages = dotsContainer.children.length;
        if (!totalPages) return;

        let pageIndex;
        if (track.scrollLeft >= maxScroll - 16) {
          pageIndex = totalPages - 1;
        } else {
          pageIndex = Math.min(
            totalPages - 1,
            Math.max(0, Math.round(track.scrollLeft / (visibleCards * cardWidth)))
          );
        }

        Array.from(dotsContainer.children).forEach((dot, idx) => {
          dot.classList.toggle('active', idx === pageIndex);
        });
      }

      // Avançar
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          const { cardWidth, visibleCards, maxScroll } = getMetrics();
          const step = visibleCards * cardWidth;
          if (track.scrollLeft >= maxScroll - 16) {
            track.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            track.scrollBy({ left: step, behavior: 'smooth' });
          }
        });
      }

      // Voltar
      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          const { cardWidth, visibleCards, maxScroll } = getMetrics();
          const step = visibleCards * cardWidth;
          if (track.scrollLeft <= 16) {
            track.scrollTo({ left: maxScroll, behavior: 'smooth' });
          } else {
            track.scrollBy({ left: -step, behavior: 'smooth' });
          }
        });
      }

      // Sincronizar indicador de rolagem via rAF
      let isTicking = false;
      track.addEventListener('scroll', () => {
        if (!isTicking) {
          window.requestAnimationFrame(() => {
            syncActiveDot();
            isTicking = false;
          });
          isTicking = true;
        }
      }, { passive: true });

      // Suporte a Mouse Drag (arrastar com o mouse no desktop)
      let isDown = false;
      let startX = 0;
      let scrollStart = 0;

      track.addEventListener('mousedown', (e) => {
        isDown = true;
        track.classList.add('is-dragging');
        startX = e.pageX - track.offsetLeft;
        scrollStart = track.scrollLeft;
      });

      window.addEventListener('mouseup', () => {
        if (isDown) {
          isDown = false;
          track.classList.remove('is-dragging');
        }
      });

      track.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - track.offsetLeft;
        const walk = (x - startX) * 1.4;
        track.scrollLeft = scrollStart - walk;
      });

      // Suporte a teclado
      track.addEventListener('keydown', (e) => {
        const { cardWidth, visibleCards } = getMetrics();
        const step = visibleCards * cardWidth;
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          track.scrollBy({ left: step, behavior: 'smooth' });
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          track.scrollBy({ left: -step, behavior: 'smooth' });
        }
      });

      panel.__updateCarousel = () => {
        updateControls();
      };
    });

    const activePanel = document.querySelector('.tab-panel.active');
    if (activePanel && activePanel.__updateCarousel) {
      activePanel.__updateCarousel();
    }
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      tabPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      const panel = document.getElementById('tab-' + target);
      if (panel) {
        panel.classList.add('active');
        const track = panel.querySelector('.cardapio__carousel-track');
        if (track) track.scrollLeft = 0;
        if (panel.__updateCarousel) {
          setTimeout(() => panel.__updateCarousel(), 40);
        }
      }
    });
  });

  initCardapioCarousels();

  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const activePanel = document.querySelector('.tab-panel.active');
      if (activePanel && activePanel.__updateCarousel) {
        activePanel.__updateCarousel();
      }
      if (window.__updateGaleriaCarousel) {
        window.__updateGaleriaCarousel();
      }
    }, 150);
  });

  /* --- 6.5. GALERIA CAROUSEL --------------------------------- */
  let galeriaHasDragged = false;

  function initGaleriaCarousel() {
    const container = document.querySelector('.galeria__carousel-container');
    if (!container) return;

    const track = container.querySelector('.galeria__carousel-track');
    const prevBtn = container.querySelector('.galeria-btn--prev');
    const nextBtn = container.querySelector('.galeria-btn--next');
    const dotsContainer = container.querySelector('.galeria-dots');
    if (!track) return;

    const items = track.querySelectorAll('.galeria__item');
    if (!items.length) return;

    items.forEach(item => item.classList.add('in-view'));

    function getMetrics() {
      const firstItem = items[0];
      const gap = parseFloat(window.getComputedStyle(track).gap) || 24;
      const itemWidth = firstItem.offsetWidth + gap;
      const visibleItems = Math.max(1, Math.round((track.clientWidth + gap * 0.4) / itemWidth));
      const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
      return { itemWidth, visibleItems, maxScroll, gap };
    }

    function updateControls() {
      const { itemWidth, visibleItems, maxScroll } = getMetrics();

      if (maxScroll <= 8) {
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        if (dotsContainer) {
          dotsContainer.style.visibility = 'hidden';
          dotsContainer.innerHTML = '';
        }
        return;
      }

      if (prevBtn) prevBtn.style.display = 'flex';
      if (nextBtn) nextBtn.style.display = 'flex';
      if (dotsContainer) {
        dotsContainer.style.visibility = 'visible';
        dotsContainer.style.display = 'flex';
      }

      const totalPages = Math.max(1, Math.ceil(items.length / visibleItems));
      dotsContainer.innerHTML = '';

      const currentScroll = track.scrollLeft;
      const currentPage = Math.min(
        totalPages - 1,
        Math.round(currentScroll / (visibleItems * itemWidth))
      );

      for (let i = 0; i < totalPages; i++) {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot' + (i === currentPage ? ' active' : '');
        dot.type = 'button';
        dot.setAttribute('aria-label', `Ir para foto ${i + 1}`);
        dot.addEventListener('click', () => {
          const targetLeft = Math.min(i * visibleItems * itemWidth, maxScroll);
          track.scrollTo({ left: targetLeft, behavior: 'smooth' });
        });
        dotsContainer.appendChild(dot);
      }
    }

    function syncActiveDot() {
      if (!dotsContainer || dotsContainer.style.display === 'none') return;
      const { itemWidth, visibleItems, maxScroll } = getMetrics();
      const totalPages = dotsContainer.children.length;
      if (!totalPages) return;

      let pageIndex;
      if (track.scrollLeft >= maxScroll - 16) {
        pageIndex = totalPages - 1;
      } else {
        pageIndex = Math.min(
          totalPages - 1,
          Math.max(0, Math.round(track.scrollLeft / (visibleItems * itemWidth)))
        );
      }

      Array.from(dotsContainer.children).forEach((dot, idx) => {
        dot.classList.toggle('active', idx === pageIndex);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const { itemWidth, visibleItems, maxScroll } = getMetrics();
        const step = visibleItems * itemWidth;
        if (track.scrollLeft >= maxScroll - 16) {
          track.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          track.scrollBy({ left: step, behavior: 'smooth' });
        }
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        const { itemWidth, visibleItems, maxScroll } = getMetrics();
        const step = visibleItems * itemWidth;
        if (track.scrollLeft <= 16) {
          track.scrollTo({ left: maxScroll, behavior: 'smooth' });
        } else {
          track.scrollBy({ left: -step, behavior: 'smooth' });
        }
      });
    }

    let isTicking = false;
    track.addEventListener('scroll', () => {
      if (!isTicking) {
        window.requestAnimationFrame(() => {
          syncActiveDot();
          isTicking = false;
        });
        isTicking = true;
      }
    }, { passive: true });

    let isDown = false;
    let startX = 0;
    let scrollStart = 0;

    track.addEventListener('mousedown', (e) => {
      isDown = true;
      galeriaHasDragged = false;
      track.classList.add('is-dragging');
      startX = e.pageX - track.offsetLeft;
      scrollStart = track.scrollLeft;
    });

    window.addEventListener('mouseup', () => {
      if (isDown) {
        isDown = false;
        track.classList.remove('is-dragging');
        setTimeout(() => { galeriaHasDragged = false; }, 60);
      }
    });

    track.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      const x = e.pageX - track.offsetLeft;
      const walk = (x - startX) * 1.4;
      if (Math.abs(walk) > 5) {
        galeriaHasDragged = true;
      }
      e.preventDefault();
      track.scrollLeft = scrollStart - walk;
    });

    track.addEventListener('keydown', (e) => {
      const { itemWidth, visibleItems } = getMetrics();
      const step = visibleItems * itemWidth;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        track.scrollBy({ left: step, behavior: 'smooth' });
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        track.scrollBy({ left: -step, behavior: 'smooth' });
      }
    });

    window.__updateGaleriaCarousel = updateControls;
    updateControls();
  }

  initGaleriaCarousel();

  /* --- 7. GALERIA LIGHTBOX ----------------------------------- */
  const galItems = document.querySelectorAll('.galeria__item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  let lastActiveGalleryItem = null;

  if (lightbox && lightboxImg) {
    const openLightbox = (item) => {
      if (typeof galeriaHasDragged !== 'undefined' && galeriaHasDragged) return;
      const img = item.querySelector('img');
      if (img) {
        lastActiveGalleryItem = item;
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || 'Foto do Braseiro do Grajaú em tamanho ampliado';
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
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
    const backdrop = document.querySelector('.modal-cardapio__backdrop');
    const modalBody = document.querySelector('.modal-cardapio__body');
    const modalImages = modal ? modal.querySelectorAll('.modal-cardapio__img') : [];

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
      updateZoom(false); // Sempre reseta para a visualização inicial de 100% da vh

      if (page === 'frente') {
        if (viewFrente) viewFrente.style.display = 'flex';
        if (viewVerso) viewVerso.style.display = 'none';
        if (prevBtn) prevBtn.disabled = true;
        if (nextBtn) nextBtn.disabled = false;
        if (indicator) indicator.textContent = 'Página 1 de 2 (Frente)';
      } else {
        if (viewFrente) viewFrente.style.display = 'none';
        if (viewVerso) viewVerso.style.display = 'flex';
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
      loadModalImages();
      setPage('frente');
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modal.classList.remove('open');
      updateZoom(false);
      document.body.style.overflow = '';
    }

    if (openBtn) {
      openBtn.addEventListener('click', openModal);
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }

    if (zoomBtn) {
      zoomBtn.addEventListener('click', toggleZoom);
    }

    modalImages.forEach(img => {
      img.addEventListener('click', toggleZoom);
    });

    if (backdrop) {
      backdrop.addEventListener('click', closeModal);
    }

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        setPage(tab.dataset.page);
      });
    });

    if (prevBtn) {
      prevBtn.addEventListener('click', () => setPage('frente'));
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => setPage('verso'));
    }

    document.addEventListener('keydown', (e) => {
      if (modal.classList.contains('open')) {
        if (e.key === 'Escape') {
          closeModal();
        } else if (e.key === 'ArrowRight' && currentPage === 'frente') {
          setPage('verso');
        } else if (e.key === 'ArrowLeft' && currentPage === 'verso') {
          setPage('frente');
        }
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

  if (cookiePolicyLink) {
    cookiePolicyLink.addEventListener('click', (e) => {
      e.preventDefault();
      alert('Política de Privacidade: O Braseiro do Grajaú respeita a sua privacidade. Utilizamos apenas armazenamento local essencial para registrar seu consentimento de navegação. Não compartilhamos nem comercializamos seus dados.');
    });
  }

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

  /* --- 11. FORMULÁRIO DE RESERVAS (WHATSAPP INTEGRATION) --- */
  const formReserva = document.getElementById('formReserva');
  const dataInput = document.getElementById('reserva-data');

  if (dataInput) {
    // Define a data mínima como a data atual
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    dataInput.min = `${yyyy}-${mm}-${dd}`;
  }

  if (formReserva) {
    formReserva.addEventListener('submit', (e) => {
      e.preventDefault();

      const nomeInput = document.getElementById('reserva-nome');
      const horarioInput = document.getElementById('reserva-horario');
      const pessoasInput = document.getElementById('reserva-pessoas');
      const obsInput = document.getElementById('reserva-obs');

      const nome = nomeInput ? nomeInput.value.trim().slice(0, 100) : '';
      const data = dataInput ? dataInput.value : '';
      const horario = horarioInput ? horarioInput.value : '';
      const pessoas = pessoasInput ? pessoasInput.value : '';
      const obs = obsInput ? obsInput.value.trim().slice(0, 200) : '';

      if (!nome) {
        alert('Por favor, informe seu nome completo.');
        if (nomeInput) nomeInput.focus();
        return;
      }

      if (!data) {
        alert('Por favor, selecione a data desejada para a reserva.');
        if (dataInput) dataInput.focus();
        return;
      }

      if (!horario) {
        alert('Por favor, selecione o horário pretendido.');
        if (horarioInput) horarioInput.focus();
        return;
      }

      if (!pessoas) {
        alert('Por favor, selecione a quantidade de pessoas.');
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
          alert('O horário selecionado já passou para o dia de hoje. Por favor, escolha um horário futuro.');
          if (horarioInput) horarioInput.focus();
          return;
        }
      }

      // Formata data de AAAA-MM-DD para DD/MM/AAAA
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

      const openedWindow = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      if (!openedWindow || openedWindow.closed || typeof openedWindow.closed === 'undefined') {
        window.location.href = whatsappUrl;
      }
    });
  }

});
