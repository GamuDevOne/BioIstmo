// ============ SISTEMA DE NAVEGACIÓN POR PÁGINAS ============

function navigateTo(pageId) {
    // Ocultar todas las páginas
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    
    // Mostrar la página seleccionada
    const targetPage = document.getElementById('page-' + pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // Actualizar links activos en el menú
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === pageId) {
            link.classList.add('active');
        }
    });

    // Cerrar menú móvil si está abierto
    const navMenu = document.getElementById('navMenu');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    navMenu.classList.remove('active');
    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
}

// Asignar eventos a los nav-links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.getAttribute('data-page');
        if (page) navigateTo(page);
    });
});

// ============ MENÚ MÓVIL ============
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navMenu = document.getElementById('navMenu');

mobileMenuBtn.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    mobileMenuBtn.innerHTML = navMenu.classList.contains('active')
        ? '<i class="fas fa-times"></i>'
        : '<i class="fas fa-bars"></i>';
});

// ============ FILTROS DE ESPECIES ============
const speciesFilters = document.querySelectorAll('.species-filter');
const speciesCards = document.querySelectorAll('.species-card');

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
                setTimeout(() => { card.style.display = 'none'; }, 300);
            }
        });
    });
});

// ============ DETALLES DE ESPECIES ============
document.querySelectorAll('.details-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
        const targetId = toggle.getAttribute('data-target');
        const targetEl = document.getElementById(targetId);

        targetEl.classList.toggle('active');

        if (targetEl.classList.contains('active')) {
            toggle.innerHTML = '<i class="fas fa-chevron-up"></i> Ocultar detalles';
        } else {
            toggle.innerHTML = '<i class="fas fa-chevron-down"></i> Cómo protegerla';
        }
    });
});

// ============ JUEGO INTERACTIVO ============
const gameQuestions = [
    {
        question: "¿Cuál es el ave nacional de Panamá?",
        options: ["Águila Harpía", "Guacamaya Roja", "Quetzal", "Tucán"],
        correct: 0
    },
    {
        question: "¿Qué especie de anfibio es endémica de Panamá y está en peligro crítico?",
        options: ["Rana arbórea de ojos rojos", "Rana Dorada", "Sapo común", "Salamandra"],
        correct: 1
    },
    {
        question: "¿Qué porcentaje del territorio panameño está protegido?",
        options: ["15%", "30%", "45%", "60%"],
        correct: 1
    },
    {
        question: "¿Cuál de estos es un Patrimonio Mundial de la UNESCO en Panamá?",
        options: ["Parque Nacional Darién", "Isla Taboga", "Lago Gatún", "Cerro Ancón"],
        correct: 0
    },
    {
        question: "¿Cuántas especies de aves se han registrado en Panamá?",
        options: ["Alrededor de 500", "Alrededor de 750", "Alrededor de 978", "Más de 1,200"],
        correct: 2
    }
];

let currentQuestion = 0;
let score = 0;
let gameFinished = false;

const gameQuestionEl = document.getElementById('game-question');
const gameOptionsEl  = document.getElementById('game-options');
const scoreEl        = document.getElementById('score');
const nextBtn        = document.getElementById('next-question');
const restartBtn     = document.getElementById('restart-game');
const gameResultEl   = document.getElementById('game-result');

function loadQuestion() {
    if (currentQuestion >= gameQuestions.length) {
        finishGame();
        return;
    }

    const q = gameQuestions[currentQuestion];
    gameQuestionEl.textContent = q.question;
    gameOptionsEl.innerHTML = '';
    gameResultEl.textContent = '';

    q.options.forEach((option, index) => {
        const optEl = document.createElement('div');
        optEl.className = 'game-option';
        optEl.textContent = option;
        optEl.setAttribute('data-correct', index === q.correct ? 'true' : 'false');

        optEl.addEventListener('click', () => {
            if (gameFinished) return;
            document.querySelectorAll('.game-option').forEach(opt => {
                if (opt.getAttribute('data-correct') === 'true') opt.classList.add('correct');
                else if (opt === optEl) opt.classList.add('incorrect');
                opt.style.pointerEvents = 'none';
            });
            if (index === q.correct) {
                score++;
                scoreEl.textContent = score;
            }
        });

        gameOptionsEl.appendChild(optEl);
    });
}

