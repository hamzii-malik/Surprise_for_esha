/**
 * ROMANTIC BIRTHDAY SURPRISE - SCRIPT ENGINE
 * Handles scene navigation, interactive heart trails, starry background,
 * 3x3 card flip game, audio synth melody, confetti & cake interactions.
 */

document.addEventListener('DOMContentLoaded', () => {

  // Migrate previous Aiman default to Esha
  const storedRecipient = localStorage.getItem('bday_recipient');
  const storedWelcome = localStorage.getItem('bday_welcome_title');
  if (!storedRecipient || storedRecipient === 'Aiman') {
    localStorage.setItem('bday_recipient', 'Esha');
  }
  if (!storedWelcome || storedWelcome === 'Happy Birthday' || storedWelcome === 'Happy Birthday Aiman' || storedWelcome === 'Happy Birthday Esha') {
    localStorage.setItem('bday_welcome_title', 'Happy Birthday Jaan');
  }

  const defaultEshaLetter = `Happy Birthday to the person who has quietly become one of the most beautiful parts of my life

I don’t think any “Happy Birthday” could ever be enough to explain what you mean to me. You are not just someone I love. You are my best friend my comfort, my favorite person and a feeling that somehow feels like home. Somewhere between our conversations, our laughter, our silly moments, our beautiful memories and even the difficult days you became a part of my heart in a way I never expected.

I often wonder how one person can become so important without even realizing when it happened. But with you it happened so naturally. You slowly became someone whose smile matters to me whose happiness matters to me and whose presence can make an ordinary day feel special.

If I could give you one gift today I would give you the ability to see yourself through my eyes just once. I wish you could see the person I see when I look at you. You would see someone incredibly precious someone whose smile can brighten my entire world and someone whose existence alone has given me countless beautiful memories.

The moon in me finds its sky in you. In your presence I feel complete as if every scattered piece of me somehow finds its place. If I could choose one place in this entire world to be forever I think I would choose wherever you are. I would dance with you hold you close and hug you until infinity because if there is one place where my heart feels at peace it is close to you.

Life is yours and death is mine.
Peace is yours and stress is mine.
Happiness is yours and sorrow is mine.
Everything beautiful is yours…
but you are mine. ❤️

And no matter how much life changes around us I hope you always remember that some people become a permanent part of your story. You are one of those people for me. Distance circumstances time and everything life brings may change many things but they cannot erase the memories we have created or the place you have made for yourself in my heart.

On your birthday I don’t just wish you happiness for today. I wish you a lifetime filled with reasons to smile. I wish you peaceful mornings beautiful surprises dreams that come true and people who remind you every day how precious you are. I hope life is gentle with your heart. I hope you achieve everything you secretly wish for. And whenever life feels heavy I hope you remember that you are stronger than you think and far more loved than you realize.

Thank you for being Esha.

Thank you for every smile.
Thank you for every conversation.
Thank you for every little moment that became special simply because you were there.
Thank you for becoming one of the most beautiful chapters of my life.

And most of all…

Thank you for being born.
Thank you for existing in this world.
Thank you for finding your way into my life.
And thank you for letting me love you. ❤️

As you turn another year older I hope you know that somewhere in this world there is someone who is genuinely grateful that you were born on this day.

Someone who looks at your happiness and feels happy.
Someone who remembers the little things about you.
Someone who carries your memories in his heart.
Someone who will always be grateful for having known you.

My love… my favorite person… my beautiful Esha…

May you always be happy even on the days when I’m not there to make you smile.

And if life ever makes you forget how loved you are then come back to this little page and read these words again.

Maybe I will never find words powerful enough to explain everything I feel for you. Maybe no letter could ever hold the depth of it.

But if there is one thing I hope you understand today it is this:

You are deeply loved.
You are incredibly precious.
And you will always have a very special place in my heart. ❤️

Happy Birthday, jan e jahan🎂❤️

The moon in me will always find its sky in you.`;

  const defaultSignature = '— From someone who loves you more than words can ever explain. ❤️';

  const storedLetter = localStorage.getItem('bday_letter');
  if (!storedLetter || storedLetter.includes('Aaj ka din meri life') || storedLetter.includes('Aiman')) {
    localStorage.setItem('bday_letter', defaultEshaLetter);
  }

  const storedSign = localStorage.getItem('bday_signature');
  if (!storedSign || storedSign === 'Your Hubby' || storedSign.includes('Hubby')) {
    localStorage.setItem('bday_signature', defaultSignature);
  localStorage.setItem('bday_passcode', '1010');
  localStorage.setItem('bday_passcode_hint', 'Hint: Try 1010 ❤️');

  // ==================== STATE & CONFIG ====================
  const state = {
    currentScene: 1,
    totalScenes: 6,
    revealedCards: new Set(),
    isCandleBlown: false,
    musicPlaying: false,
    audioCtx: null,
    melodyInterval: null,
    recipientName: localStorage.getItem('bday_recipient') || 'Esha',
    senderSignature: localStorage.getItem('bday_signature') || defaultSignature,
    welcomeTitle: localStorage.getItem('bday_welcome_title') || 'Happy Birthday Jaan',
    letterContent: localStorage.getItem('bday_letter') || defaultEshaLetter,
    secretPasscode: '1010',
    passcodeHint: 'Hint: Try 1010 ❤️'
  };

  // ==================== INITIALIZE PERSONALIZED DATA ====================
  function applyPersonalization() {
    const disp1 = document.getElementById('display-name-1');
    if (disp1) disp1.textContent = state.recipientName;

    const signEl = document.getElementById('letter-signature');
    if (signEl) {
      signEl.textContent = state.senderSignature;
    }

    const inputName = document.getElementById('input-recipient-name');
    if (inputName) inputName.value = state.recipientName;

    const inputSign = document.getElementById('input-sender-signature');
    if (inputSign) inputSign.value = state.senderSignature;

    const inputWelcome = document.getElementById('input-welcome-title');
    if (inputWelcome) inputWelcome.value = state.welcomeTitle;

    const inputPasscode = document.getElementById('input-secret-passcode');
    if (inputPasscode) inputPasscode.value = state.secretPasscode;

    const inputHint = document.getElementById('input-passcode-hint');
    if (inputHint) inputHint.value = state.passcodeHint;

    const hintDisplay = document.getElementById('pin-hint-display');
    if (hintDisplay) hintDisplay.textContent = state.passcodeHint;

    if (state.letterContent) {
      const letterBody = document.getElementById('love-letter-content');
      if (letterBody) {
        letterBody.innerHTML = state.letterContent
          .split('\n\n')
          .filter(Boolean)
          .map(para => {
            const trimmed = para.trim();
            const withBreaks = trimmed.replace(/\n/g, '<br>');
            if (trimmed.startsWith('Thank you for being Esha') || trimmed.startsWith('Happy Birthday, jan e jahan') || trimmed.startsWith('My love… my favorite person')) {
              return `<p class="love-emphasis">${withBreaks}</p>`;
            }
            return `<p>${withBreaks}</p>`;
          })
          .join('');
      }
      const inputLetter = document.getElementById('input-letter-text');
      if (inputLetter) inputLetter.value = state.letterContent;
    }
  }
  applyPersonalization();

  // ==================== SCENE NAVIGATION ====================
  function goToScene(sceneNum) {
    if (sceneNum < 1 || sceneNum > state.totalScenes) return;
    
    // Play transition chime
    playTone(523.25, 0.15, 'sine', 0.05); // C5
    setTimeout(() => playTone(659.25, 0.2, 'sine', 0.05), 100); // E5

    // Hide active scene
    const currentEl = document.getElementById(`scene-${state.currentScene}`);
    if (currentEl) {
      currentEl.classList.remove('active');
    }

    state.currentScene = sceneNum;

    // Show new scene
    const newEl = document.getElementById(`scene-${state.currentScene}`);
    if (newEl) {
      newEl.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Update Stepper Dots
    document.querySelectorAll('.step-dot').forEach(dot => {
      const step = parseInt(dot.getAttribute('data-step'), 10);
      dot.classList.toggle('active', step === state.currentScene);
    });

    // Special trigger for scene 1 typing
    if (sceneNum === 1) {
      startTypingEffect();
    }
  }

  // Stepper dot clicks
  document.querySelectorAll('.step-dot').forEach(dot => {
    dot.addEventListener('click', () => {
      const targetStep = parseInt(dot.getAttribute('data-step'), 10);
      goToScene(targetStep);
    });
  });

  // Action buttons to next scenes
  document.getElementById('btn-to-scene-2')?.addEventListener('click', () => goToScene(2));
  document.getElementById('btn-to-scene-3')?.addEventListener('click', () => goToScene(3));
  document.getElementById('btn-to-scene-4')?.addEventListener('click', () => goToScene(4));
  document.getElementById('btn-to-scene-5')?.addEventListener('click', () => goToScene(5));
  document.getElementById('btn-to-scene-6')?.addEventListener('click', () => goToScene(6));

  // ==================== SCENE 1: TYPING EFFECT ====================
  let typingTimeout = null;
  function startTypingEffect() {
    const textEl = document.getElementById('welcome-typing-text');
    if (!textEl) return;
    
    const fullText = state.welcomeTitle;
    textEl.textContent = '';
    let charIdx = 0;
    
    if (typingTimeout) clearTimeout(typingTimeout);

    function typeChar() {
      if (charIdx < fullText.length) {
        textEl.textContent += fullText.charAt(charIdx);
        charIdx++;
        typingTimeout = setTimeout(typeChar, 100);
      }
    }
    typeChar();
  }
  startTypingEffect();

  // ==================== SCENE 4: 3x3 FLIP CARD GAME ====================
  const flipCards = document.querySelectorAll('.flip-card');
  const progressFill = document.getElementById('special-progress-fill');
  const progressLabel = document.getElementById('special-progress-label');

  flipCards.forEach(card => {
    card.addEventListener('click', () => {
      const cardId = card.getAttribute('data-id');
      const isFlipped = card.classList.contains('flipped');

      if (!isFlipped) {
        card.classList.add('flipped');
        state.revealedCards.add(cardId);
        
        // Play sweet sparkle sound
        playCardSparkle();

        // Update progress
        updateProgress();

        // Check if all revealed
        if (state.revealedCards.size === 9) {
          triggerCardFireworks();
        }
      } else {
        // Allow flipping back if user wants to play again
        card.classList.remove('flipped');
        state.revealedCards.delete(cardId);
        updateProgress();
      }
    });
  });

  function updateProgress() {
    const count = state.revealedCards.size;
    const percentage = (count / 9) * 100;
    if (progressFill) progressFill.style.width = `${percentage}%`;
    if (progressLabel) {
      if (count === 9) {
        progressLabel.textContent = `All 9 Revealed! You're The Best! 🎉`;
      } else {
        progressLabel.textContent = `${count} of 9 Revealed`;
      }
    }
  }

  // ==================== SCENE 5 & MODAL: SECRET & CAKE ====================
  const secretModal = document.getElementById('secret-modal');
  const openSecretBtn = document.getElementById('btn-open-secret');
  const closeSecretBtn = document.getElementById('close-secret-btn');
  const cakeFlame = document.getElementById('cake-flame');
  const candleSmoke = document.getElementById('candle-smoke');
  const wishStatus = document.getElementById('wish-status');
  const revealedPromise = document.getElementById('revealed-promise');
  const replayBtn = document.getElementById('btn-replay-journey');

  if (openSecretBtn && secretModal) {
    openSecretBtn.addEventListener('click', () => {
      secretModal.classList.add('active');
    });
  }

  if (closeSecretBtn && secretModal) {
    closeSecretBtn.addEventListener('click', () => {
      secretModal.classList.remove('active');
    });
  }

  // Blow out candle interaction
  const birthdayCake = document.getElementById('birthday-cake');
  if (birthdayCake) {
    birthdayCake.addEventListener('click', blowOutCandle);
  }

  function blowOutCandle() {
    if (state.isCandleBlown) return;
    state.isCandleBlown = true;

    // Extinguish flame & show smoke puff
    if (cakeFlame) cakeFlame.classList.add('blown-out');
    if (candleSmoke) candleSmoke.classList.add('puff');

    // Play pleasant magic chime
    playCelebrationFanfare();

    // Trigger full confetti shower
    launchConfetti();

    // Update status text
    if (wishStatus) {
      wishStatus.innerHTML = `<span class="status-badge" style="background: rgba(34, 197, 94, 0.2); border-color: rgba(34, 197, 94, 0.4); color: #86efac;">
        🎉 Wish Made! May all your dreams come true! ✨
      </span>`;
    }

    // Reveal hidden promise card
    setTimeout(() => {
      if (revealedPromise) {
        revealedPromise.classList.remove('hidden');
      }
    }, 600);
  }

  // Replay journey button
  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      if (secretModal) secretModal.classList.remove('active');
      goToScene(1);
    });
  }

  // ==================== SCENE 6: ONE SECRET LEFT (PASSCODE KEYPAD) ====================
  let enteredPin = '';
  const pinDots = document.querySelectorAll('.pin-dot');
  const pinStatus = document.getElementById('pin-status');
  const keypadCard = document.getElementById('keypad-card');
  const numKeys = document.querySelectorAll('.num-key');
  const btnShowHint = document.getElementById('btn-show-hint');
  const pinHintDisplay = document.getElementById('pin-hint-display');

  function updatePinDots() {
    pinDots.forEach((dot, idx) => {
      dot.classList.toggle('filled', idx < enteredPin.length);
    });
  }

  function handleKeyInput(key) {
    if (state.currentScene !== 6) return;

    if (key >= '0' && key <= '9') {
      if (enteredPin.length < 4) {
        enteredPin += key;
        playTone(600 + enteredPin.length * 60, 0.08, 'sine', 0.04);
        updatePinDots();
        if (pinStatus) pinStatus.textContent = '';

        if (enteredPin.length === 4) {
          // Auto verify after brief moment
          setTimeout(verifyPinCode, 200);
        }
      }
    } else if (key === 'backspace' || key === 'Backspace') {
      if (enteredPin.length > 0) {
        enteredPin = enteredPin.slice(0, -1);
        playTone(400, 0.06, 'sine', 0.04);
        updatePinDots();
        if (pinStatus) pinStatus.textContent = '';
      }
    } else if (key === 'enter' || key === 'Enter') {
      verifyPinCode();
    }
  }

  function verifyPinCode() {
    if (enteredPin.length === 0) return;

    if (enteredPin === '1010' || enteredPin === state.secretPasscode) {
      // SUCCESS!
      if (pinStatus) {
        pinStatus.textContent = 'UNLOCKED! 💖';
        pinStatus.style.color = '#4ade80';
        pinStatus.style.textShadow = '0 0 10px rgba(74, 222, 128, 0.6)';
      }
      playCelebrationFanfare();
      launchConfetti();

      // Animate gift box
      const giftBox = document.getElementById('secret-gift-box');
      if (giftBox) {
        giftBox.style.transform = 'scale(1.25) rotate(10deg)';
        giftBox.style.transition = 'transform 0.4s ease';
      }

      setTimeout(() => {
        if (secretModal) {
          secretModal.classList.add('active');
        }
      }, 700);
    } else {
      // INCORRECT PIN
      if (pinStatus) {
        pinStatus.textContent = 'TRY AGAIN ❌';
        pinStatus.style.color = '#f43f5e';
        pinStatus.style.textShadow = '0 0 10px rgba(244, 63, 94, 0.6)';
      }
      playTone(220, 0.25, 'sawtooth', 0.06);

      if (keypadCard) {
        keypadCard.classList.remove('shake-anim');
        void keypadCard.offsetWidth; // trigger reflow
        keypadCard.classList.add('shake-anim');
      }

      // Reset entered PIN
      setTimeout(() => {
        enteredPin = '';
        updatePinDots();
      }, 600);
    }
  }

  // Keypad button clicks
  numKeys.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-key');
      handleKeyInput(key);
    });
  });

  // Physical keyboard support
  window.addEventListener('keydown', (e) => {
    if (state.currentScene === 6) {
      if ((e.key >= '0' && e.key <= '9') || e.key === 'Backspace' || e.key === 'Enter') {
        handleKeyInput(e.key);
      }
    }
  });

  // Hint button toggle
  if (btnShowHint && pinHintDisplay) {
    btnShowHint.addEventListener('click', () => {
      pinHintDisplay.classList.toggle('hidden');
    });
  }

  // ==================== PHOTO LIGHTBOX ====================
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeLightboxBtn = document.getElementById('close-lightbox-btn');

  const photoCards = document.querySelectorAll('.photo-card');
  photoCards.forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('img');
      const tag = card.querySelector('.photo-hover-tag');
      if (img && lightboxImg && lightboxModal) {
        lightboxImg.src = img.src;
        if (lightboxCaption && tag) {
          lightboxCaption.textContent = tag.textContent;
        }
        lightboxModal.classList.add('active');
        playTone(440, 0.1, 'sine', 0.04);
      }
    });
  });

  if (closeLightboxBtn && lightboxModal) {
    closeLightboxBtn.addEventListener('click', () => {
      lightboxModal.classList.remove('active');
    });
  }

  // ==================== SHARE & QR CODE MODAL ====================
  const shareModal = document.getElementById('share-modal');
  const shareQrBtn = document.getElementById('share-qr-btn');
  const closeShareBtn = document.getElementById('close-share-btn');
  const shareUrlInput = document.getElementById('share-url-input');
  const qrCodeImg = document.getElementById('qr-code-img');
  const btnCopyLink = document.getElementById('btn-copy-link');
  const copySuccessMsg = document.getElementById('copy-success-msg');

  function updateQrCode(url) {
    if (!url) url = window.location.href;
    if (qrCodeImg) {
      qrCodeImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=10&data=${encodeURIComponent(url)}`;
    }
  }

  if (shareQrBtn && shareModal) {
    shareQrBtn.addEventListener('click', () => {
      const savedLiveUrl = localStorage.getItem('bday_live_url');
      const fallbackUrl = window.location.hostname === 'localhost' ? '' : window.location.href;
      const currentUrl = savedLiveUrl || fallbackUrl;
      
      if (shareUrlInput) {
        shareUrlInput.value = currentUrl;
      }
      updateQrCode(currentUrl || window.location.href);
      shareModal.classList.add('active');
      playTone(523.25, 0.1, 'sine', 0.04);
    });
  }

  if (closeShareBtn && shareModal) {
    closeShareBtn.addEventListener('click', () => {
      shareModal.classList.remove('active');
    });
  }

  if (shareUrlInput) {
    shareUrlInput.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      localStorage.setItem('bday_live_url', val);
      updateQrCode(val || window.location.href);
    });
  }

  if (btnCopyLink && shareUrlInput) {
    btnCopyLink.addEventListener('click', () => {
      const val = shareUrlInput.value.trim() || window.location.href;
      navigator.clipboard.writeText(val).then(() => {
        if (copySuccessMsg) {
          copySuccessMsg.classList.remove('hidden');
          setTimeout(() => copySuccessMsg.classList.add('hidden'), 2500);
        }
        playTone(659.25, 0.12, 'sine', 0.05);
      });
    });
  }

  // Close modals on clicking outside backdrop
  [secretModal, lightboxModal, shareModal].forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
      });
    }
  });

  // ==================== PERSONALIZATION MODAL ====================
  const customizerModal = document.getElementById('customizer-modal');
  const customizeBtn = document.getElementById('customize-btn');
  const closeCustomizerBtn = document.getElementById('close-customizer-btn');
  const customizerForm = document.getElementById('customizer-form');

  if (customizeBtn && customizerModal) {
    customizeBtn.addEventListener('click', () => {
      customizerModal.classList.add('active');
    });
  }

  if (closeCustomizerBtn && customizerModal) {
    closeCustomizerBtn.addEventListener('click', () => {
      customizerModal.classList.remove('active');
    });
  }

  if (customizerForm) {
    customizerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const newRecipient = document.getElementById('input-recipient-name')?.value.trim();
      const newSignature = document.getElementById('input-sender-signature')?.value.trim();
      const newWelcome = document.getElementById('input-welcome-title')?.value.trim();
      const newLetter = document.getElementById('input-letter-text')?.value.trim();
      const newPasscode = document.getElementById('input-secret-passcode')?.value.trim();
      const newHint = document.getElementById('input-passcode-hint')?.value.trim();

      if (newRecipient) {
        state.recipientName = newRecipient;
        localStorage.setItem('bday_recipient', newRecipient);
      }
      if (newSignature) {
        state.senderSignature = newSignature;
        localStorage.setItem('bday_signature', newSignature);
      }
      if (newWelcome) {
        state.welcomeTitle = newWelcome;
        localStorage.setItem('bday_welcome_title', newWelcome);
      }
      if (newLetter) {
        state.letterContent = newLetter;
        localStorage.setItem('bday_letter', newLetter);
      }
      if (newPasscode) {
        state.secretPasscode = newPasscode;
        localStorage.setItem('bday_passcode', newPasscode);
      }
      if (newHint) {
        state.passcodeHint = newHint;
        localStorage.setItem('bday_passcode_hint', newHint);
      }

      applyPersonalization();
      startTypingEffect();
      if (customizerModal) customizerModal.classList.remove('active');
      
      // Sweet notification chime
      playCelebrationFanfare();
    });
  }

  // ==================== INTERACTIVE HEART TRAIL (CANVAS) ====================
  const heartCanvas = document.getElementById('heart-trail-canvas');
  let heartCtx = null;
  let heartParticles = [];

  if (heartCanvas) {
    heartCtx = heartCanvas.getContext('2d');
    
    function resizeHeartCanvas() {
      heartCanvas.width = window.innerWidth;
      heartCanvas.height = window.innerHeight;
    }
    resizeHeartCanvas();
    window.addEventListener('resize', resizeHeartCanvas);

    class HeartParticle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 12 + 10;
        this.opacity = 1;
        this.fadeSpeed = Math.random() * 0.02 + 0.015;
        this.speedX = (Math.random() - 0.5) * 1.5;
        this.speedY = -Math.random() * 2 - 0.8;
        this.rotation = (Math.random() - 0.5) * 0.5;
        // Warm romantic pinks, corals, magentas
        const colors = [
          'rgba(244, 114, 182, ',
          'rgba(251, 113, 133, ',
          'rgba(255, 94, 156, ',
          'rgba(125, 211, 252, '
        ];
        this.colorPrefix = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.opacity -= this.fadeSpeed;
      }

      draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.fillStyle = `${this.colorPrefix}${Math.max(0, this.opacity)})`;
        ctx.shadowColor = 'rgba(255, 105, 180, 0.7)';
        ctx.shadowBlur = 8;
        
        // Draw heart shape
        const s = this.size;
        ctx.beginPath();
        const topCurveHeight = s * 0.3;
        ctx.moveTo(0, topCurveHeight);
        // top left curve
        ctx.bezierCurveTo(-s / 2, -topCurveHeight, -s, topCurveHeight, 0, s);
        // top right curve
        ctx.bezierCurveTo(s, topCurveHeight, s / 2, -topCurveHeight, 0, topCurveHeight);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
    }

    let lastHeartSpawn = 0;
    function addHearts(x, y) {
      const now = performance.now();
      if (now - lastHeartSpawn > 45) { // throttle spawn
        heartParticles.push(new HeartParticle(x, y));
        if (Math.random() > 0.5) {
          heartParticles.push(new HeartParticle(x + (Math.random() - 0.5) * 10, y + (Math.random() - 0.5) * 10));
        }
        lastHeartSpawn = now;
      }
    }

    // Mouse movement trail
    window.addEventListener('mousemove', (e) => {
      addHearts(e.clientX, e.clientY);
    });

    // Touch screen trail
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        addHearts(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    function animateHearts() {
      heartCtx.clearRect(0, 0, heartCanvas.width, heartCanvas.height);
      for (let i = heartParticles.length - 1; i >= 0; i--) {
        const p = heartParticles[i];
        p.update();
        p.draw(heartCtx);
        if (p.opacity <= 0) {
          heartParticles.splice(i, 1);
        }
      }
      requestAnimationFrame(animateHearts);
    }
    animateHearts();
  }

  // ==================== STARRY NIGHT BACKGROUND (CANVAS) ====================
  const starCanvas = document.getElementById('star-canvas');
  if (starCanvas) {
    const starCtx = starCanvas.getContext('2d');
    let stars = [];

    function initStars() {
      starCanvas.width = window.innerWidth;
      starCanvas.height = window.innerHeight;
      stars = [];
      const numStars = Math.floor((window.innerWidth * window.innerHeight) / 4500);

      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * starCanvas.width,
          y: Math.random() * starCanvas.height,
          radius: Math.random() * 1.5 + 0.4,
          baseAlpha: Math.random() * 0.7 + 0.3,
          twinkleSpeed: Math.random() * 0.03 + 0.01,
          phase: Math.random() * Math.PI * 2
        });
      }
    }
    initStars();
    window.addEventListener('resize', initStars);

    function animateStars() {
      starCtx.clearRect(0, 0, starCanvas.width, starCanvas.height);
      const now = performance.now() * 0.001;

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        const alpha = s.baseAlpha + Math.sin(now * 3 + s.phase) * 0.3;
        starCtx.beginPath();
        starCtx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        starCtx.fillStyle = `rgba(224, 242, 254, ${Math.max(0.1, Math.min(1, alpha))})`;
        starCtx.shadowColor = '#38bdf8';
        starCtx.shadowBlur = s.radius > 1.2 ? 6 : 0;
        starCtx.fill();
      }
      requestAnimationFrame(animateStars);
    }
    animateStars();
  }

  // ==================== CONFETTI PARTICLES ENGINE ====================
  const confettiCanvas = document.getElementById('confetti-canvas');
  let confettiCtx = null;
  let confettiPieces = [];
  let confettiAnimId = null;

  if (confettiCanvas) {
    confettiCtx = confettiCanvas.getContext('2d');
    function resizeConfetti() {
      confettiCanvas.width = window.innerWidth;
      confettiCanvas.height = window.innerHeight;
    }
    resizeConfetti();
    window.addEventListener('resize', resizeConfetti);

    class ConfettiPiece {
      constructor(x, y) {
        this.x = x || Math.random() * confettiCanvas.width;
        this.y = y || -20;
        this.size = Math.random() * 9 + 6;
        this.speedY = Math.random() * 4 + 2;
        this.speedX = (Math.random() - 0.5) * 5;
        this.rotation = Math.random() * 360;
        this.rotSpeed = (Math.random() - 0.5) * 8;
        this.colors = ['#38bdf8', '#f472b6', '#facc15', '#60a5fa', '#f43f5e', '#a855f7', '#ffffff'];
        this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
        this.opacity = 1;
      }
      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.rotation += this.rotSpeed;
        if (this.y > confettiCanvas.height) {
          this.opacity -= 0.05;
        }
      }
      draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = Math.max(0, this.opacity);
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.6);
        ctx.restore();
      }
    }

    function runConfettiLoop() {
      confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      for (let i = confettiPieces.length - 1; i >= 0; i--) {
        const c = confettiPieces[i];
        c.update();
        c.draw(confettiCtx);
        if (c.opacity <= 0) {
          confettiPieces.splice(i, 1);
        }
      }
      if (confettiPieces.length > 0) {
        confettiAnimId = requestAnimationFrame(runConfettiLoop);
      } else {
        cancelAnimationFrame(confettiAnimId);
        confettiAnimId = null;
      }
    }

    window.launchConfetti = function() {
      for (let i = 0; i < 180; i++) {
        confettiPieces.push(new ConfettiPiece());
      }
      if (!confettiAnimId) {
        runConfettiLoop();
      }
    };
  }

  function triggerCardFireworks() {
    if (window.launchConfetti) window.launchConfetti();
    playCelebrationFanfare();
  }

  // ==================== WEB AUDIO API (ROMANTIC MELODY & SOUND FX) ====================
  function getAudioContext() {
    if (!state.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      state.audioCtx = new AudioContext();
    }
    if (state.audioCtx.state === 'suspended') {
      state.audioCtx.resume();
    }
    return state.audioCtx;
  }

  function playTone(freq, duration, type = 'sine', volume = 0.08) {
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio might be blocked until gesture
    }
  }

  function playCardSparkle() {
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      setTimeout(() => playTone(freq, 0.25, 'sine', 0.05), i * 65);
    });
  }

  function playCelebrationFanfare() {
    const notes = [
      { f: 523.25, d: 0.15 }, // C5
      { f: 659.25, d: 0.15 }, // E5
      { f: 783.99, d: 0.2 },  // G5
      { f: 1046.50, d: 0.4 }, // C6
      { f: 880.00, d: 0.2 },  // A5
      { f: 1046.50, d: 0.6 }  // C6
    ];
    let time = 0;
    notes.forEach(n => {
      setTimeout(() => playTone(n.f, n.d, 'triangle', 0.08), time);
      time += n.d * 750;
    });
  }

  // Romantic Lofi Melody Loop (Synthesized gentle music box / acoustic bells)
  const melodyNotes = [
    // Canon-like calming sweet sequence
    { note: 523.25, dur: 0.5 }, // C5
    { note: 659.25, dur: 0.5 }, // E5
    { note: 783.99, dur: 0.6 }, // G5
    { note: 659.25, dur: 0.4 }, // E5
    { note: 880.00, dur: 0.7 }, // A5
    { note: 783.99, dur: 0.5 }, // G5
    { note: 659.25, dur: 0.5 }, // E5
    { note: 587.33, dur: 0.8 }, // D5
    { note: 523.25, dur: 0.5 }, // C5
    { note: 587.33, dur: 0.5 }, // D5
    { note: 659.25, dur: 0.6 }, // E5
    { note: 523.25, dur: 0.8 }  // C5
  ];

  let melodyStep = 0;
  function startRomanticMelody() {
    state.musicPlaying = true;
    const waves = document.getElementById('music-waves');
    if (waves) waves.classList.add('playing');

    getAudioContext();

    function playNextMelodyNote() {
      if (!state.musicPlaying) return;
      const current = melodyNotes[melodyStep % melodyNotes.length];
      playTone(current.note, current.dur * 0.9, 'sine', 0.04);
      // Soft bass accompaniment on root notes
      if (melodyStep % 4 === 0) {
        playTone(current.note / 2, 0.8, 'triangle', 0.03);
      }
      melodyStep++;
      state.melodyInterval = setTimeout(playNextMelodyNote, current.dur * 900);
    }
    playNextMelodyNote();
  }

  function stopRomanticMelody() {
    state.musicPlaying = false;
    const waves = document.getElementById('music-waves');
    if (waves) waves.classList.remove('playing');
    if (state.melodyInterval) {
      clearTimeout(state.melodyInterval);
      state.melodyInterval = null;
    }
  }

  const musicToggleBtn = document.getElementById('music-toggle-btn');
  if (musicToggleBtn) {
    musicToggleBtn.addEventListener('click', () => {
      if (state.musicPlaying) {
        stopRomanticMelody();
      } else {
        startRomanticMelody();
      }
    });
  }

  // Auto-play romantic melody on first user interaction anywhere
  document.addEventListener('click', function startMusicOnce() {
    if (!state.musicPlaying) {
      startRomanticMelody();
    }
  }, { once: true });

  // ==================== ROMANTIC BACK HUG STORY MOTION CONTROLLER ====================
  function initBackHugStoryAnimation() {
    const f1 = document.getElementById('hug-f1');
    const f2 = document.getElementById('hug-f2');
    const f3 = document.getElementById('hug-f3');
    const container = document.getElementById('hero-animated-frame');
    const heartsContainer = document.getElementById('hug-hearts-container');

    if (!f1 || !f2 || !f3) return;

    let storyTimeout1 = null;
    let storyTimeout2 = null;
    let storyTimeout3 = null;

    function clearStoryTimeouts() {
      if (storyTimeout1) clearTimeout(storyTimeout1);
      if (storyTimeout2) clearTimeout(storyTimeout2);
      if (storyTimeout3) clearTimeout(storyTimeout3);
    }

    function burstHearts() {
      if (!heartsContainer) return;
      const icons = ['💖', '💕', '✨', '🌸', '❤️'];
      for (let i = 0; i < 10; i++) {
        setTimeout(() => {
          const heart = document.createElement('span');
          heart.className = 'hug-floating-heart';
          heart.innerText = icons[Math.floor(Math.random() * icons.length)];
          heart.style.left = `${35 + Math.random() * 45}%`;
          heart.style.top = `${35 + Math.random() * 45}%`;
          heart.style.fontSize = `${1.1 + Math.random() * 0.9}rem`;
          heartsContainer.appendChild(heart);
          setTimeout(() => heart.remove(), 2500);
        }, i * 110);
      }
    }

    function playSequence() {
      clearStoryTimeouts();

      // Phase 1: Girl is standing quietly by the window
      f1.classList.add('active');
      f2.classList.remove('active');
      f3.classList.remove('active');

      // Phase 2: Boy walks up from behind her
      storyTimeout1 = setTimeout(() => {
        f2.classList.add('active');
      }, 2200);

      // Phase 3: Boy wraps arms around her and gives romantic back hug
      storyTimeout2 = setTimeout(() => {
        f3.classList.add('active');
        burstHearts();
      }, 4200);

      // Phase 4: Savor the hug, then loop naturally
      storyTimeout3 = setTimeout(() => {
        playSequence();
      }, 8800);
    }

    // Start story sequence
    playSequence();

    if (container) {
      container.addEventListener('click', () => {
        playSequence();
      });
    }
  }

  initBackHugStoryAnimation();

  // ==================== FINAL SCENE ROMANTIC KISS MOTION CONTROLLER ====================
  function initFinalKissStoryAnimation() {
    const f1 = document.getElementById('kiss-f1');
    const f2 = document.getElementById('kiss-f2');
    const f3 = document.getElementById('kiss-f3');
    const container = document.getElementById('final-animated-frame');
    const heartsContainer = document.getElementById('kiss-hearts-container');

    if (!f1 || !f2 || !f3) return;

    let storyTimeout1 = null;
    let storyTimeout2 = null;
    let storyTimeout3 = null;

    function clearStoryTimeouts() {
      if (storyTimeout1) clearTimeout(storyTimeout1);
      if (storyTimeout2) clearTimeout(storyTimeout2);
      if (storyTimeout3) clearTimeout(storyTimeout3);
    }

    function burstKissHearts() {
      if (!heartsContainer) return;
      const icons = ['💖', '✨', '⭐', '🌙', '💕', '🥰'];
      for (let i = 0; i < 10; i++) {
        setTimeout(() => {
          const heart = document.createElement('span');
          heart.className = 'hug-floating-heart';
          heart.innerText = icons[Math.floor(Math.random() * icons.length)];
          heart.style.left = `${35 + Math.random() * 45}%`;
          heart.style.top = `${30 + Math.random() * 50}%`;
          heart.style.fontSize = `${1.1 + Math.random() * 0.9}rem`;
          heartsContainer.appendChild(heart);
          setTimeout(() => heart.remove(), 2500);
        }, i * 110);
      }
    }

    function playKissSequence() {
      clearStoryTimeouts();

      // Phase 1: Holding hands / forehead touch under stars
      f1.classList.add('active');
      f2.classList.remove('active');
      f3.classList.remove('active');

      // Phase 2: Leaning in close, caressing cheek
      storyTimeout1 = setTimeout(() => {
        f2.classList.add('active');
      }, 2200);

      // Phase 3: Romantic kiss under starlight
      storyTimeout2 = setTimeout(() => {
        f3.classList.add('active');
        burstKissHearts();
      }, 4200);

      // Phase 4: Savor kiss, then repeat loop
      storyTimeout3 = setTimeout(() => {
        playKissSequence();
      }, 8800);
    }

    // Start sequence
    playKissSequence();

    if (container) {
      container.addEventListener('click', () => {
        playKissSequence();
      });
    }
  }

  initFinalKissStoryAnimation();

});
