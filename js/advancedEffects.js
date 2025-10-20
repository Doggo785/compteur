// Permet d'arrêter l'effet Matrix depuis l'extérieur
function stopMatrixTransition() {
    if (matrixEffect && matrixEffect.isActive) {
        matrixEffect.stop();
        console.log('🛑 Effet Matrix arrêté');
    }
}
// ============================================
// ANIMATIONS SUPPLÉMENTAIRES AVANCÉES
// ============================================

// ========================================
// 1. PARTICULES MAGNÉTIQUES (Souris)
// ========================================

class MagneticParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.radius = Math.random() * 3 + 1;
        this.life = 1;
        this.maxLife = Math.random() * 60 + 40;
        this.hue = Math.random() * 60 + 180; // Bleu-vert
    }

    update(mouseX, mouseY, mouseActive) {
        // Attraction magnétique vers la souris
        if (mouseActive) {
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const attractionRadius = magneticSystem?.attractionRadius ?? 150;

            if (distance < attractionRadius && distance > 0) {
                const force = (attractionRadius - distance) / attractionRadius;
                this.vx += (dx / distance) * force * 0.5;
                this.vy += (dy / distance) * force * 0.5;
            }
        }

        // Friction
        this.vx *= 0.95;
        this.vy *= 0.95;

        // Mouvement
        this.x += this.vx;
        this.y += this.vy;

        // Vie
        this.life++;

        // Rebondir sur les bords
        if (this.x < 0 || this.x > window.innerWidth) this.vx *= -1;
        if (this.y < 0 || this.y > window.innerHeight) this.vy *= -1;
    }

    draw(ctx) {
        const alpha = 1 - (this.life / this.maxLife);
        ctx.fillStyle = `hsla(${this.hue}, 70%, 60%, ${alpha * 0.8})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // Glow effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = `hsl(${this.hue}, 70%, 60%)`;
        ctx.fill();
        ctx.shadowBlur = 0;
    }

    isDead() {
        return this.life >= this.maxLife;
    }
}

class MagneticParticleSystem {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.mouseActive = false;
        this.animationId = null;
        this.lastSpawnTime = 0;
        // paramètres via config
        this.maxParticles = (typeof getConfigPath === 'function') ? (getConfigPath('effects.magneticParticles.maxParticles', 200) || 200) : 200;
        this.spawnIntervalMs = (typeof getConfigPath === 'function') ? (getConfigPath('effects.magneticParticles.spawnIntervalMs', 50) || 50) : 50;
        this.attractionRadius = (typeof getConfigPath === 'function') ? (getConfigPath('effects.magneticParticles.attractionRadius', 150) || 150) : 150;
    }

    init() {
        // Créer le canvas
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'magnetic-canvas';
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '5';
        document.body.appendChild(this.canvas);

        this.ctx = this.canvas.getContext('2d');
        this.resize();

        // Event listeners
        window.addEventListener('resize', () => this.resize());
        document.addEventListener('mousemove', (e) => this.onMouseMove(e));
        document.addEventListener('mouseenter', () => this.mouseActive = true);
        document.addEventListener('mouseleave', () => this.mouseActive = false);

        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    onMouseMove(e) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
        this.mouseActive = true;

        // Spawn des particules au passage de la souris
        const now = Date.now();
        const interval = this.spawnIntervalMs;
        if (now - this.lastSpawnTime > interval) { // spawn contrôlé par config
            this.particles.push(new MagneticParticle(this.mouseX, this.mouseY));
            this.lastSpawnTime = now;
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update et draw des particules
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.update(this.mouseX, this.mouseY, this.mouseActive);
            p.draw(this.ctx);

            if (p.isDead()) {
                this.particles.splice(i, 1);
            }
        }

        // Limiter le nombre de particules (config)
        if (this.particles.length > this.maxParticles) {
            this.particles.splice(0, this.particles.length - this.maxParticles);
        }

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

// Instance globale
let magneticSystem = null;

function initMagneticParticles() {
    const enabled = (typeof getConfigPath === 'function') ? !!getConfigPath('effects.magneticParticles.enabled', true) : true;
    if (!enabled) {
        console.log('🧲 Particules magnétiques désactivées via configuration');
        return;
    }
    if (!magneticSystem) {
        magneticSystem = new MagneticParticleSystem();
        magneticSystem.init();
        console.log('✨ Particules magnétiques activées');
    }
}

// ========================================
// 2. GLITCH EFFECT EN MODE CRITIQUE
// ========================================

function applyGlitchEffect(element, intensity = 1) {
    const glitchClass = 'glitch-effect';
    
    if (!element.classList.contains(glitchClass)) {
        element.classList.add(glitchClass);
    }

    // Animation de glitch aléatoire
    const glitchAnimation = () => {
        const duration = Math.random() * 100 + 50;
        const offsetX = (Math.random() - 0.5) * 10 * intensity;
        const offsetY = (Math.random() - 0.5) * 5 * intensity;
        
        element.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        element.style.textShadow = `
            ${Math.random() * 5 - 2.5}px ${Math.random() * 5 - 2.5}px 0 rgba(255, 0, 0, ${intensity * 0.8}),
            ${Math.random() * 5 - 2.5}px ${Math.random() * 5 - 2.5}px 0 rgba(0, 255, 255, ${intensity * 0.8}),
            0 0 ${10 * intensity}px rgba(255, 255, 255, ${intensity * 0.5})
        `;

        setTimeout(() => {
            element.style.transform = 'translate(0, 0)';
        }, duration);
    };

    // Répéter l'effet
    const glitchInterval = setInterval(glitchAnimation, Math.random() * 200 + 100);
    
    // Sauvegarder l'interval pour le cleanup
    element.dataset.glitchInterval = glitchInterval;
}

function removeGlitchEffect(element) {
    element.classList.remove('glitch-effect');
    element.style.transform = '';
    element.style.textShadow = '';
    
    if (element.dataset.glitchInterval) {
        clearInterval(parseInt(element.dataset.glitchInterval));
        delete element.dataset.glitchInterval;
    }
}

// ========================================
// 3. TRANSITION MATRICIELLE
// ========================================

class MatrixEffect {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        this.fontSize = 16;
        this.columns = 0;
        this.drops = [];
        this.animationId = null;
        this.isActive = false;
    }

    init() {
        // Créer le canvas
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'matrix-canvas';
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '10';
        this.canvas.style.opacity = '0';
        this.canvas.style.transition = 'opacity 0.5s';
        document.body.appendChild(this.canvas);

        this.ctx = this.canvas.getContext('2d');
        this.resize();

        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.columns = Math.floor(this.canvas.width / this.fontSize);
        this.drops = Array(this.columns).fill(1);
    }

    trigger(duration = 1000) {
        if (!this.canvas) {
            this.init();
        }

        this.isActive = true;
        this.canvas.style.opacity = '0.8';

        // Réinitialiser les gouttes
        this.drops = Array(this.columns).fill(1).map(() => Math.random() * -100);

        // Démarrer l'animation
        if (!this.animationId) {
            this.animate();
        }

        // Arrêter après la durée spécifiée
        setTimeout(() => {
            this.stop();
        }, duration);
    }

    animate() {
        // Fond semi-transparent pour l'effet de traînée
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Texte vert Matrix
        this.ctx.fillStyle = '#0F0';
        this.ctx.font = `${this.fontSize}px monospace`;

        for (let i = 0; i < this.drops.length; i++) {
            const char = this.characters[Math.floor(Math.random() * this.characters.length)];
            const x = i * this.fontSize;
            const y = this.drops[i] * this.fontSize;

            this.ctx.fillText(char, x, y);

            // Réinitialiser la goutte aléatoirement
            if (y > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }

            this.drops[i]++;
        }

        if (this.isActive) {
            this.animationId = requestAnimationFrame(() => this.animate());
        }
    }

    stop() {
        this.isActive = false;
        this.canvas.style.opacity = '0';
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }

        // Nettoyer le canvas après la transition
        setTimeout(() => {
            if (this.ctx) {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            }
        }, 500);
    }

    destroy() {
        this.stop();
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

// Instance globale
let matrixEffect = null;

function initMatrixEffect() {
    if (!matrixEffect) {
        matrixEffect = new MatrixEffect();
        matrixEffect.init();
        console.log('🟢 Effet Matrix initialisé');
    }
}

function triggerMatrixTransition(duration = 1000) {
    if (!matrixEffect) {
        initMatrixEffect();
    }
    matrixEffect.trigger(duration);
}

// ========================================
// INTÉGRATION AVEC LE COMPTE À REBOURS
// ========================================

let isInCriticalMode = false;

function checkCriticalMode() {
    if (typeof dateCible === 'undefined' || typeof dateDebut === 'undefined') {
        return;
    }

    const now = new Date();
    const totalDuration = dateCible - dateDebut;
    const remaining = dateCible - now;
    const percentageRemaining = (remaining / totalDuration) * 100;

    const criticalEnabled = (typeof getConfigPath === 'function') ? !!getConfigPath('effects.critical.enabled', true) : true;
    const criticalThreshold = (typeof getConfigPath === 'function') ? (getConfigPath('effects.critical.thresholdPercent', 10) || 10) : 10;
    const h1Element = document.querySelector('h1');
    const timerElement = document.getElementById('countdown-timer');
    const containerElement = document.querySelector('.container');
    const progressBars = document.querySelectorAll('.progress-bar');

    // Mode critique activé
    if (criticalEnabled && percentageRemaining < criticalThreshold && percentageRemaining > 0) {
        if (!isInCriticalMode) {
            isInCriticalMode = true;
            console.log('⚠️ MODE CRITIQUE ACTIVÉ !');
            
            // Appliquer le glitch
            if (h1Element) {
                const intensity = 1 + (1 - percentageRemaining / criticalThreshold);
                applyGlitchEffect(h1Element, intensity);
                h1Element.classList.add('critical-text');
            }
            if (timerElement) {
                const intensity = 1 + (1 - percentageRemaining / criticalThreshold);
                applyGlitchEffect(timerElement, intensity);
                timerElement.classList.add('critical-text');
            }
            
            // Ajouter la classe critique au conteneur
            if (containerElement) {
                containerElement.classList.add('critical-mode');
            }
            
            // Ajouter la classe critique aux barres
            progressBars.forEach(bar => {
                if (!bar.classList.contains('hype-mode-progress')) {
                    bar.classList.add('critical-mode');
                }
            });
            
            // Trigger Matrix effect immédiatement en mode critique
            triggerMatrixTransition(1500);
        }
    } else if (isInCriticalMode && percentageRemaining >= criticalThreshold) {
        // Désactiver le mode critique
        isInCriticalMode = false;
        console.log('✅ Mode critique désactivé');
        
        if (h1Element) {
            removeGlitchEffect(h1Element);
            h1Element.classList.remove('critical-text');
        }
        if (timerElement) {
            removeGlitchEffect(timerElement);
            timerElement.classList.remove('critical-text');
        }
        
        if (containerElement) {
            containerElement.classList.remove('critical-mode');
        }
        
        progressBars.forEach(bar => {
            bar.classList.remove('critical-mode');
        });
    }

    // Note: l'effet Matrix n'est plus déclenché automatiquement ici.
    // Il est maintenant déclenché exclusivement par la roue (wheel.js).
}

// Vérifier le mode critique régulièrement
setInterval(checkCriticalMode, 100);

// ========================================
// INITIALISATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🎨 Initialisation des effets avancés...');
    
    // Activer les particules magnétiques
    initMagneticParticles();
    
    // Préparer l'effet Matrix
    initMatrixEffect();
    
    console.log('✨ Tous les effets avancés sont prêts !');
});

// Export pour utilisation externe
window.advancedEffects = {
    initMagneticParticles,
    initMatrixEffect,
    triggerMatrixTransition,
    stopMatrixTransition,
    applyGlitchEffect,
    removeGlitchEffect,
    // Fonction de test pour forcer le mode critique
    testCriticalMode: () => {
        console.log('🧪 Test du mode critique (10 secondes)');
        // Sauvegarder les vraies valeurs
        const realDateCible = window.dateCible;
        const realDateDebut = window.dateDebut;
        
        // Simuler qu'il reste 5% du temps
        window.dateDebut = new Date(Date.now() - 95000); // Il y a 95s
        window.dateCible = new Date(Date.now() + 5000); // Dans 5s
        
        setTimeout(() => {
            // Restaurer les vraies valeurs
            window.dateDebut = realDateDebut;
            window.dateCible = realDateCible;
            console.log('🧪 Test terminé, valeurs restaurées');
        }, 10000);
    }
};
