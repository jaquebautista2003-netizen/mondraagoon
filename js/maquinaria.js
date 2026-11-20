/* =========================================================
   Carrito de cotización de maquinaria
   ========================================================= */
(() => {
  const KEY = 'um_carrito_maq';
  const KEY_SOL = 'um_solicitudes_maq';
  const TODO = [...MAQUINARIA, ...MAQUINARIA_EXTRA];
  const porId = id => TODO.find(m => m.id === id);
  const $ = s => document.querySelector(s);
  const { esc } = UM;

  const base = { items: [], ini: '', fin: '', ind: false, jornada: '', operador: 'Con operador', combustible: 'Por definir', traslado: false, mun: '', loc: '', maps: '', savedAt: null };
  let st = Object.assign({}, base, UM.store.get(KEY, {}));
  st.items = (st.items || []).filter(i => porId(i.id));
  let filtro = 'todas', texto = '', datos = {}, folioActual = '';

  const guardar = () => { UM.store.set(KEY, st); UM.badgeCarrito(); };
  const totalUnidades = () => st.items.reduce((a, i) => a + i.qty, 0);
  const enCarrito = id => st.items.find(i => i.id === id);

  /* ---------------- Catálogo ---------------- */
  function pintarFiltros() {
    $('#cat-filtros').innerHTML = CATEGORIAS_MAQ.map(c =>
      `<button role="tab" data-c="${c.id}" class="${c.id === filtro ? 'on' : ''}">${c.nombre}</button>`).join('');
  }

  function coincide(m) {
    const t = texto.trim().toLowerCase();
    const okCat = filtro === 'todas' || m.cat === filtro;
    const okTxt = !t || (m.nombre + ' ' + m.uso + ' ' + m.modelos.join(' ')).toLowerCase().includes(t);
    return okCat && okTxt;
  }

  function botonAgregar(m) {
    const it = enCarrito(m.id);
    if (it) return `<div class="added"><span>✓ ${it.qty} en tu cotización</span><button class="link-btn" data-quitar="${m.id}">Quitar</button></div>`;
    return `<button class="btn full add" data-add="${m.id}">+ Agregar a cotización</button>`;
  }

  function pintarCatalogo() {
    const lista = MAQUINARIA.filter(coincide);
    $('#maq-grid').innerHTML = lista.length ? lista.map(m => `
      <article class="mcard ${enCarrito(m.id) ? 'sel' : ''}">
        <div class="mimg"><img src="${m.img}" alt="${esc(m.nombre)}" loading="lazy">
          <span class="disp">${m.servicio ? 'Planta propia' : m.unidades + (m.unidades > 1 ? ' unidades' : ' unidad')}</span></div>
        <div class="mbody">
          <h3>${esc(m.nombre)}</h3>
          <p class="uso">${esc(m.uso)}</p>
          <details><summary>Ver modelos (${m.modelos.length})</summary>
            <ul>${m.modelos.map(x => `<li>${esc(x)}</li>`).join('')}${(m.extras || []).map(x => `<li>+ ${esc(x)}</li>`).join('')}</ul>
            ${m.nota ? `<p class="hint">${esc(m.nota)}</p>` : ''}</details>
          ${botonAgregar(m)}
        </div>
      </article>`).join('') : '<p class="vacio">No encontramos equipo con ese criterio.</p>';

    const extra = MAQUINARIA_EXTRA.filter(coincide);
    $('#maq-extra').innerHTML = extra.map(m => `
      <div class="xrow ${enCarrito(m.id) ? 'sel' : ''}">
        <div class="xic">${iconoCat(m.cat)}</div>
        <div class="xtx"><b>${esc(m.nombre)}</b><small>${esc(m.uso)} · ${esc(m.modelos.join(', '))}</small></div>
        ${enCarrito(m.id) ? `<button class="chip-ok" data-quitar="${m.id}">✓ Agregado</button>` : `<button class="btn line sm" data-add="${m.id}">+ Agregar</button>`}
      </div>`).join('') || '<p class="vacio">Sin coincidencias.</p>';
    $('#maq-extra').previousElementSibling.hidden = !extra.length && !!texto;
  }

  function iconoCat(cat) {
    const p = {
      acarreo: '<path d="M3 16V8h11v8M14 11h4l3 3v2h-7"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>',
      pavimento: '<path d="M4 20L10 4h4l6 16M12 8v2M12 13v2M12 18v2"/>',
      tierra: '<path d="M3 18h10l2-5h4l2 5M6 18l4-9 5 4"/><circle cx="12" cy="6" r="1.5"/>',
      compactacion: '<circle cx="8" cy="15" r="4"/><path d="M12 15h8v-5h-5l-3 5"/>'
    }[cat] || '';
    return `<svg width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">${p}</svg>`;
  }

  /* ---------------- Carrito ---------------- */
  function agregar(id) {
    if (!enCarrito(id)) st.items.push({ id, qty: 1, ini: st.ini, fin: st.fin });
    guardar(); render();
    const m = porId(id);
    UM.toast(`${m.nombre} agregado a tu cotización`);
    if (window.innerWidth <= 980) pulseBar();
  }
  function quitar(id) { st.items = st.items.filter(i => i.id !== id); guardar(); render(); }
  function cambiarQty(id, d) {
    const it = enCarrito(id); const m = porId(id); if (!it) return;
    const max = m.servicio ? 1 : m.unidades;
    it.qty = Math.min(max, Math.max(1, it.qty + d));
    if (it.qty === max && d > 0 && !m.servicio) UM.toast(`Tenemos ${max} ${max > 1 ? 'unidades' : 'unidad'} de este equipo`, 'info');
    guardar(); render();
  }

  function pintarCarrito() {
    const n = totalUnidades();
    $('#car-count').textContent = `${n} ${n === 1 ? 'unidad' : 'unidades'}`;
    $('#bar-n').textContent = n;
    $('#car-empty').hidden = !!st.items.length;
    $('#btn-continuar').disabled = !st.items.length;
    $('#car-bar').hidden = !st.items.length;

    $('#car-items').innerHTML = st.items.map(it => {
      const m = porId(it.id);
      const thumb = m.img ? `<img src="${m.img}" alt="">` : iconoCat(m.cat);
      const max = m.servicio ? 1 : m.unidades;
      const fechas = st.ind ? `
        <div class="it-fechas">
          <label>Inicio<input type="date" value="${it.ini || ''}" data-ini="${it.id}" min="${UM.hoyISO()}"></label>
          <label>Término<input type="date" value="${it.fin || ''}" data-fin="${it.id}" min="${it.ini || UM.hoyISO()}"></label>
          <span class="it-dias">${UM.dias(it.ini, it.fin) ? UM.dias(it.ini, it.fin) + ' días' : ''}</span>
        </div>` : '';
      return `
        <div class="it">
          <div class="it-th">${thumb}</div>
          <div class="it-tx"><b>${esc(m.nombre)}</b><small>${esc(m.uso)}</small></div>
          <div class="stepper" aria-label="Cantidad">
            <button data-menos="${it.id}" aria-label="Menos" ${it.qty <= 1 ? 'disabled' : ''}>−</button>
            <span>${it.qty}</span>
            <button data-mas="${it.id}" aria-label="Más" ${it.qty >= max ? 'disabled' : ''}>+</button>
          </div>
          <button class="it-del" data-quitar="${it.id}" aria-label="Quitar ${esc(m.nombre)}">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></svg></button>
          ${fechas}
        </div>`;
    }).join('');

    // periodo
    $('#f-ini').value = st.ini; $('#f-fin').value = st.fin;
    $('#f-ini').min = UM.hoyISO(); $('#f-fin').min = st.ini || UM.hoyISO();
    const d = UM.dias(st.ini, st.fin);
    $('#dur').textContent = d ? `Duración: ${d} ${d === 1 ? 'día' : 'días'}` : 'Indica las fechas aproximadas de tu obra.';
    $('#fechas-ind').checked = st.ind;
    $('#jornada').value = st.jornada;
    document.querySelectorAll('.seg').forEach(s => s.querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.v === st[s.dataset.name])));
    $('#traslado').checked = st.traslado; $('#traslado-box').hidden = !st.traslado;
    $('#t-mun').value = st.mun; $('#t-loc').value = st.loc; $('#t-maps').value = st.maps;
    ['#sec-periodo'].forEach(s => $(s).classList.toggle('dim', !st.items.length));

    // pasos del encabezado
    const paso = st.items.length ? (st.ini && st.fin ? 3 : 2) : 1;
    document.querySelectorAll('.steps li').forEach((li, i) => { li.classList.toggle('on', i < paso); });
  }

  function render() { pintarCatalogo(); pintarCarrito(); }

  /* ---------------- Eventos ---------------- */
  document.addEventListener('click', e => {
    const t = e.target.closest('button'); if (!t) return;
    if (t.dataset.c) { filtro = t.dataset.c; pintarFiltros(); pintarCatalogo(); }
    if (t.dataset.add) agregar(t.dataset.add);
    if (t.dataset.quitar) quitar(t.dataset.quitar);
    if (t.dataset.mas) cambiarQty(t.dataset.mas, 1);
    if (t.dataset.menos) cambiarQty(t.dataset.menos, -1);
    const seg = t.closest('.seg');
    if (seg) { st[seg.dataset.name] = t.dataset.v; guardar(); pintarCarrito(); }
  });

  $('#cat-buscar').addEventListener('input', e => { texto = e.target.value; pintarCatalogo(); });

  $('#f-ini').addEventListener('change', e => {
    st.ini = e.target.value;
    if (st.fin && st.fin < st.ini) st.fin = st.ini;
    st.items.forEach(i => { if (!i.ini) i.ini = st.ini; if (!i.fin || i.fin < i.ini) i.fin = st.fin; });
    guardar(); pintarCarrito();
  });
  $('#f-fin').addEventListener('change', e => {
    st.fin = e.target.value; st.items.forEach(i => { if (!i.fin) i.fin = st.fin; }); guardar(); pintarCarrito();
  });
  $('#fechas-ind').addEventListener('change', e => {
    st.ind = e.target.checked;
    if (st.ind) st.items.forEach(i => { i.ini = i.ini || st.ini; i.fin = i.fin || st.fin; });
    guardar(); pintarCarrito();
  });
  $('#car-items').addEventListener('change', e => {
    const el = e.target;
    if (el.dataset.ini) { const it = enCarrito(el.dataset.ini); it.ini = el.value; if (it.fin && it.fin < it.ini) it.fin = it.ini; }
    if (el.dataset.fin) enCarrito(el.dataset.fin).fin = el.value;
    guardar(); pintarCarrito();
  });
  $('#jornada').addEventListener('change', e => { st.jornada = e.target.value; guardar(); });
  $('#traslado').addEventListener('change', e => { st.traslado = e.target.checked; guardar(); pintarCarrito(); });
  ['mun', 'loc', 'maps'].forEach(k => $('#t-' + k).addEventListener('input', e => { st[k] = e.target.value; guardar(); }));

  $('#t-geo').addEventListener('click', () => {
    if (!navigator.geolocation) return UM.toast('Tu navegador no permite obtener la ubicación', 'bad');
    UM.toast('Obteniendo tu ubicación…', 'info');
    navigator.geolocation.getCurrentPosition(p => {
      st.maps = `https://www.google.com/maps?q=${p.coords.latitude.toFixed(6)},${p.coords.longitude.toFixed(6)}`;
      guardar(); pintarCarrito(); UM.toast('Ubicación agregada');
    }, () => UM.toast('No se pudo obtener la ubicación. Pega el enlace de Google Maps.', 'bad'), { enableHighAccuracy: true, timeout: 10000 });
  });

  $('#btn-guardar').addEventListener('click', () => {
    if (!st.items.length) return UM.toast('Agrega al menos un equipo', 'info');
    st.savedAt = new Date().toISOString(); guardar();
    UM.toast('Cotización guardada. La encontrarás aquí cuando regreses.');
  });
  $('#btn-vaciar').addEventListener('click', () => {
    if (!st.items.length) return;
    if (!confirm('¿Vaciar tu cotización?')) return;
    st = Object.assign({}, base); guardar(); render();
  });

  /* ---------------- Carrito en celular ---------------- */
  const abrirCar = () => { $('#carrito').classList.add('open'); $('#velo').hidden = false; document.body.classList.add('lock'); };
  const cerrarCar = () => { $('#carrito').classList.remove('open'); $('#velo').hidden = true; document.body.classList.remove('lock'); };
  $('#car-bar').addEventListener('click', abrirCar);
  $('#car-close').addEventListener('click', cerrarCar);
  $('#velo').addEventListener('click', cerrarCar);
  function pulseBar() { const b = $('#car-bar'); b.classList.remove('pulse'); void b.offsetWidth; b.classList.add('pulse'); }

  /* ---------------- Validación del periodo ---------------- */
  function validarPeriodo() {
    const err = [];
    if (st.ind) { st.items.forEach(i => { if (!i.ini || !i.fin) err.push(porId(i.id).nombre); }); if (err.length) return 'Indica las fechas de: ' + err.join(', '); }
    else if (!st.ini || !st.fin) return 'Indica la fecha de inicio y término de la renta.';
    if (st.traslado && !st.mun.trim()) return 'Indica el municipio para cotizar el traslado.';
    return '';
  }

  /* ---------------- Asistente ---------------- */
  const wz = $('#wizard');
  function irPaso(n) {
    wz.querySelectorAll('.wz-step').forEach(s => s.hidden = s.dataset.step != n);
    wz.scrollTop = 0;
  }
  $('#btn-continuar').addEventListener('click', () => {
    const e = validarPeriodo();
    if (e) { UM.toast(e, 'bad'); abrirCar(); return; }
    cerrarCar();
    const f = $('#form-datos');
    Object.entries(datos).forEach(([k, v]) => { if (f.elements[k]) f.elements[k].value = v; });
    irPaso(3); wz.showModal();
  });
  wz.addEventListener('click', e => {
    if (e.target === wz) wz.close();
    const b = e.target.closest('[data-close]'); if (b) wz.close();
    const g = e.target.closest('[data-goto]'); if (g) irPaso(g.dataset.goto);
  });

  $('#form-datos').addEventListener('submit', e => {
    e.preventDefault();
    const f = e.target; let ok = true;
    f.querySelectorAll('[required]').forEach(el => { const b = el.checkValidity() && el.value.trim(); el.classList.toggle('err', !b); if (!b) ok = false; });
    if (!ok) return UM.toast('Revisa los campos marcados en rojo', 'bad');
    datos = Object.fromEntries(new FormData(f));
    folioActual = UM.folio('UM-RM');
    pintarResumen(); irPaso(4);
  });
  $('#form-datos').addEventListener('input', e => e.target.classList.remove('err'));

  function filasEquipo() {
    return st.items.map(it => {
      const m = porId(it.id);
      const ini = st.ind ? it.ini : st.ini, fin = st.ind ? it.fin : st.fin;
      return { m, qty: it.qty, ini, fin, dias: UM.dias(ini, fin) };
    });
  }

  function pintarResumen() {
    const filas = filasEquipo();
    $('#resumen').innerHTML = `
      <div class="res-folio"><span>Folio de solicitud</span><b>${folioActual}</b></div>
      <table class="res-tab">
        <thead><tr><th>Equipo</th><th>Cant.</th><th>Periodo</th><th>Días</th></tr></thead>
        <tbody>${filas.map(f => `<tr><td><b>${esc(f.m.nombre)}</b><small>${esc(f.m.uso)}</small></td><td>${f.qty}</td><td>${UM.fmtFecha(f.ini)} – ${UM.fmtFecha(f.fin)}</td><td>${f.dias || '—'}</td></tr>`).join('')}</tbody>
      </table>
      <div class="res-grid">
        <div><h5>Servicios</h5>
          <p>Operador: <b>${esc(st.operador)}</b></p>
          <p>Combustible: <b>${esc(st.combustible)}</b></p>
          <p>Jornada: <b>${esc(st.jornada || 'Por definir')}</b></p>
          <p>Traslado: <b>${st.traslado ? 'Sí, ida y regreso' : 'No requerido'}</b></p>
          ${st.traslado ? `<p>Destino: <b>${esc([st.loc, st.mun].filter(Boolean).join(', '))}</b>${st.maps ? ` · <a href="${esc(st.maps)}" target="_blank" rel="noopener">ver mapa</a>` : ''}</p>` : ''}
        </div>
        <div><h5>Datos de contacto</h5>
          <p><b>${esc(datos.nombre)}</b>${datos.empresa ? '<br>' + esc(datos.empresa) : ''}</p>
          <p>${esc(datos.telefono)}<br>${esc(datos.correo)}</p>
          <p>${esc(datos.tipo)} · Factura: ${esc(datos.factura)}</p>
          ${datos.obra ? `<p>Obra: ${esc(datos.obra)}</p>` : ''}
        </div>
      </div>
      ${datos.comentarios ? `<p class="res-com"><b>Comentarios:</b> ${esc(datos.comentarios)}</p>` : ''}
      <button type="button" class="link-btn" id="res-editar-equipo">✎ Cambiar equipo o fechas</button>`;
    $('#res-editar-equipo').onclick = () => { wz.close(); if (window.innerWidth <= 980) abrirCar(); };
    $('#wz-msg').textContent = ''; $('#wz-msg').className = 'note';
  }

  function textoPlano() {
    const filas = filasEquipo();
    return [
      `*Solicitud de renta de maquinaria*`, `Folio: ${folioActual}`, ``,
      `*Equipo*`,
      ...filas.map(f => `• ${f.qty} × ${f.m.nombre} — ${UM.fmtFecha(f.ini)} al ${UM.fmtFecha(f.fin)} (${f.dias || '?'} días)`),
      ``, `*Servicios*`,
      `Operador: ${st.operador}`, `Combustible: ${st.combustible}`, `Jornada: ${st.jornada || 'Por definir'}`,
      `Traslado: ${st.traslado ? `Sí — ${[st.loc, st.mun].filter(Boolean).join(', ')}${st.maps ? ' ' + st.maps : ''}` : 'No'}`,
      ``, `*Cliente*`,
      `${datos.nombre}${datos.empresa ? ' — ' + datos.empresa : ''}`, `Tel: ${datos.telefono}`, `Correo: ${datos.correo}`,
      `Tipo: ${datos.tipo} · Factura: ${datos.factura}`,
      datos.obra ? `Obra: ${datos.obra}` : '', datos.comentarios ? `Comentarios: ${datos.comentarios}` : ''
    ].filter(l => l !== null).join('\n').replace(/\n{3,}/g, '\n\n');
  }

  function checarAcepto() {
    if ($('#acepto').checked) return true;
    $('#wz-msg').className = 'note bad'; $('#wz-msg').textContent = 'Acepta el aviso de privacidad para continuar.';
    return false;
  }

  $('#enviar-correo').addEventListener('click', async () => {
    if (!checarAcepto()) return;
    const b = $('#enviar-correo'); b.disabled = true; b.textContent = 'Enviando…';
    const filas = filasEquipo();
    try {
      await UM.enviarCorreo(`Renta de maquinaria · ${folioActual} · ${datos.nombre}`, {
        'Folio': folioActual,
        'Equipo solicitado': filas.map(f => `${f.qty} × ${f.m.nombre} (${UM.fmtFecha(f.ini)} al ${UM.fmtFecha(f.fin)}, ${f.dias} días)`).join(' | '),
        'Operador': st.operador, 'Combustible': st.combustible, 'Jornada': st.jornada || 'Por definir',
        'Traslado': st.traslado ? 'Sí, ida y regreso' : 'No',
        'Municipio': st.traslado ? st.mun : '', 'Localidad': st.traslado ? st.loc : '', 'Ubicación (mapa)': st.traslado ? st.maps : '',
        'Nombre': datos.nombre, 'Empresa / dependencia': datos.empresa, 'Teléfono': datos.telefono, 'Correo': datos.correo,
        'Tipo de cliente': datos.tipo, 'Requiere factura': datos.factura, 'Obra': datos.obra, 'Comentarios': datos.comentarios,
        '_replyto': datos.correo
      }, null, UM.CORREO_COTIZACIONES);
      terminar('correo');
    } catch {
      $('#wz-msg').className = 'note bad';
      $('#wz-msg').textContent = 'No se pudo enviar por correo. Envíala por WhatsApp o llámanos al 712 197 7773.';
    } finally { b.disabled = false; b.textContent = 'Enviar solicitud'; }
  });

  $('#enviar-wa').addEventListener('click', () => {
    if (!checarAcepto()) return;
    UM.whatsapp(textoPlano());
    terminar('whatsapp');
  });

  function terminar(medio) {
    const sol = UM.store.get(KEY_SOL, []);
    const filas = filasEquipo();
    sol.unshift({ folio: folioActual, fecha: new Date().toISOString(), medio, unidades: totalUnidades(),
      equipo: filas.map(f => `${f.qty} × ${f.m.nombre}`), estado: 'Cotización solicitada' });
    UM.store.set(KEY_SOL, sol.slice(0, 20));
    $('#print-area').innerHTML = comprobante();
    $('#ok-folio').textContent = folioActual;
    st = Object.assign({}, base, { operador: st.operador, combustible: st.combustible }); guardar();
    render(); pintarSolicitudes(); irPaso(5);
  }

  function comprobante() {
    const filas = filasEquipo().length ? filasEquipo() : [];
    return `<div class="pr">
      <img src="img/logo/logo-umo.png" alt="" style="height:54px">
      <h2>Solicitud de cotización · Renta de maquinaria</h2>
      <p><b>Folio:</b> ${folioActual} &nbsp; <b>Fecha:</b> ${new Date().toLocaleDateString('es-MX')} &nbsp; <b>Estado:</b> Cotización solicitada</p>
      <pre>${esc(textoPlano())}</pre>
      <p class="pr-pie">Urbanizaciones Mondragón, S.A. de C.V. · Carretera Panamericana Km 73+100, Atlacomulco, Méx. · 712 197 7773 · urbanizacionesmondragon@hotmail.com</p></div>`;
  }
  $('#ok-print').addEventListener('click', () => window.print());
  $('#ok-nueva').addEventListener('click', () => { wz.close(); window.scrollTo({ top: 0, behavior: 'smooth' }); });

  /* ---------------- Mis solicitudes ---------------- */
  function pintarSolicitudes() {
    const sol = UM.store.get(KEY_SOL, []);
    $('#mis-solicitudes').hidden = !sol.length;
    $('#lista-solicitudes').innerHTML = sol.map(s => `
      <div class="sol">
        <div><b>${s.folio}</b><small>${new Date(s.fecha).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })} · ${s.unidades} unidades · enviada por ${s.medio}</small>
          <p>${s.equipo.map(esc).join(', ')}</p></div>
        <span class="estado sm">${s.estado}</span>
      </div>`).join('');
  }

  /* ---------------- Inicio ---------------- */
  function avisoGuardada() {
    if (!st.items.length || !st.savedAt) return;
    const r = $('#restore');
    r.hidden = false;
    r.innerHTML = `<span>📌 Retomaste la cotización que guardaste el <b>${new Date(st.savedAt).toLocaleDateString('es-MX', { day: 'numeric', month: 'long' })}</b>.</span><button class="link-btn" id="rs-x">Entendido</button>`;
    $('#rs-x').onclick = () => r.hidden = true;
  }

  pintarFiltros(); render(); pintarSolicitudes(); avisoGuardada();
  // permite llegar con ?equipo=excavadora desde la página principal
  const pre = new URLSearchParams(location.search).get('equipo');
  if (pre && porId(pre) && !enCarrito(pre)) agregar(pre);
})();
