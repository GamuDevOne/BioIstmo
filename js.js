const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navMenu = document.getElementById('navMenu');

if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileMenuBtn.innerHTML = navMenu.classList.contains('active')
            ? '<i class="fas fa-times"></i>'
            : '<i class="fas fa-bars"></i>';
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
}


// ANIMACIÓN DE ENTRADA PARA TARJETAS
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = `fadeInUp 0.8s ease-out ${entry.target.dataset.delay || '0s'} forwards`;
        }
    });
}, observerOptions);

document.querySelectorAll('.level-card, .importance-card, .threat-card, .area-item, .species-card').forEach((el, index) => {
    el.style.opacity = '0';
    el.dataset.delay = `${index * 0.1}s`;
    observer.observe(el);
});


// ANIMACIÓN DE ESTADÍSTICAS — solo se activa cuando el usuario las ve
const animateStats = (statNumbers) => {
    statNumbers.forEach(stat => {
        if (stat.classList.contains('animated')) return;
        stat.classList.add('animated'); // marcar antes para evitar doble ejecución

        const originalText = stat.textContent;
        const target = parseInt(originalText.replace(/[^0-9]/g, ''));

        if (target > 5) {
            let current = 0;
            const increment = target / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    stat.textContent = originalText;
                    clearInterval(timer);
                } else {
                    stat.textContent = Math.floor(current);
                }
            }, 30);
        }
    });
};

// Usar IntersectionObserver para disparar la animación solo cuando sea visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const stats = entry.target.querySelectorAll('.stat-number');
            animateStats(stats);
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('.stats-grid, .mega-stats').forEach(el => {
    statsObserver.observe(el);
});


// DETALLES DE ESPECIES
const detailsToggles = document.querySelectorAll('.details-toggle');

detailsToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
        const targetId = toggle.getAttribute('data-target');
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            targetElement.classList.toggle('active');

            if (targetElement.classList.contains('active')) {
                toggle.innerHTML = '<i class="fas fa-chevron-up"></i> Ocultar detalles';
            } else {
                toggle.innerHTML = '<i class="fas fa-chevron-down"></i> Cómo protegerla';
            }
        }
    });
});


// FETCH DEL FOOTER (no puedo utilizarlo)
fetch('footer.html')
    .then(response => response.text())
    .then(html => {
        const footerPlaceholder = document.getElementById('footer-placeholder');
        if (footerPlaceholder) {
            footerPlaceholder.innerHTML = html;
        }
    })
    .catch(err => console.error('Error cargando el footer:', err));