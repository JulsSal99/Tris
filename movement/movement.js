const cards = document.querySelectorAll('.card');
const markers = document.querySelectorAll('.marker');

cards.forEach(card => {
  card.addEventListener('dragstart', (event) => {
    // Aggiungi la classe "dragging" alla carta per ridurre l'opacità
    event.target.classList.add('dragging');
    
    // Aggiungi la classe "visible" a tutti i marker
    markers.forEach(marker => marker.classList.add('visible'));
  });

  card.addEventListener('dragend', () => {
    // Rimuovi la classe "dragging" dalla carta
    document.querySelector('.dragging').classList.remove('dragging');
    
    // Rimuovi la classe "visible" da tutti i marker
    markers.forEach(marker => marker.classList.remove('visible'));
  });
});