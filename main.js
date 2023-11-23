'use strict'
// Selecting and declaring the HTML element
const gameContainer = document.getElementById('game');
const contentElement = document.getElementById('content');
const gameSelectSection = document.getElementById('game-select');
const returnBtn = document.getElementById('return-button');
const returnBtnSound = document.getElementById('return-sound');
const selectSound = document.getElementById('select-sound');
const newBtnSound = document.getElementById('new-sound');
const rollBtnSound = document.getElementById('dice-sound');
const holdBtnSound = document.getElementById('hold-sound');
// Declaring elements related to HTML generated with JavaScript
let initNumber;
let rollBtn, newBtn, holdBtn;
const dice1 = document.querySelector('#game .dice1');
const dice2 = document.querySelector('#game .dice2');

// Set the number of players, generate related playerSections, hide the gameSelectSection and display the game section
function selectPlayers(numPlayers) {
    playSound(selectSound);
    console.log(numPlayers);
    initNumber = numPlayers;
    // hide the gameSelectSection and show returnBtn
    gameSelectSection.classList.add('hidden');
    returnBtn.classList.remove('hidden');
    // Display the game section based on the number of players
    gameContainer.appendChild(createPlayerSections(numPlayers));
    // declaring the buttons after to avoid 'can't read values of null'
    newBtn = document.querySelector('#gameContent .btn--new');
    rollBtn = document.querySelector('#gameContent .btn--roll');
    holdBtn = document.querySelector('#gameContent .btn--hold');
    // initializing the game
    gameInit(numPlayers);
};

// Function to generate dynamically players and gameContent
function createPlayerSections(numPlayers) {
    const gameDiv = document.createElement('div');
    gameDiv.id = 'gameContent';
    // A loop to create playerSection dynamically
    for (let i = 0; i < numPlayers; i++) {
        const playerSection = document.createElement('section');
        playerSection.classList.add('player', `player--${i}`);
        // Player name h2 goes first into the playerSection
        const playerNameHeader = document.createElement('h2');
        playerNameHeader.classList.add('name', `name--${i}`);
        playerNameHeader.innerHTML = ` Pelaaja${i + 1} <i class="edit-icon" onclick="renamePlayer(${i})">✏️</i>`;
        // Player score p goes after player name h2 into the playerSection
        const playerScore = document.createElement('p');
        playerScore.id = `score--${i}`;
        playerScore.classList.add('score');
        playerScore.textContent = '0';
        // div containing current score, goes last into playerSection
        const currentDiv = document.createElement('div');
        currentDiv.classList.add('current');
        // labelParagraph and currentScoreParagraph go into currentDiv respectively
        const labelParagraph = document.createElement('p');
        labelParagraph.classList.add('current-label');
        labelParagraph.textContent = 'Nykyinen';
        const currentScoreParagraph = document.createElement('p');
        currentScoreParagraph.id = `current--${i}`;
        currentScoreParagraph.classList.add('current-score');
        currentScoreParagraph.textContent = '0';
        // Appending labelParagraph and currentScoreParagraph to currentDiv
        currentDiv.appendChild(labelParagraph);
        currentDiv.appendChild(currentScoreParagraph);
        // Appending playerNameHeader, playerScore and currentDiv to playerSection
        playerSection.appendChild(playerNameHeader);
        playerSection.appendChild(playerScore);
        playerSection.appendChild(currentDiv);
        // Appending playerSection to gameDiv/gameContent
        gameDiv.appendChild(playerSection);
    };
    // Buttons section for the game
    const buttonsSection = document.createElement('section');
    buttonsSection.classList.add('player', 'selectButtons');
    // button 'UUSI PELI'
    const uusiPeliBtn = document.createElement('button');
    uusiPeliBtn.classList.add('btn', 'btn--new');
    uusiPeliBtn.addEventListener('click', newGame);
    uusiPeliBtn.innerHTML = '🔄 Uusi peli';
    // button 'HEITÄ NOPPIA'
    const rollBtn = document.createElement('button');
    rollBtn.addEventListener('click', rollDices);
    rollBtn.classList.add('btn', 'btn--roll');
    rollBtn.innerHTML = '🎲 Heitä noppia';
    // button 'PIDÄ'
    const holdBtn = document.createElement('button');
    holdBtn.addEventListener('click', hold);
    holdBtn.classList.add('btn', 'btn--hold');
    holdBtn.innerHTML = '📥 Pidä';
    // Appending buttons to button section
    buttonsSection.appendChild(uusiPeliBtn);
    buttonsSection.appendChild(rollBtn);
    buttonsSection.appendChild(holdBtn);
    // Appending buttonsSection to gameContent
    gameDiv.appendChild(buttonsSection);
    // dice images
    const diceImg1 = document.createElement('img');
    diceImg1.src = './media/dice-5.png';
    diceImg1.className = 'dice1';
    const diceImg2 = document.createElement('img');
    diceImg2.className = 'dice2';
    diceImg2.src = './media/dice-5.png';
    // Appending dice images to gameContent
    gameDiv.appendChild(diceImg1);
    gameDiv.appendChild(diceImg2);
    // the function return the gameContent
    return gameDiv;
};

