const script = [
  { name: '', text: "Hi there. Before this story begins, let me introduce myself I'm Don. Someone special asked me to share a message with you." },
  { name: 'Don (Narrator)', text: "This message isn’t mine alone. It comes from someone you once knew.\nHis name is Bon." },
  { name: 'Don (Narrator)', text: "Season after season, people change. Sometimes the change is messy, sometimes it hurts, but change still happens." },
  { name: 'Don (Narrator)', text: "Bon wants you to know this:\nEven if he stumbles with words or fails to show it right, his heart has never changed. He will stand by you, because to him… you truly matter." },
  { name: 'Don (Narrator)', text: "And because you matter, he doesn’t just want to see your bright side—he wants to see every side of you, even the storms. He wants to see you grow. That’s why he asked me to share something else with you." },

  { name: 'Don (Narrator)', text: "Aizelle… don’t let hatred grow toward your mother.\nYes, she has flaws. Yes, she’s made mistakes.\nBut please wag mo ei hate yung mother mo kahit ganun siya." },
  { name: 'Don (Narrator)', text: "I know you’ve felt the weight of her words. The trashtalk. The way she sometimes makes you feel unseen. Bon knows that pain, because he’s been there with you listening when you needed to vent, noticing the way your eyes shift when you're having a conversation." },
  { name: 'Don (Narrator)', text: "He remembers the nights you’d laugh, only for that laughter to fade when the topic of home slipped in. He feel the times you pretend you were fine, but your grief said otherwise. And in those moments, Bon wanted nothing more than to protect you from that hurt." },

  { name: 'Don (Narrator)', text: "But hatred won’t heal you. It won’t give you peace. It only binds you tighter to the same wounds you’re trying so hard to escape." },
  { name: 'Don (Narrator)', text: "Try to understand her not because she was perfect, but because she couldn’t be. Even broken people give life. Even flawed love can still root us, still teach us." },
  { name: 'Don (Narrator)', text: "Life doesn’t hand out perfect parents. It gives us people cracked, shadowed, sometimes toxic. And yet… they are still the ground where we grow.\nWithout her, you wouldn’t be as strong, as wise, as brave as you are today." },
  { name: 'Don (Narrator)', text: "Think of it this way: flowers still bloom even from soil that is rough, dry, or scarred. You are that flower. You carry color and strength that the world cannot take from you." },

  { name: 'Don (Narrator)', text: "You’ve learned to stand on your own feet because of the storms it brought. You’ve learned patience, endurance, and how to carry yourself even when it hurts. That strength? That’s yours now. It’s part of you and no one can take that away." },
  { name: 'Don (Narrator)', text: "Maybe one day they’ll realize the pain it caused. Regrets. And maybe it won’t. Atleast your intentions was pure, you can choose. The choice to break the cycle, to turn pain into wisdom, to choose peace instead of blame, love instead of resentment. Ignore instead to fight back" },
  { name: 'Don (Narrator)', text: "And Bon wants you to remember: you’re not alone in that choice. He walked beside you quietly when you thought no one understood. And he’ll keep walking beside you not as someone who wants to fix you, but as someone who wants to hold you through ups and down." },

  { name: 'Don (Narrator)', text: "Because your pain is his pain, and your happiness is what he prays for." },  
  { name: 'Don (Narrator)', text: "He hasn’t felt this way before. This moment is different as  deeper, steady, something even he struggles to explain. It’s not just a feeling it’s a promise since the day he stalked you,ask you, tries to study you just like a book that he wants to understand." },
  { name: 'Don (Narrator)', text: "No matter how hard the seasons shift, no matter how heavy the weight, just like a bonfire by the seaside it stays bright, guiding you through the dark." },

  { name: '', text: "" },
  { name: 'Narration', text: "\"Bon wants you to know this was his second confession... his way of asking you out. : )\"" }
];


let currentLine = 0;
let gameStarted = false;
let audioContext = null;
let bgBuffer = null;
let audioElem = null;

const audioSrc = 'assets/𝐇𝐢𝐝𝐝𝐞𝐧 𝐋𝐨𝐯𝐞.mp3';

function initAudioPreload() {
   
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
            audioContext = new AudioCtx();
          
            fetch(audioSrc).then(r => r.arrayBuffer()).then(buf => {
                return audioContext.decodeAudioData(buf);
            }).then(decoded => {
                bgBuffer = decoded;
            }).catch(() => {
                
                audioContext = null;
                bgBuffer = null;
                setupHtmlAudioFallback();
            });
            return;
        }
    } catch (e) {
        
    }
    setupHtmlAudioFallback();
}

function setupHtmlAudioFallback() {
    try {
        audioElem = new Audio(audioSrc);
        audioElem.preload = 'auto';
        audioElem.load();
    } catch (e) {
        audioElem = null;
    }
}

// Whether background audio has already been started to avoid duplicate sources
let bgAudioStarted = false;

