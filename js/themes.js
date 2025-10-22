// ============================================
// Theme System - Gestion des thèmes
// ============================================

const THEMES_STORAGE_KEY = 'countdown-themes';
const ACTIVE_THEME_KEY = 'countdown-active-theme';

// Thèmes prédéfinis
const PREDEFINED_THEMES = {
    default: {
        name: 'Default',
        editable: false,
        colors: {
            // Background
            bodyBg: '#121212',
            bodyBgGradient1: 'rgba(255, 255, 255, 0.05)',
            bodyBgGradient2: 'transparent',
            
            // Container
            containerBg: 'rgba(30, 30, 30, 0.9)',
            containerBorder: 'rgba(255, 255, 255, 0.1)',
            
            // Text
            textPrimary: '#e0e0e0',
            textSecondary: '#ffffff',
            titleColor: '#c91616',
            titleShadow: '#c91616',
            
            // Progress bars
            progressBg: '#333',
            mainProgressStart: '#ff4d4d',
            mainProgressEnd: '#9400d3',
            
            // Specific bars
            barDaysStart: '#5ee6a8',
            barDaysEnd: '#9bffd9',
            barHoursStart: '#47a1ff',
            barHoursEnd: '#81c7ff',
            barMinutesStart: '#ffb347',
            barMinutesEnd: '#ffcf81',
            barSecondsStart: '#ff5e5e',
            barSecondsEnd: '#ff9b9b',
            barMillisecondsStart: '#d85bff',
            barMillisecondsEnd: '#ff9bfb',
            
            // Accents
            accentPrimary: '#00ffaa',
            accentSecondary: '#00aaff',
            
            // Config panel
            configPanelBg: 'rgba(20, 20, 20, 0.98)',
            configInputBg: 'rgba(40, 40, 40, 0.9)',
            configInputBorder: 'rgba(255, 255, 255, 0.2)',
            configButtonBg: '#c91616',
            configButtonHover: '#a01212',
        }
    },
    
    cyberpunk: {
        name: 'Cyberpunk',
        editable: false,
        colors: {
            // Background - Style néon cyberpunk avec grille
            bodyBg: '#0a0e27',
            bodyBgGradient1: 'rgba(255, 0, 255, 0.1)',
            bodyBgGradient2: 'rgba(0, 255, 255, 0.05)',
            
            // Container - Bordure néon cyan
            containerBg: 'rgba(10, 14, 39, 0.95)',
            containerBorder: 'rgba(0, 255, 255, 0.6)',
            
            // Text - Cyan électrique
            textPrimary: '#00ffff',
            textSecondary: '#ff00ff',
            titleColor: '#ff00ff',
            titleShadow: '#ff00ff',
            
            // Progress bars - Dégradés néon
            progressBg: 'rgba(20, 20, 60, 0.8)',
            mainProgressStart: '#ff00ff',
            mainProgressEnd: '#00ffff',
            
            // Specific bars - Palette cyberpunk
            barDaysStart: '#ff00ff',
            barDaysEnd: '#ff66ff',
            barHoursStart: '#00ffff',
            barHoursEnd: '#66ffff',
            barMinutesStart: '#ffff00',
            barMinutesEnd: '#ffff66',
            barSecondsStart: '#ff0066',
            barSecondsEnd: '#ff66b3',
            barMillisecondsStart: '#00ff66',
            barMillisecondsEnd: '#66ffb3',
            
            // Accents - Néon cyan et magenta
            accentPrimary: '#00ffff',
            accentSecondary: '#ff00ff',
            
            // Config panel - Style futuriste
            configPanelBg: 'rgba(10, 14, 39, 0.98)',
            configInputBg: 'rgba(20, 20, 60, 0.9)',
            configInputBorder: 'rgba(0, 255, 255, 0.4)',
            configButtonBg: '#ff00ff',
            configButtonHover: '#cc00cc',
        }
    }
};

// Récupère tous les thèmes (prédéfinis + personnalisés)
function getAllThemes() {
    const customThemes = getCustomThemes();
    return { ...PREDEFINED_THEMES, ...customThemes };
}

// Récupère uniquement les thèmes personnalisés
function getCustomThemes() {
    const saved = localStorage.getItem(THEMES_STORAGE_KEY);
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            console.error('Erreur lors du chargement des thèmes personnalisés:', e);
            return {};
        }
    }
    return {};
}

// Sauvegarde les thèmes personnalisés
function saveCustomThemes(themes) {
    try {
        localStorage.setItem(THEMES_STORAGE_KEY, JSON.stringify(themes));
        return true;
    } catch (e) {
        console.error('Erreur lors de la sauvegarde des thèmes:', e);
        return false;
    }
}

