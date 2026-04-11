/* ============================================================
   AgroVision SaaS Platform — Application Logic (app.js)
   ============================================================ */

// ── Config ──────────────────────────────────────────────────
const CFG = {
  openWeatherKey: 'bd5e378503939ddaee76f12ad7a97608', // demo key
  city: 'Bogota',
  country: 'CO',
};

// ── State ────────────────────────────────────────────────────
const S = {
  dark: true,
  sidebarCollapsed: false,
  currentPage: 'inicio',
  alertsCount: 3,
  predictions: [],
  analyses: [],
  historyLog: [],
  libFilter: 'all',
  libSearch: '',
  user: null,
};

// ── Library Dataset ──────────────────────────────────────────
const LIBRARY = [
  { id:1, cat:'cacao', title:'Moniliasis del Cacao', severity:'Alta', severityClass:'bg-red',
    img:'https://images.unsplash.com/photo-1637247002390-bf4c3e2b27e0?auto=format&fit=crop&w=400&q=70',
    desc:'Enfermedad fúngica causada por Moniliopthora roreri. Afecta mazorcas causando pudrición interna blanca.',
    symptoms:'Manchas acuosas en mazorcas, polvo blanquecino esporífero, frutos deformes y prematuros.',
    treatment:'Remoción de frutos enfermos cada 8 días, fungicidas cúpricos, sombrío regulado al 30%.', tags:['hongo','mazorca','postcosecha'] },
  { id:2, cat:'cacao', title:'Escoba de Bruja', severity:'Muy Alta', severityClass:'bg-red',
    img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=400&q=70',
    desc:'Moniliopthora perniciosa es uno de los patógenos más devastadores del cacao en América Latina.',
    symptoms:'Proliferación de brotes escobiformes, mazorcas chirimoya, ramas secas y necrosis sistémica.',
    treatment:'Podas sanitarias intensivas, fungicidas sistémicos, variedades resistentes CCN-51 y FSV-41.', tags:['hongo','sistémica','brote'] },
  { id:3, cat:'cafe', title:'Roya del Cafeto', severity:'Alta', severityClass:'bg-red',
    img:'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=400&q=70',
    desc:'Hemileia vastatrix causa lesiones anaranjadas en hojas, reduciendo la fotosíntesis hasta un 60%.',
    symptoms:'Pústulas naranjas en el envés de hojas, defoliación prematura y reducción de cosecha.',
    treatment:'Fungicidas triazoles (ciproconazol), variedad Castillo, manejo de sombra y fertilización.', tags:['hongo','hojas','defoliación'] },
  { id:4, cat:'cafe', title:'Broca del Café', severity:'Alta', severityClass:'bg-orange',
    img:'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=70',
    desc:'Hypothenemus hampei perfora el grano desde el ombligo hasta el interior, destruyendo su calidad.',
    symptoms:'Orificios circulares de 1mm en granos, polvillo en la perforación, pérdida de peso.',
    treatment:'Trampas BROCAP con mezcla alcohólica, Beauveria bassiana, cosecha oportuna.', tags:['insecto','grano','calidad'] },
  { id:5, cat:'plagas', title:'Áfidos (Pulgones)', severity:'Media', severityClass:'bg-gold',
    img:'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?auto=format&fit=crop&w=400&q=70',
    desc:'Insectos dípteros que colonizan brotes tiernos, segregando melaza que favorece la fumagina.',
    symptoms:'Brotes curvados, hojas pegajosas, presencia de fumagina negra, debilitamiento del cultivo.',
    treatment:'Jabón potásico al 2%, extracto de neem, liberación de Chrysoperla carnea.', tags:['insecto','foliar','brote'] },
  { id:6, cat:'saludable', title:'Café en Óptimo Estado', severity:'Ninguna', severityClass:'bg-green',
    img:'https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?auto=format&fit=crop&w=400&q=70',
    desc:'Cafeto en plena producción con manejo agronómico integrado y condiciones agroecológicas óptimas.',
    symptoms:'Hojas verde brillante, floración abundante, granos uniformes, brotes activos y vigorosos.',
    treatment:'Fertilización cada 90 días, poda de renovación cada 5 años, monitoreo mensual.', tags:['saludable','floración','productivo'] },
  { id:7, cat:'saludable', title:'Cacao Productivo', severity:'Ninguna', severityClass:'bg-green',
    img:'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400&q=70',
    desc:'Árbol de cacao en fase productiva con mazorcas vigorosas y follaje denso y sano.',
    symptoms:'Mazorcas coloreadas y firmes, árbol vigoroso, sin lesiones visibles en tallo ni hojas.',
    treatment:'Fertilización NPK 15-15-15, control de sombra al 30-35%, riego suplementario.', tags:['saludable','mazorca','producción'] },
  { id:8, cat:'cafe', title:'Ojo de Gallo (Cercospora)', severity:'Media', severityClass:'bg-gold',
    img:'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=400&q=70',
    desc:'Cercospora coffeicola provoca lesiones necróticas circulares en hojas y frutos del café.',
    symptoms:'Manchas circulares con halo amarillo, lesiones necróticas en frutos, defoliación parcial.',
    treatment:'Fungicidas cúpricos preventivos, drenaje mejorado, reducción de humedad foliar.', tags:['hongo','foliar','fruto'] },
  { id:9, cat:'plagas', title:'Minador de la Hoja', severity:'Media', severityClass:'bg-gold',
    img:'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=400&q=70',
    desc:'Larvas de Leucoptera coffeella construyen galerías entre el haz y el envés de las hojas.',
    symptoms:'Minas plateadas serpenteantes en hojas, defoliación severa en ataques intensos.',
    treatment:'Insecticidas sistémicos selectivos, trampas amarillas adhesivas, control biológico.', tags:['larva','foliar','galería'] },
];

// ── News Dataset ─────────────────────────────────────────────
const NEWS = [
  { id:1, cat:'cafe', title:'Colombia rompe récord de exportaciones de café especial en 2026', excerpt:'Las exportaciones de café especial colombiano alcanzaron 3.2 millones de sacos en el primer trimestre, un incremento del 18% respecto al año anterior, impulsado por la demanda de mercados asiáticos.', date:'11 Abr 2026', src:'FNC', time:'3 min', img:'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=70', catClass:'bg-gold' },
  { id:2, cat:'cacao', title:'IA revoluciona detección temprana de Moniliasis con 94% de precisión', excerpt:'Investigadores de la Universidad Nacional desarrollan modelo de visión computacional que detecta Moniliasis antes de síntomas visibles, permitiendo intervención preventiva que reduce pérdidas hasta un 60%.', date:'09 Abr 2026', src:'AgroTech CO', time:'5 min', img:'https://images.unsplash.com/photo-1606914469633-bd3f3a129f7e?auto=format&fit=crop&w=600&q=70', catClass:'bg-orange' },
  { id:3, cat:'clima', title:'Fenómeno La Niña: impacto crítico en cultivos del segundo semestre', excerpt:'El IDEAM proyecta lluvias 25-30% superiores al promedio histórico para junio-septiembre. Los agricultores deben ajustar planes de fumigación, drenajes y poscosecha para mitigar riesgos fitosanitarios.', date:'08 Abr 2026', src:'IDEAM', time:'4 min', img:'https://images.unsplash.com/photo-1504489516408-1b38dc8e0c95?auto=format&fit=crop&w=600&q=70', catClass:'bg-blue' },
  { id:4, cat:'tecnologia', title:'Drones NDVI reducen uso de agroquímicos en un 40% en Huila', excerpt:'Cooperativas cafetales implementan monitoreo multiespectral con resolución de 5cm/px, generando mapas de vigor foliar que permiten aplicaciones de precisión y reducen el impacto ambiental.', date:'07 Abr 2026', src:'AgriDrones CO', time:'6 min', img:'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=600&q=70', catClass:'bg-purple' },
  { id:5, cat:'cafe', title:'Precio del café arábica alcanza USD $3.82/lb: máximo de la última década', excerpt:'La Bolsa de Nueva York registra el precio más alto del café arábica desde 2011, impulsado por restricciones de oferta en Brasil por heladas atípicas y la alta demanda post-pandémica de cafés de especialidad.', date:'06 Abr 2026', src:'Bloomberg Agro', time:'2 min', img:'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=600&q=70', catClass:'bg-gold' },
  { id:6, cat:'cacao', title:'Colombia gana Medalla de Oro en Salon du Chocolat París 2026', excerpt:'El cacao fino de aroma del Huila colombiano recibe reconocimiento internacional por sus notas florales y frutales excepcionales, abriendo nuevos mercados premium en Europa y Japón.', date:'05 Abr 2026', src:'Proexport', time:'3 min', img:'https://images.unsplash.com/photo-1481391319762-47dff72954d9?auto=format&fit=crop&w=600&q=70', catClass:'bg-orange' },
];

