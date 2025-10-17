// ============================================
// Configuration Panel - Gestion des dates
// ============================================

const CONFIG_STORAGE_KEY = 'countdown-config';

// Dates par défaut
const DEFAULT_CONFIG = {
    dateDebut: '2025-10-07T10:30:00',
    dateCible: '2025-10-10T13:30:00'
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
    const saveBtn = document.getElementById('save-config-btn');
    const resetBtn = document.getElementById('reset-config-btn');
    const dateDebutInput = document.getElementById('date-debut');
    const dateCibleInput = document.getElementById('date-cible');
    
    if (!configBtn || !configPanel) return;
    
    // Charge la configuration actuelle
    const currentConfig = loadConfig();
    dateDebutInput.value = formatDateForInput(currentConfig.dateDebut);
    dateCibleInput.value = formatDateForInput(currentConfig.dateCible);
    updatePreview();
    
    // Ouvre le panneau
    configBtn.addEventListener('click', () => {
        configPanel.classList.add('visible');
        updatePreview();
    });
    
    // Ferme le panneau
    closeBtn.addEventListener('click', () => {
        configPanel.classList.remove('visible');
    });
    
    // Ferme le panneau en cliquant en dehors
    configPanel.addEventListener('click', (e) => {
        if (e.target === configPanel) {
            configPanel.classList.remove('visible');
        }
    });
    
    // Sauvegarde les modifications
    saveBtn.addEventListener('click', () => {
        const newConfig = {
            dateDebut: dateDebutInput.value,
            dateCible: dateCibleInput.value
        };
        
        // Validation
        const debut = new Date(newConfig.dateDebut);
        const cible = new Date(newConfig.dateCible);
        
        if (cible <= debut) {
            alert('⚠️ La date cible doit être postérieure à la date de début !');
            return;
        }
        
        // Sauvegarde
        if (saveConfig(newConfig)) {
            // Effet visuel de confirmation
            saveBtn.textContent = '✅ Sauvegardé !';
            saveBtn.style.backgroundColor = '#00ff88';
            
            setTimeout(() => {
                saveBtn.textContent = '💾 Sauvegarder';
                saveBtn.style.backgroundColor = '';
            }, 2000);
            
            // Recharge la page pour appliquer les nouvelles dates
            setTimeout(() => {
                location.reload();
            }, 1000);
        } else {
            alert('❌ Erreur lors de la sauvegarde. Veuillez réessayer.');
        }
    });
    
    // Réinitialise aux valeurs par défaut
    resetBtn.addEventListener('click', () => {
        if (confirm('🔄 Êtes-vous sûr de vouloir réinitialiser aux valeurs par défaut ?')) {
            dateDebutInput.value = formatDateForInput(DEFAULT_CONFIG.dateDebut);
            dateCibleInput.value = formatDateForInput(DEFAULT_CONFIG.dateCible);
            updatePreview();
        }
    });
    
    // Met à jour l'aperçu quand les dates changent
    dateDebutInput.addEventListener('change', updatePreview);
    dateCibleInput.addEventListener('change', updatePreview);
    dateDebutInput.addEventListener('input', updatePreview);
    dateCibleInput.addEventListener('input', updatePreview);
    
    // Raccourci clavier ESC pour fermer
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && configPanel.classList.contains('visible')) {
            configPanel.classList.remove('visible');
        }
    });
}

// Exporte les fonctions pour main.js
window.loadConfig = loadConfig;
window.saveConfig = saveConfig;

// Initialise au chargement du DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initConfigPanel);
} else {
    initConfigPanel();
}
