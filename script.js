// Definisco il mazzo di carte
const deck = [
  'A♠', '2♠', '3♠', '4♠', '5♠', '6♠', '7♠', '8♠', '9♠', '10♠', 'J♠', 'Q♠', 'K♠',
  'A♥', '2♥', '3♥', '4♥', '5♥', '6♥', '7♥', '8♥', '9♥', '10♥', 'J♥', 'Q♥', 'K♥',
  'A♦', '2♦', '3♦', '4♦', '5♦', '6♦', '7♦', '8♦', '9♦', '10♦', 'J♦', 'Q♦', 'K♦',
  'A♣', '2♣', '3♣', '4♣', '5♣', '6♣', '7♣', '8♣', '9♣', '10♣', 'J♣', 'Q♣', 'K♣'
];
// nel caso di 104 carte, metti un numero dopo la carta per capire se è la prima o secona

const numPlayers = localStorage.getItem('numPlayers') || 3;

let shuffledDeck = [];

let playerCards = {}; // per memorizzare le carte dei giocatori

let selectedCard = []; // Variabile per tenere traccia delle carte selezionate

let playerturn = 1;

let ncardGroup = 0;

/**
 * Funzione che passa il turno al prossimo giocatore
 */
function skipTurn() {
  // Qui, per esempio, passeremo al giocatore 1
  if (playerturn < numPlayers){
    playerturn += 1;
  } else { playerturn = 1; }
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
 * @param {*} selectedCards 
 * @returns 
 */
function isValidSelection(selectedCards) {
  if (!Array.isArray(selectedCards)) {
    console.error('selectedCards deve essere un array.');
    return false;
  } else if (selectedCards.length <= 1){
    console.log('selectedCards ha meno di 2 elementi.');
    return true;
  } else {
    const values = selectedCards.map(card => card.slice(0, -1));
    const suits = selectedCards.map(card => card.slice(-1));
  
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
 */
function dealCards(numPlayers) {
  shuffledDeck = shuffleDeck(deck.concat(deck));

  const playersContainer = document.getElementById('playersContainer');
  playersContainer.innerHTML = ''; // Pulisce eventuali giocatori precedenti

  // Crea le sezioni dei giocatori
  for (let i = 1; i <= numPlayers; i++) {
    const playerDiv = document.createElement('div');
    playerDiv.classList.add('player');
    playerDiv.innerHTML = `<h2>Giocatore ${i}</h2><div class="cards" id="player${i}-cards"></div>`;
    playersContainer.appendChild(playerDiv);
    
    // Distribuisci 5 carte a ciascun giocatore
    playerCards[`cards${i}`] = shuffledDeck.splice(0, 5); 
  }

  // Mostra il mazzo coperto con le carte rimanenti
  displayDeck(shuffledDeck);
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
    playerCards[`cards${i}`].forEach(card => {
      const cardDiv = document.createElement('div');
      cardDiv.classList.add('card');
      cardDiv.textContent = card;

      // Aggiunge l'evento di click per selezionare la carta
      cardDiv.onclick = function() {
        selectCard(cardDiv);
      };

      playerDiv.appendChild(cardDiv);
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
  } else {
     // Aggiungi la nuova carta a un array temporaneo
     let CardsValue = [];
     CardsValue = Array.from(selectedCard).map(card => card.textContent);
     CardsValue.push(cardDiv.textContent);
     if (!isValidSelection(CardsValue)) {
       selectedCard.forEach(card => {
         card.classList.remove('selected'); // Rimuove la selezione da ogni carta
       });
       selectedCard = [];
     }
     selectedCard.push(cardDiv);
     cardDiv.classList.add('selected'); // Aggiunge classe per evidenziare la selezione
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
 * Gestisce quando viene cliccato il mazzo coperto.
 *
 */
function deckDeal() {
  const arrayLength = shuffledDeck.length;
  if (arrayLength >= 0 ){
    playerCards[`cards${playerturn}`].push(shuffledDeck.splice(0, 1)[0]);
    console.log(playerCards[`cards${playerturn}`]);
    displayDeck(shuffledDeck);
    dealHands();
    skipTurn();
  }
}

/**
 * Funzione per piazzare la carta
 */
function placeCard(selectedCards) {
  const cardSlot = document.getElementById('cardSlot');
  if (ncardGroup == 0){ cardSlot.textContent = ''; }

  // Controlla se ci sono carte selezionate
  if (selectedCards.length === 0) {
    console.log("Nessuna carta selezionata.");
    return;
  }

  // Aggiungi ogni carta selezionata all'area di gioco
  ncardGroup += 1;
  const cardGroup = document.createElement('div');
  cardGroup.id = `${ncardGroup}`;
  cardGroup.classList.add(`card-group`); // Aggiunge classe per la carta piazzata
  cardSlot.appendChild(cardGroup);
  selectedCards.forEach(cardDiv => {
    const placedCardDiv = document.createElement('div');
    placedCardDiv.classList.add('placed-card'); // Aggiunge classe per la carta piazzata
    placedCardDiv.textContent = cardDiv.textContent; // Mostra la carta piazzata

    // Aggiungi la carta piazzata all'area di gioco
    cardGroup.appendChild(placedCardDiv);

    // Rimuovi la carta dall'area del giocatore
    cardDiv.remove();
  });

  // Reset dell'array delle carte selezionate, se necessario
  selectedCard = []; // Resetta l'array delle carte selezionate
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
        const marker = document.createElement('span');
        marker.classList.add('marker');
        marker.textContent = '|';
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
 * Crea i marker per tutti i giocatori.
 */
function handleMarkers() {
  for (let player = 1; player <= numPlayers; player++) {
    if (player !== playerturn){
      rmMarker(player);
    } else {
      crtMarker(player);
    }
  }
};

function dragHandler(){
  const cards = document.querySelectorAll('.card');
  //const markers = document.querySelectorAll('.marker');
  handleMarkers();
  for (let i = 1; i <= numPlayers; i++) {
    const playercards = document.getElementById(`player${i}-cards`);
    const markers = playercards.querySelectorAll('.marker');
    enableDraggableCards(cards, markers, i);
  }
}

function enableDraggableCards(cards, markers, player) {
  cards.forEach(card => {
    card.setAttribute('draggable', 'true');
    
    card.addEventListener('dragstart', (event) => {
      event.target.classList.add('dragging');
      event.target.nextSibling.classList.add('markerdragging');
      console.log(event.target);
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
    
    // Aggiungiamo l'evento `dragover` ai marker
    markers.forEach(marker => {
      marker.addEventListener('dragover', (event) => {
        // Impediamo il comportamento di default per permettere il drop
        event.preventDefault();
      });

      marker.addEventListener('drop', (event) => {
        // Prevenire il comportamento di default di un drop
        event.preventDefault();
        
        // Otteniamo l'elemento che è stato draggato
        const draggingElement = document.querySelector('.dragging');
        const draggingMarker = document.querySelector('.markerdragging');
        
        // Verifica se c'è un elemento da spostare
        if (draggingElement) {
          marker.parentNode.insertBefore(draggingElement, marker.nextSibling);
          marker.parentNode.insertBefore(draggingMarker, draggingElement.nextSibling);
          console.log("Spostata carta");
        }
      });
    });
  });
}



/**
 * All'avvio della pagina, leggi il numero di giocatori e distribuisci automaticamente le carte
 */
window.onload = function() {
  dealCards(parseInt(numPlayers));
  dealHands();
  dragHandler();
  showplayer(playerturn);
};