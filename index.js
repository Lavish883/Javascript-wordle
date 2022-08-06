var wordOfTheDay = answersDict[Math.floor(Math.random() * answersDict.length)];
var allKeys = [['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'], ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'], ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '&#9003;']];
var worldGrid = makeWordGrid()
var currentPlace = { 'row': 0, 'column': 0 };
var abcs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

console.log(wordOfTheDay)
wordOfTheDay = 'alloy'

function replaceLetter(string, indx, replacement) {
    console.log(string.substring(0, indx) + replacement + string.substring(indx + replacement.length));
    // get string before u have to replace indx
    // add that to the letter replaced
    // then add the rest of the string behind it
    return string.substring(0, indx) + replacement + string.substring(indx + replacement.length);
}

function makeWordGrid() {
    var grid = [];

    for (var i = 0; i < 6; i++) {
        var row = { 'word': '     ', 'hint': '     ' };
        grid.push(row);
    }
    return grid
}
function generateUserKeys(userKeys) {
    var htmlGenerated = [];

    for (var i = 0; i < userKeys.length; i++) {
        // add the div keysContainer
        htmlGenerated.push(`<div class="keysContainer">`)
        for (var k = 0; k < userKeys[i].length; k++) {
            if (userKeys[i][k] == 'ENTER' || userKeys[i][k] == '&#9003;') {
                htmlGenerated.push(`<div style="padding:0px 10px" class="normalKeyBack key">${userKeys[i][k]}</div>`)
            } else {
                htmlGenerated.push(`<div class="normalKeyBack key">${userKeys[i][k]}</div>`)
            }
        }
        htmlGenerated.push(`</div>`)
    }
    return htmlGenerated.join('')
}
function generateWordGridHTML(grid) {
    var htmlGenerated = [];

    // rows is first index of array, then the items in the column
    // rember index starts with 0 in arrys
    // [0][2] => first row third column
    for (var r = 0; r < grid.length; r++) { // r meaning row indx
        htmlGenerated.push(`<div class="row">`)
        for (var c = 0; c < grid[r].word.length; c++) { // c meaning column indx

            if (grid[r].hint[c] == 'R') {
                htmlGenerated.push(`<div class="gray column ${currentPlace.row == r ? 'noBack': ''}">${grid[r].word[c]}</div>`)
            } else if (grid[r].hint[c] == 'Y') {
                htmlGenerated.push(`<div class="yellow column ${currentPlace.row == r ? 'noBack' : ''}">${grid[r].word[c]}</div>`)
            } else if (grid[r].hint[c] == 'G') {
                htmlGenerated.push(`<div class="green column ${currentPlace.row == r ? 'noBack' : ''}">${grid[r].word[c]}</div>`)
            } else {
                htmlGenerated.push(`<div class="column">${grid[r].word[c]}</div>`)
            }
        }
        htmlGenerated.push(`</div>`)
    }

    return htmlGenerated.join('');
}
function didPlayerWin() {
    let lastRowGuessed = currentPlace.row - 1;

    if (worldGrid[lastRowGuessed].hint == 'GGGGG') {
        document.querySelectorAll('.row')[lastRowGuessed].childNodes.forEach((column) => {
            column.classList.add('bounce');
            currentPlace = [];
        });
       //alert('You won')
    }
}
function addFlipAnimation(column, indx) {
    column.style.animationDelay = `${200 * indx}ms`;
    column.classList.add('flip')
    // for showing color when the flip animation finishes
    column.addEventListener('animationend', () => {
        column.classList.remove('noBack')
        // for changing the color when all the colum have done flipping
        if (indx == 4) {
            document.querySelectorAll('.key').forEach((key) => {
                if (key.classList.contains('gray') || key.classList.contains('green') || key.classList.contains('yellow')) {
                    key.classList.remove('normalKeyBack')
                }
            })
            didPlayerWin();
        }
    })
}
function handlePlayerInput(event) {
    let R = currentPlace.row;
    let C = currentPlace.column;


    if (event.key == 'Enter' && worldGrid[R].word[4] != '') {
        let guess = worldGrid[R].word

        if (dict.includes(guess.toLowerCase()) || answersDict.includes(guess.toLowerCase())) {

            worldGrid[R].hint = giveHint(wordOfTheDay, guess.toLowerCase());
            document.getElementById('words').innerHTML = generateWordGridHTML(worldGrid)

            currentPlace.row++;
            currentPlace.column = 0;

            // flip animation
            document.querySelectorAll('.row')[R].childNodes.forEach((column, indx) => {
                addFlipAnimation(column, indx);
            })
        } else {
            // shake the row if the given guess is wrong
            var row = document.querySelectorAll('.row')[R];
            row.classList.add('shake');
            row.addEventListener('animationend', () => {
                row.classList.remove('shake');
            })
        }
    }

    if (event.key == 'Backspace' && worldGrid[R].word[0] != ' ') {
        if (worldGrid[R].word[C] == ' ') {
            currentPlace.column--;
        }

        // update the world grid
        worldGrid[R].word = replaceLetter(worldGrid[R].word, currentPlace.column, ' ')

        document.getElementById('words').innerHTML = generateWordGridHTML(worldGrid)
    }

    if (abcs.indexOf(event.key.toUpperCase()) != -1 && worldGrid[R].word[C] == ' ') {
        // update the world grid
        worldGrid[R].word = replaceLetter(worldGrid[R].word,C, event.key.toUpperCase()); 

        document.getElementById('words').innerHTML = generateWordGridHTML(worldGrid) 
        document.querySelectorAll('.row')[R].childNodes[C].classList.add('pop');

        if (currentPlace.column != 4) {
            currentPlace.column++
        };
    }
}
function updateKeyboard(color, key) {
    document.querySelectorAll('.key').forEach((item) => {

        if (key.toUpperCase() == item.textContent) {
            if (color == 'R') {
                item.classList.add('gray')
            } else if (color == 'Y') {
                item.classList.add('yellow')
            } else if (color == 'G') {
                item.classList.add('green')
            }
        }
    })
}
function giveHint(word, guess) {
    let hint = '!!!!!';

    for (var i = 0; i < word.length; i++) {
        if (word.indexOf(guess[i]) == -1) {
            updateKeyboard('R', guess[i]); // R meaning not there , used as gray
            hint = replaceLetter(hint, i, 'R');
        }
        if (word[i] == guess[i]) {
            console.log(word[i], guess[i])
            hint = replaceLetter(hint, i, 'G');
            updateKeyboard('G', guess[i]);
            word = replaceLetter(word, i, '!');
        }
    }

    for (var k = 0; k < word.length; k++) {
        if (hint[k] != 'R' && hint[k] != 'G') {
            if (word.indexOf(guess[k]) != -1) {
                hint = replaceLetter(hint, k, 'Y');
                updateKeyboard('Y', guess[k]);
                word = replaceLetter(word, word.indexOf(guess[k]), '!');
            } else if (hint[k] == '!') {
                updateKeyboard('R', guess[k]);
                hint = replaceLetter(hint, k, 'R');
            }
        }
    }

    return hint;
}

//worldGrid[0][0].letter = 'H'
//worldGrid[0][1].letter = 'E'
//worldGrid[0][2].letter = 'G'
//worldGrid[0][0].hint = 'gray'
//worldGrid[0][1].hint = 'green'
//worldGrid[0][2].hint = 'yellow'

document.getElementById('keyboard').innerHTML = generateUserKeys(allKeys);
document.getElementById('words').innerHTML = generateWordGridHTML(worldGrid);
document.querySelectorAll('.key').forEach((key) => {
    key.addEventListener('click', (event) => {
        var fakeEv;
        
        if (event.target.textContent.charCodeAt(0) == '9003') {
            fakeEv = { 'key': 'Backspace' };
        } else if (event.target.textContent == 'ENTER') {
            fakeEv = { 'key': 'Enter' };
        } else {
            fakeEv = { 'key': event.target.textContent };
        }

        handlePlayerInput(fakeEv)
    })
})
window.addEventListener('keyup', handlePlayerInput)