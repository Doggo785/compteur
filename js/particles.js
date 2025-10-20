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
    "https://i.ibb.co/6ctfjdk5/octave.png",
    "https://cdn.7tv.app/emote/01F6MKTFTG0009C9ZSNZTFV2ZF/2x.avif",
    "https://cdn.7tv.app/emote/01F6MKTFTG0009C9ZSNZTFV2ZF/2x.avif",
    "https://cdn.7tv.app/emote/01F6NET6G00009JYTB75QDKV1S/2x.avif",
    "https://cdn.7tv.app/emote/01G4ZTECKR0002P97QQ94BDSP4/2x.avif",
    "https://cdn.7tv.app/emote/01F6WP22CR0004YCK11WAVZHEW/2x.avif",
    "https://cdn.7tv.app/emote/01FEV00990000FCZBKX8KY8JRF/2x.avif",
    "https://cdn.7tv.app/emote/01F6ME9FRG0005TFYTWP1H8R42/2x.avif",
    "https://cdn.7tv.app/emote/01GY6AM3T000092DZSHC04S3AZ/2x.avif",
    "https://cdn.7tv.app/emote/01G7YR9X5G0003Z50SB3FM5WR4/2x.avif",
    "https://cdn.7tv.app/emote/01F6VS6DR8000ECZXVKQBJ42S0/2x.avif",
    "https://cdn.7tv.app/emote/01GFKMBAHG0007SC7A230SCCYX/2x.avif",
    "https://cdn.7tv.app/emote/01F7A96T680001569Q2SWB43A0/2x.avif",
    "https://cdn.7tv.app/emote/01F7A96T680001569Q2SWB43A0/2x.avif",
    "https://cdn.7tv.app/emote/01FSD181Q80009A2M92QGQ17CB/2x.avif",
    "https://cdn.7tv.app/emote/01FT8MZ1ER0001606GRRVVJFA5/2x.avif",
    "https://cdn.7tv.app/emote/01F6MCX6RR0000WDA7ERT4J465/2x.avif",
    "https://cdn.7tv.app/emote/01F6NTJV7G000AAS5FM9Q5MQVV/2x.avif",
    "https://cdn.7tv.app/emote/01GB5S18QG00090V9B3D8CGHNG/2x.avif",
    "https://cdn.7tv.app/emote/01EZPMWPER00077NX500A43YF8/2x.avif",
    "https://cdn.7tv.app/emote/01F9Q7GMH8000AJG70JGMA4EQ5/2x.avif",
    "https://cdn.7tv.app/emote/01F6TDN2V0000E7TRSM97WER0J/2x.avif",
    "https://cdn.7tv.app/emote/01G61H421G0006Z5WTGWA7994Q/2x.avif",
    "https://cdn.7tv.app/emote/01HSQ1EYC00005QYJHZJZSRPWS/2x.avif",
    "https://cdn.7tv.app/emote/01F85F0A28000E14C9J6VJDGKD/2x.avif",
    "https://cdn.7tv.app/emote/01FPJJNKTG0001BCZZ99DVMMJS/2x.avif",
    "https://cdn.7tv.app/emote/01F79P6BFR0005BGS0Y3M4DPPT/2x.avif",
    "https://cdn.7tv.app/emote/01FDC150C8000F43V49GZTVECJ/2x.avif",
    "https://cdn.7tv.app/emote/01GSK9T85R0001G7T9NFZMVEGY/2x.avif",
    "https://cdn.7tv.app/emote/01EZPJ8YRR000C438200A44F2Y/2x.avif",
    "https://cdn.7tv.app/emote/01FB7W06AR0004RQA2VEYFG2EA/2x.avif",
    "https://cdn.7tv.app/emote/01FAJTK1300005Z0WD0X9XQV4D/2x.avif",
    "https://cdn.7tv.app/emote/01FG6QAY8R0000Y99N1Q2XF8ZN/2x.avif",
    "https://cdn.7tv.app/emote/01F6MDD2JR0000WDA7ERT5WV0S/2x.avif",
    "https://cdn.7tv.app/emote/01F96A83PG0007ECJ7AZB0NR4S/2x.avif",
    "https://cdn.7tv.app/emote/01H464ZJGR0008GK19N4Z11FKR/2x.avif",
    "https://cdn.7tv.app/emote/01FRHPVJQ80005RSBJP7VAF4B0/2x.avif",
    "https://cdn.7tv.app/emote/01F6TCGDZR0004ZKK01VVGX8DP/2x.avif",
    "https://cdn.7tv.app/emote/01F6QB98C0000A6S4F82DC7DR2/2x.avif",
    "https://cdn.7tv.app/emote/01J23QVR30000FQRZQPZ7GJG6C/2x.avif",
    "https://cdn.7tv.app/emote/01GCN0JF60000D8ZK13J8KVD8A/2x.avif",
    "https://cdn.7tv.app/emote/01GSTZ3E08000F54AV8GPAGMNP/2x.avif",
    "https://cdn.7tv.app/emote/01HR292BAR000264035KP5PR4Y/2x.avif",
    "https://cdn.7tv.app/emote/01H88T36FG0001DZ9QYTNFH2ZK/2x.avif",
    "https://cdn.7tv.app/emote/01F78GJQVR0005TDSTZFB0YQG7/2x.avif",
    "https://cdn.7tv.app/emote/01F78HE9PG000F17N8G1SC68Q6/2x.avif",
    "https://cdn.7tv.app/emote/01G4KD6S480004PXZJYX9ZQ0KY/2x.avif",
    "https://cdn.7tv.app/emote/01F012TSH80007E4VV006YKSM0/2x.avif",
    "https://cdn.7tv.app/emote/01F012TSH80007E4VV006YKSM0/2x.avif",
    "https://cdn.7tv.app/emote/01F6T2WAKR000FFMY8SXKB29EY/2x.avif",
    "https://cdn.7tv.app/emote/01HSVPHY80000BF22ZE9ZB6234/3x.avif",
    "https://cdn.7tv.app/emote/01F6PKXEP00002RDNAW6F1KAE8/2x.avif",
    "https://cdn.7tv.app/emote/01HCN1BBPG0005KTFQBNM1M0GD/2x.avif",
    "https://cdn.7tv.app/emote/01GKAMXN200002XZ8QVNF6S1GV/2x.avif",
    "https://cdn.7tv.app/emote/01FKC6S348000B1FXDJGM9E1RK/2x.avif",
    "https://cdn.7tv.app/emote/01F6NJG2YR000B70V1XA8R9GAJ/2x.avif",
    "https://cdn.7tv.app/emote/01F6NMJE08000BEKN8ZXWG2EJK/2x.avif",
    "https://cdn.7tv.app/emote/01F7J27WY00004GAEVKN6YZ7BD/2x.avif",
    "https://cdn.7tv.app/emote/01F8S7CRF8000CP8X9GFR0PRM8/2x.avif",
    "https://cdn.7tv.app/emote/01F6TF0FGG000E7TRSM97YXJNY/2x.avif"
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
    console.debug('createParticle: appended', particle);
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
    const randomHorizontalDelay = Math.random() * 4; // delay for horizontal animation
    const randomFallDuration = 8 + Math.random() * 5;
    const randomShakeDuration = 2 + Math.random() * 2;
    const randomHorizontalDuration = 4 + Math.random() * 6; // horizontal duration

    particle.style.left = randomLeft + 'vw';
    // Provide three values (fall, shake, horizontal) for delays and durations
    particle.style.animationDelay = `${randomFallDelay}s, ${randomShakeDelay}s, ${randomHorizontalDelay}s`;
    particle.style.animationDuration = `${randomFallDuration}s, ${randomShakeDuration}s, ${randomHorizontalDuration}s`;

    // Reset animations to force reflow
    particle.style.animationName = 'none';
    void particle.offsetWidth;
    // Use the CSS-defined animation names
    particle.style.animationName = 'dropfox-fall, dropfox-shake, dropfox-horizontal';

    console.debug('randomizeParticle:', {
        left: particle.style.left,
        animationDelay: particle.style.animationDelay,
        animationDuration: particle.style.animationDuration,
        animationName: particle.style.animationName,
        imgSrc: img ? img.src : null
    });
}

function updateParticleCount(targetCount) {
    // Respecte la configuration: si l'effet "emojis qui tombent" est désactivé, on force à 0
    try {
        const enabled = (typeof getConfigPath === 'function') ? !!getConfigPath('effects.fallingParticles.enabled', true) : true;
        if (!enabled) targetCount = 0;
    } catch {}

    const currentCount = particles.length;
    // console.debug('updateParticleCount ->', { currentCount, targetCount });

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