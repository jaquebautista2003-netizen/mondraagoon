/* =========================================================
   Página "Tipo de servicio" · catálogo + cotizador de proyectos
   ========================================================= */
(() => {
  const $ = s => document.querySelector(s);
  const { esc } = UM;
  const KEY = 'um_paquete_serv';
  const MAX_ARCH = 5, MAX_MB = 5;

  let pq = UM.store.get(KEY, { servicios: [], intent: '' });
  let abierta = null, archivos = [];
  const guardar = () => UM.store.set(KEY, pq);
  const tiene = s => pq.servicios.includes(s);

  /* ---------------- Áreas ---------------- */
  function contar(c) { return (c.grupos || []).reduce((a, g) => a + g.items.length, 0); }

  function pintarAreas() {
    $('#areas-grid').innerHTML = CATEGORIAS_SERV.map(c => `
      <button class="area ${abierta === c.id ? 'on' : ''}" data-area="${c.id}" aria-expanded="${abierta === c.id}">
        <img src="${c.img}" alt="" loading="lazy">
        <span class="area-tag">${c.modalidad === 'obra' ? 'Ejecución de obra' : 'Ingeniería y proyectos'}</span>
        <span class="area-tx"><b>${esc(c.nombre)}</b><small>${esc(c.corto)}</small>
          <em>${c.enlace ? 'Ir al cotizador de maquinaria →' : contar(c) + ' servicios · Ver especialidades'}</em></span>
      </button>`).join('');
  }

  function itemHTML(s) {
    return `<li><button class="sitem ${tiene(s) ? 'on' : ''}" data-serv="${esc(s)}" aria-pressed="${tiene(s)}">
      <span class="sbox">${tiene(s) ? '✓' : '+'}</span>${esc(s)}</button></li>`;
  }

  function pintarDetalle() {
    const d = $('#detalle');
    const c = CATEGORIAS_SERV.find(x => x.id === abierta);
    if (!c || c.enlace) { d.hidden = true; return; }
    d.hidden = false;
    d.innerHTML = `
      <div class="det-head">
        <div><span class="area-tag inline">${c.modalidad === 'obra' ? 'Ejecución de obra' : 'Ingeniería y proyectos'}</span>
          <h3>${esc(c.nombre)}</h3>${c.nota ? `<p class="hint">${esc(c.nota)}</p>` : ''}</div>
        <button class="det-x" data-cerrar aria-label="Cerrar">×</button>
      </div>
      <p class="hint">Da clic en los servicios que te interesan para agregarlos a tu cotización.</p>
      <div class="det-cols">${c.grupos.map(g => `
        <div><h4>${esc(g.titulo)}</h4><ul class="slist">${g.items.map(itemHTML).join('')}</ul></div>`).join('')}
      </div>
      <div class="det-foot"><span>${pq.servicios.length} servicio(s) en tu paquete</span><a href="#cotizador" class="btn">Continuar al cotizador →</a></div>`;
  }

  function buscar(t) {
    const r = $('#resultados');
    t = t.trim().toLowerCase();
    if (t.length < 2) { r.hidden = true; $('#areas-grid').hidden = false; pintarDetalle(); return; }
    const hits = [];
    CATEGORIAS_SERV.forEach(c => (c.grupos || []).forEach(g => g.items.forEach(s => { if (s.toLowerCase().includes(t)) hits.push([s, c.nombre]); })));
    ESPECIALIZADOS.forEach(([s]) => { if (s.toLowerCase().includes(t)) hits.push([s, 'Servicios especializados']); });
    $('#areas-grid').hidden = true; $('#detalle').hidden = true; r.hidden = false;
    r.innerHTML = hits.length
      ? `<p class="hint">${hits.length} resultado(s) para “${esc(t)}”</p><ul class="slist cols">${hits.map(([s, c]) => itemHTML(s).replace('</button>', `<small>${esc(c)}</small></button>`)).join('')}</ul>`
      : `<p class="vacio">No encontramos “${esc(t)}”. Descríbelo en el <a href="#cotizador">cotizador</a> y te asesoramos.</p>`;
  }

  /* ---------------- Especializados ---------------- */
  function pintarEsp() {
    $('#esp-grid').innerHTML = ESPECIALIZADOS.map(([t, d, p]) => `
      <div class="esp">
        <div class="esp-ic"><svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="${p}"/></svg></div>
        <h4>${esc(t)}</h4><p>${esc(d)}</p>
        <button class="link-btn ${tiene(t) ? 'on' : ''}" data-serv="${esc(t)}">${tiene(t) ? '✓ En tu paquete' : '+ Agregar a cotización'}</button>
      </div>`).join('');
  }

  /* ---------------- Paquete ---------------- */
  function toggleServ(s) {
    if (tiene(s)) pq.servicios = pq.servicios.filter(x => x !== s);
    else { pq.servicios.push(s); UM.toast(`“${s}” agregado a tu paquete`); }
    guardar(); pintarTodo();
  }

  function pintarPaquete() {
    const n = pq.servicios.length;
    $('#pq-count').textContent = `${n} ${n === 1 ? 'seleccionado' : 'seleccionados'}`;
    $('#atajos').innerHTML = ATAJOS_SERV.map(s => `<button type="button" class="achip ${tiene(s) ? 'on' : ''}" data-serv="${esc(s)}">${tiene(s) ? '✓ ' : ''}${esc(s)}</button>`).join('');
    $('#paquete').innerHTML = n
      ? pq.servicios.map(s => `<span class="pchip">${esc(s)}<button type="button" data-serv="${esc(s)}" aria-label="Quitar ${esc(s)}">×</button></span>`).join('')
      : '<p class="vacio sm">Aún no seleccionas servicios. Usa los atajos o el catálogo.</p>';
    document.querySelectorAll('#seg-intent button').forEach(b => b.classList.toggle('on', b.dataset.v === pq.intent));
  }

  function pintarTodo() { pintarAreas(); pintarDetalle(); pintarEsp(); pintarPaquete(); const t = $('#serv-buscar').value; if (t.trim().length >= 2) buscar(t); }

  /* ---------------- Intenciones ---------------- */
  function elegirIntent(v) {
    pq.intent = v; guardar();
    const cats = INTENCIONES[v].cats;
    if (cats.length) {
      abierta = cats[0]; pintarTodo();
      document.getElementById('areas').scrollIntoView({ behavior: 'smooth' });
      UM.toast(`Te mostramos: ${CATEGORIAS_SERV.find(c => c.id === cats[0]).nombre}`, 'info');
    } else {
      pintarTodo();
      document.getElementById('cotizador').scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => $('#form-serv [name="Descripción"]').focus({ preventScroll: true }), 600);
    }
  }

  /* ---------------- Eventos ---------------- */
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-area]');
    if (a) {
      const c = CATEGORIAS_SERV.find(x => x.id === a.dataset.area);
      if (c.enlace) { location.href = c.enlace; return; }
      abierta = abierta === c.id ? null : c.id; pintarAreas(); pintarDetalle();
      if (abierta) setTimeout(() => $('#detalle').scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50);
      return;
    }
    if (e.target.closest('[data-cerrar]')) { abierta = null; pintarAreas(); pintarDetalle(); return; }
    const s = e.target.closest('[data-serv]'); if (s) { toggleServ(s.dataset.serv); return; }
    const i = e.target.closest('[data-intent]'); if (i) { elegirIntent(i.dataset.intent); return; }
    const g = e.target.closest('#seg-intent button'); if (g) { pq.intent = g.dataset.v; guardar(); pintarPaquete(); }
  });
  $('#serv-buscar').addEventListener('input', e => buscar(e.target.value));

  /* ---------------- Archivos ---------------- */
  const drop = $('#drop');
  function agregarArchivos(lista) {
    for (const f of lista) {
      if (archivos.length >= MAX_ARCH) { UM.toast(`Máximo ${MAX_ARCH} archivos`, 'bad'); break; }
      if (f.size > MAX_MB * 1048576) { UM.toast(`${f.name} pesa más de ${MAX_MB} MB. Envíalo por WhatsApp o correo.`, 'bad'); continue; }
      if (!archivos.some(a => a.name === f.name && a.size === f.size)) archivos.push(f);
    }
    pintarArchivos();
  }
  function pintarArchivos() {
    $('#files').innerHTML = archivos.map((f, i) => `<li><span class="fext">${esc(f.name.split('.').pop().toUpperCase())}</span><span class="fname">${esc(f.name)}</span>
      <small>${(f.size / 1048576).toFixed(1)} MB</small><button type="button" data-delf="${i}" aria-label="Quitar">×</button></li>`).join('');
  }
  $('#archivos').addEventListener('change', e => { agregarArchivos(e.target.files); e.target.value = ''; });
  ['dragenter', 'dragover'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add('over'); }));
  ['dragleave', 'drop'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.remove('over'); }));
  drop.addEventListener('drop', e => agregarArchivos(e.dataTransfer.files));
  $('#files').addEventListener('click', e => { const b = e.target.closest('[data-delf]'); if (b) { archivos.splice(+b.dataset.delf, 1); pintarArchivos(); } });

  /* ---------------- Envío ---------------- */
  const form = $('#form-serv');
  const msg = $('#serv-msg');
  function validar() {
    let ok = true;
    form.querySelectorAll('[required]').forEach(el => { const b = el.checkValidity() && el.value.trim(); el.classList.toggle('err', !b); if (!b) ok = false; });
    if (!ok) { msg.className = 'note bad'; msg.textContent = 'Revisa los campos marcados en rojo.'; return false; }
    if (!pq.servicios.length && pq.intent !== 'otro' && !pq.intent) { msg.className = 'note bad'; msg.textContent = 'Selecciona al menos un servicio o el tipo de solicitud.'; return false; }
    if (!$('#acepto-serv').checked) { msg.className = 'note bad'; msg.textContent = 'Acepta el aviso de privacidad para continuar.'; return false; }
    msg.textContent = ''; return true;
  }
  form.addEventListener('input', e => e.target.classList.remove('err'));

  const tipoTxt = () => pq.intent ? INTENCIONES[pq.intent].titulo : 'Sin especificar';
  function datos() { return Object.fromEntries(new FormData(form)); }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!validar()) return;
    const folio = UM.folio('UM-PS');
    const d = datos();
    const b = form.querySelector('button[type=submit]'); b.disabled = true; b.textContent = 'Enviando…';
    try {
      await UM.enviarCorreo(`Cotización de servicios · ${folio} · ${d['Nombre']}`, Object.assign({
        'Folio': folio, 'Tipo de solicitud': tipoTxt(), 'Servicios solicitados': pq.servicios.join(' | ') || 'Por definir',
        'Archivos adjuntos': archivos.length ? archivos.map(f => f.name).join(', ') : 'Ninguno', '_replyto': d['Correo']
      }, d), archivos, UM.CORREO_COTIZACIONES);
      terminar(folio);
    } catch {
      msg.className = 'note bad';
      msg.textContent = 'No se pudo enviar. Intenta por WhatsApp o escríbenos a urbanizacionesmondragon@hotmail.com.';
    } finally { b.disabled = false; b.textContent = 'Solicitar cotización del proyecto'; }
  });

  $('#serv-wa').addEventListener('click', () => {
    if (!validar()) return;
    const folio = UM.folio('UM-PS'), d = datos();
    const txt = [`*Solicitud de cotización de servicios*`, `Folio: ${folio}`, `Tipo: ${tipoTxt()}`, ``,
      `*Servicios*`, ...(pq.servicios.length ? pq.servicios.map(s => '• ' + s) : ['Por definir']), ``,
      `*Datos*`, ...Object.entries(d).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`),
      archivos.length ? `\nTengo ${archivos.length} archivo(s) de apoyo que envío por este chat.` : ''].join('\n');
    UM.whatsapp(txt);
    terminar(folio);
  });

  function terminar(folio) {
    $('#serv-folio').textContent = folio;
    form.hidden = true; document.querySelector('.cotz-sel').hidden = true; $('#serv-ok').hidden = false;
    form.reset(); archivos = []; pintarArchivos();
    pq = { servicios: [], intent: '' }; guardar(); pintarTodo();
    $('#cotizador').scrollIntoView({ behavior: 'smooth' });
  }
  $('#serv-nueva').addEventListener('click', () => { form.hidden = false; document.querySelector('.cotz-sel').hidden = false; $('#serv-ok').hidden = true; });

  /* ---------------- Inicio ---------------- */
  pintarTodo();
  const q = new URLSearchParams(location.search).get('intent');
  if (q && INTENCIONES[q]) setTimeout(() => elegirIntent(q), 300);
})();
