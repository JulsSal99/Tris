/**
 * Mazzo di carte.
 * Nel caso di 104 carte, metti un numero dopo la carta per capire se e' la prima o secona
 */
const deck = [
  'A♠', '2♠', '3♠', '4♠', '5♠', '6♠', '7♠', '8♠', '9♠', '10♠', 'J♠', 'Q♠', 'K♠',
  'A♥', '2♥', '3♥', '4♥', '5♥', '6♥', '7♥', '8♥', '9♥', '10♥', 'J♥', 'Q♥', 'K♥',
  'A♦', '2♦', '3♦', '4♦', '5♦', '6♦', '7♦', '8♦', '9♦', '10♦', 'J♦', 'Q♦', 'K♦',
  'A♣', '2♣', '3♣', '4♣', '5♣', '6♣', '7♣', '8♣', '9♣', '10♣', 'J♣', 'Q♣', 'K♣'
];
const seeds = ['♥', '♦', '♣', '♠'];
const order = ['A', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

const numPlayers = localStorage.getItem('numPlayers') || 3;

/**
 * mazzo coperto
 */
let shuffledDeck = [];

/**
 * per memorizzare le carte dei giocatori.
 * Catalogato per ID giocatore
 */
let playerCards = {};

/**
 * Variabile per tenere traccia degli elementi di carte selezionate
 */
let selectedCard = [];

let selectedPlacedCard = [];

/**
 * carte messe sul tavolo 
 * catalogate per gruppo
 */
let placedCards = {};

let playerturn = 1;

/* LOGIC */
/**
 * sposta una carta dal deck alla mano
 * @param {int} player
 * @param {int} n 
 * @returns 
 */
function LGdealDeckToHand(player, n) {
  playerCards[player] = shuffledDeck.splice(0, n); // Distribuisci n carte a un giocatore
}
/**
 * Funzione passa il turno al prossimo giocatore
 */
function LGskipTurn(){
  if (playerturn < numPlayers){   playerturn += 1;
  } else {                        playerturn = 1; 
}}


/**
 * Funzione che passa il turno al prossimo giocatore
 */
function skipTurn() {
  LGskipTurn();
  showplayer(playerturn);
  dragHandler();
}

/**
 * Deseleziona qualunque card 
 */
function deselectAllCards() {
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.classList.remove('selected');
  });
}


/**
 * Funzione che mostra solo un giocatore
 */
function showplayer(player) {
  deselectAllCards();
  selectedCard = []; 
  selectedPlacedCard = [];
  console.log("Turno di " + player + ".")  
  for (let i = 1; i <= numPlayers; i++) {
    const playerDiv = document.getElementById(`player${i}-cards`);
    if (i !== player) {
      playerDiv.classList.add('hidden') // Nasconde l'elemento
    } else {
      playerDiv.classList.remove('hidden'); // Mostra l'elemento
    }
  }
}

/**
 * Controlla se è un array con almeno 2 elementi
 * Controlla se ci sono valori duplicati di semi differenti
 * Controlla se ci sono valori consecutivi di semi uguali
 * @param {string[]} CardsValue 
 * @returns 
 */
function isValidSelection(CardsValue) {
  if (!Array.isArray(CardsValue)) {
    console.error('input must be an array.');
    return false;
  } else if (CardsValue.length <= 1){
    console.log('input has less than 2 elements.');
    return true;
  } else {
    const values = CardsValue.map(card => card.slice(0, -1));
    const suits = CardsValue.map(card => card.slice(-1));
  
    // Controlla se ci sono valori duplicati di semi differenti
    const allValuesEqual = values.every(value => value === values[0]);
    if (allValuesEqual) {
      console.log("Same value, different suits");
      return true;
    }
    // Controlla se ci sono valori consecutivi di semi uguali
    // Controlla se tutti i semi sono uguali
    const allSameSuits = suits.every(suit => suit === suits[0]);
    // Ordina i valori e controlla se sono consecutivi
    const sortedValues = [...new Set(values)].sort((a, b) => deck.indexOf(a + '♠') - deck.indexOf(b + '♠'));

    const hasConsecutiveValues = sortedValues.every((value, index) => 
       index === 0 || deck.indexOf(value + suits[0]) === deck.indexOf(sortedValues[index - 1] + suits[0]) + 1
    );
    if (allSameSuits && hasConsecutiveValues) {
      console.log("Consecutive numbers, same suits");
      return true;
    } else {
      return false;
    }
  }
}