// ── Alerts Dataset ───────────────────────────────────────────
const ALERTS_DATA = [
  { id:1, type:'critical', icon:'fa-cloud-rain', title:'Alerta Roja: Exceso de Lluvias Proyectado', msg:'Precipitaciones superiores a 130mm en próximas 48h. Riesgo de anegamiento en zonas bajas. Suspender aplicaciones foliares y revisar drenajes inmediatamente.', time:'Hace 2 horas', read:false },
  { id:2, type:'warning', icon:'fa-thermometer-three-quarters', title:'Temperatura Máxima Sostenida (+34°C)', msg:'Tercer día consecutivo con temperaturas mayores a 34°C. Incremento del ciclo reproductivo de broca. Revisar trampas BROCAP y aumentar frecuencia de monitoreo.', time:'Hace 5 horas', read:false },
  { id:3, type:'warning', icon:'fa-bug', title:'Umbral de Broca Superado en Lotes 3 y 4', msg:'Conteo de infestación: 5.2%. El umbral económico de acción es 5%. Activar plan de control biológico con Beauveria bassiana en los próximos 3 días.', time:'Ayer 14:30', read:false },
  { id:4, type:'info', icon:'fa-droplet-slash', title:'Déficit Hídrico Próximas 3 Semanas', msg:'Los modelos climáticos indican un 40% de déficit hídrico. Active sistema de riego suplementario y aplique mulching para conservar humedad.', time:'Ayer 09:00', read:true },
  { id:5, type:'success', icon:'fa-chart-line', title:'Productividad 12% por Encima del Promedio Regional', msg:'Sus registros de rendimiento superan el promedio regional este período. El plan de fertilización integrado está dando resultados óptimos. ¡Excelente manejo!', time:'Hace 2 días', read:true },
  { id:6, type:'info', icon:'fa-flask', title:'Recordatorio: Análisis de Suelos Pendiente', msg:'Han pasado 6 meses desde el último análisis de suelos. Realice uno nuevo antes del próximo ciclo de fertilización para ajustar las dosis de NPK.', time:'Hace 3 días', read:true },
];

const EXPERTS = [
  { name:'Dr. Carlos Montoya', spec:'Fitopatología & Cacao', rating:4.9, reviews:124, av:'CM', available:true },
  { name:'Ing. María Sierra', spec:'Caficultura & Nutrición Vegetal', rating:4.8, reviews:98, av:'MS', available:true },
  { name:'PhD. Andrés Reyes', spec:'Entomología Agrícola Aplicada', rating:4.7, reviews:76, av:'AR', available:false },
];

// ── Initialization ───────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  loadStorage();
  applyTheme();
  applySidebar();
  createToastContainer();

  if (supabaseClient) {
    await checkAuth();
    supabaseClient.auth.onAuthStateChange(async (event, session) => {
      const { data: { user } } = await supabaseClient.auth.getUser();
      S.user = user || null;
      updateAuthUI();
      if (!user && !['inicio', 'login', 'registro'].includes(S.currentPage)) {
        window.location.href = "index.html";
      }
    });
  }

  setTimeout(() => {
    const loader = document.getElementById('agro-loader');
    if (loader) { loader.classList.add('fade-out'); setTimeout(() => loader.remove(), 600); }

    navigateTo('inicio');
    if (window.AOS) AOS.init({ duration: 750, once: true, offset: 70 });
    animateHero();
    fetchWeather();
    initCharts();
    animateCounters();
  }, 1900);
});

// ── Theme ────────────────────────────────────────────────────
function applyTheme() {
  const saved = localStorage.getItem('agv_theme') || 'dark';
  S.dark = saved !== 'light';
  document.body.classList.toggle('light', !S.dark);
  const ic = document.getElementById('themeIcon');
  if (ic) ic.className = S.dark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
}

function toggleTheme() {
  S.dark = !S.dark;
  document.body.classList.toggle('light', !S.dark);
  localStorage.setItem('agv_theme', S.dark ? 'dark' : 'light');
  const ic = document.getElementById('themeIcon');
  if (ic) ic.className = S.dark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  showToast(S.dark ? 'Modo oscuro activado' : 'Modo claro activado', 'success');
}

// ── Sidebar ──────────────────────────────────────────────────
function applySidebar() {
  const sv = localStorage.getItem('agv_sidebar') || 'expanded';
  S.sidebarCollapsed = sv === 'collapsed';
  const sb = el('sidebar'), aw = el('appWrap'), nb = el('mainNavbar');
  if (sb) sb.classList.toggle('collapsed', S.sidebarCollapsed);
  if (aw) aw.classList.toggle('contracted', S.sidebarCollapsed);
  if (nb) nb.classList.toggle('contracted', S.sidebarCollapsed);
  const ti = el('sidebarToggleIcon');
  if (ti) ti.className = S.sidebarCollapsed ? 'fa-solid fa-chevron-right' : 'fa-solid fa-chevron-left';
}

function toggleSidebar() {
  S.sidebarCollapsed = !S.sidebarCollapsed;
  localStorage.setItem('agv_sidebar', S.sidebarCollapsed ? 'collapsed' : 'expanded');
  applySidebar();
}

function toggleMobileSidebar() {
  const sb = el('sidebar');
  if (sb) sb.classList.toggle('mobile-open');
}

// ── Navigation ───────────────────────────────────────────────
function navigateTo(page) {
  const protectedPages = ['dashboard', 'prediccion', 'imagen', 'alertas', 'asesoria', 'historial', 'configuracion', 'comentarios'];
  if (protectedPages.includes(page) && !S.user) {
    showToast('Debes iniciar sesión para acceder', 'warning');
    page = 'login';
  }
  
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.sb-item').forEach(i => i.classList.remove('active'));
  const pg = el(`page-${page}`);
  if (pg) { pg.classList.add('active'); }
  const si = document.querySelector(`.sb-item[data-page="${page}"]`);
  if (si) si.classList.add('active');
  S.currentPage = page;
  window.scrollTo({ top: 0 });
  // Close mobile sidebar
  const sb = el('sidebar');
  if (sb) sb.classList.remove('mobile-open');
  // Page-specific
  const runners = { dashboard: updateDashboard, noticias: () => renderNews('all'), biblioteca: renderLibrary, alertas: renderAlerts, asesoria: renderAdvisory, historial: renderHistory, comentarios: fetchComentarios, configuracion: loadConfigData };
  if (runners[page]) runners[page]();
}

// ── GSAP Hero ────────────────────────────────────────────────
function animateHero() {
  if (!window.gsap) return;
  const tl = gsap.timeline();
  tl.from('.hero-eyebrow', { duration: 0.8, opacity: 0, y: 30, ease: 'power3.out' })
    .from('.hero-title', { duration: 1, opacity: 0, y: 40, ease: 'power3.out' }, '-=0.5')
    .from('.hero-desc', { duration: 0.8, opacity: 0, y: 25, ease: 'power3.out' }, '-=0.6')
    .from('.hero-actions', { duration: 0.7, opacity: 0, y: 18, ease: 'power3.out' }, '-=0.5')
    .from('.hero-stats-row', { duration: 0.7, opacity: 0, y: 18, ease: 'power3.out' }, '-=0.4');
  // Floating particles
  createParticles();
}

function createParticles() {
  const container = el('heroParticles');
  if (!container) return;
  for (let i = 0; i < 12; i++) {
    const p = document.createElement('div');
    const size = 4 + Math.random() * 10;
    const dur = 7 + Math.random() * 8;
    const delay = Math.random() * 5;
    p.className = 'hero-particle';
    p.style.cssText = `width:${size}px;height:${size}px;left:${Math.random()*100}%;top:${Math.random()*100}%;--dur:${dur}s;animation-delay:-${delay}s;`;
    container.appendChild(p);
  }
}

// ── Counter Animation ────────────────────────────────────────
function animateCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const isFloat = el.dataset.count.includes('.');
    const dur = 2000;
    const start = performance.now();
    const anim = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      el.textContent = (isFloat ? (target * e).toFixed(1) : Math.round(target * e).toLocaleString()) + suffix;
      if (p < 1) requestAnimationFrame(anim);
    };
    requestAnimationFrame(anim);
  });
}

