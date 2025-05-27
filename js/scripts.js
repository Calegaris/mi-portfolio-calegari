const emitterSelect = document.getElementById('emitter-select');
const areaSelect = document.getElementById('area-select');
const cards = document.querySelectorAll('.certificate-card');

function filterCertificates() {
  const emitter = emitterSelect.value;
  const area = areaSelect.value;

  cards.forEach(card => {
    const matchEmitter = emitter === 'all' || card.dataset.emitter === emitter;
    const matchArea = area === 'all' || card.dataset.area === area;
    card.style.display = (matchEmitter && matchArea) ? 'block' : 'none';
  });
}

emitterSelect.addEventListener('change', filterCertificates);
areaSelect.addEventListener('change', filterCertificates);


const form = document.getElementById('contacto-form');
const mensajeExito = document.getElementById('mensaje-exito');
const mensajeError = document.getElementById('mensaje-error');

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  // Validación manual para email y mensaje (por si alguien desactiva HTML5)
  const email = form.email.value.trim();
  const message = form.message.value.trim();

  if (!email) {
    alert("Por favor, ingresá un correo electrónico válido.");
    form.email.focus();
    return;
  }
  if (!message) {
    alert("Por favor, escribí un mensaje.");
    form.message.focus();
    return;
  }

  // Enviar formulario con fetch a Formspree
  const formData = new FormData(form);

  try {
    const response = await fetch(form.action, {
      method: form.method,
      body: formData,
      headers: { 'Accept': 'application/json' },
    });

    if (response.ok) {
      form.style.display = 'none';
      mensajeError.style.display = 'none';
      mensajeExito.style.display = 'block';
    } else {
      throw new Error('Error en la respuesta');
    }
  } catch (error) {
    mensajeExito.style.display = 'none';
    mensajeError.style.display = 'block';
  }
});