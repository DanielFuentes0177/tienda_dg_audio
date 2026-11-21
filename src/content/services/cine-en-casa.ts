import type { ServicePageContent } from "@/types/service.types";

const IMG = "/assets/Imagenes/aplicaciones/cine-en-casa";

export const cineEnCasa: ServicePageContent = {
  path: "/residencial-premium/cine-en-casa",
  seo: {
    title: "Cine en Casa en CDMX | Diseño e Instalación | DG Audiosound",
    description:
      "Diseño e instalación de cine en casa en CDMX y México: proyección 4K, pantallas, audio envolvente, Dolby Atmos, integración, configuración y calibración.",
    ogImage: `${IMG}/cine-en-casa-premium-dg-audiosound-hero.webp`,
    ogImageAlt: "DG Audiosound — Diseño e instalación de cine en casa",
  },
  schema: {
    name: "Diseño e instalación de cine en casa",
    serviceType: "Integración de cine en casa y home theater",
    category: "Audio y video residencial",
    areaServed: "México",
    description:
      "Diseño e instalación de cine en casa en CDMX y México: proyección 4K, pantallas, audio envolvente, Dolby Atmos, integración, configuración y calibración.",
  },
  breadcrumbs: [
    { name: "Inicio", href: "/" },
    { name: "Residencial Premium", href: "/residencial-premium" },
    { name: "Cine en Casa", href: "/residencial-premium/cine-en-casa" },
  ],
  whatsappMessages: {
    quote: "Hola DG Audiosound, quiero cotizar un proyecto de cine en casa.",
    update: "Hola DG Audiosound, quiero evaluar la actualización de mi sistema de cine en casa.",
  },
  hero: {
    kicker: "Cine en Casa | Residencial Premium",
    title: [
      { text: "Cine en casa", accent: true },
      { text: " diseñado para tu espacio, con imagen de gran formato y " },
      { text: "sonido envolvente.", accent: true },
    ],
    paragraphs: [
      "Diseñamos e instalamos sistemas de cine en casa para salas, family rooms y cuartos dedicados, considerando distancia de visualización, iluminación, proyección o pantalla, audio envolvente, subwoofers, amplificación, cableado y configuración.",
      "Evaluamos el espacio, los hábitos de uso, los equipos existentes y el presupuesto para integrar una solución cómoda, estética y fácil de utilizar.",
    ],
    image: `${IMG}/cine-en-casa-premium-dg-audiosound-hero.webp`,
    ctaLabel: "Cotizar mi cine en casa",
  },
  intro: {
    eyebrow: "Sonido que acompaña la experiencia",
    title: [
      { text: "Tu sala puede convertirse en el lugar " },
      { text: "favorito", accent: true },
      { text: " de tu casa." },
    ],
    paragraphs: [
      "DG Audiosound diseña e instala sistemas de cine en casa (home theater) para viviendas en Ciudad de México, Estado de México y proyectos residenciales en México. Un cine en casa integra imagen y audio envolvente para disfrutar películas, deportes, conciertos o videojuegos. El diseño considera también la comodidad y la operación cotidiana del sistema.",
      "Por eso analizamos el espacio antes de recomendar equipos. La distancia de visualización, la iluminación, la acústica, el tamaño de pantalla, la ubicación de bocinas y la forma de uso influyen directamente en el resultado final.",
    ],
    image: {
      src: `${IMG}/sala-cine-en-casa-proyector-4k-dg-audiosound.webp`,
      alt: "Sala de cine en casa con proyector y audio envolvente DG Audiosound",
      width: 1511,
      height: 1041,
    },
    benefits: [
      { icon: "award", title: "Experiencia premium", text: "Imagen, sonido y confort diseñados para que cada función se sienta especial." },
      { icon: "award", title: "Uso diario", text: "Soluciones prácticas para películas, series, deportes, conciertos y videojuegos." },
      { icon: "award", title: "Escalable", text: "Podemos iniciar con una solución funcional y crecer hacia sistemas más avanzados." },
      { icon: "sliders", title: "A la medida", text: "Cada recomendación se ajusta al espacio, presupuesto y expectativa del cliente." },
    ],
  },
  problem: {
    eyebrow: "La Filosofía",
    title: "Comprar equipos sin diseño puede terminar en una experiencia costosa y poco funcional.",
    paragraphs: [
      "En un cine en casa, una pantalla mal dimensionada, bocinas colocadas sin considerar los puntos de escucha, un subwoofer sin ajuste o una iluminación inadecuada pueden reducir claridad, impacto y comodidad.",
      "El reto no es reunir equipos por separado, sino diseñar el sistema como un conjunto: distancia de visualización, tamaño y tecnología de imagen, distribución del audio, reproducción de graves, amplificación, cableado, conectividad, control y configuración.",
    ],
    cards: [
      { icon: "volume-off", title: "Audio sin inmersión", text: "Bocinas mal ubicadas o sin subwoofer pueden quitar emoción y claridad." },
      { icon: "display", title: "Imagen incorrecta", text: "El tamaño, brillo o tipo de pantalla puede no corresponder al espacio." },
      { icon: "lightbulb", title: "Luz y reflejos", text: "La iluminación afecta directamente el desempeño de proyectores y pantallas." },
      { icon: "alert", title: "Equipos aislados", text: "Sin integración, el sistema puede volverse complicado y poco práctico." },
    ],
  },
  includes: {
    eyebrow: "Qué incluye la solución",
    title: "Un cine en casa profesional necesita más que una pantalla grande.",
    subtitle:
      "La experiencia final depende de cómo se integran imagen, sonido, cableado, ubicación, configuración y uso cotidiano. Un proyecto puede incluir los siguientes servicios, según el alcance acordado. Este servicio forma parte de nuestras",
    related: { label: "soluciones de audio y video residencial", href: "/residencial-premium" },
    items: [
      { icon: "clipboard", title: "Diagnóstico del espacio", text: "Revisión de medidas, fotos, iluminación, distancia de visualización, mobiliario y expectativa de uso." },
      { icon: "mic", title: "Selección de audio y video", text: "Recomendación de proyector, pantalla, TV, receptor AV, bocinas, subwoofer o barra premium según el caso." },
      { icon: "display", title: "Diseño de integración", text: "Ubicación de pantalla, bocinas, equipos, cableado, soportes y conexiones para una instalación limpia." },
      { icon: "video", title: "Instalación profesional", text: "Montaje, conexión, organización de equipos, pruebas de funcionamiento y puesta en marcha." },
      { icon: "couch", title: "Configuración y calibración", text: "Ajuste de niveles, distancias, subwoofer, fuentes y parámetros de audio y video según los equipos instalados." },
      { icon: "wrench", title: "Capacitación de uso", text: "Explicación clara para que tú y tu familia puedan disfrutar el sistema sin depender de improvisaciones." },
    ],
  },
  areas: {
    eyebrow: "Espacios para cine en casa",
    title: "Cine en casa para salas, family rooms y espacios dedicados",
    subtitle:
      "Un sistema de cine en casa no solo es para películas. También puede transformar partidos, conciertos, Fórmula 1, videojuegos y reuniones familiares en una experiencia más emocionante y cómoda.",
    items: [
      { label: "Sala principal", image: { src: `${IMG}/sala-principal-cine-en-casa-dg-audiosound.webp`, alt: "Sala principal con cine en casa premium DG Audiosound", width: 1602, height: 982 } },
      { label: "Family room", image: { src: `${IMG}/family-room-cine-en-casa-dg-audiosound.webp`, alt: "Family room con sistema de cine en casa y audio envolvente DG Audiosound", width: 1602, height: 982 } },
      { label: "Cuarto dedicado", image: { src: `${IMG}/cuarto-dedicado-home-theater-dg-audiosound.webp`, alt: "Cuarto dedicado home theater con pantalla grande y bocinas DG Audiosound", width: 1602, height: 982 } },
      { label: "Departamentos", image: { src: `${IMG}/departamento-cine-en-casa-dg-audiosound.webp`, alt: "Departamento con cine en casa compacto DG Audiosound", width: 1602, height: 982 } },
      { label: "Terrazas techadas", image: { src: `${IMG}/terraza-techada-audio-video-dg-audiosound.webp`, alt: "Terraza techada con audio y video residencial DG Audiosound", width: 1602, height: 982 } },
      { label: "Sala de juegos", image: { src: `${IMG}/cine-en-casa-mundial-deportes-conciertos-dg-audiosound.webp`, alt: "Sala de juegos con proyección y audio envolvente DG Audiosound", width: 1577, height: 997 } },
    ],
    banner: {
      image: {
        src: `${IMG}/cine-en-casa-premium-dg-audiosound-hero.webp`,
        alt: "Sala de cine en casa con imagen de gran formato y audio envolvente",
        width: 1672,
        height: 941,
      },
      eyebrow: "Actualización de sistemas existentes",
      title: "Actualiza tu cine en casa aprovechando los equipos que aún tienen valor",
      text: "Si ya cuentas con bocinas, receptor AV, proyector, pantalla, subwoofer, fuentes o cableado, podemos revisar su estado y compatibilidad para definir qué conviene conservar y qué actualizar. El objetivo es mejorar desempeño y facilidad de uso sin sustituir componentes que todavía sean adecuados para el proyecto.",
      ctaLabel: "Evaluar actualización por WhatsApp",
    },
  },
  process: {
    eyebrow: "Proceso",
    title: "Un proceso claro para una solución profesional",
    subtitle:
      "Un proceso estructurado para definir el alcance, seleccionar la solución e integrar el sistema con claridad en cada etapa.",
    steps: [
      { icon: "headset", title: "Nos contactas", text: "Nos escribes por WhatsApp y nos cuentas qué experiencia quieres lograr." },
      { icon: "search-chart", title: "Revisamos tu espacio", text: "Solicitamos medidas, fotos, iluminación, muebles y ubicación deseada." },
      { icon: "ruler", title: "Definimos la solución", text: "Definimos tamaño de imagen, proyección o pantalla, configuración de audio, amplificación, cableado, soportes y accesorios según el proyecto." },
      { icon: "file", title: "Propuesta clara", text: "Te entregamos alcance, equipos, tiempos e inversión." },
      { icon: "wrench", title: "Instalamos", text: "Montaje, conexión, pruebas, ajustes y puesta en marcha." },
      { icon: "user-check", title: "Te capacitamos", text: "Explicamos el uso básico para una operación sencilla." },
    ],
    quote: "Un buen proyecto audiovisual empieza entendiendo el espacio, el uso y la experiencia que quieres lograr.",
    ctaLabel: "Iniciar mi proyecto por WhatsApp",
  },
  differentiator: {
    dark: {
      eyebrow: "Diferenciador",
      title: "No vendemos cajas: diseñamos experiencias de audio y video.",
      paragraphs: [
        "La recomendación correcta depende del espacio, no solo de la ficha técnica. Un proyector puede ser excelente, pero no ser el ideal si el tiro, la luz o el tamaño de pantalla no corresponden. Una bocina puede ser poderosa, pero perder impacto si se coloca mal.",
        "En DG Audiosound buscamos que tu inversión sea coherente, funcional y preparada para que realmente disfrutes el sistema en tu día a día.",
      ],
    },
    gold: {
      eyebrow: "Confianza",
      title: "Una decisión profesional para tu hogar",
      items: [
        "Asesoría personalizada y real",
        "Propuesta técnica formal y clara",
        "Equipos profesionales seleccionados para el proyecto",
        "Instalación estética y estructurada",
        "Integración armoniosa con el espacio",
        "Capacitación práctica de uso",
        "Acompañamiento técnico posventa",
      ],
    },
    brands: {
      eyebrow: "Marcas y tecnología",
      title: [
        { text: "Marcas profesionales para soluciones de " },
        { text: "alto rendimiento", accent: true },
      ],
      subtitle:
        "Seleccionamos marcas y componentes de audio y video según el espacio, la compatibilidad del sistema, el desempeño requerido y las necesidades de cada proyecto.",
      names: ["SONOS", "KEF", "NAD", "RUARK", "PRO-JECT", "ONKYO", "SHURE", "NEXO", "QSC", "BARCO", "KRAMER", "BIAMP", "ALLEN & HEATH", "OPTOMA", "SHARP"],
    },
  },
  faq: {
    eyebrow: "FAQ",
    title: "Preguntas frecuentes sobre cine en casa",
    subtitle:
      "Resolvemos dudas frecuentes sobre espacio, imagen, audio envolvente, Dolby Atmos, instalación y actualización de equipos para ayudarte a planear mejor tu proyecto.",
    items: [
      {
        question: "¿Qué incluye un proyecto de cine en casa con DG Audiosound?",
        answer:
          "Puede incluir asesoría, análisis del espacio, selección de proyector o pantalla, sistema de audio envolvente, subwoofer, receptor AV, cableado, soportes, instalación, configuración, pruebas y capacitación básica de uso.",
      },
      {
        question: "¿Puedo instalar un cine en casa en una sala normal?",
        answer:
          "Sí. Un cine en casa puede diseñarse para sala, family room, cuarto dedicado, departamento o área social. La solución se adapta al tamaño, iluminación, distribución y presupuesto del espacio.",
      },
      {
        question: "¿Qué es mejor para cine en casa: proyector o pantalla de TV?",
        answer:
          "La selección depende del tamaño de imagen deseado, la iluminación, la distancia de visualización y el uso. Un proyector puede ser adecuado para buscar una imagen de gran formato; una pantalla de TV puede convenir en espacios con más luz o uso cotidiano intensivo. Evaluamos estas condiciones antes de recomendar una opción.",
      },
      {
        question: "¿Manejan sistemas Dolby Atmos?",
        answer:
          "Sí. DG Audiosound puede proponer sistemas compatibles con Dolby Atmos cuando el proyecto, el espacio, la ubicación de bocinas, el presupuesto y los equipos lo permitan.",
      },
      {
        question: "¿Qué datos necesitan para cotizar un cine en casa?",
        answer:
          "Para cotizar se requieren datos del espacio y del alcance: medidas aproximadas, fotos, uso principal, preferencia por proyector o pantalla, presupuesto aproximado, ubicación de muebles y equipos existentes que se quieran integrar. Si aún no tienes toda la información, podemos orientarte para reunirla.",
      },
      {
        question: "¿La instalación puede verse limpia y estética?",
        answer:
          "Sí. El objetivo es integrar una solución funcional y visualmente cuidada, considerando cableado, soportes, ubicación de bocinas, posición de pantalla y facilidad de uso.",
      },
    ],
  },
  contact: {
    title: [
      { text: "Diseñemos tu proyecto de " },
      { text: "cine en casa", accent: true },
    ],
    subtitle:
      "Cuéntanos qué espacio deseas equipar, en qué etapa se encuentra y qué experiencia quieres lograr. Con esta información podremos orientarte antes de preparar una propuesta.",
    panelTitle: [
      { text: "Hablemos de tu proyecto de " },
      { text: "cine en casa", accent: true },
    ],
    panelText:
      "Podemos orientarte sobre proyector o pantalla, audio envolvente, Dolby Atmos, subwoofers, amplificación, cableado, integración y actualización de equipos existentes.",
    whatsappDetail: "+52 55 3727 0177 — atención para proyectos residenciales",
    coverage: "Ciudad de México, Estado de México y proyectos residenciales en todo México",
    formTitle: "Solicita asesoría para tu cine en casa",
    formDescription:
      "Completa el formulario y se abrirá WhatsApp con la información del proyecto. Si tienes medidas, fotos, planos o equipos existentes, menciónalos en los detalles.",
    projectFieldLabel: "Residencia / Proyecto (Opcional)",
    projectFieldPlaceholder: "Nombre de la residencia o proyecto",
    projectTypes: [
      "Cine en Casa - Sala Principal",
      "Cine en Casa - Family Room",
      "Cine en Casa - Cuarto Dedicado",
      "Cine en Casa - Departamento",
      "Actualización de Sistema Existente",
      "Aún no lo tengo definido",
    ],
    messagePlaceholder:
      "Ej. medidas aproximadas, si buscas proyector o pantalla, equipos existentes, etapa de obra, uso principal y cualquier detalle relevante.",
    submitLabel: "Solicitar asesoría por WhatsApp",
    pageHeading: "CINE EN CASA",
  },
};
