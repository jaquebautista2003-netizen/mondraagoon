/* =========================================================
   Catálogo de servicios · Urbanizaciones Mondragón
   modalidad: 'obra' = ejecución · 'proyecto' = ingeniería y proyectos
   ========================================================= */
const CATEGORIAS_SERV = [
  {
    id: 'infra', nombre: 'Construcción e infraestructura', corto: 'Pavimentos, carreteras, drenajes y obra civil',
    img: 'img/servicios/camino-o-vialidad-terminada.webp', modalidad: 'obra',
    grupos: [
      { titulo: 'Pavimentación, carreteras y caminos', items: [
        'Pavimentos de concreto hidráulico', 'Pavimentación con mezcla asfáltica', 'Construcción y rehabilitación de caminos rurales',
        'Construcción de carreteras, calles y avenidas', 'Bacheo, fresado y rehabilitación de pavimentos', 'Banquetas, guarniciones y andadores',
        'Cunetas y bordillos', 'Obras de drenaje transversal y longitudinal', 'Terracerías, cortes, excavaciones y rellenos',
        'Subrasantes, subbases y bases hidráulicas', 'Estabilización de suelos con cal o cemento', 'Accesos vehiculares y estacionamientos',
        'Vados y pasos de agua', 'Señalamiento horizontal y vertical', 'Muros de contención y protección de taludes', 'Obras complementarias carreteras'] },
      { titulo: 'Obra pública e infraestructura municipal', items: [
        'Urbanización de calles y localidades', 'Redes de agua potable', 'Drenaje sanitario y pluvial', 'Tuberías, pozos de visita y registros',
        'Alcantarillas y obras de captación', 'Muros, bardas y cercados perimetrales', 'Plazas, parques y espacios públicos',
        'Infraestructura para escuelas y edificios públicos', 'Rehabilitación de instalaciones municipales', 'Protección hidráulica y control de erosión',
        'Canchas y espacios deportivos', 'Mantenimiento de infraestructura carretera', 'Obra para dependencias federales, estatales y municipales'] }
    ]
  },
  {
    id: 'ingenieria', nombre: 'Arquitectura e ingeniería', corto: 'Proyectos ejecutivos, planos y cálculos',
    img: 'img/servicios/barda-sanitarios-o-edificacion.webp', modalidad: 'proyecto',
    grupos: [
      { titulo: 'Proyectos arquitectónicos y diseño', items: [
        'Anteproyecto arquitectónico', 'Proyecto arquitectónico completo', 'Diseño de casa habitación', 'Diseño de edificios comerciales y oficinas',
        'Diseño de naves industriales y bodegas', 'Planos arquitectónicos y constructivos', 'Distribución y optimización de espacios',
        'Modelado arquitectónico 3D', 'Renders y recorridos virtuales', 'Diseño de fachadas e interiores', 'Proyecto de ampliación o remodelación',
        'Diseño de espacios turísticos y recreativos', 'Proyecto de urbanización y lotificación', 'Diseño de estacionamientos y accesos', 'Proyecto de accesibilidad universal'] },
      { titulo: 'Ingeniería y análisis estructural', items: [
        'Cálculo estructural de concreto armado', 'Cálculo de estructuras de acero', 'Análisis estructural de viviendas y edificios',
        'Diseño de cimentaciones', 'Diseño de zapatas, losas, trabes y columnas', 'Diseño de estructuras metálicas', 'Diseño de cubiertas y techumbres',
        'Diseño de muros de contención', 'Memoria de cálculo estructural', 'Planos estructurales y detalles', 'Modelado y análisis estructural',
        'Evaluación de estructuras existentes', 'Proyecto de reforzamiento estructural', 'Revisión de proyecto estructural', 'Cuantificación de acero y concreto'] }
    ]
  },
  {
    id: 'costos', nombre: 'Costos y presupuestos', corto: 'Catálogos, precios unitarios y licitaciones',
    img: 'img/obras/distribuidor-vial-en-el-asta-bandera-libramie.webp', modalidad: 'proyecto',
    nota: 'Servicio para particulares y también para otras constructoras.',
    grupos: [
      { titulo: 'Presupuestos y precios unitarios', items: [
        'Catálogo de conceptos', 'Presupuesto de obra', 'Análisis de precios unitarios', 'Matrices de precios unitarios',
        'Cuantificación y volumetría', 'Números generadores', 'Explosión de insumos', 'Costos directos e indirectos',
        'Financiamiento, utilidad y cargos adicionales', 'Presupuesto en Neodata y Excel'] },
      { titulo: 'Licitaciones y control de obra', items: [
        'Programa de ejecución de obra', 'Programas de mano de obra, maquinaria y materiales', 'Propuesta técnica y económica',
        'Documentación para licitaciones', 'Expediente de concurso', 'Revisión y actualización de presupuestos', 'Estimaciones de obra',
        'Finiquitos', 'Control presupuestal y seguimiento de costos', 'Asesoría para contratistas y constructoras'] }
    ]
  },
  {
    id: 'topografia', nombre: 'Topografía y estudios', corto: 'Levantamientos, nivelación y estudios técnicos',
    img: 'img/nosotros/modernizacion-del-camino-iguala-teloloapan-ar.webp', modalidad: 'proyecto',
    nota: 'Los estudios especializados se realizan con laboratorios y especialistas asociados.',
    grupos: [
      { titulo: 'Topografía y geometría', items: [
        'Levantamiento topográfico', 'Nivelación de terrenos', 'Trazo y replanteo de obra', 'Perfiles y secciones transversales',
        'Curvas de nivel y plano topográfico', 'Volúmenes de corte y relleno', 'Proyecto geométrico de caminos', 'Proyecto de rasantes y pendientes',
        'Proyecto de plataformas y terracerías', 'Cálculo de movimientos de tierra', 'Planos As-Built (obra ejecutada)'] },
      { titulo: 'Estudios e hidráulica', items: [
        'Mecánica de suelos', 'Compactación y calidad de materiales', 'Proyecto de drenaje pluvial y sanitario', 'Diseño de redes hidráulicas',
        'Proyecto de agua potable', 'Diseño de alcantarillas y obras de drenaje', 'Estudio hidrológico e hidráulico'] }
    ]
  },
  {
    id: 'edificacion', nombre: 'Edificación y remodelación', corto: 'Viviendas, comercios, naves y rehabilitaciones',
    img: 'img/obras/construccion-de-techado-en-area-de-educacion.webp', modalidad: 'obra',
    grupos: [
      { titulo: 'Construcción y edificación', items: [
        'Construcción de vivienda', 'Locales comerciales', 'Oficinas y edificios', 'Naves industriales', 'Cimentaciones y estructuras',
        'Cisternas y tanques', 'Patios de maniobras', 'Pisos industriales de concreto', 'Bardas perimetrales'] },
      { titulo: 'Remodelación y mantenimiento', items: [
        'Ampliaciones y remodelaciones', 'Albañilería y acabados', 'Impermeabilización y mantenimiento',
        'Instalaciones eléctricas, hidráulicas y sanitarias', 'Rehabilitación de edificios existentes', 'Demoliciones y retiro de escombros'] }
    ]
  },
  {
    id: 'maquinaria', nombre: 'Renta de maquinaria', corto: 'Maquinaria pesada y equipo de construcción',
    img: 'img/maquinaria/excavadoras.webp', modalidad: 'obra', enlace: 'maquinaria.html'
  }
];