/**
 * Funzione per mischiare il mazzo
 * @param {string[]} deck 
 * @returns 
 */
function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

/**
 *  Funzione per distribuire le carte solo all'inizio della partita
 * @param {int} n - numero di carte distribuite ad ogni giocatore
 * @returns 
 */
function dealCards(n) {
  shuffledDeck = shuffleDeck(deck.concat(deck));
  const playersContainer = document.getElementById('playersContainer');
  playersContainer.innerHTML = ''; // Pulisce eventuali giocatori precedenti
  for (let i = 1; i <= numPlayers; i++) { // Crea le sezioni dei giocatori
    const playerDiv = document.createElement('div');
    playerDiv.classList.add('player');
    playerDiv.innerHTML = `<h2>Giocatore ${i}</h2><div class="cards" id="player${i}-cards"></div>`;
    playersContainer.appendChild(playerDiv);
    LGdealDeckToHand(i, n); // Distribuisci 5 carte a un giocatore
  }
  displayDeck(shuffledDeck); // Mostra il mazzo coperto
  console.log("Distribuite carte iniziali");
}

/**
 * Funzione per creare le carte del giocatore
 */
function dealHands() {
  for (let i = 1; i <= numPlayers; i++) {
    const playerDiv = document.getElementById(`player${i}-cards`);
    //playerDiv.setAttribute('hidden', true);
    playerDiv.classList.add('hidden') // Nasconde l'elemento
    playerDiv.innerHTML = ''; // Pulisce l'area delle carte
    playerCards[i].forEach(card => {
      crtCard(card, playerDiv, 'div', 'card');
    });
    console.log(`Creato giocatore ${i}`);
  }
}

/**
 * Funzione per selezionare una carta
 */
function selectCard(cardDiv) {
  // Controlla se la carta è già selezionata
  const isAlreadySelected = selectedCard.includes(cardDiv);

  if (isAlreadySelected) {
    // Se la carta è già selezionata, rimuovila
    selectedCard = selectedCard.filter(card => card !== cardDiv);
    cardDiv.classList.remove('selected'); // Rimuovi la classe di selezione
    console.log("deselezionata");
  } else {
     // Aggiungi la nuova carta a un array temporaneo
     let CardsValue = [];
     CardsValue = Array.from(selectedCard).map(card => card.textContent);
     CardsValue.push(cardDiv.textContent);
     if (!isValidSelection(CardsValue)) {
       selectedCard.forEach(card => {
         card.classList.remove('selected'); // Rimuove la selezione da ogni carta
         console.log("deselezionate le carte");
       });
       selectedCard = [];
     }
     selectedCard.push(cardDiv);
     cardDiv.classList.add('selected'); // Aggiunge classe per evidenziare la selezione
     console.log("selezionata");
  }
}

/**
 * Funzione per visualizzare il mazzo coperto
 * gestisce l'onclick e il cursore
 * function(remainingDeck, arrayLength)
 */
function displayDeck(remainingDeck) {
  const deckDiv = document.getElementById('deck');
  const arrayLength = remainingDeck.length;
  // Mantieni le carte rimanenti nel mazzo come coperto, senza mostrare il contenuto.
  if (arrayLength == 0){
    document.getElementById('deck-count').innerText = ``;
    deckDiv.removeAttribute("onclick");
    deckDiv.style.cursor = "default"; // Cambia il cursore a default, puoi usare anche "auto" o un altro valore
  } else {
    document.getElementById('deck-count').innerText = `${arrayLength}`;
  }
}

