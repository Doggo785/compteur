let hypeModeActive = false;
let normalBackgroundColorInterval;
let hypeBackgroundColorInterval;
let hypeParticleCount = 250; // Nombre de particules pour le mode Hype
let prevParticleCount = null; // sauvegarde du nombre de particules avant hype

function startHypeMode() {
    if (hypeModeActive) return;
    hypeModeActive = true;
    console.log("HYPE MODE ACTIVÉ !");

    // Appliquer les classes Hype
    document.querySelector('h1').classList.add('hype-mode-text');
    document.querySelectorAll('.progress-bar').forEach(bar => {
        bar.classList.add('hype-mode-progress');
    });

    clearInterval(normalBackgroundColorInterval);
    hypeBackgroundColorInterval = setInterval(() => {
        const randomHue = Math.floor(Math.random() * 360);
        const randomColor = `hsl(${randomHue}, 70%, 50%)`; 
        document.body.style.backgroundColor = randomColor;
    }, 150);

    // Mémorise l'état actuel pour restauration
    try {
        prevParticleCount = typeof getParticleCount === 'function' ? getParticleCount() : null;
    } catch {}
    updateParticleCount(hypeParticleCount);

    setTimeout(stopHypeMode, 30000); 
}

function stopHypeMode() {
    if (!hypeModeActive) return;
    hypeModeActive = false;
    console.log("HYPE MODE DÉSACTIVÉ.");

    // Retirer les classes Hype
    document.querySelector('h1').classList.remove('hype-mode-text');
    document.querySelectorAll('.progress-bar').forEach(bar => {
        bar.classList.remove('hype-mode-progress');
    });

    clearInterval(hypeBackgroundColorInterval);
    startNormalBackgroundColorChange();

    // Restaure le nombre de particules précédent si connu, sinon une valeur par défaut raisonnable
    const target = (typeof prevParticleCount === 'number' && prevParticleCount >= 0)
        ? prevParticleCount
        : 25;
    updateParticleCount(target);
    prevParticleCount = null;

}

function startNormalBackgroundColorChange() {
    // Évite les doublons
    clearInterval(normalBackgroundColorInterval);
    const setColor = () => {
        if (hypeModeActive) return;
        const randomHue = Math.floor(Math.random() * 360);
        // Un peu plus visible que 20%/10% mais reste sombre
        const randomColor = `hsl(${randomHue}, 35%, 14%)`;
        document.body.style.backgroundColor = randomColor;
    };
    // Applique immédiatement une couleur
    setColor();
    // Puis continue à changer doucement
    normalBackgroundColorInterval = setInterval(setColor, 6000);
}

startNormalBackgroundColorChange();