const ESPECIALIZADOS = [
  ['Supervisión de obra', 'Supervisión técnica, control de avances, reportes y bitácoras', 'M9 11l3 3 8-8M4 4h10v4M4 4v16h16v-6'],
  ['Administración de proyectos', 'Planeación, programación y coordinación de contratistas', 'M4 6h16M4 12h10M4 18h6'],
  ['Ingeniería eléctrica', 'Proyectos de iluminación, instalaciones y canalizaciones', 'M13 2L4 14h7l-1 8 9-12h-7z'],
  ['Ingeniería hidráulica', 'Redes de distribución, bombeo y almacenamiento', 'M12 3c4 5 6 8 6 11a6 6 0 01-12 0c0-3 2-6 6-11z'],
  ['Ingeniería sanitaria', 'Drenajes, tratamiento y conducción de aguas', 'M4 8h16M4 8v8a4 4 0 004 4h8a4 4 0 004-4V8M9 4v4M15 4v4'],
  ['Diseño industrial', 'Estructuras auxiliares, soportes y soluciones especiales', 'M12 3l8 4.5v9L12 21l-8-4.5v-9zM12 12l8-4.5M12 12v9M12 12L4 7.5'],
  ['Paisajismo', 'Jardines, áreas verdes y espacios recreativos', 'M12 22V12M12 12C7 12 5 8 5 5c4 0 7 2 7 7zM12 12c5 0 7-4 7-7-4 0-7 2-7 7z'],
  ['Infraestructura turística', 'Diseño de experiencias, rutas e infraestructura turística', 'M3 20l6-12 4 7 3-4 5 9z'],
  ['Mantenimiento', 'Conservación preventiva y correctiva de inmuebles', 'M14 7l3-3 3 3-3 3M4 20l9-9M11 4a4 4 0 104 4'],
  ['Consultoría técnica', 'Dictámenes, asesoría, revisión de proyectos y soluciones', 'M4 5h16v11H8l-4 4z'],
  ['Documentación técnica', 'Planos CAD, modelado BIM, memorias y expedientes', 'M6 2h9l5 5v15H6zM14 2v6h6M9 13h6M9 17h6']
];

/* Atajos del cotizador de proyectos */
const ATAJOS_SERV = [
  'Proyecto arquitectónico completo', 'Cálculo estructural de concreto armado', 'Planos estructurales y detalles', 'Catálogo de conceptos',
  'Presupuesto de obra', 'Levantamiento topográfico', 'Proyecto de agua potable', 'Supervisión de obra'
];

const INTENCIONES = {
  obra: { titulo: 'Quiero construir o remodelar', desc: 'Necesito una empresa que ejecute los trabajos.', cats: ['infra', 'edificacion'] },
  proyecto: { titulo: 'Solo necesito un proyecto o estudio', desc: 'Planos, cálculos, diseño, memoria técnica o expediente.', cats: ['ingenieria', 'topografia'] },
  presupuesto: { titulo: 'Necesito un presupuesto o catálogo', desc: 'Precios unitarios, volumetrías, Neodata o licitaciones.', cats: ['costos'] },
  otro: { titulo: 'Tengo otro proyecto en mente', desc: 'Quiero explicar mi idea y recibir asesoría.', cats: [] }
};
