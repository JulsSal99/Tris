// Definisco il mazzo di carte
const deck = [
  'A♠', '2♠', '3♠', '4♠', '5♠', '6♠', '7♠', '8♠', '9♠', '10♠', 'J♠', 'Q♠', 'K♠',
  'A♥', '2♥', '3♥', '4♥', '5♥', '6♥', '7♥', '8♥', '9♥', '10♥', 'J♥', 'Q♥', 'K♥',
  'A♦', '2♦', '3♦', '4♦', '5♦', '6♦', '7♦', '8♦', '9♦', '10♦', 'J♦', 'Q♦', 'K♦',
  'A♣', '2♣', '3♣', '4♣', '5♣', '6♣', '7♣', '8♣', '9♣', '10♣', 'J♣', 'Q♣', 'K♣'
];

let selectedCard = []; // Variabile per tenere traccia delle carte selezionate

function isValidSelection(selectedCards) {
  if (!Array.isArray(selectedCard)) {
    console.error('selectedCards deve essere un array.');
    return false;
  }
  
  if (selectedCard.length <= 1){
    return true;
  }
  const values = selectedCards.map(card => card.slice(0, -1));
  const suits = selectedCards.map(card => card.slice(-1));

  // Controlla se ci sono valori duplicati di semi differenti
  const hasDifferentSuits = values.some((value, index) => 
    values.indexOf(value) !== index && suits[index] !== suits[values.indexOf(value)]
  );

  // Controlla se ci sono valori consecutivi di semi uguali
  const sortedValues = [...new Set(values)].sort((a, b) => deck.indexOf(a + '♠') - deck.indexOf(b + '♠'));
  const hasConsecutiveSameSuits = sortedValues.some((value, index) => 
    index > 0 && deck.indexOf(value + suits[values.indexOf(value)]) === deck.indexOf(sortedValues[index - 1] + suits[values.indexOf(sortedValues[index - 1])]) + 1
  );

  return !(hasDifferentSuits || hasConsecutiveSameSuits); // Ritorna true se è valida
}

// Funzione per mischiare il mazzo
function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

// Funzione per distribuire le carte
function dealCards(numPlayers) {
  let shuffledDeck = shuffleDeck([...deck]);

  const playersContainer = document.getElementById('playersContainer');
  playersContainer.innerHTML = ''; // Pulisce eventuali giocatori precedenti

  // Crea le sezioni dei giocatori
  for (let i = 1; i <= numPlayers; i++) {
    const playerDiv = document.createElement('div');
    playerDiv.classList.add('player');
    playerDiv.innerHTML = `<h2>Giocatore ${i}</h2><div class="cards" id="player${i}-cards"></div>`;
    playersContainer.appendChild(playerDiv);

    const playerCards = shuffledDeck.splice(0, 5); // Distribuisci 5 carte a ciascun giocatore
    displayCards(`player${i}-cards`, playerCards);
  }

  // Mostra il mazzo coperto con le carte rimanenti
  displayDeck(shuffledDeck);
}

// Funzione per visualizzare le carte sullo schermo
function displayCards(playerId, cards) {
  const playerDiv = document.getElementById(playerId);
  playerDiv.innerHTML = ''; // Pulisce l'area delle carte
  cards.forEach(card => {
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card');
    cardDiv.textContent = card;

    // Aggiunge l'evento di click per selezionare la carta
    cardDiv.onclick = function() {
      selectCard(cardDiv);
    };

    playerDiv.appendChild(cardDiv);
  });
}

// Funzione per selezionare una carta
function selectCard(cardDiv) {
  // Aggiungi la nuova carta all'array e evidenzialo
  selectedCard.push(cardDiv); // Imposta la nuova carta selezionata
  if (!isValidSelection(selectedCard)) {
    selectedCard.forEach(card => {
      card.classList.remove('selected'); // Rimuove la selezione da ogni carta
    });
    selectedCard = [];
  }
  cardDiv.classList.add('selected'); // Aggiunge classe per evidenziare la selezione
}

// Funzione per visualizzare il mazzo coperto
function displayDeck(remainingDeck) {
  const deckDiv = document.getElementById('deck');
  deckDiv.innerHTML = ''; // Pulisce l'area del mazzo
  // Mantieni le carte rimanenti nel mazzo come coperto, senza mostrare il contenuto.
  deckDiv.dataset.remaining = remainingDeck.length; // Memorizza il numero di carte rimanenti
}

// Aggiungere l'evento per piazzare la carta quando si clicca sull'area di gioco
document.getElementById('cardSlot').onclick = function() {
  if (selectedCard.length > 0) {
    placeCard(selectedCard);
    selectedCard = []; // Resetta la selezione dopo il piazzamento
  }
};

// Funzione per piazzare la carta
function placeCard(selectedCards) {
  const cardSlot = document.getElementById('cardSlot');
  cardSlot.textContent = ''; // Pulisci il contenuto esistente

  // Controlla se ci sono carte selezionate
  if (selectedCards.length === 0) {
    console.log("Nessuna carta selezionata.");
    return;
  }

  // Aggiungi ogni carta selezionata all'area di gioco
  selectedCards.forEach(cardDiv => {
    const placedCardDiv = document.createElement('div');
    placedCardDiv.classList.add('placed-card'); // Aggiunge classe per la carta piazzata
    placedCardDiv.textContent = cardDiv.textContent; // Mostra la carta piazzata

    // Aggiungi la carta piazzata all'area di gioco
    cardSlot.appendChild(placedCardDiv);

    // Rimuovi la carta dall'area del giocatore
    cardDiv.remove();
  });

  // Reset dell'array delle carte selezionate, se necessario
  selectedCard = []; // Resetta l'array delle carte selezionate
}

// All'avvio della pagina, leggi il numero di giocatori e distribuisci automaticamente le carte
window.onload = function() {
  const numPlayers = localStorage.getItem('numPlayers') || 3; // Imposta 3 giocatori di default se non viene trovato nulla
  dealCards(parseInt(numPlayers));
};