function finishGame() {
    gameFinished = true;
    gameQuestionEl.textContent = "¡Juego completado!";
    gameOptionsEl.innerHTML = '';

    let message = '';
    if (score === gameQuestions.length)              message = "¡Excelente! Eres un experto en biodiversidad panameña.";
    else if (score >= gameQuestions.length * 0.7)    message = "¡Muy bien! Tienes buen conocimiento sobre la biodiversidad.";
    else if (score >= gameQuestions.length * 0.5)    message = "Buen intento. Sigue aprendiendo sobre nuestra biodiversidad.";
    else                                              message = "Sigue explorando las maravillas naturales de Panamá.";

    gameResultEl.textContent = `${message} Puntuación final: ${score}/${gameQuestions.length}`;
}

nextBtn.addEventListener('click', () => {
    if (gameFinished) return;
    currentQuestion++;
    loadQuestion();
});

restartBtn.addEventListener('click', () => {
    currentQuestion = 0;
    score = 0;
    gameFinished = false;
    scoreEl.textContent = '0';
    loadQuestion();
});

loadQuestion();

// ============ CALCULADORA DE HUELLA ECOLÓGICA ============
const footprintOptions   = document.querySelectorAll('.footprint-option');
const calculateBtn       = document.getElementById('calculate-footprint');
const footprintResult    = document.getElementById('footprint-result');
const footprintValueEl   = document.getElementById('footprint-value');
const footprintMessageEl = document.getElementById('footprint-message');
const reduceBtn          = document.getElementById('reduce-footprint');

let selectedOptions = [];

footprintOptions.forEach(option => {
    option.addEventListener('click', () => {
        const parent = option.parentElement;
        parent.querySelectorAll('.footprint-option').forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');

        const stepIndex = Array.from(document.querySelectorAll('.footprint-step')).indexOf(parent.parentElement);
        selectedOptions[stepIndex] = parseInt(option.getAttribute('data-value'));
    });
});

calculateBtn.addEventListener('click', () => {
    if (selectedOptions.length < 3 || selectedOptions.includes(undefined) || selectedOptions.filter(v => v !== undefined).length < 3) {
        alert('Por favor, responde todas las preguntas antes de calcular tu huella.');
        return;
    }

    const total   = selectedOptions.reduce((sum, v) => sum + v, 0);
    const average = (total / selectedOptions.length).toFixed(1);

    footprintValueEl.textContent = average;

    let message = '';
    if (average <= 1.5)      message = '¡Tu huella ecológica es baja! Continúa con tus buenas prácticas ambientales.';
    else if (average <= 2.5) message = 'Tu huella ecológica es moderada. Pequeños cambios pueden reducir significativamente tu impacto.';
    else                     message = 'Tu huella ecológica es alta. Considera implementar cambios en tu estilo de vida para proteger la biodiversidad.';

    footprintMessageEl.textContent = message;
    footprintResult.classList.add('active');
    footprintResult.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

reduceBtn.addEventListener('click', () => {
    alert(
        'Consejos para reducir tu huella ecológica:\n\n' +
        '1. Usa transporte público, bicicleta o camina\n' +
        '2. Reduce el consumo de carne\n' +
        '3. Recicla y composta tus residuos\n' +
        '4. Consume productos locales y de temporada\n' +
        '5. Ahorra agua y energía en casa\n' +
        '6. Planta árboles nativos'
    );
});

// ============ ANIMACIÓN DE NÚMEROS EN ESTADÍSTICAS ============
function animateNumbers() {
    document.querySelectorAll('.stat-number, .stat-num').forEach(stat => {
        if (stat.classList.contains('animated')) return;
        const text = stat.textContent;
        const num = parseInt(text.replace(/[^0-9]/g, ''));
        if (!num || num <= 5) { stat.classList.add('animated'); return; }

        let current = 0;
        const increment = num / 50;
        stat.classList.add('animated');

        const timer = setInterval(() => {
            current += increment;
            if (current >= num) {
                stat.textContent = text;
                clearInterval(timer);
            } else {
                stat.textContent = Math.floor(current);
            }
        }, 28);
    });
}

// Observar cuando las estadísticas entran en viewport
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) animateNumbers();
    });
}, { threshold: 0.2 });

document.querySelectorAll('.stats-grid, .home-stats-grid').forEach(el => statsObserver.observe(el));

// ============ ANIMACIONES DE ENTRADA PARA CARDS ============
const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = `fadeInUp 0.6s ease-out ${entry.target.dataset.delay || '0s'} both`;
        }
    });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

function observeCards() {
    document.querySelectorAll(
        '.importance-card, .threat-card, .area-item, .species-card, ' +
        '.home-stat-card, .explore-card, .level-card, .panama-feature'
    ).forEach((el, i) => {
        el.style.opacity = '0';
        el.dataset.delay = `${(i % 6) * 0.08}s`;
        cardObserver.observe(el);
    });
}

observeCards();