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
        objective: 'Construye un Gosper Glider Gun: vida que crea vida',
        hint: 'El Gun tiene dos secciones que disparan gliders periódicamente. Busca el patrón en la biblioteca',
        minTime: 60,
        isCentralPuzzle: true,
        eigenvalorReward: 'machina',
        verification: {
            question: '¿Por qué el Game of Life es Turing-completo?',
            options: [
                'Porque tiene muchas células',
                'Porque puede simular cualquier computación',
                'Porque Conway lo diseñó así',
                'Porque usa números binarios'
            ],
            correct: 1
        }
    },
    'boids-masivo': {
        objective: 'Encuentra la consciencia colectiva: ajusta las 3 reglas hasta que emerja un patrón coherente',
        hint: 'Separación, alineación, cohesión. De la simplicidad emerge la complejidad',
        minTime: 55,
        isCentralPuzzle: true,
        eigenvalorReward: 'psyche',
        verification: {
            question: '¿Qué demuestra la simulación de boids sobre la consciencia?',
            options: [
                'La consciencia requiere un líder central',
                'El comportamiento complejo puede emerger de reglas simples',
                'Los boids son realmente conscientes',
                'Nada puede emerger sin programación explícita'
            ],
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
    'orbitales': {
        objective: 'Explora las nubes de probabilidad y encuentra el orbital 4f₀',
        hint: 'Navega por los números cuánticos n, l, m. Los orbitales f tienen formas más complejas',
        minTime: 55,
        isCentralPuzzle: true,
        eigenvalorReward: 'atomos',
        verification: {
            question: '¿Qué determina la forma de un orbital atómico?',
            options: [
                'Solo el número cuántico principal n',
                'Los números cuánticos l y m',
                'La carga del núcleo',
                'La temperatura'
            ],
            correct: 1
        }
    },
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
    // TERRA - Geología
    // ═══════════════════════════════════════════════════════════════
    'terremotos': {
        objective: 'Triangula el epicentro del terremoto usando las ondas P y S',
        hint: 'Las ondas P viajan más rápido que las S. La diferencia de tiempo revela la distancia',
        minTime: 55,
        isCentralPuzzle: true,
        eigenvalorReward: 'terra',
        verification: {
            question: '¿Qué diferencia hay entre las ondas P y S?',
            options: [
                'Las P son más destructivas',
                'Las P son longitudinales, las S transversales',
                'Las S viajan más rápido',
                'No hay diferencia'
            ],
            correct: 1
        }
    },
    'tectonica-placas': {
        objective: 'Observa cómo se mueven las placas tectónicas y predice dónde ocurrirán volcanes',
        hint: 'Los volcanes suelen aparecer en los bordes de las placas, especialmente en zonas de subducción',
        minTime: 40,
        verification: {
            question: '¿Dónde se forman más volcanes?',
            options: ['En el centro de los continentes', 'En los bordes de placas', 'En los océanos profundos', 'Aleatoriamente'],
            correct: 1
        }
    },
    'erosion': {
        objective: 'Simula millones de años de erosión y observa cómo se forma un cañón',
        hint: 'El agua es paciente. Dale tiempo suficiente a la simulación',
        minTime: 45,
        verification: {
            question: '¿Cuál es el principal agente de erosión en la formación de cañones?',
            options: ['Viento', 'Agua', 'Temperatura', 'Gravedad'],
            correct: 1
        }
    },
    'ciclo-rocas': {
        objective: 'Sigue el ciclo completo de una roca: de ígnea a sedimentaria a metamórfica',
        hint: 'El calor y la presión transforman las rocas. El enfriamiento crea nuevas',
        minTime: 40,
        verification: {
            question: '¿Qué tipo de roca se forma cuando el magma se enfría?',
            options: ['Sedimentaria', 'Metamórfica', 'Ígnea', 'Fósil'],
            correct: 2
        }
    },

    // ═══════════════════════════════════════════════════════════════
    // ALCHEMY - Química
    // ═══════════════════════════════════════════════════════════════
    'le-chatelier': {
        objective: 'Perturba el equilibrio químico y observa cómo el sistema se opone al cambio',
        hint: 'Cambia concentraciones, temperatura o presión. El sistema siempre empuja de vuelta',
        minTime: 55,
        isCentralPuzzle: true,
        eigenvalorReward: 'alchemy',
        verification: {
            question: '¿Qué predice el principio de Le Chatelier?',
            options: [
                'Las reacciones siempre van hacia la derecha',
                'El sistema se opone a las perturbaciones del equilibrio',
                'Las concentraciones siempre son iguales',
                'La temperatura no afecta el equilibrio'
            ],
            correct: 1
        }
    },
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
    'neurona': {
        objective: 'Genera un potencial de acción ajustando los canales iónicos',
        hint: 'El umbral está cerca de -55mV. Los canales de Na+ y K+ son la clave',
        minTime: 55,
        isCentralPuzzle: true,
        eigenvalorReward: 'bios',
        verification: {
            question: '¿Qué sucede durante un potencial de acción?',
            options: [
                'El potencial de membrana baja gradualmente',
                'Los canales de Na+ se abren causando despolarización rápida',
                'La célula muere temporalmente',
                'Solo entra potasio a la célula'
            ],
            correct: 1
        }
    },
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
        objective: 'Compón un contrapunto que integre a La Disonancia como una suspensión que resuelve',
        hint: 'Las disonancias no son errores — son tensiones que piden resolución. 7→6, 4→3, tritono→tercera',
        minTime: 60,
        isCentralPuzzle: true,
        eigenvalorReward: 'aether',
        isFinalPuzzle: true,
        verification: {
            question: '¿Qué aprendiste sobre la disonancia en la música?',
            options: [
                'Debe evitarse siempre',
                'Es un error del compositor',
                'Es tensión que hace significativa la consonancia',
                'Solo existe en música moderna'
            ],
            correct: 2
        }
    },
    // M5.4: Rameau Machine - Acto III
    'rameau-machine': {
        objective: 'Observa cómo Rameau explicó la armonía funcional: Tónica → Subdominante → Dominante → Tónica',
        hint: 'El Primer Resonador quería quedarse en Tónica para siempre. Observa qué pasa cuando lo intenta',
        minTime: 45,
        isCentralPuzzle: true,
        eigenvalorReward: 'aether',
        verification: {
            question: '¿Qué descubrió el Primer Resonador sobre la consonancia perpetua?',
            options: [
                'Funciona perfectamente',
                'La consonancia perpetua se convierte en disonancia',
                'La música mejora',
                'Nada cambia'
            ],
            correct: 1
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
