const wordDisplay = document.querySelector(".word-display");
const guessesText = document.querySelector(".guesses-text b");
const keyboardDiv = document.querySelector(".keyboard");
const hangmanImage = document.querySelector(".hangman-box img");
const gameModal = document.querySelector(".game-modal");
const playAgainBtn = gameModal.querySelector("button");

const bgMusic = document.getElementById("bg-sound");
const btnMusic = document.getElementById("btn-sound");


// Initializing game variables
let currentWord, correctLetters, wrongGuessCount;
const maxGuesses = 6;


const player ={
    name : "",
    nickname: "",
    score : 0
};



const upScore = () => {
    player.score += 2;   
};

const showScore = () => {
    alert(`Final Score is : ${player.score}`);
};


let Noinfo = false;

const getInfo = () => {

    if(Noinfo){
        return;
    }
    player.name = prompt("Enter name:");

    if (player.name === null){
        Noinfo = true;
        return;
    }
    player.nickname = prompt("Enter nickname:");

    Noinfo = true;
};

const win = ["Well done !", "Congratulations!" ,"You're a Champion!"];
const lose = ["Better luck next time!", "Don't give up!", "Keep Trying!"];
const Phrase = (phrases) => {
    return phrases[Math.floor(Math.random() * phrases.length)];
};


const resetGame = () => {
    // Ressetting game variables and UI elements
    correctLetters = [];
    wrongGuessCount = 0;
    hangmanImage.src = "images/hangman-0.svg";
    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;
    wordDisplay.innerHTML = currentWord.split("").map(() => `<li class="letter"></li>`).join("");
    keyboardDiv.querySelectorAll("button").forEach(btn => btn.disabled = false);
    gameModal.classList.remove("show");
}

const getRandomWord = () => {
    // Selecting a random word and hint from the wordList
    const { word, hint } = wordList[Math.floor(Math.random() * wordList.length)];
    currentWord = word; // Making currentWord as random word
    document.querySelector(".hint-text b").innerText = hint;
    resetGame();
}

const gameOver = (isVictory) => {

    if (isVictory) {
        upScore();
    }


    let modalText;
    if (isVictory) {
        if (player.name !== null) {
            modalText = ` ${player.name}! ${Phrase(win)} `;
        } else {
            modalText = ` You won! ${Phrase(win)} `;
        }
    } else {
        modalText = `${Phrase(lose)} The correct word was:`;
    }
    // After game complete.. showing modal with relevant details
    
    gameModal.querySelector("img").src = `images/${isVictory ? 'victory' : 'lost'}.gif`;
    gameModal.querySelector("h4").innerText = isVictory ? 'Congrats!' : 'Game Over!';
    gameModal.querySelector("p").innerHTML = `${modalText} <b>${currentWord}</b>`;
    gameModal.classList.add("show");

    bgMusic.play();


};

const quit = () => {
    showScore();
};
quitBtn.addEventListener("click", quit);


const initGame = (button, clickedLetter) => {


    getInfo();
    // Checking if clickedLetter is exist on the currentWord
    if(currentWord.includes(clickedLetter)) {
        // Showing all correct letters on the word display
        [...currentWord].forEach((letter, index) => {
            if(letter === clickedLetter) {
                correctLetters.push(letter);
                wordDisplay.querySelectorAll("li")[index].innerText = letter;
                wordDisplay.querySelectorAll("li")[index].classList.add("guessed");
            }
        });
    } else {
        // If clicked letter doesn't exist then update the wrongGuessCount and hangman image
        wrongGuessCount++;
        hangmanImage.src = `images/hangman-${wrongGuessCount}.svg`;
    }
    button.disabled = true; // Disabling the clicked button so user can't click again
    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;

    // Calling gameOver function if any of these condition meets
    if(wrongGuessCount === maxGuesses) return gameOver(false);
    if(correctLetters.length === currentWord.length) return gameOver(true);
}

// Creating keyboard buttons and adding event listeners
for (let i = 97; i <= 122; i++) {
    const button = document.createElement("button");
    button.innerText = String.fromCharCode(i);
    keyboardDiv.appendChild(button);
    button.addEventListener("click", (e) => {
        initGame(e.target, String.fromCharCode(i));
        btnMusic.play();
    });
}

getRandomWord();
playAgainBtn.addEventListener("click", getRandomWord);