document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.section');
    let currentSlide = 0;

    // Set initial slide active
    if (sections[0]) {
        sections[0].classList.add('active');
    }

    // Sparkles Effect Logic
    const createSpark = (container, isTextSparks = false) => {
        const spark = document.createElement('div');
        spark.classList.add('spark');
        
        // Random position
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        spark.style.left = `${x}%`;
        spark.style.top = `${y}%`;
        
        // Movement vectors
        let tx, ty;
        if (isTextSparks) {
            tx = (Math.random() - 0.5) * 200;
            ty = (Math.random() - 0.5) * 60 + 30; 
        } else {
            tx = (Math.random() - 0.5) * 150;
            ty = (Math.random() - 0.5) * 150 - 50;
        }

        const smax = 1 + Math.random() * 2;
        spark.style.setProperty('--tx', `${tx}px`);
        spark.style.setProperty('--ty', `${ty}px`);
        spark.style.setProperty('--smax', `${smax}`);
        
        const duration = 3 + Math.random() * 6;
        spark.style.animation = `sparkTwinkle ${duration}s ease-in-out forwards`;
        
        container.appendChild(spark);
        
        setTimeout(() => {
            if (spark.parentNode) {
                spark.remove();
            }
        }, duration * 1000);
    };

    // Start Section Sparks
    const sparksContainerStart = document.getElementById('sparks-container-start');
    let sparkIntervalStart;
    if (sparksContainerStart) {
        sparkIntervalStart = setInterval(() => createSpark(sparksContainerStart), 400);
        for (let i = 0; i < 8; i++) {
            setTimeout(() => createSpark(sparksContainerStart), Math.random() * 2000);
        }
    }



    // Story Section 1 Sparks (Text)
    const sparksContainer2 = document.getElementById('sparks-container-2');
    let sparkInterval2;
    const sparksContainer3 = document.getElementById('sparks-container-3');
    let sparkInterval3;

    // Ember particle system for the flame
    const createEmber = (container) => {
        const ember = document.createElement('div');
        ember.classList.add('ember');

        const x = 100 + Math.random() * 280;
        ember.style.left = `${x}px`;

        const tx = (Math.random() - 0.5) * 80;
        const ty = -(80 + Math.random() * 150);
        ember.style.setProperty('--ember-tx', `${tx}px`);
        ember.style.setProperty('--ember-ty', `${ty}px`);

        const duration = 2 + Math.random() * 3;
        ember.style.animation = `emberRise ${duration}s ease-out forwards`;

        container.appendChild(ember);

        setTimeout(() => {
            if (ember.parentNode) ember.remove();
        }, duration * 1000);
    };

    const startEmbers = () => {
        const emberContainer = document.getElementById('ember-container');
        if (!emberContainer) return;
        setInterval(() => createEmber(emberContainer), 300);
        for (let i = 0; i < 5; i++) {
            setTimeout(() => createEmber(emberContainer), Math.random() * 1000);
        }
    };

    let polaroidsTriggered = false;
    let embersStarted = false;

    // Presentation Transition Logic
    const advanceSlide = () => {
        if (currentSlide >= sections.length - 1) return; // End of presentation

        // 1. Deactivate current slide
        if (currentSlide !== 0) {
            sections[currentSlide].classList.remove('active');
        }

        if (currentSlide === 0) {
            const startContent = sections[0].querySelector('.content');
            if (startContent) startContent.classList.add('fade-interior');
        } else if (currentSlide === 1) {
            sections[0].classList.remove('active'); // Hide background sparks section

            if (typeof sparkIntervalStart !== 'undefined') clearInterval(sparkIntervalStart);
            
            const heroContent = sections[1].querySelector('.content');
            if (heroContent) heroContent.classList.add('fade-interior');
            
            const allSparks = document.querySelectorAll('#sparks-container-start .spark');
            
            allSparks.forEach(spark => {
                spark.style.opacity = window.getComputedStyle(spark).opacity;
                spark.style.animation = 'none';
            });
            
            void document.body.offsetWidth; // Force single reflow
            
            allSparks.forEach(spark => {
                spark.style.transition = 'all 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
                spark.style.left = '50%';
                spark.style.top = '50%';
                spark.style.transform = 'translate(-50%, -50%) scale(0.1)';
                spark.style.opacity = '0';
            });
        } else if (currentSlide === 2) {
            if (sparkInterval2) clearInterval(sparkInterval2);
            if (sparkInterval3) clearInterval(sparkInterval3);
            // Collapse text sparks
            const allSparks = document.querySelectorAll('#sparks-container-2 .spark, #sparks-container-3 .spark');
            allSparks.forEach(spark => {
                spark.style.opacity = '0';
            });
        }

        // 2. Advance to next slide
        currentSlide++;
        sections[currentSlide].classList.add('active');

        // Auto-advance logic for timed presentation
        if (currentSlide === 1) {
            setTimeout(advanceSlide, 6500); // 6.5s to read the hero message
        } else if (currentSlide === 2) {
            setTimeout(advanceSlide, 10000); // 10s to watch polaroids and both texts
        }

        // 3. Trigger slide-specific animations
        if (currentSlide === 2 && !polaroidsTriggered) {
            polaroidsTriggered = true;
            
            // Polaroids appear at 2.5s
            setTimeout(() => {
                const polaroids = document.querySelectorAll('.polaroid');
                polaroids.forEach((p, index) => {
                    setTimeout(() => {
                        p.classList.add('thrown');
                    }, index * 250);
                });

                setTimeout(() => {
                    polaroids.forEach(p => p.classList.add('spread'));
                }, (polaroids.length * 250) + 400);
            }, 2500);

            // Top text sparks at 1.0s
            setTimeout(() => {
                if (sparksContainer2) {
                    sparkInterval2 = setInterval(() => createSpark(sparksContainer2, true), 600);
                    for (let i = 0; i < 5; i++) {
                        setTimeout(() => createSpark(sparksContainer2, true), Math.random() * 2000);
                    }
                }
            }, 1000);

            // Bottom text sparks at 6.0s (after second text appears)
            setTimeout(() => {
                if (sparksContainer3) {
                    sparkInterval3 = setInterval(() => createSpark(sparksContainer3, true), 600);
                    for (let i = 0; i < 5; i++) {
                        setTimeout(() => createSpark(sparksContainer3, true), Math.random() * 2000);
                    }
                }
            }, 6000);
        } else if (currentSlide === 3) {
            const sectionSunrise = document.getElementById('section-sunrise');
            if (sectionSunrise) {
                sectionSunrise.classList.add('sunrise-active');
            }
            if (!embersStarted) {
                embersStarted = true;
                setTimeout(() => {
                    startEmbers();
                }, 3000);
            }
        }
    };

    const startPresentation = () => {
        if (currentSlide !== 0) return;
        
        document.removeEventListener('click', startPresentation);
        document.removeEventListener('touchstart', startPresentation);
        document.removeEventListener('keydown', keydownListener);
        
        advanceSlide();
    };

    const keydownListener = (e) => {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') {
            startPresentation();
        }
    };

    // Global listeners to start the timed presentation
    document.addEventListener('click', startPresentation);
    document.addEventListener('touchstart', startPresentation, { passive: true });
    document.addEventListener('keydown', keydownListener);
});
