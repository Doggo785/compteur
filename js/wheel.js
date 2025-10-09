const wheelSegments = [
    { label: 'RIEN', color: '#cccccc', hype: false },
    { label: 'RIEN', color: '#aaaaaa', hype: false },
    { label: 'RIEN', color: '#cccccc', hype: false },
    { label: 'HYPE!', color: '#ffd700', hype: true },
    { label: 'HYPE!', color: '#ffd700', hype: true },
    { label: 'HYPE!', color: '#ffd700', hype: true },
    { label: 'HYPE!', color: '#ffd700', hype: true },
    { label: 'RIEN', color: '#cccccc', hype: false }
];

function generateWheel() {
    console.log('generateWheel called');
    console.log(domElements.wheel);
    const segmentAngle = 360 / wheelSegments.length;
    wheelSegments.forEach((segment, i) => {
        const segmentEl = document.createElement('div');
        segmentEl.className = 'wheel-segment';
        segmentEl.style.setProperty('--color', segment.color);
        segmentEl.style.setProperty('--i', i);
        segmentEl.style.transform = `rotate(${segmentAngle * i}deg)`;
        
        const span = document.createElement('span');
        span.textContent = segment.label;
        span.style.transform = `rotate(${segmentAngle / 2}deg)`;

        segmentEl.appendChild(span);
        domElements.wheel.appendChild(segmentEl);
    });
}

function spinWheel() {
    console.log('spinWheel called');
    console.log(domElements.wheel);
    console.log(domElements.wheelContainer);
    domElements.wheelContainer.classList.add('visible');
    
    const spinOffset = 1080; // Fait plusieurs tours pour l'effet
    const randomSpin = Math.random() * 360;
    const finalRotation = spinOffset + randomSpin;
    
    domElements.wheel.style.transition = 'transform 6s cubic-bezier(0.25, 1, 0.5, 1)';
    domElements.wheel.style.transform = `rotate(${finalRotation}deg)`;

    setTimeout(() => {
        const segmentAngle = 360 / wheelSegments.length;
        const landedAngle = finalRotation % 360;
        const winningSegmentIndex = Math.floor((360 - landedAngle + (segmentAngle / 2)) % 360 / segmentAngle);
        const winningSegment = wheelSegments[winningSegmentIndex];

        const resultMessage = domElements.resultMessage;
        resultMessage.textContent = winningSegment.label;
        resultMessage.style.setProperty('--glow-color', winningSegment.hype ? '#ffd700' : '#cccccc');
        resultMessage.classList.add('visible');

        domElements.wheelContainer.classList.remove('visible');

        if (winningSegment.hype) {
            startHypeMode();
        }

        setTimeout(() => {
            resultMessage.classList.remove('visible');
            domElements.wheel.style.transition = 'none';
            domElements.wheel.style.transform = 'rotate(0deg)';
        }, 2000);

    }, 6500);
}