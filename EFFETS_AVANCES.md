# 🎨 Effets Avancés - Documentation

Ce document explique les trois animations avancées ajoutées au projet.

---

## 1. 🧲 Particules Magnétiques

### Description
Des particules colorées apparaissent au passage de la souris et sont attirées vers elle avec un effet d'attraction magnétique réaliste.

### Caractéristiques
- **Génération** : Une nouvelle particule tous les 50ms au passage de la souris
- **Attraction** : Zone d'attraction de 150px autour du curseur
- **Couleurs** : Teintes bleu-vert avec effet de glow
- **Limite** : Maximum 200 particules simultanées pour les performances
- **Physique** : Friction réaliste et rebond sur les bords de l'écran

### Activation
Activé automatiquement au chargement de la page. Il suffit de bouger la souris pour voir l'effet.

### Code
```javascript
// Accès programmatique
window.advancedEffects.initMagneticParticles();
```

---

## 2. 🟢 Effet Matrix

### Description
Transition matricielle inspirée du film Matrix, avec pluie de caractères japonais et chiffres verts sur fond noir.

### Déclenchement
- L'effet Matrix est déclenché par la **roue** lorsqu'elle s'arrête sur le segment dédié **MATRIX**.
- Il n'y a plus de déclenchement automatique au fil du temps.

### Durée
- Par défaut ~25 000 ms (25s) lors d'un **MATRIX** (configuré dans `wheel.js`).
- Personnalisable si vous appelez l'API manuellement.

### Activation manuelle
```javascript
// Déclencher l'effet Matrix pour 1 seconde (test)
window.advancedEffects.triggerMatrixTransition(1000);
```

### Personnalisation
Dans `advancedEffects.js`, ligne 141 :
```javascript
this.characters = '01アイウエオ...'; // Modifier les caractères
this.fontSize = 16; // Taille des caractères
```

---

## 3. ⚠️ Mode Critique avec Glitch Effect

### Description
Quand il reste moins de 10% du temps total, le mode critique s'active avec des effets visuels intenses.

### Déclenchement
Automatique quand : `(temps restant / temps total) < 10%`

### Effets visuels

#### Glitch Effect
- **Shake** : Tremblement du texte
- **Distorsion chromatique** : Séparation RGB des couleurs
- **Décalage** : Effet de glitch avec clips aléatoires
- **Intensité** : Augmente plus on approche de 0%

#### Autres effets
- **Pulsation rouge** : Le conteneur pulse en rouge
- **Barres critiques** : Les barres de progression deviennent rouges pulsantes
- **Texte rouge** : Le titre et le timer flashent en rouge
- **Matrix intensifié** : Transitions plus fréquentes

### Calcul d'intensité
```javascript
intensity = 1 + (1 - pourcentageRestant / 10)
// À 10% : intensity = 1
// À 5%  : intensity = 1.5
// À 0%  : intensity = 2 (maximum)
```

### Test du Mode Critique

Pour tester sans attendre, ouvrez la **console du navigateur** (F12) et tapez :

```javascript
advancedEffects.testCriticalMode()
```

Cela simulera le mode critique pendant 10 secondes.

---

## 🎯 Performance

### Optimisations
- **Canvas** : Utilisation du Canvas API pour les particules et Matrix
- **RequestAnimationFrame** : Animations synchronisées avec le rafraîchissement
- **Limitation** : Max 200 particules magnétiques
- **Nettoyage** : Suppression des particules mortes

### Impact
- **Particules magnétiques** : ~5-10% CPU (selon mouvement souris)
- **Effet Matrix** : ~15-20% CPU pendant l'animation
- **Glitch effect** : ~2-3% CPU (animations CSS)

### Désactivation

Pour désactiver les effets si nécessaire :

```javascript
// Désactiver les particules magnétiques
if (magneticSystem) {
    magneticSystem.destroy();
    magneticSystem = null;
}

// Désactiver l'effet Matrix
if (matrixEffect) {
    matrixEffect.destroy();
    matrixEffect = null;
}
```

---

## 🎨 Personnalisation

### Modifier le seuil du mode critique

Dans `advancedEffects.js`, ligne 267 :
```javascript
const criticalThreshold = 10; // Changer à 20 pour activer à 20%
```

### Modifier la fréquence du Matrix

Dans `advancedEffects.js`, ligne 323-329 :
```javascript
if (isInCriticalMode && Math.random() > 0.6) { // 40% de chance
    triggerMatrixTransition(800);
} else if (Math.random() > 0.92) { // 8% de chance
    triggerMatrixTransition(500);
}
```

### Modifier les couleurs des particules

Dans `advancedEffects.js`, ligne 17 :
```javascript
this.hue = Math.random() * 60 + 180; // 180-240 = bleu-vert
// Changer à :
this.hue = Math.random() * 360; // Toutes les couleurs
```

---

## 🐛 Dépannage

### Les particules ne s'affichent pas
- Vérifier que le Canvas est bien créé : `document.getElementById('magnetic-canvas')`
- Vérifier la console pour les erreurs JavaScript
- Vérifier que `advancedEffects.js` est bien chargé

### L'effet Matrix ne se déclenche jamais
- Assurez-vous que la roue s'arrête sur le segment **MATRIX**.
- Utilisez `advancedEffects.triggerMatrixTransition(1000)` pour forcer l'effet (test).

### Le mode critique ne s'active pas
- Vérifier que `dateCible` et `dateDebut` sont bien définis
- Utiliser `advancedEffects.testCriticalMode()` pour tester
- Vérifier que moins de 10% du temps reste

### Lag/Ralentissements
- Réduire le nombre max de particules (ligne 94)
- Désactiver les effets sur mobile
- Fermer les autres onglets du navigateur

---

## 📱 Compatibilité

### Navigateurs supportés
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Edge 90+
- ✅ Safari 14+
- ⚠️ Mobile : Performances réduites (désactiver sur faibles appareils)

### APIs utilisées
- Canvas API (particules et Matrix)
- RequestAnimationFrame (animations fluides)
- CSS Animations (glitch effect)
- ES6+ (classes, arrow functions)

---

## 🚀 Améliorations futures possibles

1. **Mode GPU** : Utiliser WebGL pour encore plus de particules
2. **Audio réactif** : Particules réagissant au son
3. **Customisation UI** : Panneau pour activer/désactiver chaque effet
4. **Presets** : Thèmes prédéfinis (Cyber, Neon, Minimal, etc.)
5. **Mobile optimization** : Version allégée pour smartphones

---

## 📝 Crédits

Effets développés pour le projet **Compte à Rebours Temporel**
- Particules magnétiques : Canvas 2D avec physique personnalisée
- Effet Matrix : Inspiré du film Matrix (1999)
- Glitch effect : CSS animations avec clip-path