// ── Weather API ──────────────────────────────────────────────
async function fetchWeather() {
  const fallback = { main:{ temp:22, humidity:74, feels_like:23 }, weather:[{ description:'parcialmente nublado' }], wind:{ speed:3.2 }, name:'Bogotá, CO' };
  try {
    const r = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${CFG.city},${CFG.country}&appid=${CFG.openWeatherKey}&units=metric&lang=es`);
    if (!r.ok) throw new Error('API fallback');
    const d = await r.json(); updateWeatherUI(d);
  } catch { updateWeatherUI(fallback); }
}

function updateWeatherUI(d) {
  const set = (id, v) => { const e = el(id); if (e) e.textContent = v; };
  set('wTemp', `${Math.round(d.main.temp)}°`);
  set('wDesc', d.weather?.[0]?.description || 'N/A');
  set('wHumidity', `${d.main.humidity}%`);
  set('wWind', `${d.wind?.speed?.toFixed(1) ?? '-'} m/s`);
  set('wFeels', `${Math.round(d.main.feels_like)}°C`);
  set('wCity', d.name);
}

// ── Dashboard ────────────────────────────────────────────────
let cProd, cHealth, cMonthly, cClimate;

function initCharts() {
  const CC = { muted: S.dark ? '#6b7280' : '#9ca3af', border: 'rgba(34,197,94,0.1)', tt: { bg:'rgba(10,20,12,0.95)', title:'#22c55e', body:'#9ca3af' } };
  const sc = (c) => ({ x:{ grid:{ color:CC.border }, ticks:{ color:CC.muted } }, y:{ grid:{ color:CC.border }, ticks:{ color:CC.muted }, beginAtZero:true } });

  const c1 = el('chartProd');
  if (c1 && !cProd) {
    cProd = new Chart(c1, {
      type: 'bar',
      data: {
        labels: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago'],
        datasets: [
          { label:'Café (kg)', data:[1200,1450,1100,1350,1600,1800,1550,1700], backgroundColor:'rgba(34,197,94,0.8)', borderRadius:7, borderSkipped:false },
          { label:'Cacao (kg)', data:[800,950,780,890,1100,1200,1050,1150], backgroundColor:'rgba(16,185,129,0.45)', borderRadius:7, borderSkipped:false }
        ]
      },
      options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ labels:{ color:CC.muted, font:{ size:11 } } }, tooltip:{ backgroundColor:CC.tt.bg, titleColor:CC.tt.title, bodyColor:CC.tt.body, borderColor:CC.border, borderWidth:1 } }, scales:sc() }
    });
  }
  const c2 = el('chartHealth');
  if (c2 && !cHealth) {
    cHealth = new Chart(c2, {
      type: 'doughnut',
      data: {
        labels: ['Excelente','Bueno','Regular','Crítico'],
        datasets: [{ data:[45,30,20,5], backgroundColor:['#22c55e','#10b981','#f59e0b','#ef4444'], borderWidth:0, hoverOffset:8 }]
      },
      options: { responsive:true, cutout:'70%', plugins:{ legend:{ position:'bottom', labels:{ color:CC.muted, padding:16, font:{ size:11 } } } }, animation:{ animateScale:true } }
    });
  }
  const c3 = el('chartMonthly');
  if (c3 && !cMonthly) {
    cMonthly = new Chart(c3, {
      type: 'line',
      data: {
        labels: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago'],
        datasets: [{ label:'Rendimiento (kg/Ha)', data:[580,620,570,640,710,760,720,780], borderColor:'#22c55e', backgroundColor:'rgba(34,197,94,0.1)', fill:true, tension:0.4, pointBackgroundColor:'#22c55e', pointRadius:4, pointHoverRadius:7 }]
      },
      options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ labels:{ color:CC.muted, font:{ size:11 } } }, tooltip:{ backgroundColor:CC.tt.bg, titleColor:CC.tt.title, bodyColor:CC.tt.body, borderColor:CC.border, borderWidth:1 } }, scales:sc() }
    });
  }
  const c4 = el('chartClimate');
  if (c4 && !cClimate) {
    cClimate = new Chart(c4, {
      type: 'line',
      data: {
        labels: ['Ene','Feb','Mar','Abr','May','Jun'],
        datasets: [
          { label:'Lluvia (mm)', data:[80,110,95,140,120,90], borderColor:'#3b82f6', backgroundColor:'rgba(59,130,246,0.1)', fill:true, tension:0.4, yAxisID:'y1' },
          { label:'Rendimiento (%)', data:[75,82,78,65,88,85], borderColor:'#22c55e', backgroundColor:'rgba(34,197,94,0.1)', fill:true, tension:0.4, yAxisID:'y' }
        ]
      },
      options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ labels:{ color:CC.muted, font:{ size:11 } } } }, scales:{ x:{ grid:{ color:CC.border }, ticks:{ color:CC.muted } }, y:{ grid:{ color:CC.border }, ticks:{ color:CC.muted } }, y1:{ position:'right', grid:{ display:false }, ticks:{ color:'#3b82f6' } } } }
    });
  }
}

function updateDashboard() {
  const totalKg = S.predictions.reduce((s,p) => s + (p.kg||0), 0);
  const totHa = S.predictions.reduce((s,p) => s + (parseFloat(p.area)||0), 0);
  setText('kpiProd', totalKg > 0 ? `${totalKg.toLocaleString()} kg` : '0 kg');
  setText('kpiArea', totHa > 0 ? `${totHa.toFixed(1)} Ha` : '0 Ha');
  setText('kpiAnalyses', S.analyses.length || 0);
  setText('kpiAlerts', S.alertsCount);
  renderMarketPrices();
  renderHistoryRows();
}

function renderMarketPrices() {
  const cont = el('marketPrices');
  if (!cont) return;
  const prices = [
    { label:'Café Arábica', icon:'fa-mug-hot', val:'$3.82', unit:'USD/lb', chg:'+0.05', pct:'+1.3%', up:true },
    { label:'Cacao', icon:'fa-seedling', val:'$4,280', unit:'USD/TM', chg:'-45', pct:'-1.0%', up:false },
    { label:'Fert. NPK', icon:'fa-flask', val:'$520', unit:'USD/TM', chg:'+10', pct:'+2.1%', up:true },
  ];
  cont.innerHTML = prices.map(p => `
    <div class="mkt-item">
      <div class="mkt-label"><i class="fa-solid ${p.icon}"></i> ${p.label}</div>
      <div>
        <div class="mkt-price">${p.val} <span class="mkt-unit">${p.unit}</span></div>
        <div class="mkt-change ${p.up?'mkt-up':'mkt-dn'}">${p.up?'▲':'▼'} ${p.pct}</div>
      </div>
    </div>`).join('');
}

// ── Prediction Engine ────────────────────────────────────────
function runPrediction(e) {
  e.preventDefault();
  const cultivo = val('predCultivo');
  const area = parseFloat(val('predArea')) || 1;
  const temp = parseFloat(val('predTemp')) || 22;
  const hum = parseFloat(val('predHum')) || 72;
  const rain = parseFloat(val('predRain')) || 120;
  const alt = parseFloat(val('predAlt')) || 1500;
  const soil = val('predSoil') || 'franco';

  // AI Simulation Logic
  const base = cultivo === 'cafe' ? 1350 : 920;

  const tempOpt = cultivo === 'cafe' ? 21 : 26;
  const tF = Math.max(0.48, 1 - Math.abs(temp - tempOpt) * 0.047);

  const hF = (hum >= 65 && hum <= 85) ? 1.02 : (hum >= 55 && hum <= 92) ? 0.88 : 0.68;

  const annualR = rain * 12;
  const rF = (annualR >= 1400 && annualR <= 2200) ? 1.06 : (annualR >= 900) ? 0.84 : 0.62;

  const aF = cultivo === 'cafe' ? ((alt >= 1200 && alt <= 1800) ? 1.12 : (alt >= 900) ? 0.9 : 0.72) : ((alt >= 200 && alt <= 800) ? 1.05 : 0.8);

  const soilMap = { franco:1.1, humifero:1.18, arcilloso:0.88, argiloso:0.94, arenoso:0.76 };
  const sF = soilMap[soil] || 1.0;

  const variation = 0.94 + Math.random() * 0.12;
  const kgHa = Math.round(base * tF * hF * rF * aF * sF * variation);
  const totalKg = Math.round(kgHa * area);
  const prod = Math.min(100, Math.round((kgHa / base) * 100));
  const risk = prod < 62 ? 'Alto' : prod < 83 ? 'Medio' : 'Bajo';
  const confidence = Math.round(81 + Math.random() * 16);
  const recs = buildRecs(cultivo, temp, hum, rain, soil, prod);

  // Show result panel, hide placeholder
  const panel = el('predResultPanel');
  const placeholder = el('predPlaceholder');
  if (placeholder) placeholder.style.display = 'none';
  if (panel) { panel.style.display = 'flex'; panel.scrollIntoView({ behavior:'smooth', block:'nearest' }); }
  // Update config stats
  const sp = el('statPreds'); if (sp) sp.textContent = S.predictions.length + 1;


  animVal('resTotalKg', 0, totalKg, 1400, v => `${Math.round(v).toLocaleString()}`);
  animVal('resKgHa', 0, kgHa, 1400, v => `${Math.round(v).toLocaleString()} kg/Ha`);
  animVal('resProd', 0, prod, 1200, v => `${Math.round(v)}%`);
  setText('resRisk', risk);
  setText('resConf', `${confidence}%`);
  const re = el('resRisk');
  if (re) re.style.color = prod >= 83 ? 'var(--primary)' : prod >= 62 ? 'var(--gold)' : 'var(--red)';

  const bar = el('resProdBar');
  if (bar) { setTimeout(() => { bar.style.width = `${prod}%`; bar.style.background = prod >= 83 ? 'linear-gradient(90deg,#16a34a,#4ade80)' : prod >= 62 ? 'linear-gradient(90deg,#d97706,#fbbf24)' : 'linear-gradient(90deg,#b91c1c,#ef4444)'; }, 100); }

  const recEl = el('resRecs');
  if (recEl) recEl.innerHTML = recs.map(r => `<div class="rec-item"><i class="fa-solid fa-circle-check"></i><span class="rec-text">${r}</span></div>`).join('');

  updatePredChart(area, kgHa, base);

  const record = { cultivo, area, kg:totalKg, kgHa, productivity:prod, risk, confidence, recs };
  
  if (supabaseClient && S.user) {
    guardarPrediccion(record).then(() => {
      cargarHistorial();
    });
  } else {
    // Fallback if not logged in
    const localRec = { ...record, date:new Date().toLocaleDateString('es-CO'), type:'Predicción IA', rawType:'prediccion' };
    S.predictions.unshift(localRec);
    S.historyLog.unshift(localRec);
    saveStorage();
  }

  showToast(`✅ Producción estimada: ${totalKg.toLocaleString()} kg`, 'success');
}

function buildRecs(cultivo, temp, hum, rain, soil, prod) {
  const r = [];
  if (prod < 68) r.push('Realizar análisis de suelos completo y corregir deficiencias de macronutrientes.');
  if (temp > 28) r.push('Implementar sombrío del 30-40% para reducir temperatura del dosel foliar.');
  if (temp < 17) r.push('Evaluar variedades más tolerantes a bajas temperaturas para esta altitud.');
  if (hum < 63) r.push('Programar riegos suplementarios cada 8-10 días durante estiaje.');
  if (hum > 90) r.push('Mejorar drenajes y ventilación para reducir incidencia de enfermedades fúngicas.');
  if (rain < 80) r.push('Instalar reservorios de captación de agua lluvia para riego de apoyo.');
  if (soil === 'arenoso') r.push('Incorporar materia orgánica y humus para mejorar CIC y retención hídrica.');
  if (cultivo === 'cafe') r.push('Programar poda de formación o renovación según edad y ciclo del cultivo.');
  if (cultivo === 'cacao') r.push('Mantener densidad de sombra del 25-35% con leguminosas de apoyo.');
  r.push('Implementar monitoreo mensual documentado de plagas y enfermedades con GPS.');
  return r.slice(0, 4);
}

let pChart;
function updatePredChart(area, kgHa, base) {
  const ctx = el('chartPrediction');
  if (!ctx) return;
  if (pChart) pChart.destroy();
  const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  const seasonal = [0.58,0.68,0.82,0.9,1.0,1.1,1.05,0.95,0.85,0.88,0.78,0.62];
  pChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: months,
      datasets: [
        { label:'Producción proyectada (kg)', data:seasonal.map(f => Math.round(kgHa*area*f/3)), borderColor:'#22c55e', backgroundColor:'rgba(34,197,94,0.1)', fill:true, tension:0.4, pointBackgroundColor:'#22c55e', pointRadius:3 },
        { label:'Meta óptima (kg)', data:seasonal.map(f => Math.round(base*area*f/3)), borderColor:'#3b82f6', backgroundColor:'transparent', borderDash:[5,5], tension:0.4, pointRadius:0 }
      ]
    },
    options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ labels:{ color:'#6b7280', font:{ size:11 } } } }, scales:{ x:{ grid:{ color:'rgba(34,197,94,0.08)' }, ticks:{ color:'#6b7280' } }, y:{ grid:{ color:'rgba(34,197,94,0.08)' }, ticks:{ color:'#6b7280' }, beginAtZero:true } } }
  });
}

// ── Image Analysis ───────────────────────────────────────────
function initImageUpload() {
  const zone = el('uploadZone');
  const input = el('imgInput');
  if (!zone) return;
  zone.addEventListener('click', () => input?.click());
  zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag-over'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
  zone.addEventListener('drop', e => { e.preventDefault(); zone.classList.remove('drag-over'); if (e.dataTransfer.files[0]) processImage(e.dataTransfer.files[0]); });
  input?.addEventListener('change', () => { if (input.files[0]) processImage(input.files[0]); });
}

function processImage(file) {
  if (!file.type.startsWith('image/')) { showToast('Sube un archivo de imagen válido (JPG, PNG)', 'error'); return; }
  const reader = new FileReader();
  reader.onload = (e) => {
    const pw = el('imgPreviewWrap'), pi = el('imgPreviewImg');
    if (pw && pi) { pi.src = e.target.result; pw.style.display = 'block'; }
    const panel = el('imgResultPanel');
    if (panel) panel.innerHTML = `<div style="text-align:center;padding:2rem;"><div class="loader-spinner" style="margin:auto;"></div><p style="color:var(--muted);margin-top:1rem;font-size:.85rem;">Analizando imagen con IA...</p></div>`;
    const img = new Image();
    img.onload = () => analyzePixels(img, file);
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function analyzePixels(img, file) {
  const c = document.createElement('canvas');
  c.width = Math.min(img.width, 500); c.height = (img.height / img.width) * c.width;
  const ctx = c.getContext('2d'); ctx.drawImage(img, 0, 0, c.width, c.height);
  const d = ctx.getImageData(0, 0, c.width, c.height).data;
  let green = 0, yellow = 0, brown = 0, total = 0;
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i], g = d[i+1], b = d[i+2];
    if (r > 238 && g > 238 && b > 238) continue;
    if (r < 12 && g < 12 && b < 12) continue;
    total++;
    if (g > r * 1.08 && g > b * 1.08 && g > 55) green++;
    else if (r > 100 && g > 78 && b < 85 && r > g * 0.78) yellow++;
    else if (r > 80 && g > 48 && b < 52 && r > g) brown++;
  }
  total = total || 1;
  const pG = (green/total)*100, pY = (yellow/total)*100, pB = (brown/total)*100;
  const health = Math.min(100, Math.max(0, Math.round(pG*1.25 - pY*0.85 - pB*1.3 + 38)));
  let status, conditions, recs;
  if (health >= 75) {
    status = 'Excelente';
    conditions = [{ l:'Clorofila',v:'Alta',c:'text-green fa-check-circle' },{ l:'Plagas',v:'No detectadas',c:'text-green fa-check-circle' },{ l:'Nutrición',v:'Óptima',c:'text-green fa-check-circle' },{ l:'Estrés hídrico',v:'Ninguno',c:'text-green fa-check-circle' }];
    recs = ['Mantener plan de fertilización actual con NPK balanceado','Continuar monitoreo preventivo mensual','Optimizar poda para mejorar ventilación y penetración de luz'];
  } else if (health >= 55) {
    status = 'Bueno';
    conditions = [{ l:'Clorofila',v:'Media',c:'text-green fa-check-circle' },{ l:'Clorosis leve',v:'Detectada',c:'text-gold fa-exclamation-circle' },{ l:'Plagas',v:'Sin evidencia',c:'text-green fa-check-circle' },{ l:'Estrés hídrico',v:'Leve',c:'text-gold fa-exclamation-circle' }];
    recs = ['Aplicar fertilizante foliar con magnesio y zinc','Revisar el plan de riego y considerar mayor frecuencia','Monitorear avance de posible clorosis en próximas semanas'];
  } else if (health >= 35) {
    status = 'Regular';
    conditions = [{ l:'Clorofila',v:'Baja',c:'text-gold fa-exclamation-circle' },{ l:'Clorosis',v:'Moderada',c:'text-gold fa-exclamation-circle' },{ l:'Posibles plagas',v:'Probable',c:'text-gold fa-exclamation-circle' },{ l:'Estrés hídrico',v:'Moderado',c:'text-gold fa-exclamation-circle' }];
    recs = ['Realizar análisis de suelo de urgencia para corregir deficiencias','Aplicar correctores foliares de micronutrientes (Fe, Mn, Zn)','Inspección física en campo para identificar focos de plaga','Aumentar frecuencia de riego y revisar drenaje'];
  } else {
    status = 'Crítico';
    conditions = [{ l:'Clorofila',v:'Muy baja',c:'text-red fa-times-circle' },{ l:'Necrosis',v:'Detectada',c:'text-red fa-times-circle' },{ l:'Enfermedad',v:'Alta probabilidad',c:'text-red fa-times-circle' },{ l:'Estrés severo',v:'Confirmado',c:'text-red fa-times-circle' }];
    recs = ['⚠️ Consultar asesor agrícola profesional de inmediato','Aislar las plantas afectadas para evitar propagación','Aplicar fungicida + insecticida de amplio espectro preventivo','Evaluar viabilidad de renovación del lote afectado'];
  }
  setTimeout(async () => {
    renderImgResult(health, status, pG, pY, pB, conditions, recs);
    const resultObj = { cultivo:'Imagen', status, health, area:'-', kg:'-', productivity:health, risk: health>=55?'Bajo':health>=35?'Medio':'Alto' };
    
    if (supabaseClient && S.user) {
      await guardarAnalisisImagen(file, resultObj);
      cargarHistorial();
    } else {
      // Fallback
      const an = { ...resultObj, date:new Date().toLocaleDateString('es-CO'), type:'Análisis Foliar', rawType:'imagen' };
      S.analyses.unshift(an); S.historyLog.unshift(an); saveStorage();
      showToast(`Diagnóstico local: ${status} (${health}% salud)`, health>=55?'success':health>=35?'warning':'error');
    }
  }, 1600);
}

function renderImgResult(h, status, pG, pY, pB, conditions, recs) {
  const panel = el('imgResultPanel');
  if (!panel) return;
  const sc = h>=75?'bg-green':h>=55?'bg-blue':h>=35?'bg-gold':'bg-red';
  panel.innerHTML = `
    <div class="health-gauge">
      <div class="gauge-val" style="color:${h>=75?'var(--primary)':h>=55?'var(--blue)':h>=35?'var(--gold)':'var(--red)'}">${h}%</div>
      <div class="gauge-lbl">Índice de Salud Foliar</div>
      <div style="margin-top:.75rem;"><span class="badge ${sc}">${status}</span></div>
    </div>
    <div>
      <div class="prog-label"><span>Verde (clorofila): ${pG.toFixed(1)}%</span><span style="color:var(--gold)">Amarillo: ${pY.toFixed(1)}%</span></div>
      <div class="prog-bar"><div class="prog-fill" style="width:${pG}%"></div></div>
    </div>
    <div class="diag-grid">
      ${conditions.map(c=>`<div class="diag-item"><div class="diag-lbl"><i class="fa-solid ${c.c}" style="margin-right:.3rem;font-size:.78rem;"></i>${c.l}</div><div class="diag-val">${c.v}</div></div>`).join('')}
    </div>
    <div>
      <div style="font-weight:700;font-size:.85rem;color:var(--text);margin-bottom:.65rem;"><i class="fa-solid fa-lightbulb text-gold" style="margin-right:.4rem;"></i>Recomendaciones</div>
      ${recs.map(r=>`<div class="rec-item" style="margin-bottom:.5rem;"><i class="fa-solid fa-arrow-right"></i><span class="rec-text">${r}</span></div>`).join('')}
    </div>`;
}

// ── Library ──────────────────────────────────────────────────
function renderLibrary() {
  const q = S.libSearch.toLowerCase();
  const f = S.libFilter;
  const filtered = LIBRARY.filter(item =>
    (f === 'all' || item.cat === f) &&
    (!q || item.title.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q) || item.tags.some(t=>t.includes(q)))
  );
  const grid = el('libraryGrid');
  if (!grid) return;
  if (!filtered.length) { grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--muted)"><i class="fa-solid fa-magnifying-glass" style="font-size:2rem;display:block;margin-bottom:1rem;"></i>Sin resultados para "<b>${q}</b>"</div>`; return; }
  grid.innerHTML = filtered.map(item => `
    <div class="lib-card" onclick="openLibModal(${item.id})">
      <div class="lib-card-img" style="background-image:url('${item.img}')">
        <div class="lib-card-cat"><span class="badge ${item.cat==='saludable'?'bg-green':item.cat==='cafe'?'bg-gold':item.cat==='cacao'?'bg-orange':'bg-red'}">${item.cat}</span></div>
      </div>
      <div class="lib-card-body">
        <div class="lib-card-hd">
          <div class="lib-card-title">${item.title}</div>
          <span class="badge ${item.severityClass}" style="font-size:.6rem;flex-shrink:0;">${item.severity}</span>
        </div>
        <div class="lib-card-desc">${item.desc.substring(0,95)}...</div>
        <div class="lib-tags">${item.tags.map(t=>`<span class="lib-tag">#${t}</span>`).join('')}</div>
      </div>
    </div>`).join('');
}

function filterLib(cat) {
  S.libFilter = cat;
  document.querySelectorAll('.chip[data-lf]').forEach(c => c.classList.toggle('active', c.dataset.lf === cat));
  renderLibrary();
}
function searchLib(q) { S.libSearch = q; renderLibrary(); }

function openLibModal(id) {
  const item = LIBRARY.find(i => i.id === id); if (!item) return;
  const cont = el('libModalContent');
  if (cont) cont.innerHTML = `
    <div style="height:200px;background-image:url('${item.img}');background-size:cover;background-position:center;border-radius:var(--r-lg);margin-bottom:1.5rem;position:relative;">
      <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(7,14,9,.9),transparent);border-radius:var(--r-lg);"></div>
      <div style="position:absolute;bottom:1rem;left:1.25rem;">
        <h3 style="color:#fff;font-size:1.2rem;">${item.title}</h3>
        <span class="badge ${item.severityClass}" style="margin-top:.35rem;">${item.severity}</span>
      </div>
    </div>
    <div class="diag-grid" style="margin-bottom:1.25rem;">
      <div class="diag-item"><div class="diag-lbl">Categoría</div><div class="diag-val">${item.cat}</div></div>
      <div class="diag-item"><div class="diag-lbl">Tags</div><div class="diag-val">${item.tags.join(', ')}</div></div>
    </div>
    <div style="margin-bottom:1rem;"><div style="font-weight:700;color:var(--text);margin-bottom:.45rem;"><i class="fa-solid fa-circle-info text-blue" style="margin-right:.35rem;"></i>Descripción</div><p style="color:var(--muted);font-size:.875rem;line-height:1.75;">${item.desc}</p></div>
    <div style="margin-bottom:1rem;"><div style="font-weight:700;color:var(--text);margin-bottom:.45rem;"><i class="fa-solid fa-eye text-gold" style="margin-right:.35rem;"></i>Síntomas</div><p style="color:var(--muted);font-size:.875rem;line-height:1.75;">${item.symptoms}</p></div>
    <div><div style="font-weight:700;color:var(--text);margin-bottom:.45rem;"><i class="fa-solid fa-syringe text-green" style="margin-right:.35rem;"></i>Tratamiento</div><p style="color:var(--muted);font-size:.875rem;line-height:1.75;">${item.treatment}</p></div>`;
  openModal('libModal');
}

// ── News ─────────────────────────────────────────────────────
function renderNews(cat) {
  const filtered = cat === 'all' ? NEWS : NEWS.filter(n => n.cat === cat);
  const grid = el('newsGrid'); if (!grid) return;
  grid.innerHTML = filtered.map(n => `
    <div class="news-card" onclick="openNewsModal(${n.id})">
      <div class="news-img" style="background-image:url('${n.img}')"></div>
      <div class="news-body">
        <div class="news-meta">
          <span class="badge ${n.catClass}">${n.cat}</span>
          <span class="news-date"><i class="fa-regular fa-calendar" style="margin-right:.25rem;"></i>${n.date}</span>
          <span class="news-date"><i class="fa-regular fa-clock" style="margin-right:.25rem;"></i>${n.time}</span>
        </div>
        <div class="news-title">${n.title}</div>
        <div class="news-excerpt">${n.excerpt.substring(0,115)}...</div>
        <span class="news-more">Leer artículo completo →</span>
      </div>
    </div>`).join('');
  document.querySelectorAll('.news-tab').forEach(t => t.classList.toggle('active', t.dataset.nt === cat));
}

function openNewsModal(id) {
  const n = NEWS.find(x => x.id === id); if (!n) return;
  const cont = el('newsModalContent');
  if (cont) cont.innerHTML = `
    <div style="height:220px;background-image:url('${n.img}');background-size:cover;background-position:center;border-radius:var(--r-lg);margin-bottom:1.5rem;"></div>
    <div style="display:flex;gap:.65rem;margin-bottom:1rem;flex-wrap:wrap;">
      <span class="badge ${n.catClass}">${n.cat}</span>
      <span class="badge bg-teal">${n.src}</span>
      <span style="font-size:.78rem;color:var(--muted);">${n.date} · ${n.time} de lectura</span>
    </div>
    <h2 style="color:var(--text);font-size:1.1rem;margin-bottom:1rem;line-height:1.45;">${n.title}</h2>
    <p style="color:var(--muted);font-size:.88rem;line-height:1.8;">${n.excerpt}</p>
    <p style="color:var(--muted);font-size:.86rem;line-height:1.8;margin-top:1rem;">Los expertos del sector señalan que esta tendencia continuará a lo largo del año, impulsada por la creciente demanda global de productos agrícolas de alta calidad y el crecimiento de los mercados de cafés de especialidad en Asia y Europa del Norte.</p>`;
  openModal('newsModal');
}

// ── Alerts ───────────────────────────────────────────────────
function renderAlerts() {
  const list = el('alertsList'); if (!list) return;
  list.innerHTML = ALERTS_DATA.map(a => `
    <div class="alert-card ${a.type}" id="al-${a.id}" style="${a.read?'opacity:.65':''}">
      <div class="al-icon"><i class="fa-solid ${a.icon}"></i></div>
      <div class="al-body">
        <div class="al-title">${!a.read?'<span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:var(--red);margin-right:.45rem;"></span>':''}${a.title}</div>
        <div class="al-msg">${a.msg}</div>
        <div class="al-time"><i class="fa-regular fa-clock" style="margin-right:.25rem;"></i>${a.time}</div>
      </div>
      <div class="al-actions">
        ${!a.read?`<button class="btn btn-sm btn-secondary" onclick="markReadAlert(${a.id})">Marcar leída</button>`:'<span class="badge bg-green">Leída</span>'}
        <button class="btn btn-sm btn-icon btn-danger" onclick="dismissAlert(${a.id})" title="Descartar"><i class="fa-solid fa-xmark"></i></button>
      </div>
    </div>`).join('');
}

function markReadAlert(id) {
  const a = ALERTS_DATA.find(x => x.id === id);
  if (a && !a.read) { a.read = true; S.alertsCount = Math.max(0, S.alertsCount-1); }
  renderAlerts(); syncAlertBadge(); showToast('Alerta marcada como leída', 'success');
}
function dismissAlert(id) {
  const i = ALERTS_DATA.findIndex(x => x.id === id);
  if (i > -1) { if (!ALERTS_DATA[i].read) S.alertsCount = Math.max(0, S.alertsCount-1); ALERTS_DATA.splice(i,1); }
  renderAlerts(); syncAlertBadge(); showToast('Alerta eliminada', 'success');
}
function markAllAlerts() {
  ALERTS_DATA.forEach(a => a.read = true); S.alertsCount = 0;
  renderAlerts(); syncAlertBadge(); showToast('Todas las alertas marcadas como leídas', 'success');
}
function syncAlertBadge() {
  [el('navAlertBadge'), el('sbAlertBadge')].forEach(b => { if (b) { b.textContent = S.alertsCount; b.style.display = S.alertsCount > 0 ? 'flex' : 'none'; } });
}

// ── Advisory ─────────────────────────────────────────────────
function renderAdvisory() {
  const grid = el('expertsGrid'); if (!grid) return;
  grid.innerHTML = EXPERTS.map(e => `
    <div class="expert-card">
      <div class="expert-avatar">${e.av}</div>
      <div class="expert-name">${e.name}</div>
      <div class="expert-spec">${e.spec}</div>
      <div class="expert-stars">${'★'.repeat(Math.round(e.rating))} ${e.rating} (${e.reviews} reseñas)</div>
      <div style="margin-top:.65rem;"><span class="badge ${e.available?'bg-green':'bg-red'}">${e.available?'Disponible':'No disponible'}</span></div>
      ${e.available ? `<button class="btn btn-primary btn-sm btn-block mt-2" onclick="selectExpert('${e.name}')"><i class='fa-solid fa-calendar-check'></i> Solicitar</button>` : `<button class="btn btn-secondary btn-sm btn-block mt-2" disabled><i class='fa-solid fa-clock'></i> No disponible</button>`}
    </div>`).join('');
}

function selectExpert(name) {
  const inp = el('advExpert'); if (inp) inp.value = name;
  showToast(`${name} seleccionado/a`, 'success');
  el('advisoryForm')?.scrollIntoView({ behavior:'smooth' });
}

function submitAdvisory(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';
  btn.disabled = true;
  setTimeout(() => {
    btn.innerHTML = '<i class="fa-solid fa-check"></i> ¡Solicitud Enviada!';
    btn.style.background = 'var(--teal)';
    showToast('✅ Solicitud enviada. El experto te contactará en máximo 24 horas hábiles.', 'success');
    setTimeout(() => { btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Solicitar Asesoría'; btn.disabled = false; btn.style.background = ''; e.target.reset(); }, 3000);
  }, 1800);
}

// ── History ──────────────────────────────────────────────────
function renderHistory() { 
  if (S.user) {
    cargarHistorial(); 
  } else {
    renderHistoryRows();
  }
}
function renderHistoryRows() {
  const tbody = el('historyBody'); if (!tbody) return;
  if (!S.historyLog.length) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:3rem;color:var(--muted);"><i class="fa-solid fa-folder-open" style="font-size:2rem;display:block;margin-bottom:.75rem;"></i>Aún no has realizado acciones</td></tr>`;
    return;
  }
  
  const spanBadge = el('histCount');
  if (spanBadge) spanBadge.textContent = `${S.historyLog.length} registros`;

  tbody.innerHTML = S.historyLog.map(l => {
    const rc = l.risk==='Alto'?'bg-red':l.risk==='Medio'?'bg-gold':'bg-green';
    const tc = l.rawType==='prediccion'?'bg-blue':'bg-purple';
    const pc = parseInt(l.productivity)>=75?'var(--primary)':parseInt(l.productivity)>=50?'var(--gold)':'var(--red)';
    const icon = l.rawType==='imagen' ? '<i class="fa-solid fa-camera"></i>' : '<i class="fa-solid fa-robot"></i>';
    
    // Thumbnail para imágenes
    const thumbStr = (l.rawType === 'imagen' && l.imageUrl) 
      ? `<div style="width:36px;height:36px;border-radius:4px;background:url('${l.imageUrl}') center/cover;margin-right:8px;border:1px solid var(--border);"></div>`
      : '';

    return `<tr>
      <td style="color:var(--muted);font-size:.78rem;">${l.date}</td>
      <td>
        <div style="display:flex;align-items:center;">
          ${thumbStr}
          <span class="badge ${tc}" style="display:inline-flex;gap:4px;align-items:center;">${icon} ${l.type}</span>
        </div>
      </td>
      <td style="font-weight:600;">${l.cultivo||'-'}</td>
      <td>${l.area!=='-'&&l.area?l.area+' Ha':'-'}</td>
      <td style="font-weight:700;color:var(--primary);">${l.kg&&l.kg!=='-'?parseFloat(l.kg).toLocaleString()+' kg':'-'}</td>
      <td>${l.productivity?`<span style="font-weight:700;color:${pc}">${l.productivity}%</span>`:'-'}</td>
      <td><span class="badge ${rc}">${l.risk||'-'}</span></td>
    </tr>`;
  }).join('');
}

