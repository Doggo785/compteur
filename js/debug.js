// ============================================
// Mode Debug - Contrôle complet de l'application
// ============================================

const DEBUG_STORAGE_KEY = 'countdown-debug-config';

// État du mode Debug
let debugModeActive = false;

// Configuration Debug par défaut
const DEFAULT_DEBUG_CONFIG = {
    enabled: false,
    wheelEnabled: true,
    criticalModeEnabled: false, // désactivé par défaut - à activer manuellement
    forcedEffect: null, // null | 'hype' | 'matrix' | 'none'
    timeMultiplier: 1, // multiplicateur de vitesse du temps
    showDebugInfo: false, // affiche les infos de debug sur l'écran
    particleDebug: false, // affiche le nombre de particules en temps réel
    autoTriggerEffects: false, // déclenche automatiquement les effets pour test
    freezeTime: false, // gèle le temps
    customPercentage: null // force un pourcentage spécifique (0-100)
};

// Charge la configuration Debug
function loadDebugConfig() {
    const saved = localStorage.getItem(DEBUG_STORAGE_KEY);
    if (saved) {
        try {
            return { ...DEFAULT_DEBUG_CONFIG, ...JSON.parse(saved) };
        } catch (e) {
            console.error('Erreur lors du chargement de la config debug:', e);
            return DEFAULT_DEBUG_CONFIG;
        }
    }
    return DEFAULT_DEBUG_CONFIG;
}

// Sauvegarde la configuration Debug
function saveDebugConfig(config) {
    try {
        localStorage.setItem(DEBUG_STORAGE_KEY, JSON.stringify(config));
        return true;
    } catch (e) {
        console.error('Erreur lors de la sauvegarde de la config debug:', e);
        return false;
    }
}

// Active/Désactive le mode Debug
function toggleDebugMode() {
    const config = loadDebugConfig();
    config.enabled = !config.enabled;
    debugModeActive = config.enabled;
    saveDebugConfig(config);
    
    const panel = document.getElementById('debug-panel');
    if (panel) {
        panel.classList.toggle('visible', debugModeActive);
    }
    
    // Affiche/Cache l'overlay de debug
    updateDebugOverlay();
    
    console.log(`Mode Debug ${debugModeActive ? 'ACTIVÉ' : 'DÉSACTIVÉ'}`);
    return debugModeActive;
}

