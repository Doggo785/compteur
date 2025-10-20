const wheelSegments = [
    { label: 'HYPE!', color: '#ffd700', hype: true },
    { label: 'HYPE!', color: '#ffd700', hype: true },
    { label: 'MATRIX', color: '#00ff88', matrix: true, hype: false },
    { label: 'RIEN', color: '#cccccc', hype: false },
    { label: 'RIEN', color: '#aaaaaa', hype: false },
    { label: 'RIEN', color: '#cccccc', hype: false },
    { label: 'RIEN', color: '#aaaaaa', hype: false },
    { label: 'RIEN', color: '#cccccc', hype: false }
];

// État interne de la roue
let isSpinning = false;
let accumulatedRotation = 0;

function generateWheel() {
    const numSegments = wheelSegments.length;
    const segmentAngle = 360 / numSegments;
    const radius = 200; // rayon de la roue
    
    wheelSegments.forEach((segment, i) => {
        const segmentEl = document.createElement('div');
        segmentEl.className = 'wheel-segment';
        segmentEl.style.backgroundColor = segment.color;
        
        // Rotation de base pour ce segment
        const rotation = segmentAngle * i;
        segmentEl.style.transform = `rotate(${rotation}deg)`;
        
    // Données pour la détection
    segmentEl.dataset.label = segment.label;
    segmentEl.dataset.hype = String(!!segment.hype);
    segmentEl.dataset.matrix = String(!!segment.matrix);
        
        // Création du texte
        const textEl = document.createElement('span');
        textEl.className = 'segment-text';
        textEl.textContent = segment.label;
        
        // Position du texte au milieu du segment
        textEl.style.transform = `rotate(${segmentAngle / 2}deg) translate(0%, -150%) rotate(${-rotation - (segmentAngle / 2)}deg)`;
        
        segmentEl.appendChild(textEl);
        domElements.wheel.appendChild(segmentEl);
    });
}

// Retourne l'élément <div.wheel-segment> situé sous la pointe du curseur fixe
function getSegmentUnderPointer() {
    const spinner = document.querySelector('.wheel-spinner');
    if (!spinner) return null;

    const rect = spinner.getBoundingClientRect();
    // On vise le bord droit de la roue, légèrement à l'intérieur (10px)
    const x = rect.right - 10;
    const y = rect.top + rect.height / 2;
    let el = document.elementFromPoint(x, y);
    while (el && el !== document.body && !el.classList?.contains('wheel-segment')) {
        el = el.parentElement;
    }
    return (el && el.classList?.contains('wheel-segment')) ? el : null;
}

function revealResultFromSegment(segmentEl) {
    const label = segmentEl?.dataset?.label ?? 'RIEN';
    const hype = segmentEl?.dataset?.hype === 'true';
    const matrix = segmentEl?.dataset?.matrix === 'true';
    const resultMessage = domElements.resultMessage;
    resultMessage.textContent = label;
    // Couleur de glow selon le type
    const glowColor = matrix ? '#00ff88' : (hype ? '#ffd700' : '#cccccc');
    resultMessage.style.setProperty('--glow-color', glowColor);
    resultMessage.classList.add('visible');
    if (hype) {
        // Respecte config hype.enabled
        const hypeEnabled = (typeof getConfigPath === 'function') ? !!getConfigPath('effects.hype.enabled', true) : true;
        if (hypeEnabled) startHypeMode();
        // Ne déclenche plus Matrix sur HYPE
    } else if (matrix) {
        // Déclencher l'effet Matrix selon config (enabled + durée)
        const matrixEnabled = (typeof getConfigPath === 'function') ? !!getConfigPath('effects.matrix.enabled', true) : true;
        if (matrixEnabled) {
            try {
                const duration = (typeof getConfigPath === 'function') ? (getConfigPath('effects.matrix.durationMs', 25000) || 25000) : 25000;
                if (typeof triggerMatrixTransition === 'function') {
                    triggerMatrixTransition(duration);
                } else if (window.advancedEffects && typeof window.advancedEffects.triggerMatrixTransition === 'function') {
                    window.advancedEffects.triggerMatrixTransition(duration);
                }
            } catch (e) {
                console.debug('Matrix effect not available:', e);
            }
        }
    } else if (typeof hypeModeActive !== 'undefined' && hypeModeActive) {
        // Si on tombe sur un segment non-hype pendant le mode hype, on arrête immédiatement
        if (typeof stopHypeMode === 'function') stopHypeMode();
    }
}

function spinWheel() {
    // Vérifie si la roue est désactivée en mode Debug
    if (window.debugMode && typeof window.debugMode.getConfig === 'function') {
        const debugConfig = window.debugMode.getConfig();
        if (debugConfig.enabled && !debugConfig.wheelEnabled) {
            console.log('🐛 Debug: Roue désactivée');
            return;
        }
    }
    
    if (isSpinning) return;
    isSpinning = true;

    domElements.wheelContainer.classList.add('visible');

    // On crée une rotation aléatoire (sans calcul d'atterrissage)
    const extraTurns = 3 + Math.floor(Math.random() * 4); // 3 à 6 tours complets
    const extraDegrees = Math.floor(Math.random() * 360); // 0..359°
    const totalDelta = extraTurns * 360 + extraDegrees;
    const finalRotation = accumulatedRotation + totalDelta;

    // Lance la rotation
    domElements.wheel.style.transition = 'transform 6s cubic-bezier(0.25, 1, 0.5, 1)';
    domElements.wheel.style.transform = `rotate(${finalRotation}deg)`;

    // À la fin de la transition, on lit réellement le segment pointé
    const onEnd = () => {
        // Détection fiable via hit-testing
        const segmentEl = getSegmentUnderPointer();
        
        // Applique l'override du mode Debug si configuré
        let forcedEffect = null;
        if (window.debugMode && typeof window.debugMode.getConfig === 'function') {
            const debugConfig = window.debugMode.getConfig();
            if (debugConfig.enabled && debugConfig.forcedEffect) {
                forcedEffect = debugConfig.forcedEffect;
                console.log('🐛 Debug: Effet forcé ->', forcedEffect);
            }
        }
        
        if (forcedEffect) {
            // Force l'effet selon la config debug
            if (forcedEffect === 'hype' && typeof startHypeMode === 'function') {
                startHypeMode();
            } else if (forcedEffect === 'matrix') {
                if (typeof triggerMatrixTransition === 'function') {
                    triggerMatrixTransition(25000);
                } else if (window.advancedEffects && typeof window.advancedEffects.triggerMatrixTransition === 'function') {
                    window.advancedEffects.triggerMatrixTransition(25000);
                }
            }
            // 'none' = aucun effet déclenché
        } else {
            // Comportement normal
            revealResultFromSegment(segmentEl);
        }

        // Cache l'overlay et reset la rotation pour le prochain tour
        setTimeout(() => {
            domElements.resultMessage.classList.remove('visible');
            domElements.wheel.style.transition = 'none';
            accumulatedRotation = finalRotation % 360;
            domElements.wheel.style.transform = `rotate(${accumulatedRotation}deg)`;
            domElements.wheelContainer.classList.remove('visible');
            // Force reflow pour que la prochaine transition soit bien prise en compte
            void domElements.wheel.offsetWidth;
            isSpinning = false;
        }, (typeof getConfigPath === 'function') ? (getConfigPath('effects.wheel.resultDisplayMs', 2000) || 2000) : 2000);
    };

    domElements.wheel.addEventListener('transitionend', onEnd, { once: true });
}