function exportHistoryCSV() {
  if (!S.historyLog.length) { showToast('Sin datos para exportar', 'warning'); return; }
  const headers = ['Fecha','Tipo','Cultivo','Área (Ha)','Producción (kg)','Productividad','Riesgo'];
  const rows = S.historyLog.map(l => [l.date,l.type,l.cultivo||'-',l.area||'-',l.kg||'-',l.productivity?l.productivity+'%':'-',l.risk||'-']);
  const csv = [headers,...rows].map(r=>r.join(',')).join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv],{ type:'text/csv;charset=utf-8;' }));
  a.download = `agrovision_historial_${new Date().toISOString().split('T')[0]}.csv`;
  a.click(); showToast('Historial exportado (CSV)', 'success');
}

function clearHistory() {
  if (!confirm('¿Eliminar todo el historial de análisis?')) return;
  S.predictions = []; S.analyses = []; S.historyLog = [];
  saveStorage(); renderHistoryRows(); updateDashboard();
  showToast('Historial eliminado', 'success');
}

// ── Modal ────────────────────────────────────────────────────
function openModal(id) { const m = el(id); if (m) m.classList.add('open'); }
function closeModal(id) { const m = el(id); if (m) m.classList.remove('open'); }
document.addEventListener('click', e => { if (e.target.classList.contains('modal-overlay')) closeModal(e.target.id); });