// Aggiungere l'evento per piazzare la carta quando si clicca sull'area di gioco
document.getElementById('cardSlot').onclick = function() {
  if (selectedCard.length > 0) {
    placeCard(selectedCard);
    selectedCard = []; // Resetta la selezione dopo il piazzamento
  }
};


/**
 * Verifica se entrambi sono in un'area
 */ 
function areBothInPlayArea(element1, element2, area) {
  const playArea = document.querySelector(area);
  const isElement1InPlayArea = playArea.contains(element1);
  const isElement2InPlayArea = playArea.contains(element2);
  const bothInPlayArea = isElement1InPlayArea && isElement2InPlayArea;
  return bothInPlayArea;
}

/**
 * Gestisce quando viene cliccato il mazzo coperto.
 *
 */
function deckDeal() {
  const arrayLength = shuffledDeck.length;
  if (arrayLength >= 0 ){
    playerCards[playerturn].push(shuffledDeck.splice(0, 1)[0]);
    console.log(playerCards[playerturn]);
    displayDeck(shuffledDeck);
    dealHands();
    skipTurn();
  }
}

function newMarker() {
  const marker = document.createElement('span');
  marker.classList.add('marker');
  marker.textContent = '|';
  return marker;
}

/**
 * Sposta le selectedCard da playerCards a un nuovo gruppo in placedCards 
 * @param {int} groupNumber 
 * @returns 
 */
function placeAllValueCard(groupNumber) {
  let CardsValue = Array.from(selectedCard).map(card => card.textContent);
  if (!playerCards[playerturn] || CardsValue.length === 0) {
      console.log("Nessuna carta selezionata o il giocatore non ha carte.");
      return;
  }
  // crea un nuovo gruppo
  placedCards[groupNumber] = [];

  CardsValue.forEach(card => {
      const cardIndex = playerCards[playerturn].indexOf(card);
      if (cardIndex !== -1) {
          placedCards[groupNumber].push(card); // Aggiungi al nuovo gruppo
          playerCards[playerturn].splice(cardIndex, 1); // Rimuovi dalla mano del giocatore
      }
  });
  selectedCard = [];
  console.log(`Le carte sono state spostate nel gruppo ${groupNumber}.`);
}

/**
 * Crea un nuovo elemento c col relativo marker e lo aggiunge a cardgroup
 * @param {string} prevDiv - origin group
 * @param {*} cardGroup - end group
 * @param {string} ELtype - new element type
 * @param {string} ELattr - new element attribute
 */
function crtCard(text, cardGroup, ELtype, ELattr){
    let newElement = document.createElement(ELtype);
    newElement.classList.add(ELattr); // Aggiunge classe per la carta piazzata
    newElement.textContent = text; // Mostra la carta piazzata
    // Aggiunge l'evento di click per selezionare la carta
    newElement.onclick = function() {
      selectCard(newElement);
      event.stopPropagation(); // Interrompe la propagazione dell'evento al cardSlot
    }
    // Aggiungi la carta piazzata all'area di gioco
    cardGroup.appendChild(newElement);
    cardGroup.appendChild(newMarker());
}


/**
 * Funzione per piazzare la carta
 */
function placeCard(selectedCards) {
  if (selectedCards.length === 0) {
    console.log("Nessuna carta selezionata.");
    return;
  }
  
  const cardSlot = document.getElementById('cardSlot');
  let ncardGroup = Object.keys(placedCards).length;
  if (ncardGroup == 0){ cardSlot.textContent = ''; }
  ncardGroup += 1;

  const cardGroup = document.createElement('div');
  cardGroup.id = `${ncardGroup}`;
  cardGroup.classList.add(`card-group`);
  cardSlot.appendChild(cardGroup);
  selectedCards.forEach((cardDiv,index) => {
    crtCard(cardDiv.textContent, cardGroup, 'div', 'placed-card');
    // Rimuovi la carta dall'area del giocatore
    cardDiv.remove();
    // const value = cardDiv.setAttribute('data-full-value', item);    
  });

  // Reset dell'array delle carte selezionate, se necessario
  placeAllValueCard(ncardGroup+1);
  dragHandler()
}

