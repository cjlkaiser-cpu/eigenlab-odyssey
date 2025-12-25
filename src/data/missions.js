/**
 * Misiones - Objetivos específicos para cada simulación
 *
 * Cada misión tiene:
 * - objective: Qué debe lograr el jugador
 * - hint: Pista de cómo lograrlo
 * - minTime: Tiempo mínimo de exploración (segundos)
 * - verification: Pregunta para verificar que lo hizo
 */

export const MISSIONS = {
    // ═══════════════════════════════════════════════════════════════
    // COSMOS - Astronomía
    // ═══════════════════════════════════════════════════════════════
    'formacion-galaxias': {
        objective: 'Crea una galaxia espiral estable con más de 500 estrellas',
        hint: 'Añade rotación inicial y observa cómo se forman los brazos',
        minTime: 45,
        verification: {
            question: '¿Qué parámetro es crucial para formar brazos espirales?',
            options: ['Masa total', 'Velocidad angular', 'Número de estrellas', 'Temperatura'],
            correct: 1
        }
    },
    'sistema-solar': {
        objective: 'Identifica qué planeta tiene la órbita más excéntrica',
        hint: 'Observa las órbitas y busca la que más se aleja del círculo perfecto',
        minTime: 30,
        verification: {
            question: '¿Cuál planeta tiene la órbita más elíptica?',
            options: ['Venus', 'Tierra', 'Mercurio', 'Júpiter'],
            correct: 2
        }
    },
    'agujero-negro': {
        objective: 'Observa cómo la luz se curva cerca del horizonte de eventos',
        hint: 'Acerca partículas de luz al agujero negro y observa su trayectoria',
        minTime: 40,
        verification: {
            question: '¿Qué le pasa a la luz que pasa cerca del agujero negro?',
            options: ['Se acelera', 'Se curva hacia él', 'Cambia de color', 'Desaparece instantáneamente'],
            correct: 1
        }
    },
    'orbitas-kepler': {
        objective: 'Verifica la segunda ley de Kepler: áreas iguales en tiempos iguales',
        hint: 'Observa cómo cambia la velocidad del planeta según su distancia al sol',
        minTime: 35,
        verification: {
            question: '¿Cuándo se mueve más rápido un planeta en su órbita?',
            options: ['Siempre igual', 'Más cerca del sol', 'Más lejos del sol', 'En los equinoccios'],
            correct: 1
        }
    },
    'three-body': {
        objective: 'Encuentra una configuración estable de tres cuerpos',
        hint: 'Prueba con masas iguales y posiciones simétricas',
        minTime: 60,
        verification: {
            question: '¿Por qué el problema de tres cuerpos es caótico?',
            options: ['Las masas cambian', 'No hay solución analítica general', 'La gravedad falla', 'Los cuerpos colisionan siempre'],
            correct: 1
        }
    },
    'expansion-universo': {
        objective: 'Observa cómo las galaxias más lejanas se alejan más rápido',
        hint: 'Compara la velocidad de recesión de galaxias cercanas vs lejanas',
        minTime: 35,
        verification: {
            question: '¿Qué establece la Ley de Hubble?',
            options: ['Las galaxias rotan', 'Velocidad proporcional a distancia', 'El universo es infinito', 'Las estrellas explotan'],
            correct: 1
        }
    },
    'harmonices-mundi': {
        objective: 'Alinea las órbitas planetarias para escuchar la armonía cósmica de Kepler',
        hint: 'Cada planeta tiene una "nota" basada en su velocidad orbital. Busca el momento de consonancia',
        minTime: 60,
        isCentralPuzzle: true, // Marca como puzzle central del reino
        eigenvalorReward: 'cosmos', // Eigenvalor específico que otorga
        verification: {
            question: '¿Qué descubrió Kepler sobre las órbitas y la música?',
            options: [
                'Los planetas cantan literalmente',
                'Las proporciones orbitales corresponden a intervalos musicales',
                'El Sol produce ondas sonoras',
                'La gravedad es una frecuencia'
            ],
            correct: 1
        }
    },

    // ═══════════════════════════════════════════════════════════════
    // CHAOS - Sistemas Emergentes
    // ═══════════════════════════════════════════════════════════════
    'lorenz-attractor': {
        objective: 'Encuentra las dos "alas" del atractor y observa cómo alterna entre ellas',
        hint: 'Inicia con condiciones cercanas y observa cómo divergen. El caos es determinista',
        minTime: 45,
        isCentralPuzzle: true,
        eigenvalorReward: 'chaos',
        verification: {
            question: '¿Qué representa el "efecto mariposa" en este sistema?',
            options: ['Las alas del atractor', 'Sensibilidad a condiciones iniciales', 'El vuelo de insectos', 'Oscilaciones regulares'],
            correct: 1
        }
    },
    'double-pendulum': {
        objective: 'Compara dos péndulos con ángulos iniciales casi idénticos',
        hint: 'Cambia el ángulo inicial por solo 0.1° y observa la diferencia',
        minTime: 45,
        verification: {
            question: '¿Qué hace caótico al péndulo doble?',
            options: ['El peso', 'La fricción', 'El acoplamiento no lineal', 'La longitud'],
            correct: 2
        }
    },
    'game-of-life': {
        objective: 'Crea un "glider" que se mueva diagonalmente por la pantalla',
        hint: 'Patrón: 3 células en fila + 1 arriba a la derecha + 1 en el medio',
        minTime: 40,
        verification: {
            question: '¿Cuántas células vivas necesita un "glider"?',
            options: ['3', '4', '5', '6'],
            correct: 2
        }
    },
    'boids-masivo': {
        objective: 'Ajusta los parámetros para crear un comportamiento de "murmuración" como los estorninos',
        hint: 'Aumenta la cohesión y reduce la separación',
        minTime: 50,
        verification: {
            question: '¿Cuáles son las 3 reglas básicas de los boids?',
            options: ['Comer, dormir, moverse', 'Separación, alineación, cohesión', 'Arriba, abajo, lateral', 'Líder, seguidor, explorador'],
            correct: 1
        }
    },
    'reaccion-difusion': {
        objective: 'Genera patrones de rayas y manchas como los de un leopardo o cebra',
        hint: 'Ajusta las tasas de reacción y difusión de los químicos',
        minTime: 45,
        verification: {
            question: '¿Quién propuso este modelo de morfogénesis?',
            options: ['Darwin', 'Turing', 'Einstein', 'Newton'],
            correct: 1
        }
    },

    // ═══════════════════════════════════════════════════════════════
    // LOGOS - Matemáticas
    // ═══════════════════════════════════════════════════════════════
    'mandelbrot': {
        objective: 'Haz zoom hasta encontrar una "mini-Mandelbrot" dentro del conjunto, el símbolo λ oculto',
        hint: 'Explora los bordes del cardioide principal. El infinito se repite a sí mismo',
        minTime: 55,
        isCentralPuzzle: true,
        eigenvalorReward: 'logos',
        verification: {
            question: '¿Qué propiedad tiene el conjunto de Mandelbrot?',
            options: ['Es finito', 'Es auto-similar', 'Es circular', 'Es aleatorio'],
            correct: 1
        }
    },
    'fourier-epicycles': {
        objective: 'Dibuja una figura reconocible usando solo círculos giratorios',
        hint: 'Más círculos = más detalle. Empieza con algo simple',
        minTime: 45,
        verification: {
            question: '¿Qué permite representar la transformada de Fourier?',
            options: ['Colores', 'Cualquier señal como suma de senos', 'Números primos', 'Probabilidades'],
            correct: 1
        }
    },
    'l-systems': {
        objective: 'Genera un árbol fractal que parezca natural',
        hint: 'Usa ángulos de ramificación entre 20° y 30°',
        minTime: 40,
        verification: {
            question: '¿Qué estructuras naturales modelan bien los L-Systems?',
            options: ['Nubes', 'Plantas y árboles', 'Ríos', 'Montañas'],
            correct: 1
        }
    },
    'voronoi': {
        objective: 'Crea un patrón que parezca la piel de una jirafa',
        hint: 'Distribuye puntos de forma semi-aleatoria',
        minTime: 35,
        verification: {
            question: '¿Qué define una celda de Voronoi?',
            options: ['Área más cercana a un punto', 'Área más lejana', 'Área con más vecinos', 'Área cuadrada'],
            correct: 0
        }
    },
    'phyllotaxis': {
        objective: 'Encuentra el ángulo que produce el patrón más compacto (como un girasol)',
        hint: 'El ángulo dorado es aproximadamente 137.5°',
        minTime: 40,
        verification: {
            question: '¿Qué ángulo produce el patrón de filotaxis más eficiente?',
            options: ['90°', '120°', '137.5° (ángulo dorado)', '180°'],
            correct: 2
        }
    },

    // ═══════════════════════════════════════════════════════════════
    // ATOMOS - Física
    // ═══════════════════════════════════════════════════════════════
    'ondas': {
        objective: 'Crea una onda estacionaria con 3 nodos',
        hint: 'Ajusta la frecuencia para que coincida con la longitud del medio',
        minTime: 35,
        verification: {
            question: '¿Qué son los nodos en una onda estacionaria?',
            options: ['Puntos de máxima amplitud', 'Puntos que no se mueven', 'El origen de la onda', 'La velocidad de la onda'],
            correct: 1
        }
    },
    'interferencia': {
        objective: 'Produce un patrón de interferencia destructiva completa',
        hint: 'Las ondas deben tener igual amplitud y estar desfasadas 180°',
        minTime: 40,
        verification: {
            question: '¿Cuándo ocurre interferencia destructiva?',
            options: ['Ondas en fase', 'Ondas desfasadas 180°', 'Ondas de diferente frecuencia', 'Ondas perpendiculares'],
            correct: 1
        }
    },
    'pendulo-simple': {
        objective: 'Verifica que el período no depende de la amplitud (para ángulos pequeños)',
        hint: 'Compara oscilaciones con diferentes amplitudes iniciales',
        minTime: 30,
        verification: {
            question: '¿De qué depende el período de un péndulo simple?',
            options: ['De la masa', 'De la longitud y gravedad', 'De la amplitud', 'Del color'],
            correct: 1
        }
    },
    'colisiones': {
        objective: 'Demuestra la conservación del momento en una colisión elástica',
        hint: 'Compara la suma de momentos antes y después del choque',
        minTime: 35,
        verification: {
            question: '¿Qué se conserva en una colisión elástica?',
            options: ['Solo momento', 'Solo energía cinética', 'Momento y energía cinética', 'Nada se conserva'],
            correct: 2
        }
    },

    // ═══════════════════════════════════════════════════════════════
    // MACHINA - Computación
    // ═══════════════════════════════════════════════════════════════
    'automatas-elementales': {
        objective: 'Encuentra la Regla 110 y observa por qué es especial',
        hint: 'La Regla 110 es Turing-completa',
        minTime: 45,
        verification: {
            question: '¿Qué tiene de especial la Regla 110?',
            options: ['Es la más simple', 'Es Turing-completa', 'Genera solo líneas', 'No genera patrones'],
            correct: 1
        }
    },
    'perceptron': {
        objective: 'Entrena un perceptrón para clasificar puntos AND',
        hint: 'El AND requiere que ambas entradas sean 1',
        minTime: 40,
        verification: {
            question: '¿Qué no puede aprender un perceptrón simple?',
            options: ['AND', 'OR', 'XOR', 'NOT'],
            correct: 2
        }
    },
    'logic-gates': {
        objective: 'Construye un sumador de 1 bit usando compuertas básicas',
        hint: 'Necesitas XOR para la suma y AND para el acarreo',
        minTime: 50,
        verification: {
            question: '¿Qué compuerta da 1 solo cuando ambas entradas son 1?',
            options: ['OR', 'AND', 'XOR', 'NOT'],
            correct: 1
        }
    },

    // ═══════════════════════════════════════════════════════════════
    // ALCHEMY - Química
    // ═══════════════════════════════════════════════════════════════
    'gas-ideal': {
        objective: 'Verifica la relación PV=nRT cambiando temperatura y volumen',
        hint: 'Si duplicas T manteniendo V, ¿qué pasa con P?',
        minTime: 35,
        verification: {
            question: 'Si aumentas la temperatura a volumen constante, la presión...',
            options: ['Disminuye', 'Se mantiene', 'Aumenta', 'Se vuelve cero'],
            correct: 2
        }
    },
    'entropia': {
        objective: 'Observa cómo la entropía siempre aumenta en un sistema cerrado',
        hint: 'Inicia con un estado ordenado y observa su evolución',
        minTime: 40,
        verification: {
            question: '¿Qué establece la segunda ley de la termodinámica?',
            options: ['La energía se conserva', 'La entropía tiende a aumentar', 'La temperatura es constante', 'La presión disminuye'],
            correct: 1
        }
    },

    // ═══════════════════════════════════════════════════════════════
    // BIOS - Biología
    // ═══════════════════════════════════════════════════════════════
    'evolucion': {
        objective: 'Observa cómo la selección natural favorece ciertos rasgos',
        hint: 'Cambia el entorno y observa qué organismos sobreviven',
        minTime: 50,
        verification: {
            question: '¿Qué impulsa la evolución según Darwin?',
            options: ['Uso y desuso', 'Selección natural', 'Mutaciones dirigidas', 'Voluntad del organismo'],
            correct: 1
        }
    },
    'adn-replicacion': {
        objective: 'Identifica las enzimas clave en la replicación del ADN',
        hint: 'Busca la helicasa, primasa y ADN polimerasa',
        minTime: 40,
        verification: {
            question: '¿Qué enzima "desenrolla" la doble hélice?',
            options: ['Polimerasa', 'Helicasa', 'Ligasa', 'Primasa'],
            correct: 1
        }
    },

    // ═══════════════════════════════════════════════════════════════
    // AETHER - Música
    // ═══════════════════════════════════════════════════════════════
    'sympathetic-12': {
        objective: 'Crea una resonancia donde todas las cuerdas vibren armónicamente',
        hint: 'Toca una nota fundamental y observa qué armónicos aparecen',
        minTime: 45,
        verification: {
            question: '¿Qué es la resonancia simpática?',
            options: ['Cuerdas que se rompen', 'Cuerdas que vibran sin tocarlas', 'Cuerdas que cambian de color', 'Cuerdas que se tensan'],
            correct: 1
        }
    },
    'contrapunctus': {
        objective: 'Crea un contrapunto de primera especie siguiendo las reglas',
        hint: 'Cada nota contra nota, evita quintas paralelas',
        minTime: 50,
        verification: {
            question: '¿Qué intervalo está prohibido en paralelo en contrapunto?',
            options: ['Terceras', 'Sextas', 'Quintas perfectas', 'Octavas'],
            correct: 2
        }
    }
};

// Misión por defecto para simulaciones sin misión específica
export const DEFAULT_MISSION = {
    objective: 'Explora la simulación y comprende el fenómeno que representa',
    hint: 'Interactúa con los controles y observa cómo cambia el sistema',
    minTime: 30,
    verification: null
};

export function getMission(simId) {
    return MISSIONS[simId] || DEFAULT_MISSION;
}