// Function for renaming the players function
function renamePlayer(playerId) {
    const playerNameElement = document.querySelector(`.name--${playerId}`);
    console.log(playerNameElement);
    let newName = prompt(`Nimeä pelaaja uudelleen ${playerId + 1} (enintään 8 kirjainta):`);
    console.log('new name input: ', newName);
    if (newName !== null) {
        // Lyhennä nimi enintään 8 kirjaimeen.
        newName = newName.substring(0, 8);
        console.log(newName);
        playerNameElement.innerHTML = `${newName} <i class="edit-icon" onclick="renamePlayer(${playerId})">✏️</i>`;
    }
};

// Declaring the gameData to avoid 'can't read/write the properties of null'
const gameData = {
    numPlayers: null,
    currentScore: null,
    scores: null,
    streak: null,
    activePlayer: null,
    playing: null,
}

// Function to initialize the values needed for the game function
function gameInit(numPlayers) {
    const sectionActive = document.querySelector('.player--0');
    sectionActive.classList.add('player--active');
    gameData.scores = Array.from({ length: numPlayers }, () => 0);
    gameData.numPlayers = numPlayers;
    gameData.currentScore = 0;
    gameData.activePlayer = 0;
    gameData.streak = 0;
    gameData.playing = true;
};

// Function to reinstate/reset values within the game
function newGame() {
    playSound(newBtnSound);
    document.getElementById('gameContent').remove()
    gameContainer.appendChild(createPlayerSections(initNumber));
    gameInit(initNumber);
};


// Function of the actions performed when the dices are rolled
function rollDices() {
    console.log(gameData.scores, gameData.activePlayer, gameData.playing);
    console.log(`Before rolling dices Active player: ${gameData.activePlayer}`);
    // Re-declaring the values of dices to avoid 'can't read/write properties of null'
    const dice1 = document.querySelector('#gameContent .dice1');
    const dice2 = document.querySelector('#gameContent .dice2');
    playSound(rollBtnSound); // play roll btn sound
    // Checking the rules of pig dice game
    if (gameData.playing && gameData.streak !== 3) {
        // 1. Satunnaisen nopparullan luominen
        const dice1Roll = Math.trunc(Math.random() * 6 + 1);
        const dice2Roll = Math.trunc(Math.random() * 6 + 1);
        // 2. Näytä noppia kuvia
        dice1.classList.remove('hidden');
        dice1.src = `./media/dice-${dice1Roll}.png`;
        dice2.classList.remove('hidden');
        dice2.src = `./media/dice-${dice2Roll}.png`;
        // 3. Tarkista olosuhteet lisätä pisteet ja jatkaa perustuu sääntöihin sika peli kaksi noppaa.
        if (dice1Roll === dice2Roll) { // check for doubles
            if (dice1Roll === 1 && dice2Roll === 1) {     // if double 1
                gameData.streak += 1;
                gameData.currentScore += 25;
                document.getElementById(`current--${gameData.activePlayer}`).textContent = gameData.currentScore;
                return;
            } else {   // if another double other than 1
                gameData.streak += 1;
                gameData.currentScore += (dice1Roll + dice2Roll) * 2;
                document.getElementById(`current--${gameData.activePlayer}`).textContent = gameData.currentScore;
                return;
            }
        } else if (dice1Roll !== 1 && dice2Roll !== 1) {  // if not double and no roll of 1
            gameData.streak = 0;
            gameData.currentScore += dice1Roll + dice2Roll;
            document.getElementById(`current--${gameData.activePlayer}`).textContent = gameData.currentScore;
            return;
        } else {
            // vaihda pelaaja
            gameData.streak = 0;
            switchPlayer();
        }
    } else {  // if three times rolled a double
        streak = 0;  // reinitiate streak value to 0
        currentScore = 0; // reinitiate currentScore value to 0
        switchPlayer(); // switching the player

    }
};