// Récupère le thème actif
function getActiveTheme() {
    const saved = localStorage.getItem(ACTIVE_THEME_KEY);
    return saved || 'default';
}

// Définit le thème actif
function setActiveTheme(themeId) {
    localStorage.setItem(ACTIVE_THEME_KEY, themeId);
}

// Applique un thème
function applyTheme(themeId) {
    const themes = getAllThemes();
    const theme = themes[themeId];
    
    if (!theme) {
        console.error(`Thème "${themeId}" introuvable`);
        return false;
    }
    
    // Applique les variables CSS
    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([key, value]) => {
        root.style.setProperty(`--${toKebabCase(key)}`, value);
    });
    
    // Sauvegarde le thème actif
    setActiveTheme(themeId);
    
    // Ajoute des effets spéciaux pour le thème Cyberpunk
    if (themeId === 'cyberpunk') {
        applyCyberpunkEffects();
    } else {
        removeCyberpunkEffects();
    }
    
    console.log(`✅ Thème "${theme.name}" appliqué`);
    return true;
}

// Convertit camelCase en kebab-case
function toKebabCase(str) {
    return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

// Crée un nouveau thème personnalisé
function createCustomTheme(name, baseThemeId = 'default') {
    const themes = getAllThemes();
    const baseTheme = themes[baseThemeId];
    
    if (!baseTheme) {
        console.error(`Thème de base "${baseThemeId}" introuvable`);
        return null;
    }
    
    // Génère un ID unique
    const themeId = 'custom_' + Date.now();
    
    // Crée le nouveau thème en copiant le thème de base
    const newTheme = {
        name: name,
        editable: true,
        colors: { ...baseTheme.colors }
    };
    
    // Sauvegarde
    const customThemes = getCustomThemes();
    customThemes[themeId] = newTheme;
    
    if (saveCustomThemes(customThemes)) {
        console.log(`✅ Thème personnalisé "${name}" créé`);
        return themeId;
    }
    
    return null;
}

// Met à jour un thème personnalisé
function updateCustomTheme(themeId, updates) {
    const customThemes = getCustomThemes();
    const theme = customThemes[themeId];
    
    if (!theme) {
        console.error(`Thème "${themeId}" introuvable ou non modifiable`);
        return false;
    }
    
    if (!theme.editable) {
        console.error(`Le thème "${theme.name}" n'est pas modifiable`);
        return false;
    }
    
    // Applique les modifications
    if (updates.name) theme.name = updates.name;
    if (updates.colors) {
        theme.colors = { ...theme.colors, ...updates.colors };
    }
    
    return saveCustomThemes(customThemes);
}

// Supprime un thème personnalisé
function deleteCustomTheme(themeId) {
    const customThemes = getCustomThemes();
    const theme = customThemes[themeId];
    
    if (!theme) {
        console.error(`Thème "${themeId}" introuvable`);
        return false;
    }
    
    if (!theme.editable) {
        console.error(`Le thème "${theme.name}" ne peut pas être supprimé`);
        return false;
    }
    
    delete customThemes[themeId];
    
    // Si c'était le thème actif, revenir au thème par défaut
    if (getActiveTheme() === themeId) {
        applyTheme('default');
    }
    
    return saveCustomThemes(customThemes);
}

// Exporte un thème en JSON
function exportTheme(themeId) {
    const themes = getAllThemes();
    const theme = themes[themeId];
    
    if (!theme) {
        console.error(`Thème "${themeId}" introuvable`);
        return null;
    }
    
    return JSON.stringify({ [themeId]: theme }, null, 2);
}

// Importe un thème depuis JSON
function importTheme(jsonString) {
    try {
        const imported = JSON.parse(jsonString);
        const themeId = Object.keys(imported)[0];
        const theme = imported[themeId];
        
        // Génère un nouvel ID pour éviter les conflits
        const newThemeId = 'custom_' + Date.now();
        theme.editable = true;
        
        const customThemes = getCustomThemes();
        customThemes[newThemeId] = theme;
        
        if (saveCustomThemes(customThemes)) {
            console.log(`✅ Thème "${theme.name}" importé`);
            return newThemeId;
        }
        
        return null;
    } catch (e) {
        console.error('Erreur lors de l\'importation du thème:', e);
        return null;
    }
}

// Effets spéciaux pour le thème Cyberpunk
function applyCyberpunkEffects() {
    // Ajoute une classe pour les effets CSS spéciaux
    document.body.classList.add('theme-cyberpunk');
    
    // Effet de scanline
    if (!document.getElementById('cyberpunk-scanline')) {
        const scanline = document.createElement('div');
        scanline.id = 'cyberpunk-scanline';
        scanline.className = 'cyberpunk-scanline';
        document.body.appendChild(scanline);
    }
    
    // Effet de glitch sur le titre (occasionnel)
    const title = document.querySelector('h1');
    if (title) {
        setInterval(() => {
            if (Math.random() < 0.05) { // 5% de chance
                title.classList.add('glitch');
                setTimeout(() => title.classList.remove('glitch'), 200);
            }
        }, 2000);
    }
}

function removeCyberpunkEffects() {
    document.body.classList.remove('theme-cyberpunk');
    
    const scanline = document.getElementById('cyberpunk-scanline');
    if (scanline) {
        scanline.remove();
    }
}

// Initialisation du système de thèmes
function initThemeSystem() {
    // Charge et applique le thème actif
    const activeTheme = getActiveTheme();
    applyTheme(activeTheme);
    
    // Initialise l'interface de sélection de thème
    initThemeUI();
    
    console.log('✅ Système de thèmes initialisé');
}

// Initialise l'interface utilisateur pour les thèmes
function initThemeUI() {
    const themeSelect = document.getElementById('theme-select');
    const createThemeBtn = document.getElementById('create-theme-btn');
    const editThemeBtn = document.getElementById('edit-theme-btn');
    const deleteThemeBtn = document.getElementById('delete-theme-btn');
    const exportThemeBtn = document.getElementById('export-theme-btn');
    const importThemeBtn = document.getElementById('import-theme-btn');
    const importThemeFile = document.getElementById('import-theme-file');
    
    if (!themeSelect) return;
    
    // Remplit le sélecteur de thèmes
    function populateThemeSelector() {
        const themes = getAllThemes();
        const activeTheme = getActiveTheme();
        
        themeSelect.innerHTML = '';
        
        Object.entries(themes).forEach(([id, theme]) => {
            const option = document.createElement('option');
            option.value = id;
            option.textContent = theme.name + (theme.editable ? ' ⚙️' : '');
            if (id === activeTheme) option.selected = true;
            themeSelect.appendChild(option);
        });
        
        updateThemeButtons();
    }
    
    // Met à jour les boutons selon le thème sélectionné
    function updateThemeButtons() {
        const selectedThemeId = themeSelect.value;
        const themes = getAllThemes();
        const theme = themes[selectedThemeId];
        
        if (editThemeBtn) editThemeBtn.disabled = !theme?.editable;
        if (deleteThemeBtn) deleteThemeBtn.disabled = !theme?.editable;
    }
    
    // Change de thème
    themeSelect.addEventListener('change', () => {
        applyTheme(themeSelect.value);
        updateThemeButtons();
    });
    
    // Crée un nouveau thème
    if (createThemeBtn) {
        createThemeBtn.addEventListener('click', () => {
            const name = prompt('Nom du nouveau thème :');
            if (name && name.trim()) {
                const baseTheme = themeSelect.value;
                const newThemeId = createCustomTheme(name.trim(), baseTheme);
                if (newThemeId) {
                    populateThemeSelector();
                    themeSelect.value = newThemeId;
                    applyTheme(newThemeId);
                    alert(`✅ Thème "${name}" créé avec succès !`);
                }
            }
        });
    }
    
    // Édite un thème
    if (editThemeBtn) {
        editThemeBtn.addEventListener('click', () => {
            const themeId = themeSelect.value;
            openThemeEditor(themeId);
        });
    }
    
    // Supprime un thème
    if (deleteThemeBtn) {
        deleteThemeBtn.addEventListener('click', () => {
            const themeId = themeSelect.value;
            const themes = getAllThemes();
            const theme = themes[themeId];
            
            if (confirm(`Êtes-vous sûr de vouloir supprimer le thème "${theme.name}" ?`)) {
                if (deleteCustomTheme(themeId)) {
                    populateThemeSelector();
                    alert(`✅ Thème supprimé`);
                }
            }
        });
    }
    
    // Exporte un thème
    if (exportThemeBtn) {
        exportThemeBtn.addEventListener('click', () => {
            const themeId = themeSelect.value;
            const themes = getAllThemes();
            const theme = themes[themeId];
            const json = exportTheme(themeId);
            
            if (json) {
                const blob = new Blob([json], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `theme_${theme.name.replace(/\s+/g, '_')}.json`;
                a.click();
                URL.revokeObjectURL(url);
            }
        });
    }
    
    // Importe un thème
    if (importThemeBtn && importThemeFile) {
        importThemeBtn.addEventListener('click', () => {
            importThemeFile.click();
        });
        
        importThemeFile.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const newThemeId = importTheme(event.target.result);
                    if (newThemeId) {
                        populateThemeSelector();
                        themeSelect.value = newThemeId;
                        applyTheme(newThemeId);
                        alert('✅ Thème importé avec succès !');
                    } else {
                        alert('❌ Erreur lors de l\'importation du thème');
                    }
                };
                reader.readAsText(file);
                importThemeFile.value = ''; // Reset l'input
            }
        });
    }
    
    // Initialise le sélecteur
    populateThemeSelector();
}