// Crée le panneau de Debug dans le DOM
function createDebugPanel() {
    const existingPanel = document.getElementById('debug-panel');
    if (existingPanel) return;
    
    const panel = document.createElement('div');
    panel.id = 'debug-panel';
    panel.className = 'debug-panel';
    panel.innerHTML = `
        <div class="debug-content">
            <div class="debug-header">
                <h2>🐛 Mode Debug</h2>
                <button id="close-debug-btn" class="debug-close-btn" title="Fermer">✕</button>
            </div>
            
            <div class="debug-section">
                <h3>🎡 Contrôle de la Roue</h3>
                <label class="debug-switch-label">
                    <span>Roue activée</span>
                    <label class="debug-switch">
                        <input type="checkbox" id="debug-wheel-enabled" checked>
                        <span class="debug-switch-slider"></span>
                    </label>
                </label>
                <button id="debug-force-spin" class="debug-btn">🎲 Forcer un lancer</button>
            </div>
            
            <div class="debug-section">
                <h3>⚠️ Mode Critique</h3>
                <label class="debug-switch-label">
                    <span>Mode critique activé</span>
                    <label class="debug-switch">
                        <input type="checkbox" id="debug-critical-enabled">
                        <span class="debug-switch-slider"></span>
                    </label>
                </label>
            </div>
            
            <div class="debug-section">
                <h3>✨ Effets Forcés</h3>
                <select id="debug-forced-effect" class="debug-select">
                    <option value="null">Aucun (Normal)</option>
                    <option value="hype">🔥 HYPE Mode</option>
                    <option value="matrix">💚 Matrix</option>
                    <option value="none">❌ Aucun effet</option>
                </select>
                <button id="debug-trigger-hype" class="debug-btn">🔥 Déclencher HYPE</button>
                <button id="debug-trigger-matrix" class="debug-btn">💚 Déclencher Matrix</button>
                <button id="debug-stop-effects" class="debug-btn">⏹️ Arrêter effets</button>
            </div>
            
            <div class="debug-section">
                <h3>⏱️ Contrôle du Temps</h3>
                <label class="debug-switch-label">
                    <span>❄️ Geler le temps</span>
                    <label class="debug-switch">
                        <input type="checkbox" id="debug-freeze-time">
                        <span class="debug-switch-slider"></span>
                    </label>
                </label>
                <div class="debug-slider-group">
                    <label for="debug-time-multiplier">Vitesse du temps: <span id="time-multiplier-value">1.0x</span></label>
                    <input type="range" id="debug-time-multiplier" min="0.1" max="10" step="0.1" value="1" class="debug-slider">
                </div>
                <div class="debug-slider-group">
                    <label for="debug-custom-percentage">Pourcentage forcé: <span id="custom-percentage-value">Désactivé</span></label>
                    <input type="range" id="debug-custom-percentage" min="0" max="100" step="1" value="50" class="debug-slider">
                    <button id="debug-reset-percentage" class="debug-btn-small">Réinitialiser</button>
                </div>
            </div>
            
            <div class="debug-section">
                <h3>🎨 Particules</h3>
                <div class="debug-slider-group">
                    <label for="debug-particle-count">Nombre de particules: <span id="particle-count-value">25</span></label>
                    <input type="range" id="debug-particle-count" min="0" max="500" step="5" value="25" class="debug-slider">
                </div>
                <label class="debug-switch-label">
                    <span>Afficher infos particules</span>
                    <label class="debug-switch">
                        <input type="checkbox" id="debug-particle-info">
                        <span class="debug-switch-slider"></span>
                    </label>
                </label>
            </div>
            
            <div class="debug-section">
                <h3>📊 Informations</h3>
                <label class="debug-switch-label">
                    <span>Overlay d'informations</span>
                    <label class="debug-switch">
                        <input type="checkbox" id="debug-show-info">
                        <span class="debug-switch-slider"></span>
                    </label>
                </label>
                <button id="debug-log-state" class="debug-btn">📋 Logger l'état</button>
                <button id="debug-reset-all" class="debug-btn debug-btn-danger">🔄 Reset complet</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(panel);
    
    // Charge la config actuelle
    const config = loadDebugConfig();
    if (config.enabled) {
        panel.classList.add('visible');
    }
    
    // Initialise les contrôles avec les valeurs sauvegardées
    initDebugControls(config);
}

// Crée l'overlay d'informations de debug
function createDebugOverlay() {
    const existingOverlay = document.getElementById('debug-overlay');
    if (existingOverlay) return;
    
    const overlay = document.createElement('div');
    overlay.id = 'debug-overlay';
    overlay.className = 'debug-overlay';
    overlay.innerHTML = `
        <div class="debug-info-item">
            <strong>FPS:</strong> <span id="debug-fps">60</span>
        </div>
        <div class="debug-info-item">
            <strong>Particules:</strong> <span id="debug-particle-count-display">0</span>
        </div>
        <div class="debug-info-item">
            <strong>Progression:</strong> <span id="debug-progress-display">0%</span>
        </div>
        <div class="debug-info-item">
            <strong>Effet actif:</strong> <span id="debug-active-effect">Aucun</span>
        </div>
        <div class="debug-info-item">
            <strong>Roue:</strong> <span id="debug-wheel-status">Activée</span>
        </div>
        <div class="debug-info-item">
            <strong>Critique:</strong> <span id="debug-critical-status">-</span>
        </div>
    `;
    
    document.body.appendChild(overlay);
}

// Initialise les contrôles du panneau Debug
function initDebugControls(config) {
    // Bouton fermer
    const closeBtn = document.getElementById('close-debug-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', toggleDebugMode);
    }
    
    // Contrôle de la roue
    const wheelEnabledCheckbox = document.getElementById('debug-wheel-enabled');
    if (wheelEnabledCheckbox) {
        wheelEnabledCheckbox.checked = config.wheelEnabled;
        wheelEnabledCheckbox.addEventListener('change', (e) => {
            const debugConfig = loadDebugConfig();
            debugConfig.wheelEnabled = e.target.checked;
            saveDebugConfig(debugConfig);
            applyWheelDebug(debugConfig.wheelEnabled);
        });
    }
    
    // Contrôle du mode critique
    const criticalEnabledCheckbox = document.getElementById('debug-critical-enabled');
    if (criticalEnabledCheckbox) {
        criticalEnabledCheckbox.checked = config.criticalModeEnabled === true;
        criticalEnabledCheckbox.addEventListener('change', (e) => {
            const debugConfig = loadDebugConfig();
            debugConfig.criticalModeEnabled = e.target.checked;
            saveDebugConfig(debugConfig);
            applyCriticalModeDebug(debugConfig.criticalModeEnabled);
            console.log(`🐛 Mode critique ${e.target.checked ? 'activé' : 'désactivé'} via debug`);
            
            // ✅ FORCE une vérification IMMÉDIATE du mode critique
            if (typeof checkCriticalMode === 'function') {
                checkCriticalMode();
            }
        });
    }
    
    // Forcer un lancer de roue
    const forceSpinBtn = document.getElementById('debug-force-spin');
    if (forceSpinBtn) {
        forceSpinBtn.addEventListener('click', () => {
            if (typeof spinWheel === 'function') {
                spinWheel();
            }
        });
    }
    
    // Effets forcés
    const forcedEffectSelect = document.getElementById('debug-forced-effect');
    if (forcedEffectSelect) {
        forcedEffectSelect.value = config.forcedEffect || 'null';
        forcedEffectSelect.addEventListener('change', (e) => {
            const debugConfig = loadDebugConfig();
            debugConfig.forcedEffect = e.target.value === 'null' ? null : e.target.value;
            saveDebugConfig(debugConfig);
        });
    }
    
    // Déclencher HYPE
    const triggerHypeBtn = document.getElementById('debug-trigger-hype');
    if (triggerHypeBtn) {
        triggerHypeBtn.addEventListener('click', () => {
            if (typeof startHypeMode === 'function') {
                startHypeMode();
            }
        });
    }
    
    // Déclencher Matrix
    const triggerMatrixBtn = document.getElementById('debug-trigger-matrix');
    if (triggerMatrixBtn) {
        triggerMatrixBtn.addEventListener('click', () => {
            if (typeof triggerMatrixTransition === 'function') {
                triggerMatrixTransition(25000);
            } else if (window.advancedEffects && typeof window.advancedEffects.triggerMatrixTransition === 'function') {
                window.advancedEffects.triggerMatrixTransition(25000);
            }
        });
    }
    
    // Arrêter tous les effets
    const stopEffectsBtn = document.getElementById('debug-stop-effects');
    if (stopEffectsBtn) {
        stopEffectsBtn.addEventListener('click', () => {
            // Arrêter HYPE
            if (typeof stopHypeMode === 'function') {
                stopHypeMode();
            }
            // Arrêter Matrix (toujours utiliser la fonction exposée)
            if (window.advancedEffects && typeof window.advancedEffects.stopMatrixTransition === 'function') {
                window.advancedEffects.stopMatrixTransition();
            } else if (typeof stopMatrixTransition === 'function') {
                stopMatrixTransition();
            }
        });
    }
    
    // Geler le temps
    const freezeTimeCheckbox = document.getElementById('debug-freeze-time');
    if (freezeTimeCheckbox) {
        freezeTimeCheckbox.checked = config.freezeTime;
        freezeTimeCheckbox.addEventListener('change', (e) => {
            const debugConfig = loadDebugConfig();
            debugConfig.freezeTime = e.target.checked;
            saveDebugConfig(debugConfig);
        });
    }
    
    // Multiplicateur de temps
    const timeMultiplierSlider = document.getElementById('debug-time-multiplier');
    const timeMultiplierValue = document.getElementById('time-multiplier-value');
    if (timeMultiplierSlider && timeMultiplierValue) {
        timeMultiplierSlider.value = config.timeMultiplier;
        timeMultiplierValue.textContent = config.timeMultiplier.toFixed(1) + 'x';
        timeMultiplierSlider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            timeMultiplierValue.textContent = value.toFixed(1) + 'x';
            const debugConfig = loadDebugConfig();
            debugConfig.timeMultiplier = value;
            saveDebugConfig(debugConfig);
        });
    }
    
    // Pourcentage personnalisé
    const customPercentageSlider = document.getElementById('debug-custom-percentage');
    const customPercentageValue = document.getElementById('custom-percentage-value');
    const resetPercentageBtn = document.getElementById('debug-reset-percentage');
    if (customPercentageSlider && customPercentageValue) {
        if (config.customPercentage !== null) {
            customPercentageSlider.value = config.customPercentage;
            customPercentageValue.textContent = config.customPercentage + '%';
        } else {
            customPercentageValue.textContent = 'Désactivé';
        }
        
        customPercentageSlider.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            customPercentageValue.textContent = value + '%';
            const debugConfig = loadDebugConfig();
            debugConfig.customPercentage = value;
            saveDebugConfig(debugConfig);
        });
    }
    
    if (resetPercentageBtn) {
        resetPercentageBtn.addEventListener('click', () => {
            const debugConfig = loadDebugConfig();
            debugConfig.customPercentage = null;
            saveDebugConfig(debugConfig);
            customPercentageValue.textContent = 'Désactivé';
        });
    }
    
    // Nombre de particules
    const particleCountSlider = document.getElementById('debug-particle-count');
    const particleCountValue = document.getElementById('particle-count-value');
    if (particleCountSlider && particleCountValue) {
        // Récupère le nombre actuel de particules
        const currentCount = (typeof getParticleCount === 'function') ? getParticleCount() : 25;
        particleCountSlider.value = currentCount;
        particleCountValue.textContent = currentCount;
        
        particleCountSlider.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            particleCountValue.textContent = value;
            if (typeof updateParticleCount === 'function') {
                updateParticleCount(value);
            }
        });
    }
    
    // Afficher infos particules
    const particleInfoCheckbox = document.getElementById('debug-particle-info');
    if (particleInfoCheckbox) {
        particleInfoCheckbox.checked = config.particleDebug;
        particleInfoCheckbox.addEventListener('change', (e) => {
            const debugConfig = loadDebugConfig();
            debugConfig.particleDebug = e.target.checked;
            saveDebugConfig(debugConfig);
        });
    }
    
    // Afficher overlay d'informations
    const showInfoCheckbox = document.getElementById('debug-show-info');
    if (showInfoCheckbox) {
        showInfoCheckbox.checked = config.showDebugInfo;
        showInfoCheckbox.addEventListener('change', (e) => {
            const debugConfig = loadDebugConfig();
            debugConfig.showDebugInfo = e.target.checked;
            saveDebugConfig(debugConfig);
            updateDebugOverlay();
        });
    }
    
    // Logger l'état
    const logStateBtn = document.getElementById('debug-log-state');
    if (logStateBtn) {
        logStateBtn.addEventListener('click', logDebugState);
    }
    
    // Reset complet
    const resetAllBtn = document.getElementById('debug-reset-all');
    if (resetAllBtn) {
        resetAllBtn.addEventListener('click', () => {
            if (confirm('Voulez-vous vraiment réinitialiser tous les paramètres de debug ?')) {
                localStorage.removeItem(DEBUG_STORAGE_KEY);
                location.reload();
            }
        });
    }
}

// Applique le debug de la roue
function applyWheelDebug(enabled) {
    const wheelContainer = document.getElementById('wheel-container');
    if (wheelContainer) {
        wheelContainer.style.display = enabled ? '' : 'none';
    }
    updateDebugInfo('wheel-status', enabled ? 'Activée' : 'Désactivée');
}

// Applique le debug du mode critique
function applyCriticalModeDebug(enabled) {
    console.log(`Mode critique ${enabled ? 'activé' : 'désactivé'} par le debug`);
    // La fonction checkCriticalMode dans advancedEffects.js vérifiera cette valeur
}

// Vérifie si le mode critique est activé (fonction appelée depuis advancedEffects.js)
function isCriticalModeEnabled() {
    const config = loadDebugConfig();
    // Si le debug est actif, vérifier son paramètre
    if (config.enabled) {
        // Retourne true seulement si explicitement activé
        return config.criticalModeEnabled === true;
    }
    // Si le debug n'est pas actif, retourne true (comportement normal - la config principale décide)
    return true;
}

// Met à jour l'overlay de debug
function updateDebugOverlay() {
    const overlay = document.getElementById('debug-overlay');
    const config = loadDebugConfig();
    
    if (overlay) {
        overlay.style.display = (config.enabled && config.showDebugInfo) ? 'block' : 'none';
    }
}

// Met à jour une info spécifique dans l'overlay
function updateDebugInfo(key, value) {
    const element = document.getElementById(`debug-${key}`);
    if (element) {
        element.textContent = value;
    }
}

// Logger l'état complet de l'application
function logDebugState() {
    const config = loadDebugConfig();
    const mainConfig = (typeof loadConfig === 'function') ? loadConfig() : {};
    
    console.group('🐛 État Debug Complet');
    console.log('Configuration Debug:', config);
    console.log('Configuration Principale:', mainConfig);
    console.log('Particules actives:', (typeof getParticleCount === 'function') ? getParticleCount() : 'N/A');
    console.log('Mode HYPE:', (typeof hypeModeActive !== 'undefined') ? hypeModeActive : 'N/A');
    console.log('Roue en rotation:', (typeof isSpinning !== 'undefined') ? isSpinning : 'N/A');
    
    // Info sur le temps
    if (typeof dateDebut !== 'undefined' && typeof dateCible !== 'undefined') {
        const now = new Date();
        const elapsed = now - dateDebut;
        const total = dateCible - dateDebut;
        const percentage = (elapsed / total * 100).toFixed(2);
        console.log(`Progression: ${percentage}%`);
        console.log(`Temps écoulé: ${elapsed}ms`);
        console.log(`Temps total: ${total}ms`);
    }
    
    console.groupEnd();
}

// Boucle de mise à jour des informations de debug (appelée dans la boucle principale)
let lastFrameTime = performance.now();
let frameCount = 0;
let fps = 60;

function updateDebugDisplay() {
    const config = loadDebugConfig();
    if (!config.enabled || !config.showDebugInfo) return;
    
    // Calcul FPS
    frameCount++;
    const currentTime = performance.now();
    if (currentTime - lastFrameTime >= 1000) {
        fps = frameCount;
        frameCount = 0;
        lastFrameTime = currentTime;
        updateDebugInfo('fps', fps);
    }
    
    // Mise à jour du nombre de particules
    if (typeof getParticleCount === 'function') {
        updateDebugInfo('particle-count-display', getParticleCount());
    }
    
    // Mise à jour de l'effet actif
    let activeEffect = 'Aucun';
    if (typeof hypeModeActive !== 'undefined' && hypeModeActive) {
        activeEffect = '🔥 HYPE';
    } else if (window.advancedEffects && window.advancedEffects.matrixActive) {
        activeEffect = '💚 Matrix';
    }
    updateDebugInfo('active-effect', activeEffect);

    // Mise à jour du statut Mode Critique (source + statut actif visuel)
    try {
        const mainCfgEnabled = (typeof getConfigPath === 'function') ? !!getConfigPath('effects.critical.enabled', true) : true;
        const debugActive = !!(window.debugMode && typeof window.debugMode.isActive === 'function' && window.debugMode.isActive());
        const debugCfg = loadDebugConfig();
        const effectiveToggle = debugActive ? (debugCfg.criticalModeEnabled === true) : mainCfgEnabled;
        const source = debugActive ? 'Debug' : 'Config';
        const container = document.querySelector('.container');
        const visuallyActive = !!(container && container.classList.contains('critical-mode'));
        const label = `${effectiveToggle ? 'ON' : 'OFF'} (${source})${visuallyActive ? ' [ACTIVE]' : ''}`;
        updateDebugInfo('critical-status', label);
    } catch {}
}

// Intercepte le pourcentage pour le mode Debug
function getDebugAdjustedPercentage(originalPercentage) {
    const config = loadDebugConfig();
    if (!config.enabled) return originalPercentage;
    
    // Si un pourcentage personnalisé est défini
    if (config.customPercentage !== null) {
        return config.customPercentage;
    }
    
    return originalPercentage;
}

// Intercepte le temps pour le mode Debug
function getDebugAdjustedTime() {
    const config = loadDebugConfig();
    if (!config.enabled) return new Date();
    
    // Si le temps est gelé
    if (config.freezeTime) {
        if (!window.debugFrozenTime) {
            window.debugFrozenTime = new Date();
        }
        return new Date(window.debugFrozenTime);
    }
    
    window.debugFrozenTime = null;
    
    // Si multiplicateur de temps
    if (config.timeMultiplier !== 1) {
        if (!window.debugTimeStart) {
            window.debugTimeStart = new Date();
            window.debugRealTimeStart = Date.now();
        }
        
        const realElapsed = Date.now() - window.debugRealTimeStart;
        const adjustedElapsed = realElapsed * config.timeMultiplier;
        return new Date(window.debugTimeStart.getTime() + adjustedElapsed);
    }
    
    window.debugTimeStart = null;
    window.debugRealTimeStart = null;
    
    return new Date();
}

// Intercepte les effets pour le mode Debug
function applyDebugEffectOverride() {
    const config = loadDebugConfig();
    if (!config.enabled || !config.forcedEffect) return false;
    
    switch (config.forcedEffect) {
        case 'hype':
            if (typeof startHypeMode === 'function' && (typeof hypeModeActive === 'undefined' || !hypeModeActive)) {
                startHypeMode();
            }
            return true;
        case 'matrix':
            if (typeof triggerMatrixTransition === 'function') {
                triggerMatrixTransition(25000);
            } else if (window.advancedEffects && typeof window.advancedEffects.triggerMatrixTransition === 'function') {
                window.advancedEffects.triggerMatrixTransition(25000);
            }
            return true;
        case 'none':
            // Désactive tous les effets
            if (typeof stopHypeMode === 'function') {
                stopHypeMode();
            }
            if (window.advancedEffects && typeof window.advancedEffects.stopMatrixTransition === 'function') {
                window.advancedEffects.stopMatrixTransition();
            }
            return true;
    }
    
    return false;
}

// Crée le bouton pour ouvrir le panneau Debug
function createDebugButton() {
    const existingBtn = document.getElementById('debug-btn');
    if (existingBtn) return;
    
    const btn = document.createElement('button');
    btn.id = 'debug-btn';
    btn.className = 'debug-button';
    btn.title = 'Mode Debug';
    btn.textContent = '🐛';
    
    btn.addEventListener('click', toggleDebugMode);
    
    document.body.appendChild(btn);
}

// Initialisation du mode Debug
function initDebugMode() {
    createDebugButton();
    createDebugPanel();
    createDebugOverlay();
    
    const config = loadDebugConfig();
    debugModeActive = config.enabled;
    
    // Applique la config initiale
    if (config.wheelEnabled === false) {
        applyWheelDebug(false);
    }
    
    console.log('🐛 Mode Debug initialisé');
}

// Raccourci clavier pour activer/désactiver le debug (Ctrl+Shift+D)
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        toggleDebugMode();
    }
});

// Export des fonctions pour usage externe
window.debugMode = {
    toggle: toggleDebugMode,
    isActive: () => debugModeActive,
    getConfig: loadDebugConfig,
    updateDisplay: updateDebugDisplay,
    getAdjustedPercentage: getDebugAdjustedPercentage,
    getAdjustedTime: getDebugAdjustedTime,
    applyEffectOverride: applyDebugEffectOverride,
    isCriticalModeEnabled: isCriticalModeEnabled
};