// ── Toast ────────────────────────────────────────────────────
function createToastContainer() {
  if (!el('toastCont')) {
    const c = document.createElement('div'); c.id = 'toastCont'; c.className = 'toast-container'; document.body.appendChild(c);
  }
}
function showToast(msg, type='success') {
  const icons = { success:'fa-check-circle', error:'fa-circle-xmark', warning:'fa-triangle-exclamation', info:'fa-circle-info' };
  const cont = el('toastCont'); if (!cont) return;
  const t = document.createElement('div');
  t.className = `toast t-${type}`;
  t.innerHTML = `<i class="fa-solid ${icons[type]}"></i><span class="toast-msg">${msg}</span>`;
  cont.appendChild(t);
  setTimeout(() => { t.classList.add('removing'); setTimeout(() => t.remove(), 320); }, 3600);
}

// ── Storage ──────────────────────────────────────────────────
function saveStorage() {
  try { localStorage.setItem('agv_data', JSON.stringify({ predictions: S.predictions.slice(0,50), analyses: S.analyses.slice(0,50), historyLog: S.historyLog.slice(0,100) })); } catch {}
}
function loadStorage() {
  try {
    const d = JSON.parse(localStorage.getItem('agv_data')||'{}');
    S.predictions = d.predictions||[]; S.analyses = d.analyses||[]; S.historyLog = d.historyLog||[];
  } catch {}
}

