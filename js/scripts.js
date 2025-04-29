/* document.addEventListener('DOMContentLoaded', () => {
    const emitterDefault = 'educacionit';
    const areaDefault = 'all';
    
    const cards = document.querySelectorAll('.certificate-card');
  
    // Mostrar solo los certificados de "EducaciónIT" y "All" por defecto
    cards.forEach(card => {
      if (
        (card.dataset.emitter === emitterDefault) &&
        (areaDefault === 'all' || card.dataset.area === areaDefault)
      ) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  
    // Activar los botones correspondientes por defecto
    const emitterButtons = document.querySelectorAll('.emitter-filters .filter-btn');
    const areaButtons = document.querySelectorAll('.area-filters .filter-btn');
  
    emitterButtons.forEach(button => {
      if (button.dataset.emitter === emitterDefault) {
        button.classList.add('active'); // Clase visual activa
      } else {
        button.classList.remove('active');
      }
    });
  
    areaButtons.forEach(button => {
      if (button.dataset.area === areaDefault) {
        button.classList.add('active'); // Clase visual activa
      } else {
        button.classList.remove('active');
      }
    });
  }); */