function playBgAudioNow() {
    if (bgAudioStarted) return;
    try {
        // Resume audio context if present
        if (audioContext && typeof audioContext.resume === 'function') {
            audioContext.resume().catch(() => { /* ignore resume errors */ });
        }

        if (bgBuffer && audioContext) {
            const src = audioContext.createBufferSource();
            src.buffer = bgBuffer;
            const gain = audioContext.createGain();
            gain.gain.value = 0.5; // 50%
            src.connect(gain).connect(audioContext.destination);
            // play only once
            src.loop = false;
            src.start(0);
            window.__vn_bg_audio = { src, gain };
            bgAudioStarted = true;
        } else if (audioElem) {
            // HTMLAudio fallback: play immediately on user gesture
            try {
                const p = audioElem.play();
                if (p && typeof p.catch === 'function') p.catch(() => { /* ignore */ });
            } catch (e) {
                // ignore
            }
            // play only once
            audioElem.loop = false;
            audioElem.volume = 0.5;
            window.__vn_bg_audio = audioElem;
            bgAudioStarted = true;
        }
    } catch (err) {
        console.warn('Audio playback failed or was blocked:', err);
    }
}

const nameElem = document.getElementById('name');
const dialogueElem = document.getElementById('dialogue');
const nextBtn = document.getElementById('next-btn');
const characterElem = document.getElementById('character');
const backgroundElem = document.getElementById('background');
const dialogueBox = document.getElementById('dialogue-box');

function showLine(idx) {
    const line = script[idx];
    if (!line) return;
    if (nameElem) nameElem.textContent = line.name || '';
    if (dialogueElem) dialogueElem.innerHTML = line.text.replace(/\n/g, '<br>');

    // Scene effects
    if (line.text.toLowerCase().includes('fades to black')) {
        if (characterElem) characterElem.style.opacity = '0';
        if (backgroundElem) backgroundElem.style.filter = 'brightness(0.2) grayscale(1)';
        spawnBlossoms();
    } else {
        if (characterElem) characterElem.style.opacity = '1';
        if (backgroundElem) backgroundElem.style.filter = '';
    }
}

function nextLine() {
    if (!gameStarted) return; // ignore advances until player starts
    currentLine++;
    if (currentLine < script.length) {
        showLine(currentLine);
    } else {
        // End of story: fade out everything
        if (dialogueBox) dialogueBox.style.opacity = '0';
        if (backgroundElem) backgroundElem.style.filter = 'brightness(0.05) grayscale(1)';

        spawnBlossoms();
    }
}

function spawnBlossoms(opts = {}) {
    const overlayId = 'blossom-overlay';
    let overlay = document.getElementById(overlayId);
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = overlayId;
        overlay.className = 'blossom-overlay';
        document.body.appendChild(overlay);
    }


    try {
        if (characterElem) {
            const cs = window.getComputedStyle(characterElem);
            const cz = parseInt(cs.zIndex, 10);
            if (!isNaN(cz)) overlay.style.zIndex = String(Math.max(0, cz - 1));
        }
    } catch (e) {
        // ignore
    }

    const petalImages = opts.images || ['assets/white_flower.png', 'assets/blue_flower.png'];
    const count = opts.count || 26;
    const duration = opts.duration || 5200;

    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    const charRect = (characterElem && typeof characterElem.getBoundingClientRect === 'function') ? characterElem.getBoundingClientRect() : null;
    const padding = 12; // px padding around character to avoid

    function intersects(x, y, w, h, rect) {
        if (!rect) return false;
        return !(x + w < rect.left - padding || x > rect.right + padding || y + h < rect.top - padding || y > rect.bottom + padding);
    }

    for (let i = 0; i < count; i++) {
        const span = document.createElement('div');
        span.className = 'blossom img';

        // Random size classes for variety
        const sizeChoice = Math.random();
        if (sizeChoice < 0.25) span.classList.add('small');
        else if (sizeChoice > 0.85) span.classList.add('large');

    const chosen = petalImages[Math.floor(Math.random() * petalImages.length)];

    // create inner petal element which floats upward; outer element sways/rotates
    const inner = document.createElement('div');
    inner.className = 'petal';
    inner.style.backgroundImage = `url(${chosen})`;

    // randomize animation durations for organic movement
    const floatDur = (duration + Math.random() * 1600);
    const swayDur = (1600 + Math.random() * 3000);
    inner.style.setProperty('--float-duration', floatDur + 'ms');
    span.style.setProperty('--sway-duration', swayDur + 'ms');

    // random start delay so motion staggers
    const delay = Math.random() * 800;
    inner.style.animationDelay = delay + 'ms';
    span.style.animationDelay = delay + 'ms';

    span.appendChild(inner);

        // approximate width/height in px for intersection checks
        const baseSize = span.classList.contains('small') ? 22 : span.classList.contains('large') ? 56 : 40;
        const wPx = baseSize;
        const hPx = baseSize;

        // choose a random starting position across the whole viewport but avoid the character rect
        let attempts = 0;
        let leftPx = 0, topPx = 0;
        do {
            leftPx = Math.random() * vw;
            topPx = Math.random() * vh;
            attempts += 1;
        } while (charRect && attempts < 20 && intersects(leftPx, topPx, wPx, hPx, charRect));

        // fallback: if still overlapping after attempts, nudge to left side of character
        if (charRect && intersects(leftPx, topPx, wPx, hPx, charRect)) {
            leftPx = Math.max(4, charRect.left - wPx - padding - Math.random() * 80);
            topPx = Math.min(vh - hPx, Math.max(4, charRect.top + Math.random() * (charRect.height || 120)));
        }

        span.style.left = (leftPx / vw * 100) + '%';
        span.style.top = (topPx / vh * 100) + '%';
        overlay.appendChild(span);

        // remove after animation completes
        setTimeout(() => { span.remove(); }, duration + 1400);
    }

    // remove overlay after a while if empty
    setTimeout(() => {
        if (overlay && overlay.childElementCount === 0) overlay.remove();
    }, duration + 1800);
}