// ── Utilities ────────────────────────────────────────────────
function el(id) { return document.getElementById(id); }
function val(id) { return el(id)?.value||''; }
function setText(id, v) { const e=el(id); if(e) e.textContent=v; }
function animVal(id, from, to, dur, fmt) {
  const e = el(id); if (!e) return;
  const start = performance.now();
  const step = (now) => {
    const t = Math.min((now-start)/dur,1);
    e.textContent = fmt(from + (to-from) * (1-Math.pow(1-t,3)));
    if (t<1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// Range input display
document.addEventListener('input', e => {
  if (e.target.type === 'range' && e.target.dataset.display) {
    const d = el(e.target.dataset.display); if (d) d.textContent = e.target.value + (e.target.dataset.unit||'');
  }
});

// Init image upload after DOM ready
window.addEventListener('load', () => { initImageUpload(); syncAlertBadge(); });

// ── Supabase & Auth Logic ────────────────────────────────────
async function checkAuth() {
  if (!supabaseClient) return;
  try {
    const { data: { user } } = await supabaseClient.auth.getUser();
    S.user = user || null;
    updateAuthUI();
    
    // Proteger rutas
    if (!user && !['inicio', 'login', 'registro'].includes(S.currentPage)) {
      window.location.href = "index.html";
    }
  } catch (e) { console.error('Auth error:', e); }
}

function updateAuthUI() {
  const authEls = document.querySelectorAll('.auth-only');
  const noAuthEls = document.querySelectorAll('.no-auth-only');
  if (S.user) {
    authEls.forEach(e => { if (e) e.style.display = ''; });
    noAuthEls.forEach(e => { if (e) e.style.display = 'none'; });
    
    // Update user info in sidebar
    const nameStr = S.user.user_metadata?.first_name || S.user.email.split('@')[0];
    if(el('sbUserName')) el('sbUserName').textContent = nameStr;
    if(el('sbUserInitials')) el('sbUserInitials').textContent = nameStr.substring(0, 2).toUpperCase();
  } else {
    authEls.forEach(e => { if (e) e.style.display = 'none'; });
    noAuthEls.forEach(e => { if (e) e.style.display = ''; });
  }
}

async function handleLogin(e) {
  e.preventDefault();
  const email = el('logEmail').value;
  const password = el('logPass').value;
  const btn = el('btnLogin');
  const originalHtml = btn.innerHTML;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Ingresando...';
  btn.disabled = true;

  try {
    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) {
      if (window.Swal) Swal.fire({ icon: 'error', title: 'Error de acceso', text: error.message, confirmButtonColor: 'var(--primary)' });
      else showToast(error.message, 'error');
    } else {
      showToast('Sesión iniciada exitosamente', 'success');
      e.target.reset();
      navigateTo('dashboard');
    }
  } catch (err) {
    showToast('Ocurrió un error inesperado', 'error');
  } finally {
    btn.innerHTML = originalHtml;
    btn.disabled = false;
  }
}

async function handleRegister(e) {
  e.preventDefault();
  const name = el('regName').value;
  const email = el('regEmail').value;
  const password = el('regPass').value;
  const btn = el('btnReg');
  const originalHtml = btn.innerHTML;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Registrando...';
  btn.disabled = true;

  try {
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: { first_name: name, nombre: name }
      }
    });

    if (error) {
      if (window.Swal) Swal.fire({ icon: 'error', title: 'Error al registrar', text: error.message, confirmButtonColor: 'var(--primary)' });
      else showToast(error.message, 'error');
    } else {
      if (data?.user) {
        try {
          await supabaseClient.from('users').insert([{
              id: data.user.id,
              email: email,
              first_name: name
          }]);
        } catch(userErr) { console.info("public.users sync skipped."); }
      }
      if (window.Swal) Swal.fire({ icon: 'success', title: '¡Registro exitoso!', text: 'Tu cuenta ha sido creada.', confirmButtonColor: 'var(--primary)' });
      showToast('Registro exitoso', 'success');
      e.target.reset();
      updateAuthUI();
      navigateTo('dashboard');
    }
  } catch (err) {
    showToast('Ocurrió un error inesperado', 'error');
  } finally {
    btn.innerHTML = originalHtml;
    btn.disabled = false;
  }
}