// Pelaajan vaihtaminen
function switchPlayer() {
    console.log(`Before switch: activePlayer= ${gameData.activePlayer}`);
    document.getElementById(`current--${gameData.activePlayer}`).textContent = 0;

    if (gameData.activePlayer !== null) {
        // Remove 'player--active' class from the current player
        const currentAvtivePlayer = document.querySelector(`#gameContent .player--${gameData.activePlayer}`);
        if (currentAvtivePlayer) {
            currentAvtivePlayer.classList.remove('player--active')
        }

        // Use modulo to cycle through players based on the numPlayers
        gameData.activePlayer = (gameData.activePlayer + 1) % gameData.numPlayers;

        // Add 'player--active' class to the current active player
        const newActivePlayer = document.querySelector(`#gameContent .player--${gameData.activePlayer}`);
        if (newActivePlayer) {
            newActivePlayer.classList.add('player--active');
        }
    }

    // reinitiate currentScore value to 0
    gameData.currentScore = 0;
    console.log(`Adding 'player--active' class to the new active player: ${gameData.activePlayer}`);
};

// Hold Btn Function
function hold() {
    console.log('Pidä button clicked');
    playSound(holdBtnSound);
    // Re-declaring the values of dices to avoid 'can't read/write properties of null'
    const dice1 = document.querySelector('#gameContent .dice1');
    const dice2 = document.querySelector('#gameContent .dice2');
    const playerElement = document.querySelector(`.player--${gameData.activePlayer}`);
    if (gameData.playing) {
        // 1. Lisää currentScore pelaajan pistemäärään scores -joukossa
        gameData.scores[gameData.activePlayer] += gameData.currentScore;
        document.getElementById(`score--${gameData.activePlayer}`).textContent = gameData.scores[gameData.activePlayer];
        console.log(gameData.scores[gameData.activePlayer]);
        console.log(gameData.scores);

        // 2. Tarkista, onko pelaajan pistemäärä >= 100: Jos True Pelaaja voittaa ja lopettaa pelin.
        if (gameData.scores[gameData.activePlayer] >= 100) {
            gameData.playing = false;
            dice1.classList.add('hidden');  // hide the dices and add the class player--winner to apply the style
            dice2.classList.add('hidden');
            document.querySelector(`.player--${gameData.activePlayer}`).classList.remove('player--active');
            document.querySelector(`.player--${gameData.activePlayer}`).classList.add('player--winner');

            // Voittajan nimeäminen
            const winningPlayer = playerElement.querySelector('.name');
            const winnerName = winningPlayer.innerText;
            winningPlayer.innerHTML = `${winnerName}<br>Voitti!!🥇`;
        } else {
            // 3. Muuten vaihda pelaaja ja aseta currentScore arvoon 0.
            switchPlayer();
        }
    }

}

// A reusable function to play sound
function playSound(soundElement) {
    soundElement.currentTime = 0;
    soundElement.play();
};

returnBtn.addEventListener('click', function () {
    playSound(returnBtnSound);
    // Remove the created cameContent div
    document.getElementById('gameContent').remove();
    gameSelectSection.classList.remove('hidden');
    returnBtn.classList.add('hidden');

});
