// ============================================
// Configuration Panel - Gestion des dates & Effets
// ============================================

const CONFIG_STORAGE_KEY = 'countdown-config';

// Configuration par défaut (dates + effets)
const DEFAULT_CONFIG = {
    dateDebut: '2025-10-07T10:30:00',
    dateCible: '2025-10-10T13:30:00',
    effects: {
        fallingParticles: {
            enabled: true,
            baseCount: 25, // nombre de particules de base (emojis qui tombent)
        },
        magneticParticles: {
            enabled: true,
            maxParticles: 200, // limite max à l'écran
            spawnIntervalMs: 50, // délai entre spawns au mouvement (ms)
            attractionRadius: 150 // rayon d'attraction (px)
        },
        matrix: {
            enabled: true,
            durationMs: 25000 // durée par défaut (25s)
        },
        critical: {
            enabled: true,
            thresholdPercent: 10 // seuil d'activation du mode critique (% restant)
        },
        hype: {
            enabled: true,
            particlesDuringHype: 250 // nombre de particules durant le Hype Mode (si activé)
        },
        wheel: {
            resultDisplayMs: 2000 // durée d'affichage du message de résultat
        }
    }
};

// Charge la configuration depuis localStorage ou utilise les valeurs par défaut
function loadConfig() {
    const saved = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            console.error('Erreur lors du chargement de la configuration:', e);
            return DEFAULT_CONFIG;
        }
    }
    return DEFAULT_CONFIG;
}

// Sauvegarde la configuration dans localStorage
function saveConfig(config) {
    try {
        localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
        return true;
    } catch (e) {
        console.error('Erreur lors de la sauvegarde de la configuration:', e);
        return false;
    }
}

