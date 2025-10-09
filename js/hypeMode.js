let hypeModeActive = false;
let normalBackgroundColorInterval;
let hypeBackgroundColorInterval;
let hypeParticleCount = 250; // Nombre de particules pour le mode Hype

function startHypeMode() {
    if (hypeModeActive) return;
    hypeModeActive = true;
    console.log("HYPE MODE ACTIVÉ !");

    clearInterval(normalBackgroundColorInterval);
    hypeBackgroundColorInterval = setInterval(() => {
        const randomHue = Math.floor(Math.random() * 360);
        const randomColor = `hsl(${randomHue}, 70%, 50%)`; 
        document.body.style.backgroundColor = randomColor;
    }, 150);

    updateParticleCount(hypeParticleCount);

    setTimeout(stopHypeMode, 30000); 
}

function stopHypeMode() {
    if (!hypeModeActive) return;
    hypeModeActive = false;
    console.log("HYPE MODE DÉSACTIVÉ.");

    clearInterval(hypeBackgroundColorInterval);
    startNormalBackgroundColorChange();

    updateParticleCount(normalParticleCount);
    document.body.style.backgroundColor = '#121212';
}

function startNormalBackgroundColorChange() {
    normalBackgroundColorInterval = setInterval(() => {
        if (hypeModeActive) return;
        const randomHue = Math.floor(Math.random() * 360);
        const randomColor = `hsl(${randomHue}, 20%, 10%)`; 
        document.body.style.backgroundColor = randomColor;
    }, 6000);
}

startNormalBackgroundColorChange();