async function logout() {
  console.log("Cerrando sesión...");

  const { error } = await supabaseClient.auth.signOut();

  if (error) {
    alert("Error al cerrar sesión");
    console.error(error);
  } else {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "index.html";
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById("logoutBtn");
  if (btn) btn.addEventListener("click", logout);
});

async function handleLogout() { logout(); }

// ── Comentarios ──────────────────────────────────────────────
async function fetchComentarios() {
  if (!supabaseClient) return;
  const feed = el('commentsFeed');
  if (!feed) return;
  
  feed.innerHTML = '<div style="text-align:center;padding:3rem;"><div class="loader-spinner" style="margin:auto;"></div></div>';
  
  try {
    const { data, error } = await supabaseClient
      .from('comentarios')
      .select('*')
      .order('fecha', { ascending: false });
      
    if (error) throw error;
    
    if (!data || data.length === 0) {
      feed.innerHTML = '<div style="text-align:center;padding:3rem;color:var(--muted);"><i class="fa-solid fa-comment-slash" style="font-size:2rem;margin-bottom:1rem;display:block;"></i>No hay comentarios aún. ¡Sé el primero!</div>';
      return;
    }
    
    feed.innerHTML = data.map(c => `
      <div class="cmt-card">
        <div class="cmt-header">
          <div class="cmt-avatar">${(c.nombre || 'U').substring(0, 2).toUpperCase()}</div>
          <div>
            <div class="cmt-author">${c.nombre || 'Usuario'}</div>
            <div class="cmt-date">${new Date(c.fecha).toLocaleString()}</div>
          </div>
        </div>
        <div class="cmt-body">${c.comentario}</div>
      </div>
    `).join('');
  } catch (err) {
    feed.innerHTML = '<div class="alert-card critical"><i class="fa-solid fa-triangle-exclamation al-icon"></i><div class="al-body"><div class="al-title">Error al cargar</div><div class="al-msg">No se pudieron cargar los comentarios.</div></div></div>';
  }
}

async function submitComentario(e) {
  e.preventDefault();
  if (!S.user) {
    showToast('Debes iniciar sesión para comentar', 'warning');
    return;
  }
  
  const text = el('cmtText').value;
  if (!text.trim()) return;
  
  const btn = el('btnCmt');
  const originalHtml = btn.innerHTML;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
  btn.disabled = true;
  
  try {
    const { data, error } = await supabaseClient
      .from('comentarios')
      .insert([{
        user_id: S.user.id,
        nombre: S.user.user_metadata?.first_name || S.user.email.split('@')[0],
        comentario: text
      }]);
      
    if (error) throw error;
    
    el('commentForm').reset();
    showToast('Comentario publicado', 'success');
    fetchComentarios(); // Reload feed
  } catch (err) {
    showToast('Error al publicar comentario', 'error');
  } finally {
    btn.innerHTML = originalHtml;
    btn.disabled = false;
  }
}

// ── Configuración (Settings) ─────────────────────────────────

