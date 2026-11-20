/* =========================================================
   Catálogo de maquinaria propia · Urbanizaciones Mondragón
   Para agregar o quitar equipo, edita esta lista.
   ========================================================= */
const CATEGORIAS_MAQ = [
  { id: 'todas', nombre: 'Todo el equipo' },
  { id: 'tierra', nombre: 'Movimiento de tierras' },
  { id: 'compactacion', nombre: 'Conformación y compactación' },
  { id: 'pavimento', nombre: 'Pavimentación' },
  { id: 'acarreo', nombre: 'Acarreo y agua' }
];

const MAQUINARIA = [
  {
    id: 'excavadora', nombre: 'Excavadora hidráulica', uso: 'Excavación, cortes y carga', cat: 'tierra',
    img: 'img/maquinaria/excavadoras.webp', unidades: 6,
    modelos: ['Caterpillar 322L', 'Caterpillar 320B', 'Caterpillar 330D', 'John Deere 892E', 'Sany SY235C', 'Sany SY215CLC'],
    extras: ['Martillo hidráulico (CAT 330)']
  },
  {
    id: 'retro', nombre: 'Retroexcavadora 4×4', uso: 'Zanjas, excavación y carga', cat: 'tierra',
    img: 'img/maquinaria/retroexcavadoras.webp', unidades: 2,
    modelos: ['Caterpillar 426', 'Caterpillar 416EST']
  },
  {
    id: 'tractor', nombre: 'Tractor sobre orugas', uso: 'Cortes, empuje y terracerías', cat: 'tierra',
    img: 'img/maquinaria/tractor-sobre-orugas.webp', unidades: 3,
    modelos: ['Caterpillar D9N', 'Caterpillar D8N', 'Caterpillar D6H']
  },
  {
    id: 'motoconformadora', nombre: 'Motoconformadora', uso: 'Conformación de bases y caminos', cat: 'compactacion',
    img: 'img/maquinaria/motoconformadora.webp', unidades: 3,
    modelos: ['Caterpillar 140G', 'Caterpillar 14E', 'Volvo G930']
  },
  {
    id: 'compactador', nombre: 'Compactador vibratorio', uso: 'Compactación de terreno y carpetas', cat: 'compactacion',
    img: 'img/maquinaria/compactadores.webp', unidades: 9,
    modelos: ['Rodillo liso Bomag BW172D', 'Rodillo liso Raygo 400-A / 304-A', 'Rodillo liso Lebrero 135TT', 'Rodillo liso Ingersoll Rand SP-54', 'Tándem Ingersoll Rand DD-24', 'Doble rodillo Dynapac', 'Neumático Muller VAP-701', 'Tractocompactador Caterpillar 815']
  },
  {
    id: 'pavimentadora', nombre: 'Pavimentadora (extendedora)', uso: 'Tendido de carpeta asfáltica', cat: 'pavimento',
    img: 'img/maquinaria/pavimentadora.webp', unidades: 1,
    modelos: ['Barber Greene BG240G con sensor']
  },
  {
    id: 'planta', nombre: 'Suministro de mezcla asfáltica', uso: 'Planta de asfalto propia', cat: 'pavimento',
    img: 'img/maquinaria/planta-de-asfalto.webp', unidades: 1, servicio: true,
    modelos: ['Planta de concreto asfáltico Simmex'], nota: 'Se cotiza por m³ o tonelada colocada en obra.'
  },
  {
    id: 'pipa', nombre: 'Pipa de agua 10,000 L', uso: 'Riego y compactación', cat: 'acarreo',
    img: 'img/maquinaria/pipas-de-agua.webp', unidades: 2,
    modelos: ['International 4700', 'Dina D552']
  }
];

/* Equipo adicional (se muestra en lista compacta, sin fotografía) */
const MAQUINARIA_EXTRA = [
  { id: 'volteo14', nombre: 'Camión de volteo 14 m³', uso: 'Acarreo de materiales', cat: 'acarreo', unidades: 1, modelos: ['Ford'] },
  { id: 'volteo7', nombre: 'Camión de volteo 7 m³', uso: 'Acarreo de materiales', cat: 'acarreo', unidades: 1, modelos: ['Famsa'] },
  { id: 'cargador', nombre: 'Cargador frontal', uso: 'Carga de material', cat: 'tierra', unidades: 1, modelos: ['Caterpillar 950'] },
  { id: 'fresadora', nombre: 'Fresadora de pavimento', uso: 'Fresado de carpeta', cat: 'pavimento', unidades: 1, modelos: ['Rotomil PR-500'] },
  { id: 'petrolizadora', nombre: 'Petrolizadora 10,000 L', uso: 'Riegos de liga e impregnación', cat: 'pavimento', unidades: 1, modelos: ['Seaman Gunnison'] },
  { id: 'barredora', nombre: 'Barredora mecánica', uso: 'Limpieza de superficie', cat: 'pavimento', unidades: 1, modelos: ['Broom DT-80'] },
  { id: 'pintarrayas', nombre: 'Pintarrayas autopropulsada', uso: 'Señalamiento horizontal', cat: 'pavimento', unidades: 1, modelos: ['EZ-Liner 600 L'] },
  { id: 'estacion', nombre: 'Estación total', uso: 'Trazo y levantamiento', cat: 'tierra', unidades: 2, modelos: ['Sokkia SET 630 RK', 'Topcon ES 60'] }
];
