// Menú móvil
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const navMenu = document.getElementById('navMenu');
        
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileMenuBtn.innerHTML = navMenu.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
        
        // Cerrar menú al hacer clic en un enlace
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
        
        // Navegación suave
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });
        
        // Animación al hacer scroll
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
        
        // Observar elementos para animación
        document.querySelectorAll('.level-card, .importance-card, .threat-card, .area-item, .species-card').forEach((el, index) => {
            el.style.opacity = '0';
            el.dataset.delay = `${index * 0.1}s`;
            observer.observe(el);
        });
        
        // Efecto de números animados en estadísticas
        const statNumbers = document.querySelectorAll('.stat-number');
        const isInViewport = (el) => {
            const rect = el.getBoundingClientRect();
            return (
                rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8
            );
        };
        
        const animateStats = () => {
            statNumbers.forEach(stat => {
                if (isInViewport(stat) && !stat.classList.contains('animated')) {
                    const originalText = stat.textContent;
                    const target = parseInt(originalText.replace('+', '').replace('%', ''));
                    
                    // Solo animar números, no porcentajes o números pequeños
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
        animateStats(); // Ejecutar al cargar
        
        // ============ FILTROS DE ESPECIES ============
        const speciesFilters = document.querySelectorAll('.species-filter');
        const speciesCards = document.querySelectorAll('.species-card');
        
        speciesFilters.forEach(filter => {
            filter.addEventListener('click', () => {
                // Remover clase activa de todos los filtros
                speciesFilters.forEach(f => f.classList.remove('active'));
                // Añadir clase activa al filtro clickeado
                filter.classList.add('active');
                
                const filterValue = filter.getAttribute('data-filter');
                
                // Mostrar/ocultar especies según el filtro
                speciesCards.forEach(card => {
                    if (filterValue === 'all') {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 10);
                    } else if (card.getAttribute('data-category') === filterValue) {
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
        
        // ============ DETALLES DE ESPECIES ============
        const detailsToggles = document.querySelectorAll('.details-toggle');
        
        detailsToggles.forEach(toggle => {
            toggle.addEventListener('click', () => {
                const targetId = toggle.getAttribute('data-target');
                const targetElement = document.getElementById(targetId);
                const icon = toggle.querySelector('i');
                
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
                question: "¿Cuál de estos es un patrimonio mundial de la UNESCO en Panamá?",
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
        const gameOptionsEl = document.getElementById('game-options');
        const scoreEl = document.getElementById('score');
        const nextBtn = document.getElementById('next-question');
        const restartBtn = document.getElementById('restart-game');
        const gameResultEl = document.getElementById('game-result');
        
        function loadQuestion() {
            if (currentQuestion >= gameQuestions.length) {
                finishGame();
                return;
            }
            
            const question = gameQuestions[currentQuestion];
            gameQuestionEl.textContent = question.question;
            
            // Limpiar opciones anteriores
            gameOptionsEl.innerHTML = '';
            
            // Añadir nuevas opciones
            question.options.forEach((option, index) => {
                const optionEl = document.createElement('div');
                optionEl.className = 'game-option';
                optionEl.textContent = option;
                optionEl.setAttribute('data-correct', index === question.correct ? 'true' : 'false');
                
                optionEl.addEventListener('click', () => {
                    if (gameFinished) return;
                    
                    // Mostrar respuesta correcta/incorrecta
                    document.querySelectorAll('.game-option').forEach(opt => {
                        const isCorrect = opt.getAttribute('data-correct') === 'true';
                        if (isCorrect) {
                            opt.classList.add('correct');
                        } else if (opt === optionEl && !isCorrect) {
                            opt.classList.add('incorrect');
                        }
                        opt.style.pointerEvents = 'none';
                    });
                    
                    // Actualizar puntuación si es correcta
                    if (index === question.correct) {
                        score++;
                        scoreEl.textContent = score;
                    }
                });
                
                gameOptionsEl.appendChild(optionEl);
            });
            
            gameResultEl.textContent = '';
        }
        
        function finishGame() {
            gameFinished = true;
            gameQuestionEl.textContent = "¡Juego completado!";
            gameOptionsEl.innerHTML = '';
            
            let message = '';
            if (score === gameQuestions.length) {
                message = "¡Excelente! Eres un experto en biodiversidad panameña.";
            } else if (score >= gameQuestions.length * 0.7) {
                message = "¡Muy bien! Tienes buen conocimiento sobre la biodiversidad.";
            } else if (score >= gameQuestions.length * 0.5) {
                message = "Buen intento. Sigue aprendiendo sobre nuestra biodiversidad.";
            } else {
                message = "Sigue explorando y aprendiendo sobre las maravillas naturales de Panamá.";
            }
            
            gameResultEl.textContent = `${message} Puntuación: ${score}/${gameQuestions.length}`;
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
        
        // Cargar primera pregunta
        loadQuestion();
        
        // ============ CALCULADORA DE HUELLA ECOLÓGICA ============
        const footprintOptions = document.querySelectorAll('.footprint-option');
        const calculateBtn = document.getElementById('calculate-footprint');
        const footprintResult = document.getElementById('footprint-result');
        const footprintValue = document.getElementById('footprint-value');
        const footprintMessage = document.getElementById('footprint-message');
        const reduceBtn = document.getElementById('reduce-footprint');
        
        let selectedOptions = [];
        
        footprintOptions.forEach(option => {
            option.addEventListener('click', () => {
                // Deseleccionar otras opciones en el mismo grupo
                const parent = option.parentElement;
                parent.querySelectorAll('.footprint-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                
                // Seleccionar esta opción
                option.classList.add('selected');
                
                // Guardar valor seleccionado
                const stepIndex = Array.from(document.querySelectorAll('.footprint-step')).indexOf(parent.parentElement);
                selectedOptions[stepIndex] = parseInt(option.getAttribute('data-value'));
            });
        });
        
        calculateBtn.addEventListener('click', () => {
            // Verificar que se hayan seleccionado todas las opciones
            if (selectedOptions.length < 3 || selectedOptions.includes(undefined)) {
                alert('Por favor, responde todas las preguntas antes de calcular tu huella.');
                return;
            }
            
            // Calcular huella (suma de valores seleccionados)
            const total = selectedOptions.reduce((sum, value) => sum + value, 0);
            const average = (total / selectedOptions.length).toFixed(1);
            
            footprintValue.textContent = average;
            
            // Determinar mensaje según resultado
            let message = '';
            if (average <= 1.5) {
                message = '¡Tu huella ecológica es baja! Continúa con tus buenas prácticas ambientales.';
            } else if (average <= 2.5) {
                message = 'Tu huella ecológica es moderada. Pequeños cambios pueden reducir significativamente tu impacto en la biodiversidad panameña.';
            } else {
                message = 'Tu huella ecológica es alta. Considera implementar cambios en tu estilo de vida para proteger la biodiversidad.';
            }
            
            footprintMessage.textContent = message;
            footprintResult.classList.add('active');
            
            // Desplazar hacia el resultado
            footprintResult.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
        
        reduceBtn.addEventListener('click', () => {
            alert('Consejos para reducir tu huella ecológica:\n\n1. Usa transporte público, bicicleta o camina\n2. Reduce el consumo de carne\n3. Recicla y composta tus residuos\n4. Consume productos locales y de temporada\n5. Ahorra agua y energía en casa\n6. Planta árboles nativos');
        });