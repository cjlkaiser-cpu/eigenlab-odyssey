/**
 * SynthAudio - Sistema de audio sintetizado para EigenLab Odyssey
 *
 * Usa Web Audio API para generar sonidos procedurales.
 * No requiere archivos de audio externos.
 */

class SynthAudio {
    constructor() {
        this.context = null;
        this.masterGain = null;
        this.initialized = false;
        this.muted = false;
        this.volume = 0.5;

        // Pool de osciladores activos
        this.activeOscillators = new Map();
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
}

// Singleton
const synthAudio = new SynthAudio();
export default synthAudio;
