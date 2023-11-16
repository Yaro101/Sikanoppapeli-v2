'use strict'

// Elementtien valitseminen
const gameSelection = document.querySelector('.game-selection');
const twoPlayerMode = document.querySelector('.game-section-2');
const threePlayerMode = document.querySelector('.game-section-3');
const fourPlayerMode = document.querySelector('.game-section-4');
const fivePlayerMode = document.querySelector('.game-section-5');

const player1Name = document.getElementById('name--0');
const player2Name = document.getElementById('name--1');
const player3Name = document.getElementById('name--2');
const player4Name = document.getElementById('name--3');
const player5Name = document.getElementById('name--4');

const editIcon = document.querySelector('.edit-icon');

const player0 = document.querySelector('.player--0');
const player1 = document.querySelector('.player--1');
const player2 = document.querySelector('.player--2');
const player3 = document.querySelector('.player--3');
const player4 = document.querySelector('.player--4');

const score0 = document.getElementById('score--0');
const score1 = document.getElementById('score--1');
const score2 = document.getElementById('score--2');
const score3 = document.getElementById('score--3');
const score4 = document.getElementById('score--4');

const current0 = document.getElementById('current--0');
const current1 = document.getElementById('current--1');
const current2 = document.getElementById('current--2');
const current3 = document.getElementById('current--3');
const current4 = document.getElementById('current--4');

const dice1 = document.querySelector('.dice1');
const dice2 = document.querySelector('.dice2');

// const hoverSound = document.getElementById("hover-sound");
const selectSound = document.getElementById("select-sound");

const returnButton = document.getElementById('return-button');
const returnSound = document.getElementById('return-sound');

const btnNew = document.querySelector('.btn--new');
const newSound = document.getElementById('new-sound');

const btnRoll = document.querySelector('.btn--roll');
const diceRollSound = document.getElementById('dice-sound');

const btnHold = document.querySelector('.btn--hold');
const holdSound = document.getElementById('hold-sound');

// muuttujien ilmoittaminen scoping-virheiden välttämiseksi
let scores, currentScore, streak, activePlayer, numPlayers, playersSelected, playing;
let playerNames = ['Pelaaja1', 'Pelaaja2', 'Pelaaja3', 'Pelaaja4', 'Pelaaja5'];

// Function to show the section based on the click event
function showGameSection(numberOfPlayers) {
    // Piilota pelin valinta div ja returnButton
    gameSelection.classList.add('hidden');
    returnButton.classList.remove('hidden');

    // Piilota kaikki pelin osiot
    twoPlayerMode.classList.add('hidden');
    threePlayerMode.classList.add('hidden');
    fourPlayerMode.classList.add('hidden');
    fivePlayerMode.classList.add('hidden');

    // Näytä peliosio pelaajien lukumäärän perusteella
    if (numberOfPlayers === 2) {
        twoPlayerMode.classList.remove('hidden');
        // playersSelected = playerNames.slice(0, 2);
    } else if (numberOfPlayers === 3) {
        threePlayerMode.classList.remove('hidden');
        // playersSelected = playerNames.slice(0, 3);
    } else if (numberOfPlayers === 4) {
        fourPlayerMode.classList.remove('hidden');
        // playersSelected = playerNames.slice(0, 4);
    } else if (numberOfPlayers === 5) {
        fivePlayerMode.classList.remove('hidden');
        // playersSelected = playerNames.slice(0, 5);
    }
};

// Function to reinstate the game selection menue and hide the game section
function showGameSelection() {
    // Piilota pelisisältöosiot
    twoPlayerMode.classList.add('hidden');
    threePlayerMode.classList.add('hidden');
    fourPlayerMode.classList.add('hidden');
    fivePlayerMode.classList.add('hidden');

    // Näytä pelin valintaosio ja näytä returnButton
    gameSelection.classList.remove('hidden');
    returnButton.classList.add('hidden');
};


function selectPlayers(numberOfPlayers) {
    // Set the number of players and initialize scores array and assigning a value to numPlayers
    numPlayers = numberOfPlayers;
    console.log(numberOfPlayers);

    // Display the selected game section based on the number of players
    showGameSection(numberOfPlayers);

    // Initializing the game and values
    gameInit();

};


