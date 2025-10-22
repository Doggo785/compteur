# Compte à Rebours Temporel

Ce projet est une application web interactive qui affiche un compte à rebours visuel et dynamique jusqu'à une date cible. Il inclut des barres de progression pour différentes unités de temps (jours, heures, minutes, secondes, millisecondes) et des animations pour rendre l'expérience utilisateur plus engageante.

## Fonctionnalités

- **Compte à rebours dynamique** : Affiche le temps restant jusqu'à une date cible sous forme de texte et de barres de progression.
- **Barres de progression** : Visualisation du temps écoulé pour chaque unité de temps (jours, heures, minutes, secondes, millisecondes).
- **Progression totale** : Une barre principale montre la progression totale entre une date de début et une date cible.
- **Animations de particules** : Des emojis animés tombent et se déplacent aléatoirement sur l'écran.
- **Changement de couleur de fond** : Le fond change de couleur aléatoirement toutes les secondes pour une expérience visuelle immersive.
- **La roue** : Une roue interactive qui génère des effets supplémentaire si le HYPE MODE est activé.
- **Hype mode** : Mode activable qui intensifie les animations (plus de particules, couleurs vives).
- **📅 Panneau de configuration** : Interface pour modifier les dates sans toucher au code, avec sauvegarde automatique.
- **🎨 Système de thèmes** : Personnalisez l'apparence avec des thèmes prédéfinis ou créez les vôtres !
  - **Thèmes inclus** : Default (original) et Cyberpunk (néon futuriste)
  - **Créez vos thèmes** : Personnalisez toutes les couleurs
  - **Import/Export** : Partagez vos créations
  - **Voir [THEMES_README.md](THEMES_README.md) pour plus de détails**
- **✨ Effets avancés** :
  - **Particules magnétiques** : Particules suivant la souris avec attraction magnétique
  - **Effet Matrix** : Transition Matrix déclenchée par la roue (segment dédié "MATRIX", durée ~25s)
  - **Mode critique** : Glitch effect quand il reste moins de 10% du temps

## Technologies utilisées

- **HTML5** : Structure de la page.
- **CSS3** : Styles et animations.
- **JavaScript** : Logique du compte à rebours et animations.
- **Canvas API** : Effets de particules et Matrix.

## Comment utiliser

1. Ouvrez le fichier `compteur.html` dans un navigateur web moderne.
2. Le compte à rebours commence automatiquement en fonction des dates définies dans le script JavaScript.
3. **Cliquez sur l'icône ⚙️** en haut à droite pour configurer les dates.
4. **Bougez votre souris** pour voir les particules magnétiques.
5. **Attendez le mode critique** (<10% du temps restant) pour voir l'effet de glitch.

## Personnalisation

### Via l'interface (Recommandé)
- Cliquez sur le bouton ⚙️ en haut à droite
- Modifiez les dates de début et cible
- Les changements sont sauvegardés automatiquement dans le navigateur

### Via le code
- **Dates** :
  - Modifiez la variable `dateDebut` pour définir la date de début.
  - Modifiez la variable `dateCible` pour définir la date cible.
- **Nombre de particules** :
  - Changez la valeur de `numberOfParticles` dans le script pour ajuster le nombre d'emojis animés.

## Effets Spéciaux

### 🧲 Particules Magnétiques
Les particules apparaissent au passage de la souris et sont attirées par celle-ci avec un effet d'attraction magnétique.

### 🟢 Effet Matrix
Une transition matricielle (pluie de caractères verts) se déclenche via un **segment dédié MATRIX** sur la roue et dure environ **25 secondes**.

### ⚠️ Mode Critique (< 10%)
Quand il reste moins de 10% du temps total :
- **Glitch effect** sur le titre et le timer
- **Pulsation rouge** du conteneur
- **Barres rouges** pulsantes
- **Effet Matrix** plus fréquent
- **Distorsion chromatique** RGB

### 🧪 Test du Mode Critique
Pour tester le mode critique sans attendre, ouvrez la console du navigateur et tapez :
```javascript
advancedEffects.testCriticalMode()
```

## 🐛 Mode Debug

Un mode Debug complet est disponible pour tester et contrôler tous les aspects de l'application.

### Activation
- **Hoverball** : Survolez le bord droit de l'écran (au milieu) pour révéler le bouton 🐛
- **Raccourci** : `Ctrl + Shift + D`

### Fonctionnalités principales
- **Contrôle de la roue** : Activer/désactiver, forcer un lancer
- **Effets forcés** : Forcer HYPE, Matrix ou aucun effet
- **Contrôle du temps** : Geler, accélérer (jusqu'à 10x), ralentir
- **Pourcentage forcé** : Tester l'interface à n'importe quel pourcentage
- **Contrôle des particules** : Ajuster de 0 à 500 particules
- **Overlay d'informations** : FPS, particules, progression en temps réel
- **Logger l'état** : Exporter toutes les données dans la console

## Pré-requis

- Un navigateur moderne prenant en charge les fonctionnalités CSS3 et JavaScript ES6.
- Support du Canvas API pour les effets avancés.

## Aperçu

![Aperçu du Compte à Rebours](https://i.ibb.co/hxchh7kw/image.png)

## Auteur

- **Doggo**

## Licence

Ce projet est sous licence MIT. Vous êtes libre de l'utiliser, de le modifier et de le distribuer.

---

Amusez-vous avec ce compte à rebours interactif et impressionnez vos amis avec ses animations captivantes !