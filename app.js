const modules = [
  { id:'dispositivos', icon:'▣', title:'Dispositivos digitales', description:'Conoce las partes de tu celular, tableta o computador y aprende a usarlas con confianza.', lessons:[['Conoce tu dispositivo','Aprenderás a identificar la pantalla, los botones, el teclado y las opciones principales.',['Ubica el botón de encendido.','Reconoce el control de volumen.','Identifica cómo volver a la pantalla principal.']],['Toques y movimientos','Practicarás gestos sencillos para navegar.',['Toca una vez para seleccionar.','Desliza para mover el contenido.','Mantén presionado para ver opciones.']],['Cuidado y batería','Aprenderás hábitos para cuidar tu equipo.',['Carga el equipo en un lugar seguro.','Evita compartirlo con desconocidos.','Actualiza cuando el dispositivo lo solicite.']]] },
  { id:'internet', icon:'◎', title:'Internet y correo', description:'Navega, busca información y aprende a reconocer mensajes confiables.', lessons:[['Navegar por internet','Una dirección web te lleva a un sitio específico. Revisa que la página sea conocida antes de ingresar información.',['Usa el buscador para encontrar un tema.','Verifica el nombre del sitio.','No abras enlaces que te generen desconfianza.']],['Correo electrónico','El correo permite enviar y recibir mensajes, documentos y fotografías.',['Revisa quién envía el mensaje.','Escribe un asunto claro.','No compartas claves por correo.']],['Información confiable','Antes de compartir una noticia, busca el mismo dato en más de una fuente.',['Revisa la fecha.','Busca la fuente original.','Pregunta si algo parece extraño.']]] },
  { id:'ia', icon:'✦', title:'Inteligencia artificial', description:'Descubre qué es la IA, para qué sirve y cómo usarla de manera crítica y responsable.', lessons:[['¿Qué es la inteligencia artificial?','La inteligencia artificial es una tecnología que reconoce patrones y produce resultados a partir de datos. Puede ayudar, pero no reemplaza el criterio humano.',['Pide explicaciones con palabras sencillas.','Compara las respuestas con fuentes confiables.','Recuerda que puede equivocarse.']],['Preguntar con claridad','Una instrucción clara ayuda a obtener una respuesta más útil. No incluyas datos privados.',['Explica lo que necesitas.','Indica el contexto general.','Revisa el resultado antes de usarlo.']],['Uso responsable','Usa la IA como apoyo para aprender y organizar ideas, no como sustituto de tus decisiones.',['Protege tu privacidad.','Reconoce posibles sesgos o errores.','Decide con criterio propio.']]] },
  { id:'seguridad', icon:'◇', title:'Seguridad digital', description:'Protege tus cuentas, tu privacidad y tu información frente a fraudes y engaños.', lessons:[['Contraseñas seguras','Una contraseña larga y diferente para cada cuenta ayuda a proteger tu información.',['No uses fechas fáciles de adivinar.','No compartas tu contraseña.','Activa la verificación en dos pasos cuando sea posible.']],['Reconoce un fraude','Los mensajes urgentes que piden dinero o claves son una señal de alerta.',['Detente antes de responder.','Verifica por un canal oficial.','No abras enlaces sospechosos.']],['Tu privacidad','Comparte solo la información necesaria y revisa los permisos de cada aplicación.',['Cuida tus datos personales.','Evita publicar información sensible.','Pide ayuda ante una situación dudosa.']]] }
];

const state = { moduleId:null, lessonIndex:0, completed:JSON.parse(localStorage.getItem('digiadul-completed') || '[]') };
const $ = (selector) => document.querySelector(selector);
const live = (message) => { $('#live-region').textContent = message; };

