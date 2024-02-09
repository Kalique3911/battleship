let placedShips = []
let occupiedSquares = []
let shipSize = 3

////////////////////////////////////////////////////////////////////////////////////////////////////

document.getElementById('head').innerHTML = 'Battleship'

////////////////////////////////////////////////////////////////////////////////////////////////////

let firstGridLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']

firstGridLetters.map(letter => {
    let letterElement = document.createElement('div')
    letterElement.innerHTML = letter
    document.getElementById('firstLetters').appendChild(letterElement)
})

let firstGridNumbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']

firstGridNumbers.map(number => {
    let numberElement = document.createElement('div')
    numberElement.innerHTML = number
    numberElement.addEventListener('click', () => {
        alert(`you clicked number ${number}`)
    })
    document.getElementById('firstNumbers').appendChild(numberElement)
})

firstGridNumbers.map(number => {
    firstGridLetters.map(letter => {
        let sqr = document.createElement('div')
        sqr.addEventListener('click', () => {
            alert(`you clicked square ${letter + number}`)
        }, {once: true})
        document.getElementById('firstSquares').appendChild(sqr)
    })
})

////////////////////////////////////////////////////////////////////////////////////////////////////

let secondGridLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']

secondGridLetters.map(letter => {
    let letterElement = document.createElement('div')
    letterElement.innerHTML = letter
    document.getElementById('secondLetters').appendChild(letterElement)
})

let secondGridNumbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']

secondGridNumbers.map(number => {
    let numberElement = document.createElement('div')
    numberElement.innerHTML = number
    numberElement.addEventListener('click', () => {
        alert(`you clicked number ${number}`)
    })
    document.getElementById('secondNumbers').appendChild(numberElement)
})

secondGridNumbers.map(number => {
    secondGridLetters.map(letter => {
        let sqr = document.createElement('div')
        sqr.id = `${letter}${number}`
        let listener = () => {
            let count = 0
            if ((secondGridNumbers.indexOf(number) - 1) > -1) {
                count--
            }
            if ((secondGridNumbers.indexOf(number) + 1) < 10) {
                shipSize++ //we do not really increase shipSize, it is done to cover nearby to the ship squares
            }
            while (shipSize > count) {
                if (!(occupiedSquares.some(ship => ship === document.getElementById(`${letter}${Number(number) + count}`).id))) {
                    placedShips.push(`${letter}${Number(number) + count}`)
                    occupiedSquares.push(`${letter}${Number(number) + count}`)
                    if ((secondGridLetters.indexOf(letter) - 1) > -1) { //no checking of if the square is in occupiedSquares, so it can append the same square multiple times, for now it does not really affects optimization
                        occupiedSquares.push(`${secondGridLetters[secondGridLetters.indexOf(letter) - 1]}${Number(number) + count}`)
                    }
                    if ((secondGridLetters.indexOf(letter) + 1) < 10) { //here too
                        occupiedSquares.push(`${secondGridLetters[secondGridLetters.indexOf(letter) + 1]}${Number(number) + count}`)
                    }
                    count++
                } else {
                    break
                }
            }
        }
        sqr.addEventListener('click', listener, {once: true})
        document.getElementById('secondSquares').appendChild(sqr)
    })
})