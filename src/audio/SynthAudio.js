/**
 * SynthAudio - Sistema de audio sintetizado para EigenLab Odyssey
 *
 * Usa Web Audio API para generar sonidos procedurales.
 * No requiere archivos de audio externos.
 *
 * M7.1: Añadido sistema de temas por reino y música adaptativa
 */

// Escalas musicales por reino (intervalos desde la tónica)
const REALM_SCALES = {
    aether:  [0, 2, 4, 5, 7, 9, 11],      // Mayor (Jónico) - armonía perfecta
    cosmos:  [0, 2, 3, 5, 7, 8, 10],      // Menor natural - misterioso
    chaos:   [0, 1, 4, 5, 7, 8, 10],      // Frigio dominante - tensión
    logos:   [0, 2, 4, 6, 7, 9, 11],      // Lidio - brillante, matemático
    atomos:  [0, 2, 4, 5, 7, 9, 10],      // Mixolidio - físico, ondulatorio
    terra:   [0, 2, 3, 5, 7, 9, 10],      // Dórico - sólido, terrenal
    machina: [0, 2, 3, 5, 7, 8, 11],      // Menor armónica - mecánico
    alchemy: [0, 1, 4, 5, 6, 8, 10],      // Locrio + - inestable, alquímico
    bios:    [0, 2, 4, 5, 7, 9, 11],      // Mayor - vital, orgánico
    psyche:  [0, 3, 5, 6, 7, 10, 11]      // Blues + - introspectivo
};

// Configuración de ambiente por reino
const REALM_AMBIENCE = {
    aether:  { baseFreq: 220, tempo: 80, waveform: 'sine', reverb: 0.5, filterFreq: 2000 },
    cosmos:  { baseFreq: 110, tempo: 50, waveform: 'sine', reverb: 0.8, filterFreq: 800 },
    chaos:   { baseFreq: 165, tempo: 120, waveform: 'sawtooth', reverb: 0.3, filterFreq: 3000 },
    logos:   { baseFreq: 261, tempo: 72, waveform: 'triangle', reverb: 0.4, filterFreq: 4000 },
    atomos:  { baseFreq: 196, tempo: 90, waveform: 'sine', reverb: 0.6, filterFreq: 1500 },
    terra:   { baseFreq: 82, tempo: 40, waveform: 'triangle', reverb: 0.7, filterFreq: 600 },
    machina: { baseFreq: 130, tempo: 100, waveform: 'square', reverb: 0.2, filterFreq: 2500 },
    alchemy: { baseFreq: 146, tempo: 66, waveform: 'sawtooth', reverb: 0.5, filterFreq: 1800 },
    bios:    { baseFreq: 174, tempo: 60, waveform: 'sine', reverb: 0.6, filterFreq: 1200 },
    psyche:  { baseFreq: 138, tempo: 55, waveform: 'sine', reverb: 0.7, filterFreq: 1000 }
};

class SynthAudio {
    constructor() {
        this.context = null;
        this.masterGain = null;
        this.initialized = false;
        this.muted = false;
        this.volume = 0.5;

        // Pool de osciladores activos
        this.activeOscillators = new Map();

        // M7.1: Sistema de música por reino
        this.currentRealm = null;
        this.musicGain = null;
        this.musicNodes = [];
        this.musicInterval = null;
        this.arpeggiatorInterval = null;
    }

    /**
     * Inicializa el contexto de audio (debe llamarse tras interacción del usuario)
     */
    init() {
        if (this.initialized) return;

        try {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.context.createGain();
            this.masterGain.gain.value = this.volume;
            this.masterGain.connect(this.context.destination);
            this.initialized = true;
        } catch (e) {
            console.warn('Web Audio API no disponible:', e);
        }
    }

    /**
     * Resume el contexto si está suspendido
     */
    resume() {
        if (this.context && this.context.state === 'suspended') {
            this.context.resume();
        }
    }

    /**
     * Ajusta el volumen master
     */
    setVolume(value) {
        this.volume = Math.max(0, Math.min(1, value));
        if (this.masterGain) {
            this.masterGain.gain.value = this.muted ? 0 : this.volume;
        }
    }

    /**
     * Mute/unmute
     */
    toggleMute() {
        this.muted = !this.muted;
        if (this.masterGain) {
            this.masterGain.gain.value = this.muted ? 0 : this.volume;
        }
        return this.muted;
    }

    // ═══════════════════════════════════════════════════════════════
    // EFECTOS DE SONIDO
    // ═══════════════════════════════════════════════════════════════

