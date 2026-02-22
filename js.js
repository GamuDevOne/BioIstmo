
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

const statNumbers = document.querySelectorAll('.stat-number');
const isInViewport = (el) => {
    const rect = el.getBoundingClientRect();
    return rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8;
};

const animateStats = () => {
    statNumbers.forEach(stat => {
        if (isInViewport(stat) && !stat.classList.contains('animated')) {
            const originalText = stat.textContent;
            const target = parseInt(originalText.replace('+', '').replace('%', ''));
            
            if (target > 5) {
                let current = 0;
                const increment = target / 50;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        stat.textContent = originalText;
                        clearInterval(timer);
                        stat.classList.add('animated');
                    } else {
                        stat.textContent = Math.floor(current);
                    }
                }, 30);
            } else {
                stat.classList.add('animated');
            }
        }
    });
};

window.addEventListener('scroll', animateStats);
animateStats();



// FILTROS DE ESPECIES 
const speciesFilters = document.querySelectorAll('.species-filter');
const speciesCards = document.querySelectorAll('.species-card');

if (speciesFilters.length && speciesCards.length) {
    speciesFilters.forEach(filter => {
        filter.addEventListener('click', () => {
            speciesFilters.forEach(f => f.classList.remove('active'));
            filter.classList.add('active');
            
            const filterValue = filter.getAttribute('data-filter');
            
            speciesCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// DETALLES DE ESPECIES 
const detailsToggles = document.querySelectorAll('.details-toggle');

detailsToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
        const targetId = toggle.getAttribute('data-target');
        const targetElement = document.getElementById(targetId);
        const icon = toggle.querySelector('i');
        
        if (targetElement) {
            targetElement.classList.toggle('active');
            
            if (targetElement.classList.contains('active')) {
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
                toggle.innerHTML = '<i class="fas fa-chevron-up"></i> Ocultar detalles';
            } else {
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
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