// Game initialization function
// Sets up the initial state of the game, including scores, players, and UI elements.
const gameInit = function () {
    scores = Array.from({ length: numPlayers }, () => 0);
    playersSelected = playerNames.slice(0, numPlayers);
    console.log(`Array of players: ${playersSelected}`);
    console.log(`The number of players: ${numPlayers}`);
    currentScore = 0;
    activePlayer = 0;
    streak = 0;
    playing = true;

    // Loop through players to initialize their names, scores, and current scores
    for (let i = 0; i < numPlayers; i++) {
        console.log(`Initializing player ${i + 1}`);
        const playerNameElement = document.getElementById(`name--${i}`);
        playerNameElement.innerHTML = `${playersSelected[i]} <i class="edit-icon" onclick="renamePlayer(${i})">✏️</i>`;

        // initializing the inner content of the HTML to 0 for the score
        const scoreElement = document.getElementById(`score--${i}`);
        scoreElement.textContent = 0;
        console.log(`score after init for player${i + 1}: ${scoreElement.textContent}`);

        // initializing the inner content of the HTML to 0 for the current
        const currentElement = document.getElementById(`current--${i}`);
        currentElement.textContent = 0;
        console.log(`current after init for player${i + 1}: ${currentElement.textContent}`);

        // removing the classes 'player--winner' and 'player--active' from each player
        const playerElement = document.querySelector(`#game-content-${numPlayers} .player--${i}`);
        playerElement.classList.remove('player--winner');
        playerElement.classList.remove('player--active');
    }


    // Adding the class 'player--active' to the active player after the loop and handeling potancial null error
    document.querySelector(`#game-content-${numPlayers} .player--${activePlayer % numPlayers}`)?.classList.add('player--active');
    console.log('Classes after adding player--active:', document.querySelector(`#game-content-${numPlayers} .player--${activePlayer % numPlayers}`)?.classList);





    // Hide the dices before the game start
    dice1.classList.add('hidden');
    dice2.classList.add('hidden');

    // Add event listeners for different game sections
    addEventListenersForGameSections();
};


// Toiminto renamePlayer(playerId) pelaajan nimi vaihtamiseksi
function renamePlayer(playerId) {
    const playerNameElement = document.getElementById(`name--${playerId}`);
    console.log(playerNameElement);
    let newName = prompt(`Nimeä pelaaja uudelleen ${playerId + 1} (enintään 8 kirjainta):`);
    console.log(`New name input: ${newName}`);

    if (newName !== null) {
        // Lyhennä nimi enintään 8 kirjaimeen.
        newName = newName.substring(0, 8);

        // Päivitä pelaajan nimimuuttuja
        playersSelected[playerId] = newName;
        console.log(`Updated name in array: ${newName}`);
        console.log(`Updated array: ${playersSelected}`);

        // Päivitä pelaajan nimi HTML:ssä
        console.log(`Before HTML update: ${playerNameElement.innerHTML}`);
        playerNameElement.innerHTML = `${playersSelected[playerId]} <i class="edit-icon" onclick="renamePlayer(${playerId})">✏️</i>`;
        console.log(`After HTML update: ${playerNameElement.innerHTML}`);

    }
};

// Pelaajan vaihtaminen
const switchPlayer = function () {
    console.log(`Before switch: activePlayer=${activePlayer}`);
    document.getElementById(`current--${activePlayer}`).textContent = 0;

    // Remove 'player--active' class from all players
    for (let i = 0; i < numPlayers; i++) {
        document.querySelector(`#game-content-${numPlayers} .player--${i}`).classList.remove('player--active');
    }

    activePlayer = (activePlayer + 1) % numPlayers; // Use modulo to cycle through players based on the numPlayers
    currentScore = 0;  // reinitiate currentScore value to 0

    // Add 'player--active' class to the current active player
    document.querySelector(`.player--${activePlayer}`).classList.add('player--active');

    console.log(`After switch: activePlayer=${activePlayer}`);
    console.log('Player classes:', document.querySelector(`#game-content-${numPlayers} .player--${activePlayer % numPlayers}`)?.classList.value);

};

// Function to add event listeners for different game sections
function addEventListenersForGameSections() {
    for (let i = 2; i <= 5; i++) {
        const btnRollId = `#game-content-${i} .btn--roll`;
        const btnHoldId = `#game-content-${i} .btn--hold`;

        const btnRoll = document.querySelector(btnRollId);
        const btnHold = document.querySelector(btnHoldId);

        // Add event listener for "Heitä noppaa" button
        btnRoll.addEventListener('click', BtnRollActions);

        // Add event listener for "PIDÄ" button
        btnHold.addEventListener('click', btnHoldActions);
    }
};