// Ouvre l'éditeur de thème
function openThemeEditor(themeId) {
    const themes = getAllThemes();
    const theme = themes[themeId];
    
    if (!theme || !theme.editable) {
        alert('Ce thème ne peut pas être édité');
        return;
    }
    
    // Ouvre un modal avec des inputs de couleur
    const editorModal = document.getElementById('theme-editor-modal');
    if (!editorModal) return;
    
    const colorGrid = editorModal.querySelector('.theme-color-grid');
    colorGrid.innerHTML = '';
    
    // Crée les inputs pour chaque couleur
    Object.entries(theme.colors).forEach(([key, value]) => {
        const div = document.createElement('div');
        div.className = 'theme-color-item';
        
        const label = document.createElement('label');
        label.textContent = formatColorName(key);
        label.setAttribute('for', `color-${key}`);
        
        const input = document.createElement('input');
        input.type = 'color';
        input.id = `color-${key}`;
        input.value = rgbaToHex(value);
        input.dataset.key = key;
        
        // Prévisualisation en temps réel
        input.addEventListener('input', () => {
            document.documentElement.style.setProperty(`--${toKebabCase(key)}`, input.value);
        });
        
        div.appendChild(label);
        div.appendChild(input);
        colorGrid.appendChild(div);
    });
    
    // Affiche le modal
    editorModal.style.display = 'flex';
    editorModal.dataset.themeId = themeId;
    
    // Gestionnaires d'événements pour les boutons du modal
    setupThemeEditorHandlers(themeId, theme);
}

