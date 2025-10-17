// --- PERSONNALISATION ---
// Charge la configuration depuis localStorage ou utilise les valeurs par défaut
function getConfigDates() {
    if (typeof window.loadConfig === 'function') {
        const config = window.loadConfig();
        return {
            dateDebut: new Date(config.dateDebut),
            dateCible: new Date(config.dateCible)
        };
    }
    // Valeurs par défaut si config.js n'est pas chargé
    return {
        dateDebut: new Date('2025-10-07T10:30:00'),
        dateCible: new Date('2025-10-10T13:30:00')
    };
}

const dates = getConfigDates();
const dateDebut = dates.dateDebut;
const dateCible = dates.dateCible;
const totalMillisecondesIntervalle = dateCible - dateDebut;

// --- Mise en cache des éléments DOM ---
const domElements = {
    mainProgressBar: document.getElementById('main-progress-bar'),
    mainProgressPercentage: document.getElementById('main-progress-percentage'),
    hoursBar: document.getElementById('hours-bar'),
    minutesBar: document.getElementById('minutes-bar'),
    secondsBar: document.getElementById('seconds-bar'),
    millisecondsBar: document.getElementById('milliseconds-bar'),
    hoursPercentage: document.getElementById('hours-percentage'),
    minutesPercentage: document.getElementById('minutes-percentage'),
    secondsPercentage: document.getElementById('seconds-percentage'),
    millisecondsPercentage: document.getElementById('milliseconds-percentage'),
    countdownTimer: document.getElementById('countdown-timer'),
    wheel: document.getElementById('wheel'),
    wheelContainer: document.getElementById('wheel-container'),
    resultMessage: document.getElementById('result-message'),
};

let particles = []; // Déclare un tableau global pour les particules

let lastSecond = -1;
let lastMinute = -1;

function updateMainProgressBar(maintenant) {
    const ecouleMillisecondes = maintenant - dateDebut;
    let pourcentageTotal = (ecouleMillisecondes / totalMillisecondesIntervalle) * 100;
    pourcentageTotal = Math.max(0, Math.min(100, pourcentageTotal));

    domElements.mainProgressBar.style.width = pourcentageTotal + '%';
    domElements.mainProgressPercentage.textContent = pourcentageTotal.toFixed(3) + '%';
}

function updateCountdownTimer(maintenant) {
    const currentSecond = maintenant.getSeconds();
    if (currentSecond !== lastSecond) {
        const tempsRestant = dateCible - maintenant;
        if (tempsRestant > 0) {
            const jours = Math.floor(tempsRestant / (1000 * 60 * 60 * 24));
            const heures = Math.floor((tempsRestant % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((tempsRestant % (1000 * 60 * 60)) / (1000 * 60));
            const secondes = Math.floor((tempsRestant % (1000 * 60)) / 1000);
            domElements.countdownTimer.textContent =
                `${String(jours).padStart(2, '0')}j ${String(heures).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(secondes).padStart(2, '0')}s`;
        } else {
            domElements.countdownTimer.textContent = "OBJECTIF ATTEINT !";
        }
        lastSecond = currentSecond;
    }
}

function updateIndividualTimeBars(maintenant) {
    const millisecondesActuelles = maintenant.getMilliseconds();
    const secondesActuelles = maintenant.getSeconds() + (millisecondesActuelles / 1000);
    const minutesActuelles = maintenant.getMinutes() + (secondesActuelles / 60);
    const heuresActuelles = maintenant.getHours() + (minutesActuelles / 60);

    const pourcentageMillisecondes = (millisecondesActuelles / 1000) * 100;
    const pourcentageSecondes = (secondesActuelles / 60) * 100;
    const pourcentageMinutes = (minutesActuelles / 60) * 100;
    const pourcentageHeures = (heuresActuelles / 24) * 100;

    domElements.millisecondsBar.style.width = pourcentageMillisecondes + '%';
    domElements.secondsBar.style.width = pourcentageSecondes + '%';
    domElements.minutesBar.style.width = pourcentageMinutes + '%';
    domElements.hoursBar.style.width = pourcentageHeures + '%';

    domElements.millisecondsPercentage.textContent = pourcentageMillisecondes.toFixed(0) + '%';
    domElements.secondsPercentage.textContent = pourcentageSecondes.toFixed(0) + '%';
    domElements.minutesPercentage.textContent = pourcentageMinutes.toFixed(2) + '%';
    domElements.hoursPercentage.textContent = pourcentageHeures.toFixed(2) + '%';

    if (Math.floor(minutesActuelles) !== lastMinute) {
        spinWheel();
        lastMinute = Math.floor(minutesActuelles);
    }
}

function miseAJourBarres() {
    const maintenant = new Date();
    
    updateMainProgressBar(maintenant);
    updateCountdownTimer(maintenant);
    updateIndividualTimeBars(maintenant);

    requestAnimationFrame(miseAJourBarres);
}

// On lance la boucle d'animation
requestAnimationFrame(miseAJourBarres);

document.addEventListener('DOMContentLoaded', () => {
    generateWheel();
    updateParticleCount(25); // Initialisation avec 25 particules
});