// HEITÄ NOPPAA -painikkeen toiminnallisuus
function BtnRollActions() {
    playSound(diceRollSound);
    console.log('Heitä btn is clicked');
    console.log('Playing:', playing);
    console.log('Streak:', streak);
    console.log('Active Player:', activePlayer);
    if (playing && streak !== 3) {
        // 1. Satunnaisen nopparullan luominen
        const dice1Roll = Math.trunc(Math.random() * 6) + 1;
        const dice2Roll = Math.trunc(Math.random() * 6) + 1;

        // 2. Näytä noppia kuvia
        dice1.classList.remove('hidden');
        dice1.src = `./media/dice-${dice1Roll}.png`;
        dice2.classList.remove('hidden');
        dice2.src = `./media/dice-${dice2Roll}.png`;

        // 3. Tarkista olosuhteet lisätä pisteet ja jatkaa perustuu sääntöihin sika peli kaksi noppaa.
        if (dice1Roll === dice2Roll) { // check for doubles
            if (dice1Roll === 1 && dice2Roll === 1) {     // if double 1
                streak += 1;
                currentScore += 25;
                document.getElementById(`current--${activePlayer}`).textContent = currentScore;
                return;
            } else {   // if another double other than 1
                streak += 1;
                currentScore += (dice1Roll + dice2Roll) * 2;
                document.getElementById(`current--${activePlayer}`).textContent = currentScore;
                return;
            }
        } else if (dice1Roll !== 1 && dice2Roll !== 1) {  // if not double and no roll of 1
            streak = 0;
            currentScore += dice1Roll + dice2Roll;
            document.getElementById(`current--${activePlayer}`).textContent = currentScore;
            return;
        } else {
            // vaihda pelaaja
            streak = 0;
            switchPlayer();
        }
    } else {  // if three times rolled a double
        console.log('Inside else condition');
        streak = 0;  // reinitiate streak value to 0
        currentScore = 0; // reinitiate currentScore value to 0
        switchPlayer(); // switching the player
    }
};

// PIDÄ Painikkeiden toiminnot
function btnHoldActions() {
    console.log('Pidä Btn is clicked');
    playSound(holdSound);
    if (playing) {
        // 1. Lisää currentScore pelaajan pistemäärään scores -joukossa
        scores[activePlayer] += currentScore;
        document.getElementById(`score--${activePlayer}`).textContent = scores[activePlayer];
        console.log(scores[activePlayer]);
        console.log(scores);

        // 2. Tarkista, onko pelaajan pistemäärä >= 100: Jos True Pelaaja voittaa ja lopettaa pelin.
        if (scores[activePlayer] >= 100) {
            playing = false;
            dice1.classList.add('hidden');  // hide the dices and add the class player--winner to apply the style
            dice2.classList.add('hidden');
            document.querySelector(`.player--${activePlayer}`).classList.remove('player--active');
            document.querySelector(`.player--${activePlayer}`).classList.add('player--winner');

            // Voittajan nimeäminen
            const winningPlayer = document.getElementById(`name--${activePlayer}`);
            const winnerName = playerNames[activePlayer];
            winningPlayer.innerHTML = `${winnerName}<br>Voitti!!🥇`;
        } else {
            // 3. Muuten vaihda pelaaja ja aseta currentScore arvoon 0.
            switchPlayer();
        }
    }
};


// UUSI PELI Painikkeen toiminnallisuus
btnNew.addEventListener('click', function () {
    console.log('New Btn Clicked! New-Sound');
    playSound(newSound);
    gameInit();
})

// activating and setting "UUSI PELI" button in different game sections  
for (let i = 2; i <= 5; i++) {
    const btnNewId = `#game-content-${i} .btn--new`;
    const btnNew = document.querySelector(btnNewId);

    btnNew.addEventListener('click', function () {
        console.log('Uusi Btn is clicked! Uusi-Sound');
        playSound(newSound);
        gameInit();
    });
}

// Heitä noppia Painikkeen toiminnallisuus
// btnRoll.addEventListener('click', function () {
//     console.log('Roll btn is clicked! Roll-sound');
//     diceRollSound.currentTime = 0;
//     diceRollSound.play();
// })

// // Setting "Heitä noppia" button in different game sections  
// for (let i = 2; i <= 5; i++) {
//     const btnRollId = `#game-content-${i} .btn--roll`;
//     const btnRoll = document.querySelector(btnRollId);

//     btnRoll.addEventListener('click', function () {
//         console.log('Heitä noppia Btn Clicked! Heitä-sound');
//         diceRollSound.currentTime = 0;
//         diceRollSound.play();
//     });
// }

// // 'PIDÄ' Painikkeen toiminnallisuus
// btnHold.addEventListener('click', function () {
//     console.log('Hold Btn Clicked! Hold-sound');
//     holdSound.currentTime = 0;
//     holdSound.play();
// })

// // Setting "PIDÄ" button in different game sections  
// for (let i = 2; i <= 5; i++) {
//     const btnholdId = `#game-content-${i} .btn--hold`;
//     const btnHold = document.querySelector(btnholdId);

//     btnHold.addEventListener('click', function () {
//         console.log('Pidä btn is clicked! Pidä-Sound');
//         holdSound.currentTime = 0;
//         holdSound.play();
//     });
// }

// A reusable function to play Sound
function playSound(soundElement) {
    soundElement.currentTime = 0; // Rewind the sound to the beginning
    soundElement.play();
};

// function playHoverSound() {
//     playSound(hoverSound)
// };


function playSelectSound() {
    playSound(selectSound)
};


// Adding an event listener to the returnButton
returnButton.addEventListener('click', function () {
    // Soita 'return-sound'
    console.log('Return btn is clicked!');
    playSound(returnSound);
    showGameSelection(); // show the game selection menue
    gameInit(); // initializing the game
})


// Peli lähtökohta
showGameSelection();
gameInit();