// Click / tap
if (nextBtn && typeof nextBtn.addEventListener === 'function') nextBtn.addEventListener('click', () => { if (gameStarted) nextLine(); });

// Keyboard: Space or Enter to advance
window.addEventListener('keydown', (e) => {
    // Allow Space/Enter to advance but only when focus isn't on an input/button/textarea
    try {
        const activeTag = document.activeElement && document.activeElement.tagName;
        if ((e.code === 'Space' || e.key === 'Enter') && activeTag !== 'INPUT' && activeTag !== 'TEXTAREA' && activeTag !== 'BUTTON') {
            e.preventDefault();
            if (gameStarted) nextLine();
        }
    } catch (err) {
        // defensive: ignore focus check errors
        nextLine();
    }
});

// Touch anywhere (outside of dialogue box) also advances for mobile
window.addEventListener('touchend', (e) => {
    try {
        const path = e.composedPath && e.composedPath();
        if (path) {
            for (const el of path) {
                if (el && el.id === 'next-btn') return;
            }
        }
    } catch (err) {
        // ignore
    }
    // small delay to allow button click handlers to run first
    setTimeout(() => { if (gameStarted) nextLine(); }, 50);
});


let dialogTapEnabled = false;
let tapTimeout = null;
function enableDialogTap() {
    const mq = window.matchMedia('(max-width:600px)');
    if (mq.matches && !dialogTapEnabled) {
        if (dialogueBox && typeof dialogueBox.addEventListener === 'function') {
            dialogueBox.addEventListener('click', dialogueTapHandler);
            dialogueBox.addEventListener('touchend', dialogueTapHandler, { passive: true });
            dialogTapEnabled = true;
            dialogueBox.classList.add('mobile-character-in-dialogue');
        }
    } else if (!mq.matches && dialogTapEnabled) {
        if (dialogueBox && typeof dialogueBox.removeEventListener === 'function') {
            dialogueBox.removeEventListener('click', dialogueTapHandler);
            dialogueBox.removeEventListener('touchend', dialogueTapHandler);
            dialogTapEnabled = false;
            dialogueBox.classList.remove('mobile-character-in-dialogue');
        }
    }
}

function dialogueTapHandler(e) {
    // Ignore taps on controls (like the next button) if they exist
    const path = e.composedPath && e.composedPath();
    if (path) {
        for (const el of path) {
            if (el && el.id === 'next-btn') return;
        }
    }
    // Debounce accidental double taps
    if (tapTimeout) return;
    tapTimeout = setTimeout(() => { tapTimeout = null; }, 250);
    nextLine();
}


// Debounced resize to avoid rapid toggles
let resizeTimer = null;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        enableDialogTap();
    }, 120);
});

// Start overlay handling
const startOverlay = document.getElementById('start-overlay');
function startGame() {
    if (startOverlay) startOverlay.classList.add('hidden');
    // Attempt to start audio immediately on user gesture (no delay)
    playBgAudioNow();
    // initialize interactivity after start
    // keep a small delay so CSS transitions can play
    const container = document.querySelector('.game-container');
    setTimeout(() => {
        if (container) container.classList.add('vn-started');
        // start from the very beginning
        gameStarted = true;
        currentLine = 0;
        enableDialogTap();
        if (dialogueBox && typeof dialogueBox.focus === 'function') dialogueBox.focus();
        showLine(0);
        // Ensure audio is running (in case decode finished after initial attempt)
        playBgAudioNow();
        // keep overlay out of tab flow
        if (startOverlay) startOverlay.setAttribute('aria-hidden', 'true');
    }, 220);
}

if (startOverlay) {
    startOverlay.addEventListener('click', startGame);
    startOverlay.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') startGame();
    });
} else {
    // fallback: start immediately
    startGame();
}

// Begin audio preload as early as possible so playback is instant when user taps Play
initAudioPreload();