// Configure les gestionnaires d'événements du modal d'édition
function setupThemeEditorHandlers(themeId, originalTheme) {
    const editorModal = document.getElementById('theme-editor-modal');
    const closeBtn = document.getElementById('close-theme-editor');
    const cancelBtn = document.getElementById('cancel-theme-edit');
    const saveBtn = document.getElementById('save-theme-edit');
    
    // Fonction pour fermer le modal
    const closeModal = () => {
        editorModal.style.display = 'none';
        // Réapplique le thème original pour annuler les changements
        applyTheme(themeId);
    };
    
    // Fonction pour sauvegarder les changements
    const saveChanges = () => {
        const colorGrid = editorModal.querySelector('.theme-color-grid');
        const inputs = colorGrid.querySelectorAll('input[type="color"]');
        
        const newColors = {};
        inputs.forEach(input => {
            const key = input.dataset.key;
            newColors[key] = input.value;
        });
        
        if (updateCustomTheme(themeId, { colors: newColors })) {
            alert('✅ Thème mis à jour avec succès !');
            applyTheme(themeId);
            editorModal.style.display = 'none';
        } else {
            alert('❌ Erreur lors de la mise à jour du thème');
        }
    };
    
    // Supprime les anciens événements
    const newCloseBtn = closeBtn.cloneNode(true);
    const newCancelBtn = cancelBtn.cloneNode(true);
    const newSaveBtn = saveBtn.cloneNode(true);
    
    closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
    cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
    saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);
    
    // Ajoute les nouveaux événements
    newCloseBtn.addEventListener('click', closeModal);
    newCancelBtn.addEventListener('click', closeModal);
    newSaveBtn.addEventListener('click', saveChanges);
    
    // Ferme le modal si on clique en dehors
    editorModal.addEventListener('click', (e) => {
        if (e.target === editorModal) {
            closeModal();
        }
    });
}

// Formate le nom d'une couleur pour l'affichage
function formatColorName(key) {
    return key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .trim();
}

// Convertit rgba en hex (simplifié, prend seulement les valeurs RGB)
function rgbaToHex(color) {
    // Si c'est déjà un hex, le retourner
    if (color.startsWith('#')) return color;
    
    // Extraire RGB de rgba
    const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (match) {
        const r = parseInt(match[1]).toString(16).padStart(2, '0');
        const g = parseInt(match[2]).toString(16).padStart(2, '0');
        const b = parseInt(match[3]).toString(16).padStart(2, '0');
        return `#${r}${g}${b}`;
    }
    
    return '#000000';
}

// Exporte les fonctions publiques
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getAllThemes,
        applyTheme,
        createCustomTheme,
        updateCustomTheme,
        deleteCustomTheme,
        exportTheme,
        importTheme,
        initThemeSystem
    };
}
