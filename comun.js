/* =========================================================
   Urbanizaciones Mondragón · utilidades compartidas
   ========================================================= */
const UM = (() => {
  const CORREO = 'urbanizacionesmondragon@hotmail.com';          // formulario de obra (inicio)
  const CORREO_COTIZACIONES = 'horaciomondragon979@gmail.com';  // maquinaria y tipo de servicio
  const WHATSAPP = '527121170008';

  /* ---------- Almacenamiento local seguro ---------- */
  const store = {
    get(k, def) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch { return def; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch { return false; } },
    del(k) { try { localStorage.removeItem(k); } catch {} }
  };

  /* ---------- Folio: PREFIJO-AAMMDD-NNNN ----------
     Un consecutivo real (UM-RM-0001) necesita un servidor que lleve la cuenta.
     Mientras tanto se genera un folio único con fecha + número aleatorio. */
  function folio(prefijo) {
    const d = new Date();
    const f = String(d.getFullYear()).slice(2) + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0');
    const n = String(Math.floor(Math.random() * 9000) + 1000);
    return `${prefijo}-${f}-${n}`;
  }

  /* ---------- Envío por correo (FormSubmit) ---------- */
  async function enviarCorreo(asunto, campos, archivos, destino = CORREO) {
    const fd = new FormData();
    fd.append('_subject', asunto);
    fd.append('_template', 'table');
    fd.append('_captcha', 'false');
    Object.entries(campos).forEach(([k, v]) => { if (v !== undefined && v !== null && v !== '') fd.append(k, v); });
    (archivos || []).forEach((f, i) => fd.append('attachment' + (i ? i : ''), f, f.name));
    const r = await fetch('https://formsubmit.co/ajax/' + destino, { method: 'POST', headers: { Accept: 'application/json' }, body: fd });
    const j = await r.json().catch(() => ({}));
    if (!r.ok || String(j.success) !== 'true') throw new Error(j.message || 'No se pudo enviar');
    return true;
  }

  /* ---------- WhatsApp ---------- */
  function whatsapp(texto) {
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`, '_blank', 'noopener');
  }

  /* ---------- Fechas ---------- */
  const fmtFecha = iso => {
    if (!iso) return '—';
    const [y, m, d] = iso.split('-');
    return `${d}/${m}/${y.slice(2)}`;
  };
  const dias = (a, b) => {
    if (!a || !b) return 0;
    const n = Math.round((new Date(b) - new Date(a)) / 86400000) + 1;
    return n > 0 ? n : 0;
  };
  const hoyISO = (plus = 0) => {
    const d = new Date(); d.setDate(d.getDate() + plus);
    return d.toISOString().slice(0, 10);
  };

  /* ---------- Avisos flotantes ---------- */
  function toast(msg, tipo = 'ok') {
    let t = document.querySelector('.toast');
    if (!t) { t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
    t.textContent = msg; t.dataset.tipo = tipo; t.classList.add('show');
    clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('show'), 2800);
  }

  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---------- Menú del celular ---------- */
  document.addEventListener('click', e => {
    const b = e.target.closest('.menu-btn');
    const m = document.getElementById('menu');
    if (b && m) { m.classList.toggle('open'); b.setAttribute('aria-expanded', m.classList.contains('open')); return; }
    if (e.target.closest('#menu a') && m) m.classList.remove('open');
  });

  /* ---------- Contador del carrito en el menú ---------- */
  function badgeCarrito() {
    const c = store.get('um_carrito_maq', { items: [] });
    const n = (c.items || []).reduce((a, i) => a + i.qty, 0);
    document.querySelectorAll('[data-badge-maq]').forEach(el => { el.textContent = n; el.hidden = !n; });
  }
  document.addEventListener('DOMContentLoaded', badgeCarrito);

  return { CORREO, CORREO_COTIZACIONES, WHATSAPP, store, folio, enviarCorreo, whatsapp, fmtFecha, dias, hoyISO, toast, esc, badgeCarrito };
})();
