const emojiImages = [
    "https://cdn3.emoji.gg/emojis/PepeHands.png",
    "https://cdn.frankerfacez.com/emoticon/619207/4",
    "https://cdn3.emoji.gg/emojis/3808-prayge.png",
    "https://cdn3.emoji.gg/emojis/4042_shyemote.png",
    "https://cdn.frankerfacez.com/emoticon/381875/4",
    "https://cdn.7tv.app/emote/01F6MQ33FG000FFJ97ZB8MWV52/2x.avif",
    "https://cdn.7tv.app/emote/01FS5ZCFG0000500DPPCXJWCP8/2x.avif",
    "https://cdn.7tv.app/emote/01FB4S3QMG0001AXCAFYDEG758/2x.avif",
    "https://cdn.7tv.app/emote/01F6NM2T080003C6R1CKK0T0P2/2x.avif",
    "https://cdn.7tv.app/emote/01F2ZWD6CR000DSBG200DM9SGM/2x.avif",
    "https://cdn.7tv.app/emote/01F6PWXW5R0005589X3BDJC4QC/2x.avif",
    "https://cdn.7tv.app/emote/01F6Q72JSR0001K6WGNZJBARWS/2x.avif",
    "https://cdn.7tv.app/emote/01F6M5ZD3R0002B6P5MWZDK80C/2x.avif",
    "https://cdn.7tv.app/emote/01F6NMD520000AAS5FM9QEF9ZJ/2x.avif",
    "https://cdn.7tv.app/emote/01HQXFC5G00003SVFRS0KDHZYN/2x.avif",
    "https://cdn.7tv.app/emote/01F6RD7B88000B4N55W5NS55R7/2x.avif",
    "https://cdn.7tv.app/emote/01FG1NDHJR0001XDR7G9054X2Q/2x.avif",
    "https://cdn.7tv.app/emote/01F6N2WHKG000AR0YATR3ZV5X4/2x.avif",
    "https://cdn.7tv.app/emote/01F6SDAHC000053E74RSRY2AD2/2x.avif",
    "https://cdn.7tv.app/emote/01G3XH6QC00000CYEX22PC5CS6/2x.avif",
    "https://cdn.7tv.app/emote/01F71DN0VR0001G6FGBXSMY13C/2x.avif",
    "https://cdn.7tv.app/emote/01FS13P9T0000600V9N65KHQK7/2x.avif",
    "https://cdn.7tv.app/emote/01GHXY2RCR00025VZ4E5FVRZ3G/2x.avif",
    "https://i.ibb.co/6ctfjdk5/octave.png"
];

function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'dropfoxy';
    const img = document.createElement('img');
    img.alt = 'particle';
    img.width = 64;
    img.height = 64;
    particle.appendChild(img);
    document.body.appendChild(particle);
    return particle;
}

function randomizeParticle(particle) {
    const randomEmojiSrc = emojiImages[Math.floor(Math.random() * emojiImages.length)];
    const img = particle.querySelector('img');
    if (img) {
        img.src = randomEmojiSrc;
    }

    const randomLeft = Math.random() * 100;
    const randomFallDelay = Math.random() * 10;
    const randomShakeDelay = Math.random() * 3;
    const randomFallDuration = 8 + Math.random() * 5;
    const randomShakeDuration = 2 + Math.random() * 2;

    particle.style.left = randomLeft + 'vw';
    particle.style.animationDelay = `${randomFallDelay}s, ${randomShakeDelay}s`;
    particle.style.animationDuration = `${randomFallDuration}s, ${randomShakeDuration}s`;

    particle.style.animationName = 'none';
    void particle.offsetWidth;
    particle.style.animationName = '';
}

function updateParticleCount(targetCount) {
    const currentCount = particles.length;
    console.log('updateParticleCount called');
    console.log(particles);
    if (currentCount < targetCount) {
        for (let i = 0; i < targetCount - currentCount; i++) {
            const particle = createParticle();
            randomizeParticle(particle);
            particle.addEventListener('animationiteration', function(e) {
                if (e.animationName === 'dropfox-fall') {
                    randomizeParticle(particle);
                }
            });
            particles.push(particle);
        }
    } else if (currentCount > targetCount) {
        const particlesToRemove = particles.splice(targetCount);
        particlesToRemove.forEach(p => p.remove());
    }
}

// Expose a getter to read the current number of particles
function getParticleCount() {
    return particles.length;
}