// Formate une date pour l'input datetime-local
function formatDateForInput(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// Calcule et formate la durée entre deux dates
function formatDuration(ms) {
    if (ms < 0) return 'Terminé';
    
    const jours = Math.floor(ms / (1000 * 60 * 60 * 24));
    const heures = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    
    const parts = [];
    if (jours > 0) parts.push(`${jours}j`);
    if (heures > 0) parts.push(`${heures}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    
    return parts.length > 0 ? parts.join(' ') : 'Moins d\'une minute';
}

// Met à jour l'aperçu dans le panneau
function updatePreview() {
    const dateDebutInput = document.getElementById('date-debut');
    const dateCibleInput = document.getElementById('date-cible');
    const durationPreview = document.getElementById('duration-preview');
    const remainingPreview = document.getElementById('remaining-preview');
    
    if (!dateDebutInput || !dateCibleInput) return;
    
    const debut = new Date(dateDebutInput.value);
    const cible = new Date(dateCibleInput.value);
    const maintenant = new Date();
    
    const totalDuration = cible - debut;
    const remaining = cible - maintenant;
    
    durationPreview.textContent = formatDuration(totalDuration);
    remainingPreview.textContent = formatDuration(remaining);
    
    // Change la couleur si la date est dépassée
    if (remaining < 0) {
        remainingPreview.style.color = '#ff5e5e';
        remainingPreview.textContent = '⚠️ Deadline dépassée !';
    } else {
        remainingPreview.style.color = '#00ffaa';
    }
}

// Initialise le panneau de configuration
function initConfigPanel() {
    const configBtn = document.getElementById('config-btn');
    const configPanel = document.getElementById('config-panel');
    const closeBtn = document.getElementById('close-config-btn');
    const unsavedBar = document.getElementById('unsaved-bar');
    const unsavedSaveBtn = document.getElementById('unsaved-save');
    const unsavedResetBtn = document.getElementById('unsaved-reset');
    const dateDebutInput = document.getElementById('date-debut');
    const dateCibleInput = document.getElementById('date-cible');
    
    console.log('Init config panel - Elements found:', {
        configBtn: !!configBtn,
        configPanel: !!configPanel,
        closeBtn: !!closeBtn,
        unsavedBar: !!unsavedBar,
        unsavedSaveBtn: !!unsavedSaveBtn,
        unsavedResetBtn: !!unsavedResetBtn
    });
    
    if (!configBtn || !configPanel) return;
    
    // État de la configuration
    let savedConfig = null;
    let hasUnsavedChanges = false;
    
    // Charge la configuration actuelle
    const currentConfig = loadConfig();
    savedConfig = JSON.parse(JSON.stringify(currentConfig)); // Clone profond
    dateDebutInput.value = formatDateForInput(currentConfig.dateDebut);
    dateCibleInput.value = formatDateForInput(currentConfig.dateCible);

    // Effets -> hydrate UI
    const $ = (id) => {
        const el = document.getElementById(id);
        if (!el) console.warn('Element not found:', id);
        return el;
    };
    
    if (currentConfig.effects) {
        const falling = $('cfg-falling-enabled');
        const fallingCount = $('cfg-falling-count');
        if (falling) falling.checked = currentConfig.effects.fallingParticles?.enabled ?? true;
        if (fallingCount) fallingCount.value = currentConfig.effects.fallingParticles?.baseCount ?? 25;

        const magnetic = $('cfg-magnetic-enabled');
        const magneticMax = $('cfg-magnetic-max');
        const magneticSpawn = $('cfg-magnetic-spawn');
        const magneticRadius = $('cfg-magnetic-radius');
        if (magnetic) magnetic.checked = currentConfig.effects.magneticParticles?.enabled ?? true;
        if (magneticMax) magneticMax.value = currentConfig.effects.magneticParticles?.maxParticles ?? 200;
        if (magneticSpawn) magneticSpawn.value = (currentConfig.effects.magneticParticles?.spawnIntervalMs ?? 50) / 1000;
        if (magneticRadius) magneticRadius.value = currentConfig.effects.magneticParticles?.attractionRadius ?? 150;

        const matrix = $('cfg-matrix-enabled');
        const matrixDuration = $('cfg-matrix-duration');
        if (matrix) matrix.checked = currentConfig.effects.matrix?.enabled ?? true;
        if (matrixDuration) matrixDuration.value = (currentConfig.effects.matrix?.durationMs ?? 25000) / 1000;

        const critical = $('cfg-critical-enabled');
        const criticalThreshold = $('cfg-critical-threshold');
        if (critical) critical.checked = currentConfig.effects.critical?.enabled ?? true;
        if (criticalThreshold) criticalThreshold.value = currentConfig.effects.critical?.thresholdPercent ?? 10;

        const hype = $('cfg-hype-enabled');
        const hypeParticles = $('cfg-hype-particles');
        if (hype) hype.checked = currentConfig.effects.hype?.enabled ?? true;
        if (hypeParticles) hypeParticles.value = currentConfig.effects.hype?.particlesDuringHype ?? 250;

        const wheelResult = $('cfg-wheel-result');
        if (wheelResult) wheelResult.value = (currentConfig.effects.wheel?.resultDisplayMs ?? 2000) / 1000;
    } else {
        console.warn('No effects configuration found, using defaults');
    }

    updatePreview();
    
    // Fonction pour récupérer la config actuelle depuis les inputs
    function getCurrentFormConfig() {
        const $ = (id) => document.getElementById(id);
        
        return {
            dateDebut: dateDebutInput.value,
            dateCible: dateCibleInput.value,
            effects: {
                fallingParticles: {
                    enabled: $('cfg-falling-enabled')?.checked ?? true,
                    baseCount: parseInt($('cfg-falling-count')?.value, 10) || 25,
                },
                magneticParticles: {
                    enabled: $('cfg-magnetic-enabled')?.checked ?? true,
                    maxParticles: parseInt($('cfg-magnetic-max')?.value, 10) || 200,
                    spawnIntervalMs: parseFloat($('cfg-magnetic-spawn')?.value) * 1000 || 50,
                    attractionRadius: parseInt($('cfg-magnetic-radius')?.value, 10) || 150,
                },
                matrix: {
                    enabled: $('cfg-matrix-enabled')?.checked ?? true,
                    durationMs: parseFloat($('cfg-matrix-duration')?.value) * 1000 || 25000,
                },
                critical: {
                    enabled: $('cfg-critical-enabled')?.checked ?? true,
                    thresholdPercent: parseInt($('cfg-critical-threshold')?.value, 10) || 10,
                },
                hype: {
                    enabled: $('cfg-hype-enabled')?.checked ?? true,
                    particlesDuringHype: parseInt($('cfg-hype-particles')?.value, 10) || 250,
                },
                wheel: {
                    resultDisplayMs: parseFloat($('cfg-wheel-result')?.value) * 1000 || 2000,
                }
            }
        };
    }
    
    // Fonction pour vérifier si la config a changé
    function checkForChanges() {
        const currentFormConfig = getCurrentFormConfig();
        const changed = JSON.stringify(currentFormConfig) !== JSON.stringify(savedConfig);
        
        console.log('Checking for changes:', changed);
        
        if (changed && !hasUnsavedChanges) {
            hasUnsavedChanges = true;
            console.log('Showing unsaved bar');
            unsavedBar?.classList.add('visible');
        } else if (!changed && hasUnsavedChanges) {
            hasUnsavedChanges = false;
            console.log('Hiding unsaved bar');
            unsavedBar?.classList.remove('visible');
        }
    }
    
    // Fonction pour sauvegarder la config
    function saveConfiguration() {
        const newConfig = getCurrentFormConfig();
        
        // Validation
        const debut = new Date(newConfig.dateDebut);
        const cible = new Date(newConfig.dateCible);
        
        if (cible <= debut) {
            alert('⚠️ La date cible doit être postérieure à la date de début !');
            return false;
        }
        
        // Sauvegarde
        if (saveConfig(newConfig)) {
            savedConfig = JSON.parse(JSON.stringify(newConfig));
            hasUnsavedChanges = false;
            unsavedBar?.classList.remove('visible');
            
            // Effet visuel de confirmation
            const btn = unsavedSaveBtn;
            if (btn) {
                const originalText = btn.textContent;
                const originalBg = btn.style.background;
                btn.textContent = '✅ Sauvegardé !';
                btn.style.background = 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)';
                
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = originalBg;
                }, 2000);
            }
            
            // Recharge la page pour appliquer les nouvelles dates
            setTimeout(() => {
                location.reload();
            }, 1000);
            
            return true;
        } else {
            alert('❌ Erreur lors de la sauvegarde. Veuillez réessayer.');
            return false;
        }
    }
    
    // Fonction pour réinitialiser aux valeurs sauvegardées
    function resetToSaved() {
        dateDebutInput.value = formatDateForInput(savedConfig.dateDebut);
        dateCibleInput.value = formatDateForInput(savedConfig.dateCible);

        const $ = (id) => document.getElementById(id);
        
        if ($('cfg-falling-enabled')) $('cfg-falling-enabled').checked = savedConfig.effects.fallingParticles.enabled;
        if ($('cfg-falling-count')) $('cfg-falling-count').value = savedConfig.effects.fallingParticles.baseCount;

        if ($('cfg-magnetic-enabled')) $('cfg-magnetic-enabled').checked = savedConfig.effects.magneticParticles.enabled;
        if ($('cfg-magnetic-max')) $('cfg-magnetic-max').value = savedConfig.effects.magneticParticles.maxParticles;
        if ($('cfg-magnetic-spawn')) $('cfg-magnetic-spawn').value = savedConfig.effects.magneticParticles.spawnIntervalMs / 1000;
        if ($('cfg-magnetic-radius')) $('cfg-magnetic-radius').value = savedConfig.effects.magneticParticles.attractionRadius;

        if ($('cfg-matrix-enabled')) $('cfg-matrix-enabled').checked = savedConfig.effects.matrix.enabled;
        if ($('cfg-matrix-duration')) $('cfg-matrix-duration').value = savedConfig.effects.matrix.durationMs / 1000;

        if ($('cfg-critical-enabled')) $('cfg-critical-enabled').checked = savedConfig.effects.critical.enabled;
        if ($('cfg-critical-threshold')) $('cfg-critical-threshold').value = savedConfig.effects.critical.thresholdPercent;

        if ($('cfg-hype-enabled')) $('cfg-hype-enabled').checked = savedConfig.effects.hype.enabled;
        if ($('cfg-hype-particles')) $('cfg-hype-particles').value = savedConfig.effects.hype.particlesDuringHype;

        if ($('cfg-wheel-result')) $('cfg-wheel-result').value = savedConfig.effects.wheel.resultDisplayMs / 1000;

        hasUnsavedChanges = false;
        unsavedBar?.classList.remove('visible');
        updatePreview();
    }
    
    // Ajoute des listeners sur tous les inputs pour détecter les changements
    const allInputs = configPanel.querySelectorAll('input, select, textarea');
    allInputs.forEach(input => {
        input.addEventListener('input', checkForChanges);
        input.addEventListener('change', checkForChanges);
    });
    
    // Boutons de la barre de sauvegarde
    unsavedSaveBtn?.addEventListener('click', saveConfiguration);
    unsavedResetBtn?.addEventListener('click', resetToSaved);
    
    // Ouvre le panneau
    configBtn.addEventListener('click', () => {
        configPanel.classList.add('visible');
        updatePreview();
        // Réinitialise l'état des changements quand on ouvre
        checkForChanges();
    });
    
    // Fonction pour fermer le panneau avec vérification
    function closePanel() {
        if (hasUnsavedChanges) {
            // Clignote en rouge pour alerter
            unsavedBar?.classList.add('warning');
            setTimeout(() => {
                unsavedBar?.classList.remove('warning');
            }, 1800); // 3 clignotements × 0.6s
            return false;
        }
        configPanel.classList.remove('visible');
        return true;
    }
    
    // Bouton de fermeture
    closeBtn?.addEventListener('click', closePanel);
    
    // Ferme le panneau en cliquant en dehors
    configPanel.addEventListener('click', (e) => {
        if (e.target === configPanel) {
            closePanel();
        }
    });
    
    // Raccourci clavier ESC pour fermer
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && configPanel.classList.contains('visible')) {
            closePanel();
        }
    });
    
    // Met à jour l'aperçu quand les dates changent
    dateDebutInput.addEventListener('change', updatePreview);
    dateCibleInput.addEventListener('change', updatePreview);
    dateDebutInput.addEventListener('input', updatePreview);
    dateCibleInput.addEventListener('input', updatePreview);
}


// Helpers pour lire/mettre à jour des chemins spécifiques
function getConfigPath(path, fallback) {
    const cfg = loadConfig();
    try {
        return path.split('.').reduce((acc, key) => acc?.[key], cfg) ?? fallback;
    } catch {
        return fallback;
    }
}

function updateConfigPath(path, value) {
    const cfg = loadConfig();
    const keys = path.split('.');
    let obj = cfg;
    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (typeof obj[key] !== 'object' || obj[key] === null) obj[key] = {};
        obj = obj[key];
    }
    obj[keys[keys.length - 1]] = value;
    saveConfig(cfg);
    return cfg;
}

// Exporte les fonctions pour main.js et autres
window.loadConfig = loadConfig;
window.saveConfig = saveConfig;
window.getConfigPath = getConfigPath;
window.updateConfigPath = updateConfigPath;

// Initialise au chargement du DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initConfigPanel);
} else {
    initConfigPanel();
}
