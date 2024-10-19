// Definisco il mazzo di carte
const deck = [
    'A♠', '2♠', '3♠', '4♠', '5♠', '6♠', '7♠', '8♠', '9♠', '10♠', 'J♠', 'Q♠', 'K♠',
    'A♥', '2♥', '3♥', '4♥', '5♥', '6♥', '7♥', '8♥', '9♥', '10♥', 'J♥', 'Q♥', 'K♥',
    'A♦', '2♦', '3♦', '4♦', '5♦', '6♦', '7♦', '8♦', '9♦', '10♦', 'J♦', 'Q♦', 'K♦',
    'A♣', '2♣', '3♣', '4♣', '5♣', '6♣', '7♣', '8♣', '9♣', '10♣', 'J♣', 'Q♣', 'K♣'
  ];
  
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
      playerDiv.appendChild(cardDiv);
    });
  }
  
  // Funzione per visualizzare il mazzo coperto
  function displayDeck(remainingDeck) {
    const deckDiv = document.getElementById('deck');
    deckDiv.innerHTML = ''; // Pulisce l'area del mazzo
    // Mantieni le carte rimanenti nel mazzo come coperto, senza mostrare il contenuto.
    deckDiv.dataset.remaining = remainingDeck.length; // Memorizza il numero di carte rimanenti
  }
  
  // All'avvio della pagina, leggi il numero di giocatori e distribuisci automaticamente le carte
  window.onload = function() {
    const numPlayers = localStorage.getItem('numPlayers') || 3; // Imposta 3 giocatori di default se non viene trovato nulla
    dealCards(parseInt(numPlayers));
  };
  