/* ===== Filtros de obras ===== */
document.querySelectorAll('#filters button').forEach(b => b.addEventListener('click', () => {
  document.querySelectorAll('#filters button').forEach(x => x.classList.remove('on')); b.classList.add('on');
  const f = b.dataset.f;
  document.querySelectorAll('#works .work').forEach(w => w.classList.toggle('hide', f !== 'all' && !w.dataset.t.includes(f)));
}));

/* ===== Formulario de cotización de obra ===== */
(() => {
  const form = document.getElementById('cotizacion');
  if (!form) return;
  const msg = document.getElementById('form-msg');
  const original = msg.innerHTML;

  function validar() {
    let ok = true;
    form.querySelectorAll('[required]').forEach(el => {
      const bien = el.checkValidity() && el.value.trim() !== '';
      el.classList.toggle('err', !bien);
      if (!bien) ok = false;
    });
    if (!ok) { msg.className = 'note bad'; msg.textContent = 'Revisa los campos marcados en rojo.'; }
    return ok;
  }
  const datos = () => Object.fromEntries(new FormData(form));

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!validar()) return;
    const folio = UM.folio('UM-OB');
    const btn = form.querySelector('button[type=submit]');
    btn.disabled = true; btn.textContent = 'Enviando…';
    try {
      const d = datos();
      await UM.enviarCorreo(`Cotización de obra · ${folio} · ${d['Nombre']}`, Object.assign({ 'Folio': folio, '_replyto': d['Correo'] }, d));
      msg.className = 'note ok';
      msg.textContent = `¡Gracias! Recibimos tu solicitud (folio ${folio}). Te contactaremos pronto.`;
      form.reset();
    } catch {
      msg.className = 'note bad';
      msg.textContent = 'No se pudo enviar. Intenta por WhatsApp o llámanos al 712 197 7773.';
    } finally {
      btn.disabled = false; btn.textContent = 'Enviar por correo';
    }
  });

  document.getElementById('enviar-wa').addEventListener('click', () => {
    if (!validar()) return;
    const texto = '*Solicitud de cotización de obra*\n' + Object.entries(datos()).filter(([, v]) => v).map(([k, v]) => `*${k}:* ${v}`).join('\n');
    UM.whatsapp(texto);
    msg.className = 'note ok'; msg.textContent = 'Se abrió WhatsApp con tu solicitud. Solo presiona enviar.';
  });

  form.querySelectorAll('[required]').forEach(el => el.addEventListener('input', () => {
    el.classList.remove('err');
    if (msg.classList.contains('bad')) { msg.className = 'note'; msg.innerHTML = original; }
  }));
})();