function renderModules() {
  const grid = $('#module-grid');
  grid.innerHTML = modules.map(module => {
    const done = state.completed.filter(item => item.startsWith(`${module.id}:`)).length;
    return `<article class="module-card"><div class="module-symbol" aria-hidden="true">${module.icon}</div><h2>${module.title}</h2><p>${module.description}</p><span class="module-meta">${done} de ${module.lessons.length} lecciones completadas</span><button type="button" data-module="${module.id}">Ver módulo <span aria-hidden="true">→</span></button></article>`;
  }).join('');
  grid.querySelectorAll('[data-module]').forEach(button => button.addEventListener('click', () => openLesson(button.dataset.module, 0)));
  const started = modules.filter(module => state.completed.some(item => item.startsWith(`${module.id}:`))).length;
  $('#progress-label').textContent = `${started} de ${modules.length} módulos iniciados`;
  $('#progress-bar').style.width = `${(started / modules.length) * 100}%`;
}

function openLesson(moduleId, lessonIndex) {
  state.moduleId = moduleId; state.lessonIndex = lessonIndex;
  const module = modules.find(item => item.id === moduleId); const lesson = module.lessons[lessonIndex];
  $('#lesson-module').textContent = module.title; $('#lesson-title').textContent = lesson[0]; $('#lesson-icon').textContent = module.icon;
  $('#lesson-step').textContent = `Lección ${lessonIndex + 1} de ${module.lessons.length}`;
  $('#lesson-progress-bar').style.width = `${((lessonIndex + 1) / module.lessons.length) * 100}%`;
  $('#lesson-content').innerHTML = `<p>${lesson[1]}</p><h2>Ideas clave</h2><ul>${lesson[2].map(item => `<li>${item}</li>`).join('')}</ul>`;
  const activity = lessonIndex === 0 ? `<strong>Actividad rápida</strong><p>¿Qué acción te parece más importante para comenzar?</p><label class="choice"><input type="radio" name="quick" value="1"> Practicar sin prisa</label><label class="choice"><input type="radio" name="quick" value="2"> Compartir mis claves</label>` : `<strong>Actividad práctica</strong><p>Escribe una palabra o idea que quieras recordar de esta lección.</p><label for="reflection" class="sr-only">Mi aprendizaje</label><input id="reflection" type="text" placeholder="Escribe aquí tu idea">`;
  $('#lesson-activity').innerHTML = activity;
  $('#complete-lesson').textContent = lessonIndex === module.lessons.length - 1 ? 'Completar módulo ✓' : 'Siguiente lección →';
  showPage('leccion');
}

function showPage(pageId) { document.querySelectorAll('.page').forEach(page => page.classList.toggle('active', page.dataset.page === pageId)); window.scrollTo({top:0,behavior:'smooth'}); $('#contenido').focus({preventScroll:true}); }

document.addEventListener('click', event => { const route = event.target.closest('[data-route]')?.dataset.route; if (route) { if (route === 'modulos') renderModules(); showPage(route); } });
$('#complete-lesson').addEventListener('click', () => { const key = `${state.moduleId}:${state.lessonIndex}`; if (!state.completed.includes(key)) { state.completed.push(key); localStorage.setItem('digiadul-completed', JSON.stringify(state.completed)); } const module = modules.find(item => item.id === state.moduleId); if (state.lessonIndex < module.lessons.length - 1) { live('Lección completada. Pasas a la siguiente lección.'); openLesson(state.moduleId, state.lessonIndex + 1); } else { live(`Módulo ${module.title} completado.`); renderModules(); showPage('modulos'); } });
$('#font-toggle').addEventListener('click', event => { const active = document.body.classList.toggle('large-text'); event.currentTarget.setAttribute('aria-pressed', active); event.currentTarget.textContent = active ? 'Texto normal' : 'Aumentar texto'; live(active ? 'Texto aumentado.' : 'Texto normal restaurado.'); });
$('#contrast-toggle').addEventListener('click', event => { const active = document.body.classList.toggle('high-contrast'); event.currentTarget.setAttribute('aria-pressed', active); event.currentTarget.setAttribute('aria-label', active ? 'Desactivar alto contraste' : 'Activar alto contraste'); live(active ? 'Alto contraste activado.' : 'Alto contraste desactivado.'); });
renderModules();
if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