/**
 * Elimina e ricrea i marker in card-group
 */
function updPlayMarker() {
  const cardSlot = document.getElementById('cardSlot');
  const cardGroups = Array.from(cardSlot.getElementsByClassName('card-group'));
  cardGroups.forEach(cardGroup => {
    if (cardGroup) {
      if (markers){
        const markers = cardGroup.querySelectorAll('.marker');
        // Rimuoviamo ogni marker trovato
        markers.forEach(marker => {
          marker.remove();
        });
      }

      const cards = Array.from(cardGroup.querySelectorAll('.placed-card'));
      console.log(cards);
      cards.forEach((card, index) => {
        console.log(card, index);
        if (index < cards.length - 1) {
          const marker = newMarker();
          card.parentNode.insertBefore(marker, card.nextSibling);
        }
      });
    }
  });
}

/**
 * Funzione che crea i marker su una cards.
 */ 
function crtMarker(player) {
  const cardsContainer = document.getElementById(`player${player}-cards`);
  if (cardsContainer) {
    const cards = Array.from(cardsContainer.querySelectorAll('.card'));
    cards.forEach((card, index) => {
      if (index < cards.length - 1) {
        const marker = newMarker();
        card.parentNode.insertBefore(marker, card.nextSibling);
      }
    });
  }
}

/**
 * Funzione che rimuove i marker da un cards.
 */ 
function rmMarker(player) {
  const playerCardsContainer = document.getElementById(`player${player}-cards`);

  if (playerCardsContainer) {
    // Troviamo tutti i marker dentro il contenitore del player
    const markers = playerCardsContainer.querySelectorAll('.marker');

    // Rimuoviamo ogni marker trovato
    markers.forEach(marker => {
      marker.remove();
    });
  };
}

/**
 * Aggiorna i marker per tutti i giocatori, garantendo che siano corretti.
 */
function updHandMarkers(player) {
  const cardsContainer = document.getElementById(`player${player}-cards`);
  const cards = Array.from(cardsContainer.querySelectorAll('.card'));
  if (!(cardsContainer.querySelectorAll('.marker')).length) {
    crtMarker(player);
    console.log("created new markers for player " + player);
    return;
  }
  const marker = newMarker();
  cards.forEach((card, index) => {
    if (index == 0) {
      let previousElement = card.previousElementSibling;
      while (previousElement){
        if (previousElement.classList.contains('marker')){
          previousElement.remove();
        }
        previousElement = card.previousElementSibling;
      }
    }
    const nextSibling = card.nextSibling;
    if (index === cards.length - 1 && !nextSibling){
      card.parentNode.appendChild(marker); //aggiunge un marker all'ultimo elemento
    } else {
      const isNextMarker = nextSibling.classList.contains('marker');
      if (index === cards.length - 1 && !(isNextMarker)){
        if (nextSibling && isNextMarker){
          card.parentNode.appendChild(marker); //aggiunge un marker all'ultimo elemento
        }
      } else if (nextSibling && !(isNextMarker)) {
        card.parentNode.insertBefore(marker, nextSibling);
      } else if (nextSibling && isNextMarker) {
        let nextSibling2 = nextSibling.nextSibling;
        while (nextSibling2 && nextSibling2.classList.contains('marker')) {
          const toRemove = nextSibling2;
          nextSibling2 = nextSibling2.nextSibling; // Passa al prossimo nodo prima di rimuovere
          toRemove.remove();
        }
      }
    }
  });
}

/**
 * aggiorna i markers
 */
function dragHandler(){
  const cards = document.querySelectorAll('.card');
  //const markers = document.querySelectorAll('.marker');
  for (let player = 1; player <= numPlayers; player++) {
    if (player !== playerturn){
      rmMarker(player);
    } else {
      updHandMarkers(player);
    }
  }
  const markers = document.getElementById('cardSlot').querySelectorAll('.marker');
  console.log(markers);
  for (let i = 1; i <= numPlayers; i++) {
    const playercards = document.getElementById(`player${i}-cards`);
    const allmarkers = [
      ...playercards.querySelectorAll('.marker'),       // Seleziona marker dentro playercards
      ...markers  // Seleziona marker dentro cardSlot
    ];
    enableDraggableCards(cards, allmarkers, i);
  }
}


