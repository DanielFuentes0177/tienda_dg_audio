// Borradores de guías del blog (sin precios). Se guardan SIN publicar con scripts/import-blog-drafts.mjs.
// Las cifras de espacio, distancias y ángulos son referencias generales de planeación, no normas: verificar con el proyecto real.
const WA = "https://wa.me/525537270177";

export const DRAFTS = [
  {
    title: "Medidas de un auditorio para 100 personas: cómo calcular el espacio y el sonido",
    slug: "medidas-de-un-auditorio-para-100-personas",
    category: "Guías",
    seoTitle: "Medidas de un auditorio para 100 personas | DG Audiosound",
    seoDescription:
      "¿Qué tamaño necesita un auditorio para 100 personas? Cómo calcular butacas, pasillos, escenario, acústica y el sistema de sonido y proyección que conviene planear.",
    seoKeywords:
      "medidas de un auditorio para 100 personas, auditorio 100 personas, sonido para auditorios, diseño de audio y video para auditorio",
    coverImageAlt: "Auditorio con butacas, escenario y pantalla de proyección",
    content: `
<p>Si estás planeando un auditorio para 100 personas, la pregunta más común es cuántos metros necesitas. No hay una sola cifra correcta: depende del tipo de butaca, de los pasillos, del escenario y de las normas de seguridad que apliquen a tu inmueble. Esta guía te da un punto de partida para calcular el espacio y te explica qué decisiones de audio y video conviene tomar desde el inicio, antes de que sea caro cambiarlas.</p>

<h2>Un punto de partida para calcular el espacio</h2>
<p>Como referencia general de planeación, muchos proyectos parten de entre 1 y 1,5 m² por persona sumando butacas, pasillos y circulación, sin contar escenario ni cabina. Para 100 asistentes, eso daría una sala de entre 100 y 150 m² solo para público. Es una cifra orientativa: la distribución real puede cambiar mucho el resultado.</p>
<ul>
  <li><strong>Butaca:</strong> el ancho típico va de 50 a 60 cm por persona.</li>
  <li><strong>Separación entre filas:</strong> suele ir de 80 a 100 cm, para permitir el paso sin que todos se levanten.</li>
  <li><strong>Pasillos y salidas:</strong> deben cumplir los lineamientos de protección civil de tu inmueble. Confírmalos con quien dirija la obra, porque cambian según el tipo de uso.</li>
  <li><strong>Espacios accesibles:</strong> reserva lugares y rutas para personas en silla de ruedas; es más fácil preverlos en el diseño que agregarlos después.</li>
  <li><strong>Escenario o estrado:</strong> considera espacio para ponentes, atril, pantalla y, si aplica, mesa de panel.</li>
  <li><strong>Cabina o mesa de control:</strong> quien opera audio y video necesita ver el escenario y escuchar lo mismo que el público.</li>
</ul>

<h2>La forma de la sala importa tanto como el tamaño</h2>
<p>Dos salas con los mismos metros cuadrados pueden sonar muy distinto. Una sala muy larga y angosta suele necesitar más refuerzo de sonido en las últimas filas. Una más ancha y corta reparte mejor la vista, pero exige cuidar que las bocinas cubran los extremos. Si el piso es plano, quienes están atrás ven peor; una ligera pendiente o un estrado elevado mejora la visibilidad de todos.</p>
<p>Antes de comprar equipo conviene medir la altura, revisar techo y muros y definir desde dónde se proyecta.</p>

<h2>Acústica: el factor que suele subestimarse</h2>
<p>La reverberación (el eco que dura después de hablar) es la principal causa de que una sala "se escuche mal" aunque tenga buenas bocinas. Superficies duras como concreto, vidrio y piso liso aumentan el eco. Paneles acústicos, cortinas, alfombra o falsos plafones lo reducen. Para voz hablada, como conferencias o clases, conviene una sala con poca reverberación; para música en vivo se busca un equilibrio distinto.</p>
<p>Un especialista puede medir el tiempo de reverberación de la sala y decir cuánto tratamiento necesita. Esto debe hacerse antes de elegir el sistema de audio, no después.</p>

<h2>Qué sistema de audio y video necesita</h2>
<ul>
  <li><strong>Refuerzo de voz:</strong> bocinas distribuidas para que el sonido llegue parejo a todas las filas, sin que los de adelante lo sientan demasiado fuerte.</li>
  <li><strong>Microfonía:</strong> micrófono de atril, de solapa o inalámbrico según cómo se usará la sala. Si hay panel o preguntas del público, considera micrófonos de mano para la audiencia.</li>
  <li><strong>Proyección o pantalla:</strong> el tamaño depende de la distancia a la última fila. Una regla práctica común dice que la última fila no debería quedar a más de unas seis veces la altura de la imagen; es solo una referencia, y el contenido que presentes (texto pequeño, planos, video) cambia la cifra.</li>
  <li><strong>Control y mezcla:</strong> un panel sencillo para quien opera la sala, sin depender de un técnico en cada evento.</li>
  <li><strong>Transmisión o grabación:</strong> si vas a grabar o transmitir, conviene preverlo desde el cableado y la ubicación de cámaras.</li>
  <li><strong>Asistencia auditiva:</strong> en espacios públicos o institucionales puede ser útil considerar un sistema para personas con dificultades auditivas.</li>
</ul>

<h2>Errores comunes al planear un auditorio</h2>
<ul>
  <li>Comprar las bocinas antes de tener definido el tamaño y la forma de la sala.</li>
  <li>No dejar canalización para el cableado y tener que abrir muros después.</li>
  <li>Colocar la pantalla sin revisar la visibilidad desde las últimas filas y los extremos.</li>
  <li>Ignorar el eco: se compensa con volumen, y el resultado es ruido, no claridad.</li>
  <li>No pensar en quién operará el sistema el día a día.</li>
</ul>

<h2>Preguntas frecuentes</h2>
<h3>¿Cuántos metros cuadrados necesita un auditorio para 100 personas?</h3>
<p>Como punto de partida, entre 100 y 150 m² para público, más el espacio de escenario y control. La cifra final depende del tipo de butaca, los pasillos y las normas aplicables.</p>
<h3>¿Qué es mejor, proyector o pantalla LED en un auditorio?</h3>
<p>Depende de la luz de la sala, la distancia y el tamaño de imagen que necesites. Una pantalla LED soporta bien la luz ambiente; un proyector permite imágenes muy grandes si puedes controlar la luz.</p>
<h3>¿Cuántas bocinas necesito?</h3>
<p>No hay un número fijo. Se calcula según el tamaño y la forma de la sala, la altura del techo y la acústica. Lo importante es que el sonido llegue parejo a todas las butacas.</p>
<h3>¿Puedo equipar el auditorio por etapas?</h3>
<p>Sí, siempre que el cableado y la canalización queden previstos desde el principio para poder ampliar después.</p>

<h2>Datos que necesitamos para recomendarte un sistema</h2>
<p>Con las medidas aproximadas, el aforo, el tipo de eventos y fotos del espacio podemos proponerte una solución. Si ya tienes planos, mejor.</p>
<p>Conoce nuestras <a href="/corporativo-e-institucional/auditorios-corporativos">soluciones de sonido y proyección para auditorios</a> o <a href="${WA}">escríbenos por WhatsApp</a> para revisar tu proyecto.</p>
`,
  },
  {
    title: "Sistema de sonido para restaurantes: qué necesitas y cómo planearlo",
    slug: "sistema-de-sonido-para-restaurantes-que-necesitas",
    category: "Guías",
    seoTitle: "Sistema de sonido para restaurantes: guía | DG Audiosound",
    seoDescription:
      "Guía para planear el audio ambiental de un restaurante: zonas, bocinas, volumen, terraza y pantallas. Qué definir antes de pedir una cotización.",
    seoKeywords:
      "sistema de sonido para restaurantes, audio ambiental para restaurantes, audio para restaurantes, sistemas de audio para restaurantes",
    coverImageAlt: "Salón de restaurante con bocinas integradas en el plafón",
    content: `
<p>La música de un restaurante forma parte de la experiencia: si es muy fuerte, la gente no conversa; si casi no se escucha, el lugar se siente vacío. Un buen sistema de sonido logra que la música se escuche parejo en todas las mesas sin molestar, y que el ambiente cambie con el momento del día. Estos son los puntos que conviene definir antes de elegir equipo.</p>

<h2>1. Define las zonas del local</h2>
<p>Un restaurante rara vez necesita el mismo volumen en todas partes. Salón principal, terraza, barra, privados, baños y zona de espera tienen ritmos distintos. Un sistema por zonas permite subir la música en la barra por la noche sin saturar a quien cena en el comedor, y bajarla en un privado donde hay una reunión.</p>

<h2>2. Más bocinas pequeñas suelen funcionar mejor que pocas grandes</h2>
<p>Repartir el sonido en varias bocinas de menor potencia, por ejemplo en el plafón, evita que las mesas cercanas a una bocina escuchen demasiado fuerte y las lejanas casi nada. Además permite mantener un volumen cómodo para conversar. En locales grandes se usan líneas de distribución pensadas para conectar muchas bocinas con un solo amplificador, lo que simplifica el cableado.</p>

<h2>3. Considera la altura, los materiales y el ruido</h2>
<ul>
  <li><strong>Altura del techo:</strong> cambia el tipo y la cantidad de bocinas necesarias.</li>
  <li><strong>Materiales duros:</strong> cristal, concreto y madera sin tratamiento aumentan el eco y el ruido de fondo; un local muy vivo obliga a subir la música y todos terminan gritando.</li>
  <li><strong>Ruido de cocina y de la calle:</strong> la música necesita cubrir ese ruido sin volverse molesta.</li>
  <li><strong>Mobiliario y decoración:</strong> telas, plantas y paneles absorben sonido y ayudan a controlar el eco.</li>
</ul>

<h2>4. Terraza y áreas abiertas</h2>
<p>En exteriores el sonido se pierde con facilidad y también puede molestar a vecinos. Se usan bocinas resistentes a intemperie y se controla el volumen de esa zona por separado. Revisa también los reglamentos locales sobre el nivel de ruido en terrazas.</p>

<h2>5. Pantallas para partidos y eventos</h2>
<p>Si transmites partidos o eventos, conviene planear las pantallas junto con el audio: ubicación visible desde las mesas, distribución de señal y que el sonido de la transmisión no pise la música del resto del local. A veces es mejor que solo la barra tenga el audio del partido.</p>

<h2>6. Control sencillo para tu equipo</h2>
<p>Quien abre el restaurante cada día debe poder encender la música, cambiar de lista y ajustar volumen sin llamar a un técnico. Un control claro, en una app o un panel, evita errores y desgaste del equipo. También conviene dejar límites de volumen para que nadie suba el sistema más de lo debido.</p>

<h2>7. Música, licencias y contenido</h2>
<p>El equipo es una cosa y la música que reproduces es otra. Reproducir música en un negocio puede requerir licencias o permisos de uso; consulta con quien corresponda para estar en regla. También hay servicios de música para negocios con listas pensadas para cada momento del día.</p>

<h2>Errores comunes</h2>
<ul>
  <li>Instalar una sola zona de volumen en todo el local.</li>
  <li>Poner pocas bocinas potentes en lugar de repartir el sonido.</li>
  <li>No considerar la terraza o la barra al diseñar el sistema.</li>
  <li>Elegir el equipo por precio sin revisar si cubre el local de manera pareja.</li>
  <li>Dejar cables visibles por no haber planeado la instalación.</li>
</ul>

<h2>Preguntas frecuentes</h2>
<h3>¿Qué tipo de bocinas se usan en un restaurante?</h3>
<p>Lo más común son bocinas de plafón o de muro, discretas y repartidas por el local. En terrazas se usan bocinas para exterior.</p>
<h3>¿Puedo reutilizar el equipo que ya tengo?</h3>
<p>A veces sí. Se revisa qué bocinas, amplificadores y cableado sirven y qué conviene cambiar o ampliar.</p>
<h3>¿Se puede instalar con el restaurante abierto?</h3>
<p>Según el alcance, se puede coordinar el trabajo en horarios de menor servicio para reducir molestias.</p>
<h3>¿Puedo empezar por una zona y ampliar después?</h3>
<p>Sí, si el diseño deja previstos el cableado y la capacidad del amplificador para sumar zonas más adelante.</p>

<h2>Qué datos preparar para cotizar</h2>
<ul>
  <li>Medidas aproximadas y fotos del local.</li>
  <li>Zonas a cubrir (salón, terraza, barra, privados).</li>
  <li>Si ya cuentas con bocinas, amplificador o pantallas.</li>
  <li>Si hay obra o remodelación en proceso.</li>
</ul>
<p>Con eso podemos recomendarte una solución. Conoce nuestro <a href="/negocios-y-experiencias/restaurantes">servicio de sonido ambiental para restaurantes</a> o <a href="${WA}">cuéntanos tu proyecto por WhatsApp</a>.</p>
`,
  },
  {
    title: "Cine en casa: cómo elegir proyector o pantalla y qué necesita tu sala",
    slug: "como-elegir-proyector-o-pantalla-para-cine-en-casa",
    category: "Guías",
    seoTitle: "Cine en casa: proyector o pantalla | DG Audiosound",
    seoDescription:
      "Guía para armar una sala de cine en casa: proyector o pantalla grande, luz de la sala, distancia, audio envolvente y qué revisar antes de comprar.",
    seoKeywords:
      "cine en casa, sala de cine en casa, sistema de cine en casa, home theater, proyector para cine en casa",
    coverImageAlt: "Sala de cine en casa con proyector, pantalla grande y asientos reclinables",
    content: `
<p>Armar una sala de cine en casa no empieza por el equipo, sino por la sala. El tamaño, la luz que entra y quién la usa deciden si te conviene un proyector o una pantalla grande, y qué sonido necesitas. Esta guía te ayuda a ordenar esas decisiones antes de comprar, para que cada pieza trabaje con las demás.</p>

<h2>Paso 1: ¿sala dedicada o espacio compartido?</h2>
<p>En una sala dedicada puedes controlar la luz y la acústica, y ahí un proyector lo aprovecha mejor. En un espacio compartido, como la sala familiar, entra luz natural y se usa de día, así que una pantalla grande suele ser más práctica. Define esto primero: cambia casi todas las demás decisiones.</p>

<h2>Proyector o pantalla grande: cuándo conviene cada uno</h2>
<ul>
  <li><strong>Proyector con pantalla:</strong> permite imágenes muy grandes y una sensación cercana al cine. Funciona mejor si puedes oscurecer la sala. Requiere pensar en la distancia, la altura de instalación y el cableado.</li>
  <li><strong>Pantalla grande (TV o similar):</strong> se ve bien con luz ambiente, es más sencilla de usar a diario y no necesita oscurecer. El tamaño máximo es menor que con un proyector.</li>
</ul>

<h2>Lo que debes medir antes de decidir</h2>
<ul>
  <li><strong>Distancia de visión:</strong> cuánto se aleja el sillón de la pared de la imagen. Una referencia común es que la imagen ocupe cerca de 40° del campo de visión desde el asiento principal.</li>
  <li><strong>Luz natural:</strong> ventanas y cortinas, y a qué hora usas la sala.</li>
  <li><strong>Ancho y alto del muro:</strong> el tamaño máximo de imagen posible.</li>
  <li><strong>Distancia de proyección:</strong> cada proyector necesita cierta distancia a la pantalla para dar un tamaño determinado; revisa la ficha del equipo antes de decidir dónde irá.</li>
  <li><strong>Ruido:</strong> un proyector genera ruido de ventilación; en salas pequeñas conviene ubicarlo con cuidado.</li>
</ul>

<h2>Imagen: resolución, brillo y contraste</h2>
<p>La resolución 4K es hoy lo habitual en equipos de cine en casa, pero no es lo único que cuenta. El brillo importa si hay algo de luz en la sala, y el contraste define qué tan profundos se ven los negros. En una sala oscura, un buen contraste hace más que unos cuantos lúmenes extra. También conviene que el equipo soporte los formatos de alto rango dinámico (HDR) que usan los servicios de streaming y los discos.</p>

<h2>El sonido es la mitad de la experiencia</h2>
<p>Una buena imagen con mal sonido se siente como un cine a medias. El audio envolvente reparte el sonido en varias bocinas para que los efectos y la música rodeen al espectador. Hay configuraciones desde una barra de sonido hasta sistemas con varios canales y subwoofer:</p>
<ul>
  <li><strong>Barra de sonido:</strong> sencilla y discreta; mejora mucho el sonido de una TV, aunque el envolvente es limitado.</li>
  <li><strong>5.1 y 7.1:</strong> cinco o siete bocinas más subwoofer repartidas alrededor del público.</li>
  <li><strong>Formatos con altura (como Dolby Atmos):</strong> agregan bocinas en el techo o que rebotan el sonido hacia arriba, para efectos que vienen "de arriba".</li>
</ul>
<p>La elección depende del tamaño de la sala, del presupuesto y de cuánto quieres integrar el equipo a tu decoración.</p>

<h2>Acústica y cableado: lo que no se ve</h2>
<p>Una sala con mucho eco, cristal o piso duro se escucha menos clara aunque el equipo sea bueno. Alfombras, cortinas y muebles ayudan. Y conviene planear el cableado desde el inicio para que bocinas, proyector y control queden ordenados y sin cables a la vista, sobre todo si la casa está en obra.</p>

<h2>Control simple para toda la familia</h2>
<p>Un cine en casa se usa más cuando encender todo toma un solo botón. Un control unificado evita tener tres controles distintos y que nadie sepa cómo cambiar de fuente.</p>

<h2>Errores comunes</h2>
<ul>
  <li>Comprar el proyector sin medir la distancia real a la pantalla.</li>
  <li>Ignorar la luz natural y esperar una imagen de cine a mediodía.</li>
  <li>Invertir en imagen y dejar el sonido para después.</li>
  <li>Instalar las bocinas sin pensar en la ubicación de los asientos.</li>
  <li>Dejar el cableado sin canalizar y terminar con cables visibles.</li>
</ul>

<h2>Preguntas frecuentes</h2>
<h3>¿Qué tamaño de pantalla me conviene?</h3>
<p>Depende de la distancia de los asientos y del tamaño del muro. Una imagen más grande no siempre es mejor si te queda demasiado cerca.</p>
<h3>¿Necesito una sala dedicada?</h3>
<p>No necesariamente, pero una sala dedicada permite controlar luz y acústica y suele dar mejores resultados con proyector.</p>
<h3>¿Puedo usar un proyector en una sala con luz?</h3>
<p>Se puede con un proyector brillante y una pantalla adecuada, pero la imagen siempre será mejor con la sala oscurecida.</p>
<h3>¿Se puede instalar en una casa ya terminada?</h3>
<p>Sí. Se puede ocultar el cableado con canaletas o ductos y elegir bocinas que se integren al espacio.</p>

<p>Si quieres revisar tu sala, conoce nuestro servicio de <a href="/residencial-premium/cine-en-casa">cine en casa y home theater</a> o <a href="${WA}">escríbenos por WhatsApp</a> con las medidas de tu espacio.</p>
`,
  },
  {
    title: "Audio multiroom o audio distribuido: ¿cuál conviene en tu casa?",
    slug: "audio-multiroom-vs-audio-distribuido-en-casa",
    category: "Guías",
    seoTitle: "Audio multiroom o distribuido en casa | DG Audiosound",
    seoDescription:
      "Diferencias entre audio multiroom inalámbrico y audio distribuido por cableado en casa, cuándo conviene cada uno y qué definir antes de instalarlo.",
    seoKeywords:
      "audio multiroom, sistema de audio distribuido, audio multizona casa, sonido por zonas en casa",
    coverImageAlt: "Sala con bocinas de plafón integradas para audio distribuido",
    content: `
<p>Poner música en varias zonas de la casa se puede resolver de dos formas: con bocinas inalámbricas que se conectan entre sí (multiroom) o con un sistema de audio distribuido, donde un amplificador central alimenta bocinas integradas en cada zona. Las dos funcionan, pero resuelven necesidades distintas. Elegir bien desde el inicio evita rehacer la instalación después.</p>

<h2>Qué es el audio multiroom</h2>
<p>Son bocinas o equipos independientes que se conectan a tu red y se controlan desde una app. Cada uno se coloca donde lo necesites. Es una solución flexible y fácil de empezar, ideal para casas donde ya no es posible abrir muros o cuando quieres crecer poco a poco. Su desempeño depende de la calidad de tu red Wi-Fi: si la red es débil, el audio puede cortarse o tardar en responder.</p>

<h2>Qué es el audio distribuido</h2>
<p>Un amplificador o equipo central conecta varias zonas por cable y alimenta bocinas integradas en plafones o muros. Se maneja desde una app o un panel. Suele ser la mejor opción cuando la casa está en obra o remodelación, porque el cableado queda oculto y las bocinas se integran a la arquitectura. Como el audio viaja por cable, la conexión es estable y el sonido llega sincronizado en todas las zonas.</p>

<h2>Comparación rápida</h2>
<table>
  <thead>
    <tr><th>Aspecto</th><th>Multiroom inalámbrico</th><th>Audio distribuido</th></tr>
  </thead>
  <tbody>
    <tr><td>Instalación</td><td>Sencilla, sin obra</td><td>Requiere cableado, ideal en obra o remodelación</td></tr>
    <tr><td>Estética</td><td>Bocinas visibles</td><td>Bocinas integradas en plafón o muro</td></tr>
    <tr><td>Estabilidad</td><td>Depende de la red Wi-Fi</td><td>Conexión por cable, muy estable</td></tr>
    <tr><td>Ampliar</td><td>Se agregan equipos fácilmente</td><td>Se prevé desde el diseño</td></tr>
    <tr><td>Exteriores</td><td>Limitado según el equipo</td><td>Terrazas y jardines con bocinas para exterior</td></tr>
  </tbody>
</table>

<h2>Cuándo conviene cada uno</h2>
<ul>
  <li><strong>Multiroom:</strong> casas ya terminadas, rentas, departamentos o cuando quieres una solución que puedas mover y ampliar.</li>
  <li><strong>Audio distribuido:</strong> obra nueva o remodelación, casas grandes, terrazas y jardines, o cuando buscas una instalación discreta y estable.</li>
  <li><strong>Mixto:</strong> es común combinar ambos, por ejemplo distribuido en la sala, cocina y terraza, y bocinas inalámbricas en una recámara.</li>
</ul>

<h2>Si la casa está en obra, deja previsto el cableado</h2>
<p>Aunque todavía no vayas a instalar el sistema, dejar tubería (canalización) hacia los lugares donde van las bocinas y un punto central para el equipo es barato en obra y muy caro de añadir después. Pídele a tu arquitecto o contratista que lo considere.</p>

<h2>Preguntas que ayudan a decidir</h2>
<ol>
  <li>¿La casa está en obra o ya está terminada?</li>
  <li>¿Cuántas zonas quieres cubrir y qué tan grandes son?</li>
  <li>¿Quieres música diferente por zona al mismo tiempo?</li>
  <li>¿Importa que las bocinas queden ocultas?</li>
  <li>¿Quieres integrar también la terraza o el jardín?</li>
  <li>¿Quién va a usar el sistema y con qué fuentes (celular, streaming, tornamesa, TV)?</li>
</ol>

<h2>Errores comunes</h2>
<ul>
  <li>Decidir el equipo antes de definir las zonas.</li>
  <li>Comprar bocinas inalámbricas para toda la casa sin revisar la cobertura Wi-Fi.</li>
  <li>No dejar cableado previsto durante la obra.</li>
  <li>Elegir bocinas de plafón sin considerar la altura del techo y la ubicación de los muebles.</li>
  <li>No pensar cómo se controlará: una app que cada persona usa distinto termina sin usarse.</li>
</ul>

<h2>Preguntas frecuentes</h2>
<h3>¿Puedo escuchar música diferente en cada zona?</h3>
<p>Sí, en ambos tipos de sistema. Hay que definir cuántas fuentes y zonas independientes necesitas.</p>
<h3>¿Se puede instalar en una casa terminada?</h3>
<p>Sí. Con multiroom es más sencillo; el audio distribuido también se puede, aunque requiere pasar cable con más cuidado.</p>
<h3>¿Se puede usar en terraza y jardín?</h3>
<p>Sí, con bocinas diseñadas para exterior y cobertura pensada para esas áreas.</p>

<p>Conoce nuestro servicio de <a href="/residencial-premium/audio-distribuido">audio distribuido y multizona para casa</a> o <a href="${WA}">escríbenos por WhatsApp</a> con una descripción de tu casa.</p>
`,
  },
  {
    title: "Videoconferencia en sala de juntas: cómo elegir el equipo correcto",
    slug: "equipo-de-videoconferencia-para-sala-de-juntas",
    category: "Guías",
    seoTitle: "Videoconferencia para sala de juntas | DG Audiosound",
    seoDescription:
      "Qué necesita una sala de juntas para videollamadas: cámara, micrófonos, audio y pantalla; equipo todo en uno o modular, y qué revisar según el tamaño de la sala.",
    seoKeywords:
      "equipo de videoconferencia, videoconferencia sala de juntas, sala de reuniones, audio corporativo, soluciones de audio empresarial",
    coverImageAlt: "Sala de juntas con pantalla, cámara y micrófonos de mesa para videollamada",
    content: `
<p>Una sala de juntas que no funciona bien para videollamadas hace perder tiempo a todos: no se escucha a quien está lejos, la cámara no muestra a todos o hay que "rezar" para que conecte. Resolverlo bien depende más del tamaño de la sala y de cómo se reúne tu equipo que de la marca del equipo. Esta guía te ayuda a decidir qué necesitas y qué preguntar antes de comprar.</p>

<h2>Los cuatro elementos de una sala lista para videoconferencia</h2>
<ul>
  <li><strong>Cámara:</strong> debe mostrar a todos los asistentes. En salas grandes se usan cámaras que siguen a quien habla o con varios lentes.</li>
  <li><strong>Micrófonos:</strong> es lo que más se subestima. Si no se escucha claro, la reunión falla. Pueden ser de mesa o de techo según la sala.</li>
  <li><strong>Bocinas o barra de audio:</strong> para que quienes están en remoto se escuchen con claridad, sin eco.</li>
  <li><strong>Pantalla o proyector:</strong> para ver a los participantes y compartir contenido. Su tamaño debe permitir leer a quien está en la punta de la mesa.</li>
</ul>

<h2>Todo en uno o modular</h2>
<p>Los equipos todo en uno integran cámara, micrófono y bocinas en una sola pieza: son más simples de instalar y de usar, y funcionan muy bien en salas pequeñas o medianas. Un sistema modular combina componentes por separado: es más flexible para salas grandes o con necesidades especiales, pero requiere más diseño y configuración.</p>

<h2>Cómo cambia según el tamaño de la sala</h2>
<ul>
  <li><strong>Sala pequeña (mesa para pocas personas):</strong> un equipo todo en uno suele bastar.</li>
  <li><strong>Sala mediana:</strong> barra de video más micrófono adicional de mesa o de techo.</li>
  <li><strong>Sala grande o de dirección:</strong> varias cámaras, micrófonos distribuidos y procesamiento de audio para evitar eco y acoples.</li>
</ul>

<h2>La plataforma que usan importa</h2>
<p>No todos los equipos funcionan igual con Teams, Meet o Zoom. Conviene elegir equipos certificados para la plataforma que ya usa tu empresa, para evitar configuraciones complicadas. Si tu equipo usa más de una plataforma, pregunta cómo se resuelve en cada reunión.</p>

<h2>Conexión: cómo entra la reunión a la sala</h2>
<p>Hay dos formas habituales: un equipo propio de la sala que se une a la reunión (la sala "tiene su propia cuenta") o una laptop que se conecta por cable a la cámara, los micrófonos y la pantalla. La primera es más cómoda para quien llega; la segunda es más flexible y suele costar menos de implementar. Elegir una de las dos y estandarizarla en todas las salas simplifica mucho el soporte.</p>

<h2>La sala también cuenta</h2>
<p>El ruido del aire acondicionado, los muros de vidrio y el eco afectan más de lo que parece. Un buen diseño considera la acústica y la ubicación de cámara y pantalla desde el inicio: la cámara debe quedar a la altura de los ojos, cerca de la pantalla, y nadie debe quedar a contraluz frente a una ventana. Y el cableado debe quedar limpio, sin cables sueltos sobre la mesa.</p>

<h2>Errores comunes</h2>
<ul>
  <li>Comprar solo cámara y olvidar el audio, que es lo que más se nota.</li>
  <li>Instalar la cámara desde un ángulo donde no se ve a todos.</li>
  <li>No probar con una reunión real antes de dar por terminado el proyecto.</li>
  <li>Usar un equipo distinto en cada sala y complicar el soporte.</li>
  <li>No considerar la red: una conexión inestable arruina la mejor sala.</li>
</ul>

<h2>Preguntas frecuentes</h2>
<h3>¿Qué equipo necesita una sala de juntas pequeña?</h3>
<p>Normalmente un equipo todo en uno con cámara, micrófono y bocinas, y una pantalla. Es la opción más sencilla.</p>
<h3>¿Sirve una barra de sonido de TV para videollamadas?</h3>
<p>No siempre. Está pensada para reproducir sonido, no para captar voces; conviene un equipo diseñado para videoconferencia.</p>
<h3>¿Cuántas salas conviene equipar con el mismo kit?</h3>
<p>Si tienes varias salas del mismo tamaño, estandarizar un kit facilita la instalación, el soporte y la capacitación.</p>

<h2>Lo que necesitamos saber para recomendarte</h2>
<ul>
  <li>Tamaño de la mesa y número de personas.</li>
  <li>Plataforma de videollamada que usan.</li>
  <li>Si ya tienen pantalla o equipos.</li>
  <li>Cuántas salas quieren equipar, por si conviene estandarizar.</li>
</ul>
<p>Conoce nuestro servicio de <a href="/corporativo-e-institucional/salas-de-juntas">videoconferencia y salas de juntas</a> o <a href="${WA}">escríbenos por WhatsApp</a> para revisar tu sala.</p>
`,
  },
  {
    title: "Sistema de sonido para iglesia o templo: qué necesitas y cómo planearlo",
    slug: "sistema-de-sonido-para-iglesia-que-necesitas",
    category: "Guías",
    seoTitle: "Sistema de sonido para iglesia: guía | DG Audiosound",
    seoDescription:
      "Guía para planear el sonido de una iglesia o templo: bocinas, micrófonos, mezcladora, acústica, monitoreo y transmisión; qué definir antes de comprar.",
    seoKeywords:
      "sistema de sonido para iglesia, sonido para templo, audio para centros de culto, equipo de sonido para iglesia",
    coverImageAlt: "Interior de un templo con bocinas, púlpito y micrófonos",
    content: `
<p>En una iglesia o templo, lo más importante es que la voz se entienda en toda la nave. El sonido bien resuelto acerca a la congregación; uno mal resuelto la distrae de lo que viene a escuchar. Este es un orden de trabajo para planear un sistema de sonido sin gastar de más y sin comprar equipo que no necesitas.</p>

<h2>1. Entiende cómo se usa el espacio</h2>
<p>Antes de elegir equipo, define quién habla o canta, si hay banda o coro, cuántas personas asisten normalmente y si algo se transmite o se graba. Un templo con solo palabra hablada necesita menos equipo que uno con banda en vivo. También importa si el sistema será fijo o si en ocasiones se usa en otro lugar, como un evento al aire libre.</p>

<h2>2. Mide y escucha el recinto</h2>
<p>Los templos suelen tener techos altos, muros duros y columnas, lo que produce eco y zonas donde la voz se pierde. Antes de comprar bocinas conviene recorrer el espacio, escuchar desde varias posiciones (incluidos balcones o naves laterales) y detectar dónde el sonido rebota. A veces mejorar la acústica con cortinas, paneles o alfombra rinde más que comprar equipo más potente.</p>

<h2>3. Los componentes básicos</h2>
<ul>
  <li><strong>Micrófonos:</strong> de púlpito, de mano, inalámbricos o de solapa, según cómo se hable o cante. Los inalámbricos dan libertad de movimiento pero requieren cuidar baterías y frecuencias.</li>
  <li><strong>Mezcladora:</strong> el centro del sistema. Se elige según cuántas entradas necesitas hoy y cuántas podrías necesitar después.</li>
  <li><strong>Bocinas:</strong> bien distribuidas para que el sonido llegue parejo. Calcular mal su número y ubicación es un error común. En recintos largos o con balcones pueden hacer falta bocinas adicionales con retardo para que todo suene sincronizado.</li>
  <li><strong>Amplificación y procesamiento:</strong> para dar la potencia necesaria, controlar el nivel y evitar el acople (ese silbido molesto).</li>
  <li><strong>Monitoreo:</strong> para que quienes cantan o tocan se escuchen entre sí; puede ser con bocinas de piso o con monitores personales.</li>
</ul>

<h2>4. Piensa en quién lo va a operar</h2>
<p>En muchas comunidades el sonido lo opera un voluntario. Un sistema demasiado complejo termina mal usado. Conviene un diseño que quien opere cada semana pueda manejar con confianza, con ajustes claros y una guía sencilla. También ayuda dejar ajustes preconfigurados para servicios habituales, de modo que no haya que empezar de cero cada vez.</p>

<h2>5. Prevé crecer</h2>
<p>Si es probable que la congregación o el grupo musical crezcan, deja espacio para ampliar: más entradas en la mezcladora, cableado previsto y capacidad en el amplificador.</p>

<h2>6. Transmisión en línea</h2>
<p>Si quieres transmitir los servicios, conviene planear desde el inicio cómo sale el audio hacia la transmisión, para que se escuche limpio también en línea. Una mezcla pensada para la sala no siempre suena bien para quien ve desde su casa; a veces se hace una mezcla aparte para la transmisión.</p>

<h2>7. Audio, video y pantallas</h2>
<p>Muchas comunidades también usan pantallas para letras, lecturas o avisos. Si es tu caso, conviene planearlas junto con el audio: ubicación visible desde todas las bancas, y que el contenido sea legible desde atrás.</p>

<h2>Errores comunes</h2>
<ul>
  <li>Comprar potencia de más sin resolver primero el eco.</li>
  <li>Poner todas las bocinas al frente y dejar las últimas bancas sin cobertura.</li>
  <li>Elegir equipo complejo que solo una persona sabe operar.</li>
  <li>No dejar espacio para crecer.</li>
  <li>Olvidar la transmisión hasta después de la instalación.</li>
</ul>

<h2>Preguntas frecuentes</h2>
<h3>¿Qué necesito para un templo pequeño?</h3>
<p>Normalmente micrófonos, una mezcladora sencilla, un par de bocinas bien ubicadas y amplificación, más un micrófono extra para lecturas o invitados.</p>
<h3>¿Cómo evito el silbido o acople?</h3>
<p>Con buena ubicación de micrófonos y bocinas, ajuste de niveles y, en muchos casos, procesamiento. Mejorar la acústica también ayuda.</p>
<h3>¿Puedo instalarlo por etapas?</h3>
<p>Sí. Se puede empezar por la voz y ampliar a música, pantallas o transmisión, dejando previsto el cableado.</p>

<p>Conoce nuestro servicio de <a href="/eventos-y-produccion/centros-de-culto">audio y video para centros de culto</a> o <a href="${WA}">escríbenos por WhatsApp</a> con el tamaño del recinto y el número de asistentes.</p>
`,
  },
];
