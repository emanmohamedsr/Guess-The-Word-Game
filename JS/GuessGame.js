// Game name
const gameName = 'Guess The Word';

document.title = gameName;
document.querySelector('.header').innerHTML = gameName;
document.querySelector('footer').innerHTML = `${gameName} Game Created By <span>Eman</span>`;

// Game options
const numberOfTries = 5;
let currentTry = 1;
const words = ['book', 'tree', 'lion' ,'apple', 'bread', 'chair', 'dance', 'eagle', 'flame', 'grass', 'house', 'jelly', 'lemon', 'orange', 'flower', 'jacket' , 'freedom', 'student', 'example'];
const correctWord = getRandomWord();
const numberOfLetters = correctWord.length; //dynmically generation for inputs upon the number of letters

let numberOFHints = 3; 
const numberOFHintsSpan = document.querySelector('button.hint span');
numberOFHintsSpan.innerHTML = numberOFHints;

function getRandomWord() {
    return words[Math.floor(Math.random() * words.length)];
}

//initial generation for the inputs
function generateInput() {
    const inputs = document.querySelector('.inputs');
    // generate tries 
    for (let i = 1; i <= numberOfTries; i++) {
        const newTry = document.createElement('div');
        newTry.classList.add(`try-${i}`);
        newTry.innerHTML = `<span>Try ${i}</span>`;
        if (i === currentTry) {
            newTry.classList.add('active');
        } else {
            newTry.classList.add('disabled');
        }
        // generate inputs
        for (let j = 0; j < numberOfLetters; j++) {
            const newLetter = document.createElement('input');
            newLetter.setAttribute('id', `try-${i}-letter-${j}`);
            newLetter.setAttribute('type', 'text');
            newLetter.setAttribute('maxlength', 1);
            newLetter.disabled = newTry.classList.contains('disabled');//disabled or not based on state of its try
            newTry.appendChild(newLetter);
        }        
        inputs.appendChild(newTry);
    }   
    // features
    nextFocus(); 
    arrowKeyEvent(); 
}

// Set the focus on the first letter of the current try and somthly move to the next letter
function nextFocus() {
    const letters = document.querySelectorAll('.active input');
    letters[0].focus();     
    letters.forEach(function (letter, index) {
        letter.addEventListener('input', function () {
            this.value = this.value.toLowerCase(); 
            const nextLetter = letters[index + 1];
            if (nextLetter) nextLetter.focus(); 
        });
    });
}

// Set up arrow key navigation
function arrowKeyEvent() {
    const letters = document.querySelectorAll('.active input');
    letters.forEach(letter => {
        letter.addEventListener('keydown', function(event) {
            const currentLetterIndex = Array.from(letters).indexOf(event.target); // current index
            if (event.key === 'ArrowRight' && currentLetterIndex < letters.length - 1) {
                letters[currentLetterIndex + 1].focus(); // Move focus right
            }
            if (event.key === 'ArrowLeft' && currentLetterIndex > 0) {
                letters[currentLetterIndex - 1].focus(); // Move focus left
            }
        });
    });
}

// Start The Game
document.querySelector('button.check').addEventListener('click', handleGuesses);

function checkAllFilled() {
    const letters = document.querySelectorAll('.active input');
    for (let i = 0; i < letters.length; i++) {
        if (letters[i].value === '') {
            letters[i].focus(); 
            return false;
        }
    }
    return true;
}

function handleGuesses(event) {
    if (!checkAllFilled()) {
        event.preventDefault(); 
        return;
    }

    const activeTry = document.querySelector(`.active`);
    const letters = document.querySelectorAll('.active input');
    let correctNumber=0;
    for (let i = 0; i < correctWord.length; i++) {
        if (letters[i].value === correctWord[i]) {
            letters[i].classList.add('correct'); 
            correctNumber++;
        } else if (correctWord.includes(letters[i].value)) {
            letters[i].classList.add('not-in-place'); 
        } else {
            letters[i].classList.add('wrong');
        }
        letters[i].disabled = true; // Disable inputs after guessing
    }

    // Win
    if (correctNumber === correctWord.length) {
        swal("Good Job!", "You Guessed The Word", "success");
        document.querySelector('button.check').disabled = true; 
        document.querySelector('button.hint').disabled = true; 
        return; 
    }

    activeTry.children[0].style.color = "#5c5c5c";
    activeTry.classList.remove('active');
    activeTry.classList.add('disabled'); 
    currentTry++; 
    
    const newActiveTry = document.querySelector(`.try-${currentTry}`); // Get the next try
    if (newActiveTry) { 
        newActiveTry.classList.add('active'); 
        newActiveTry.classList.remove('disabled'); 
        newActiveTry.children[0].style.color = '#000';

        const newletters = document.querySelectorAll(`.try-${currentTry} input`);     
        newletters.forEach(letter => letter.disabled = false); // Enable inputs for the new try 
        nextFocus();
        arrowKeyEvent();
    } else {
        swal("Game Over", "You Lost", "error");
        document.querySelector('button.check').disabled = true; 
        document.querySelector('button.hint').disabled = true; 
        return;
    }
}


document.querySelector('button.hint').addEventListener('click', handleHint);

function handleHint(event) {
    if (numberOFHints <= 0) {
        swal("Sorry, you have reached the limit");
        event.preventDefault(); 
        return; 
    }
    const activeLetters = document.querySelectorAll(`.active input`);
    
    // Check if there are any empty fields
    const anyEmpty = Array.from(activeLetters).some(letter => letter.value === '');

    if (!anyEmpty) {
        swal("All fields are filled, please free up a field to give the hint.");
        event.preventDefault();
        return; 
    }

    for (let i = 0; i < correctWord.length; i++) {
        if (activeLetters[i].value === '' && !activeLetters[i].disabled) {
            activeLetters[i].value = correctWord[i]; 
            activeLetters[i].disabled = true; 
            activeLetters[i].classList.add('correct'); 
            
            // Move focus to the next letter, if it exists
            if (i + 1 < activeLetters.length) {
                activeLetters[i + 1].focus(); 
            }
            
            numberOFHints--; // Decrease the hint count
            numberOFHintsSpan.innerHTML = numberOFHints; 
            break; 
        }
    }
}

window.addEventListener("DOMContentLoaded", (_) => generateInput()); 