    /**
     * Sonido de terminal - click de tecla
     */
    playKeyClick() {
        if (!this.initialized || this.muted) return;

        const osc = this.context.createOscillator();
        const gain = this.context.createGain();
        const now = this.context.currentTime;

        osc.type = 'square';
        osc.frequency.value = 800 + Math.random() * 200;

        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start();
        osc.stop(now + 0.05);
    }

    /**
     * Efecto de glitch/error
     */
    playGlitch(duration = 0.2) {
        if (!this.initialized || this.muted) return;

        const bufferSize = this.context.sampleRate * duration;
        const buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            // Ruido con modulación
            data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
        }

        const source = this.context.createBufferSource();
        const gain = this.context.createGain();
        const filter = this.context.createBiquadFilter();

        filter.type = 'bandpass';
        filter.frequency.value = 1000 + Math.random() * 2000;
        filter.Q.value = 10;

        source.buffer = buffer;
        gain.gain.value = 0.15;

        source.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        source.start();
    }

    /**
     * Sonido de cuerda vibrando (para la Lira)
     * @param {number} frequency - Frecuencia en Hz
     * @param {number} duration - Duración en segundos
     */
    playString(frequency = 440, duration = 2) {
        if (!this.initialized || this.muted) return;

        const fundamental = this.context.createOscillator();
        const harmonic2 = this.context.createOscillator();
        const harmonic3 = this.context.createOscillator();

        const gainNode = this.context.createGain();
        const filter = this.context.createBiquadFilter();

        // Forma de onda de cuerda pulsada (rico en armónicos)
        fundamental.type = 'triangle';
        harmonic2.type = 'sine';
        harmonic3.type = 'sine';

        fundamental.frequency.value = frequency;
        harmonic2.frequency.value = frequency * 2;
        harmonic3.frequency.value = frequency * 3;

        // Envolvente de cuerda pulsada
        const now = this.context.currentTime;
        gainNode.gain.setValueAtTime(0.3, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

        // Filtro que decae (simula la pérdida de armónicos)
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(4000, now);
        filter.frequency.exponentialRampToValueAtTime(500, now + duration);

        // Conectar
        const mixer = this.context.createGain();
        fundamental.connect(mixer);
        harmonic2.connect(mixer);
        harmonic3.connect(mixer);

        mixer.gain.value = 0.33;
        mixer.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.masterGain);

        fundamental.start();
        harmonic2.start();
        harmonic3.start();

        fundamental.stop(now + duration);
        harmonic2.stop(now + duration);
        harmonic3.stop(now + duration);
    }

    /**
     * Sonido de resonancia armónica (cuando se activa una cuerda simpática)
     */
    playResonance(frequency = 440) {
        if (!this.initialized || this.muted) return;

        const oscillators = [];
        const gains = [];

        // Crear múltiples osciladores para efecto de chorus
        for (let i = 0; i < 3; i++) {
            const osc = this.context.createOscillator();
            const gain = this.context.createGain();

            osc.type = 'sine';
            osc.frequency.value = frequency * (1 + (i - 1) * 0.002); // Slight detuning

            const now = this.context.currentTime;
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.15, now + 0.5);
            gain.gain.linearRampToValueAtTime(0, now + 3);

            osc.connect(gain);
            gain.connect(this.masterGain);

            osc.start();
            osc.stop(now + 3);

            oscillators.push(osc);
            gains.push(gain);
        }
    }

    /**
     * Sonido de UI hover
     */
    playHover() {
        if (!this.initialized || this.muted) return;

        const osc = this.context.createOscillator();
        const gain = this.context.createGain();
        const now = this.context.currentTime;

        osc.type = 'sine';
        osc.frequency.value = 600;

        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start();
        osc.stop(now + 0.15);
    }

    /**
     * Sonido de UI click/selección
     */
    playSelect() {
        if (!this.initialized || this.muted) return;

        const osc = this.context.createOscillator();
        const gain = this.context.createGain();
        const now = this.context.currentTime;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.linearRampToValueAtTime(800, now + 0.05);

        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start();
        osc.stop(now + 0.15);
    }

    /**
     * Sonido de portal/transición
     */
    playPortal() {
        if (!this.initialized || this.muted) return;

        const osc1 = this.context.createOscillator();
        const osc2 = this.context.createOscillator();
        const gain = this.context.createGain();
        const filter = this.context.createBiquadFilter();

        osc1.type = 'sine';
        osc2.type = 'sine';

        const now = this.context.currentTime;

        // Sweep ascendente
        osc1.frequency.setValueAtTime(200, now);
        osc1.frequency.exponentialRampToValueAtTime(800, now + 0.5);

        osc2.frequency.setValueAtTime(205, now);
        osc2.frequency.exponentialRampToValueAtTime(803, now + 0.5);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.15, now + 0.1);
        gain.gain.linearRampToValueAtTime(0, now + 0.6);

        filter.type = 'lowpass';
        filter.frequency.value = 2000;

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc1.start();
        osc2.start();
        osc1.stop(now + 0.6);
        osc2.stop(now + 0.6);
    }

    /**
     * Sonido de éxito/logro
     */
    playSuccess() {
        if (!this.initialized || this.muted) return;

        const notes = [523.25, 659.25, 783.99]; // C5, E5, G5 (acorde mayor)
        const now = this.context.currentTime;

        notes.forEach((freq, i) => {
            const osc = this.context.createOscillator();
            const gain = this.context.createGain();

            osc.type = 'sine';
            osc.frequency.value = freq;

            const startTime = now + i * 0.1;
            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(0.15, startTime + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.5);

            osc.connect(gain);
            gain.connect(this.masterGain);

            osc.start(startTime);
            osc.stop(startTime + 0.5);
        });
    }

    /**
     * Sonido del péndulo oscilando
     */
    playPendulumTick(pitch = 1) {
        if (!this.initialized || this.muted) return;

        const osc = this.context.createOscillator();
        const gain = this.context.createGain();
        const now = this.context.currentTime;

        osc.type = 'sine';
        osc.frequency.value = 200 * pitch;

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start();
        osc.stop(now + 0.15);
    }

    /**
     * Drone ambiental (fondo de la Catedral)
     */
    startAmbientDrone(frequency = 55) {
        if (!this.initialized) return null;

        const id = 'ambient_drone';
        if (this.activeOscillators.has(id)) return;

        const osc1 = this.context.createOscillator();
        const osc2 = this.context.createOscillator();
        const gain = this.context.createGain();
        const filter = this.context.createBiquadFilter();

        osc1.type = 'sine';
        osc2.type = 'sine';
        osc1.frequency.value = frequency;
        osc2.frequency.value = frequency * 1.5; // Quinta

        filter.type = 'lowpass';
        filter.frequency.value = 300;

        gain.gain.value = this.muted ? 0 : 0.05;

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc1.start();
        osc2.start();

        this.activeOscillators.set(id, { oscs: [osc1, osc2], gain });

        return id;
    }

    /**
     * Detiene un sonido continuo
     */
    stopContinuous(id) {
        const sound = this.activeOscillators.get(id);
        if (!sound) return;

        const now = this.context.currentTime;
        sound.gain.gain.linearRampToValueAtTime(0, now + 0.5);

        sound.oscs.forEach(osc => {
            osc.stop(now + 0.5);
        });

        this.activeOscillators.delete(id);
    }

    /**
     * Detiene todos los sonidos continuos
     */
    stopAll() {
        this.activeOscillators.forEach((sound, id) => {
            this.stopContinuous(id);
        });
    }

    // ═══════════════════════════════════════════════════════════════
    // UTILIDADES
    // ═══════════════════════════════════════════════════════════════

    /**
     * Convierte nota MIDI a frecuencia
     */
    midiToFreq(midi) {
        return 440 * Math.pow(2, (midi - 69) / 12);
    }

    /**
     * Frecuencias de las 12 cuerdas de la Lira
     */
    getLyraFrequencies() {
        // Afinación en quintas desde C3, como un dulcimer
        const baseNote = 48; // C3
        return Array.from({ length: 12 }, (_, i) => {
            return this.midiToFreq(baseNote + i * 7 % 12 + Math.floor(i * 7 / 12) * 12);
        });
    }

    // ═══════════════════════════════════════════════════════════════
    // M7.1: MÚSICA POR REINO
    // ═══════════════════════════════════════════════════════════════

    /**
     * Inicia la música ambiental de un reino
     */
    startRealmMusic(realm) {
        if (!this.initialized || this.muted) return;
        if (this.currentRealm === realm) return;

        // Detener música anterior con fade
        this.stopRealmMusic(true);

        this.currentRealm = realm;
        const config = REALM_AMBIENCE[realm] || REALM_AMBIENCE.aether;
        const scale = REALM_SCALES[realm] || REALM_SCALES.aether;

        // Crear nodo de ganancia para la música
        this.musicGain = this.context.createGain();
        this.musicGain.gain.value = 0;
        this.musicGain.connect(this.masterGain);

        // Fade in
        this.musicGain.gain.linearRampToValueAtTime(0.08, this.context.currentTime + 2);

        // Drone base (tónica + quinta)
        this.startRealmDrone(config, scale);

        // Arpegiador generativo
        this.startArpeggiator(config, scale);
    }

    /**
     * Drone ambiental del reino
     */
    startRealmDrone(config, scale) {
        const baseFreq = config.baseFreq;

        // Tónica
        const osc1 = this.context.createOscillator();
        osc1.type = config.waveform;
        osc1.frequency.value = baseFreq;

        // Quinta
        const osc2 = this.context.createOscillator();
        osc2.type = 'sine';
        osc2.frequency.value = baseFreq * 1.5;

        // Octava baja (sub)
        const osc3 = this.context.createOscillator();
        osc3.type = 'sine';
        osc3.frequency.value = baseFreq / 2;

        // Filtro
        const filter = this.context.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = config.filterFreq;
        filter.Q.value = 1;

        // Mezclar
        const droneGain = this.context.createGain();
        droneGain.gain.value = 0.15;

        osc1.connect(droneGain);
        osc2.connect(droneGain);
        osc3.connect(droneGain);
        droneGain.connect(filter);
        filter.connect(this.musicGain);

        osc1.start();
        osc2.start();
        osc3.start();

        this.musicNodes.push(osc1, osc2, osc3, droneGain, filter);
    }

    /**
     * Arpegiador generativo
     */
    startArpeggiator(config, scale) {
        const baseFreq = config.baseFreq;
        const interval = (60 / config.tempo) * 1000; // ms por beat

        let noteIndex = 0;
        let direction = 1;

        this.arpeggiatorInterval = setInterval(() => {
            if (this.muted || !this.musicGain) return;

            // Seleccionar nota de la escala
            const scaleNote = scale[noteIndex % scale.length];
            const octave = Math.floor(noteIndex / scale.length);
            const freq = baseFreq * Math.pow(2, (scaleNote + octave * 12) / 12);

            // Tocar nota corta
            this.playArpNote(freq, config.waveform, 0.1 + Math.random() * 0.1);

            // Movimiento en la escala (aleatorio pero musical)
            if (Math.random() < 0.3) {
                direction *= -1;
            }
            noteIndex = Math.max(0, Math.min(scale.length * 2 - 1, noteIndex + direction));

            // Ocasionalmente saltar
            if (Math.random() < 0.15) {
                noteIndex = Math.floor(Math.random() * scale.length);
            }
        }, interval);
    }

    /**
     * Nota individual del arpegiador
     */
    playArpNote(freq, waveform, duration) {
        if (!this.musicGain) return;

        const osc = this.context.createOscillator();
        const gain = this.context.createGain();
        const now = this.context.currentTime;

        osc.type = waveform;
        osc.frequency.value = freq;

        // Envolvente suave
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.06, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        osc.connect(gain);
        gain.connect(this.musicGain);

        osc.start(now);
        osc.stop(now + duration);
    }

    /**
     * Detiene la música del reino
     */
    stopRealmMusic(fade = false) {
        if (this.arpeggiatorInterval) {
            clearInterval(this.arpeggiatorInterval);
            this.arpeggiatorInterval = null;
        }

        if (this.musicGain) {
            const now = this.context.currentTime;
            if (fade) {
                this.musicGain.gain.linearRampToValueAtTime(0, now + 1);
                setTimeout(() => this.cleanupMusicNodes(), 1100);
            } else {
                this.musicGain.gain.value = 0;
                this.cleanupMusicNodes();
            }
        }

        this.currentRealm = null;
    }

    cleanupMusicNodes() {
        this.musicNodes.forEach(node => {
            try {
                if (node.stop) node.stop();
                node.disconnect();
            } catch (e) { }
        });
        this.musicNodes = [];
        if (this.musicGain) {
            this.musicGain.disconnect();
            this.musicGain = null;
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // M7.1: EFECTOS DE UI ADICIONALES
    // ═══════════════════════════════════════════════════════════════

    /**
     * Sonido de notificación
     */
    playNotification() {
        if (!this.initialized || this.muted) return;

        const now = this.context.currentTime;
        const osc = this.context.createOscillator();
        const gain = this.context.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.linearRampToValueAtTime(1320, now + 0.1);

        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.35);
    }

    /**
     * Sonido de eigenvalor obtenido
     */
    playEigenvalor() {
        if (!this.initialized || this.muted) return;

        const now = this.context.currentTime;
        // Acorde mayor ascendente con brillo
        const notes = [261.63, 329.63, 392, 523.25, 659.25]; // C4, E4, G4, C5, E5

        notes.forEach((freq, i) => {
            const osc = this.context.createOscillator();
            const gain = this.context.createGain();

            osc.type = 'sine';
            osc.frequency.value = freq;

            const startTime = now + i * 0.12;
            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(0.15, startTime + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.8);

            osc.connect(gain);
            gain.connect(this.masterGain);

            osc.start(startTime);
            osc.stop(startTime + 0.85);
        });
    }

    /**
     * Sonido de resonancia incrementada
     */
    playResonanceGain() {
        if (!this.initialized || this.muted) return;

        const now = this.context.currentTime;
        const osc1 = this.context.createOscillator();
        const osc2 = this.context.createOscillator();
        const gain = this.context.createGain();

        osc1.type = 'sine';
        osc2.type = 'sine';
        osc1.frequency.value = 440;
        osc2.frequency.value = 554.37; // Tercera mayor

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.08, now + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.masterGain);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.55);
        osc2.stop(now + 0.55);
    }

    /**
     * Sonido de fragmento del Constructo
     */
    playFragment() {
        if (!this.initialized || this.muted) return;

        const now = this.context.currentTime;
        const osc = this.context.createOscillator();
        const gain = this.context.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(330, now);
        osc.frequency.linearRampToValueAtTime(440, now + 0.15);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.3);
    }

    /**
     * Sonido de conexión del grafo
     */
    playConnection() {
        if (!this.initialized || this.muted) return;

        const now = this.context.currentTime;
        // Dos notas en quinta ascendente
        [392, 587.33].forEach((freq, i) => {
            const osc = this.context.createOscillator();
            const gain = this.context.createGain();

            osc.type = 'sine';
            osc.frequency.value = freq;

            const startTime = now + i * 0.08;
            gain.gain.setValueAtTime(0.1, startTime);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);

            osc.connect(gain);
            gain.connect(this.masterGain);

            osc.start(startTime);
            osc.stop(startTime + 0.35);
        });
    }

    /**
     * Sonido de diálogo apareciendo
     */
    playDialogOpen() {
        if (!this.initialized || this.muted) return;

        const now = this.context.currentTime;
        const osc = this.context.createOscillator();
        const gain = this.context.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.linearRampToValueAtTime(400, now + 0.08);

        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.2);
    }

    /**
     * Sonido de diálogo cerrando
     */
    playDialogClose() {
        if (!this.initialized || this.muted) return;

        const now = this.context.currentTime;
        const osc = this.context.createOscillator();
        const gain = this.context.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.linearRampToValueAtTime(200, now + 0.1);

        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.2);
    }

    /**
     * Sonido de error/bloqueado
     */
    playError() {
        if (!this.initialized || this.muted) return;

        const now = this.context.currentTime;
        const osc = this.context.createOscillator();
        const gain = this.context.createGain();

        osc.type = 'square';
        osc.frequency.value = 150;

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.linearRampToValueAtTime(0.08, now + 0.1);
        gain.gain.linearRampToValueAtTime(0, now + 0.15);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.2);
    }

    /**
     * Sonido de paso/movimiento
     */
    playFootstep() {
        if (!this.initialized || this.muted) return;

        const now = this.context.currentTime;
        const bufferSize = this.context.sampleRate * 0.05;
        const buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
        }

        const source = this.context.createBufferSource();
        const gain = this.context.createGain();
        const filter = this.context.createBiquadFilter();

        filter.type = 'lowpass';
        filter.frequency.value = 400;

        source.buffer = buffer;
        gain.gain.value = 0.03;

        source.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        source.start(now);
    }

    /**
     * Sonido de transición entre escenas
     */
    playTransition(ascending = true) {
        if (!this.initialized || this.muted) return;

        const now = this.context.currentTime;
        const startFreq = ascending ? 200 : 600;
        const endFreq = ascending ? 600 : 200;

        const osc1 = this.context.createOscillator();
        const osc2 = this.context.createOscillator();
        const gain = this.context.createGain();
        const filter = this.context.createBiquadFilter();

        osc1.type = 'sine';
        osc2.type = 'sine';

        osc1.frequency.setValueAtTime(startFreq, now);
        osc1.frequency.exponentialRampToValueAtTime(endFreq, now + 0.4);
        osc2.frequency.setValueAtTime(startFreq * 1.01, now);
        osc2.frequency.exponentialRampToValueAtTime(endFreq * 1.01, now + 0.4);

        filter.type = 'lowpass';
        filter.frequency.value = 1500;

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.1, now + 0.05);
        gain.gain.linearRampToValueAtTime(0, now + 0.5);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.55);
        osc2.stop(now + 0.55);
    }
}

// Singleton
const synthAudio = new SynthAudio();
export default synthAudio;