async function loadConfigData() {
  if (!supabaseClient) return;
  const btn = el('btn-save-profile');
  if (btn) btn.disabled = true;

  try {
    const { data: { user }, error: authErr } = await supabaseClient.auth.getUser();
    if (authErr || !user) throw new Error("No autenticado");

    // Llenar header del perfil
    const initials = (user.user_metadata?.full_name || user.email || 'U').substring(0,2).toUpperCase();
    setText('cfg-avatar-initials', initials);
    setText('cfg-profile-email', user.email);

    // Obtener perfil desde base de datos
    const { data: profile, error } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // Ignorar si no existe (PGRST116)

    // Setear valores en DOM
    el('cfg-name').value = profile?.nombre || user.user_metadata?.full_name || '';
    el('cfg-email').value = profile?.email || user.email || '';
    el('cfg-city').value = profile?.ciudad || '';
    
    setText('cfg-profile-name', el('cfg-name').value || 'Usuario');

    // Preferencias
    if (profile?.preferencias) {
      const prefs = profile.preferencias;
      if (prefs.darkmode !== undefined) el('cfg-darkmode').checked = prefs.darkmode;
      if (prefs.alerts !== undefined) el('cfg-alerts').checked = prefs.alerts;
      if (prefs.weatherNotif !== undefined) el('cfg-weather-notif').checked = prefs.weatherNotif;
      if (prefs.sidebar !== undefined) el('cfg-sidebar').checked = prefs.sidebar;
      if (prefs.sounds !== undefined) el('cfg-sounds').checked = prefs.sounds;
    }
    
    // API Keys (simulado en DB)
    if (profile?.api_keys) {
      if (profile.api_keys.openweather) {
        const owKey = profile.api_keys.openweather;
        // En frontend simularemos enmascarar la clave
        el('cfg-openweather').value = '*****' + owKey.substring(owKey.length - 4);
      }
      if (profile.api_keys.weatherCity) el('cfg-weather-city').value = profile.api_keys.weatherCity;
      if (profile.api_keys.supabaseUrl) el('cfg-supabase-url').value = profile.api_keys.supabaseUrl;
    }

  } catch (err) {
    console.error("Error cargando configuración:", err);
  } finally {
    if (btn) btn.disabled = false;
  }
}

async function saveProfile() {
  if (!supabaseClient) return;
  
  const name = val('cfg-name').trim();
  const email = val('cfg-email').trim();
  const city = val('cfg-city').trim();

  if (!name || !email || !city) {
    showToast("Por favor completa todos los campos del perfil", "warning");
    return;
  }

  // Validación básica de email
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    showToast("El correo electrónico no es válido", "warning");
    return;
  }

  const btn = el('btn-save-profile');
  const ogHtml = btn.innerHTML;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Guardando...';
  btn.disabled = true;

  try {
    const { data: { user }, error: authErr } = await supabaseClient.auth.getUser();
    if (authErr || !user) throw new Error("No autenticado");

    const updates = {
      id: user.id,
      nombre: name,
      email: email,
      ciudad: city,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabaseClient
      .from('profiles')
      .upsert(updates); // Usamos upsert por si no existía

    if (error) throw error;

    setText('cfg-profile-name', name);
    setText('cfg-profile-email', email);
    setText('cfg-avatar-initials', name.substring(0,2).toUpperCase());
    
    showToast("Datos guardados correctamente", "success");

  } catch (err) {
    console.error("Error guardando perfil:", err);
    showToast("Error al guardar perfil", "error");
  } finally {
    btn.innerHTML = ogHtml;
    btn.disabled = false;
  }
}

async function savePreferences() {
  if (!supabaseClient) return;
  
  try {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) return;

    const prefs = {
      darkmode: el('cfg-darkmode')?.checked || false,
      alerts: el('cfg-alerts')?.checked || false,
      weatherNotif: el('cfg-weather-notif')?.checked || false,
      sidebar: el('cfg-sidebar')?.checked || false,
      sounds: el('cfg-sounds')?.checked || false,
    };

    // Actualizar base de datos
    await supabaseClient
      .from('profiles')
      .update({ preferencias: prefs })
      .eq('id', user.id);
      
    // Apply theme persistence
    localStorage.setItem('agv_theme', prefs.darkmode ? 'dark' : 'light');
    localStorage.setItem('agv_sidebar', prefs.sidebar ? 'collapsed' : 'expanded');

  } catch (err) {
    console.error("Error guardando preferencias:", err);
  }
}

async function saveApiKeys() {
  if (!supabaseClient) return;
  
  const ow = val('cfg-openweather').trim();
  const wc = val('cfg-weather-city').trim();
  const su = val('cfg-supabase-url').trim();
  
  const btn = el('btn-save-keys');
  const ogHtml = btn.innerHTML;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Guardando...';
  btn.disabled = true;

  try {
    const { data: { user }, error: authErr } = await supabaseClient.auth.getUser();
    if (authErr || !user) throw new Error("No autenticado");

    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('api_keys')
      .eq('id', user.id)
      .single();

    let actualOwToSave = ow;
    if (ow.startsWith('*****') && profile?.api_keys?.openweather) {
      actualOwToSave = profile.api_keys.openweather;
    }

    const keys = {
      openweather: actualOwToSave,
      weatherCity: wc,
      supabaseUrl: su
    };

    const { error } = await supabaseClient
      .from('profiles')
      .update({ api_keys: keys })
      .eq('id', user.id);

    if (error) throw error;
    
    // Enmascarar al guardar
    if (actualOwToSave) {
      el('cfg-openweather').value = '*****' + actualOwToSave.substring(actualOwToSave.length - 4);
    }

    showToast("Integraciones API guardadas", "success");

  } catch (err) {
    console.error("Error guardando API Keys:", err);
    showToast("Error al guardar integraciones", "error");
  } finally {
    btn.innerHTML = ogHtml;
    btn.disabled = false;
  }
}

// ── Supabase History ─────────────────────────────────────────

async function guardarPrediccion(resultado) {
  const { data: { user } } = await supabaseClient.auth.getUser();

  if (!user) return;

  console.log("Guardando predicción...");

  const { error } = await supabaseClient.from('historial_uso').insert({
    user_id: user.id,
    tipo: "prediccion",
    resultado: typeof resultado === 'string' ? resultado : JSON.stringify(resultado),
    fecha: new Date().toISOString()
  });

  if (error) {
    console.error(error);
  } else {
    console.log("Historial guardado correctamente");
  }
}

async function guardarAnalisisImagen(file, resultado) {
  const { data: { user } } = await supabaseClient.auth.getUser();

  if (!user) return;

  console.log("Guardando imagen...");

  const fileName = `${user.id}/${Date.now()}_${file.name}`;

  // Subir imagen
  const { error: uploadError } = await supabaseClient.storage
    .from('imagenes')
    .upload(fileName, file);

  if (uploadError) {
    console.error(uploadError);
    return;
  }

  // Obtener URL
  const { data } = supabaseClient.storage
    .from('imagenes')
    .getPublicUrl(fileName);

  const url = data.publicUrl;

  // Guardar en historial
  const { error } = await supabaseClient.from('historial_uso').insert({
    user_id: user.id,
    tipo: "imagen",
    resultado: typeof resultado === 'string' ? resultado : JSON.stringify(resultado),
    imagen_url: url,
    fecha: new Date().toISOString()
  });

  if (error) {
    console.error("Error guardando historial:", error);
  } else {
    console.log("Historial guardado correctamente");
  }
}

async function cargarHistorial() {
  const { data: { user } } = await supabaseClient.auth.getUser();

  if (!user) return;

  const { data, error } = await supabaseClient
    .from('historial_uso')
    .select('*')
    .eq('user_id', user.id)
    .order('fecha', { ascending: false });

  console.log("Historial:", data);

  if (error) {
    console.error(error);
    const tbody = el('historyBody');
    if (tbody) tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:3rem;color:var(--red);"><i class="fa-solid fa-triangle-exclamation"></i> Error al cargar datos</td></tr>`;
    return;
  }

  // Transform logic to display in the UI correctly
  if (data) {
    S.historyLog = data.map(row => {
      let res = {};
      try { res = JSON.parse(row.resultado || '{}'); } catch(e){}
      return {
        id_db: row.id,
        date: new Date(row.fecha).toLocaleDateString('es-CO', { year:'numeric', month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' }),
        type: row.tipo === 'prediccion' ? 'Predicción IA' : 'Análisis Foliar',
        rawType: row.tipo,
        imageUrl: row.imagen_url,
        cultivo: res.cultivo || (row.tipo === 'imagen' ? 'Imagen' : '-'),
        area: res.area || '-',
        kg: res.kg || '-',
        productivity: res.productivity || res.health || '-',
        risk: res.risk || '-',
        status: res.status || '-'
      };
    });
    
    S.predictions = S.historyLog.filter(x => x.rawType === 'prediccion');
    S.analyses = S.historyLog.filter(x => x.rawType === 'imagen');

    renderHistoryRows();
    updateDashboard();
  }
}