function enableDraggableCards(cards, markers, player) {
  cards.forEach(card => {
    card.setAttribute('draggable', 'true');
    
    // Desktop drag and drop
    card.addEventListener('dragstart', (event) => {
      event.target.classList.add('dragging');
      if (event.target.nextSibling) {
        event.target.nextSibling.classList.add('markerdragging');
      }
      markers.forEach(marker => marker.classList.add('visible'));
      console.log("drag mode");
    });

    card.addEventListener('dragend', () => {
      const draggingElement = document.querySelector('.dragging');
      if (draggingElement) {
        draggingElement.classList.remove('dragging');
      }
      markers.forEach(marker => marker.classList.remove('visible'));
      const draggingMarker = document.querySelector('.markerdragging');
      if (draggingMarker) {
        draggingMarker.classList.remove('markerdragging');
      }
    });

    // Touch drag and drop
    card.addEventListener('touchstart', (event) => {
      const touch = event.touches[0];
      card.classList.add('dragging');
      if (card.nextSibling) {
        card.nextSibling.classList.add('markerdragging');
      }
      markers.forEach(marker => marker.classList.add('visible'));
      
      // Imposta i dati iniziali per il trascinamento
      card.style.position = 'absolute';
      card.style.left = `${touch.pageX}px`;
      card.style.top = `${touch.pageY}px`;
      console.log("Touch start");
    });

    card.addEventListener('touchmove', (event) => {
      const touch = event.touches[0];
      const draggingElement = document.querySelector('.dragging');
      if (draggingElement) {
        draggingElement.style.left = `${touch.pageX}px`;
        draggingElement.style.top = `${touch.pageY}px`;
      }
      event.preventDefault(); // Previene lo scrolling durante il trascinamento
    });

    card.addEventListener('touchend', () => {
      const draggingElement = document.querySelector('.dragging');
      if (draggingElement) {
        draggingElement.style.position = '';
        draggingElement.style.left = '';
        draggingElement.style.top = '';
        draggingElement.classList.remove('dragging');
      }
      markers.forEach(marker => marker.classList.remove('visible'));
      const draggingMarker = document.querySelector('.markerdragging');
      if (draggingMarker) {
        draggingMarker.classList.remove('markerdragging');
      }
      console.log("Touch end");
    });

    // Aggiungiamo gli eventi `dragover` e `drop` ai marker
    markers.forEach(marker => {
      // Desktop drop
      marker.addEventListener('dragover', (event) => {
        event.preventDefault(); // Permetti il drop
      });

      marker.addEventListener('drop', (event) => {
        event.preventDefault(); // Prevenire il comportamento di default di un drop
        const draggingElement = document.querySelector('.dragging');
        const draggingMarker = document.querySelector('.markerdragging');
        if (draggingElement) { // Verifica se c'è un elemento da spostare
          marker.parentNode.insertBefore(draggingElement, marker.nextSibling);
          marker.parentNode.insertBefore(draggingMarker, draggingElement.nextSibling);
          console.log("Desktop - Spostata carta");
        }
      });

      // Mobile drop
      marker.addEventListener('touchend', (event) => {
        const draggingElement = document.querySelector('.dragging');
        const draggingMarker = document.querySelector('.markerdragging');
        if (draggingElement) {
          marker.parentNode.insertBefore(draggingElement, marker.nextSibling);
          marker.parentNode.insertBefore(draggingMarker, draggingElement.nextSibling);
          console.log("Mobile - Spostata carta");
        }
      });
    });
  });
}




/**
 * All'avvio della pagina, leggi il numero di giocatori e distribuisci automaticamente le carte
 */
window.onload = function() {
  dealCards(5);
  dealHands();
  dragHandler();
  showplayer(playerturn);
};