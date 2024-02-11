let placedShips = []
let occupiedSquares = []
let shipSize = 3
let rotation = 'vertical' || 'horizontal'
let rotate = () => {
    if (rotation === 'vertical') {
        rotation = 'horizontal'
    } else {
        rotation = 'vertical'
    }
}

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
            let letterIndex = secondGridLetters.indexOf(letter)
            let numberIndex = secondGridNumbers.indexOf(number)
            let isCollision = false
            let collisionCount = 0
            let extensionShipSize = shipSize
            while (shipSize > count) {
                if (rotation === 'vertical') {
                    let squareName = `${letter}${Number(number) + count}`
                    while (shipSize > collisionCount) {
                        let collisionSquareName = `${letter}${Number(number) + collisionCount}`
                        if ((placedShips.some(square => square === collisionSquareName)) || (occupiedSquares.some(square => square === collisionSquareName)) || Number(number) + collisionCount > 10) {
                            isCollision = true
                            break
                        }
                        collisionCount++
                    }
                    if (isCollision) {
                        break
                    }
                    if (!(occupiedSquares.some(occupiedSquare => occupiedSquare === squareName))) {
                        placedShips.push(squareName)
                        count++
                    } else {
                        break
                    }
                }
                if (rotation === 'horizontal') {
                    let squareName = `${secondGridLetters[letterIndex + count]}${number}`
                    while (shipSize > collisionCount) {
                        let collisionSquareName = `${secondGridLetters[letterIndex + collisionCount]}${number}`
                        if ((placedShips.some(square => square === collisionSquareName)) || (occupiedSquares.some(square => square === collisionSquareName)) || Number(number) + collisionCount > 10) {
                            isCollision = true
                            break
                        }
                        collisionCount++
                    }
                    if (isCollision) {
                        break
                    }
                    if (!(occupiedSquares.some(occupiedSquare => occupiedSquare === squareName))) {
                        placedShips.push(squareName)
                        count++
                    } else {
                        break
                    }
                }
            }
            count = 0
            if ((((numberIndex - 1) > -1) && rotation === 'vertical') || (((letterIndex - 1) > -1) && rotation === 'horizontal')) {
                count--
            }
            if ((((numberIndex + 1) < 10) && rotation === 'vertical') || (((letterIndex + 1) < 10) && rotation === 'horizontal')) {
                extensionShipSize++ //we do not really increase shipSize, it is done to cover nearby to the ship squares
            }
            while (extensionShipSize > count) {
                if (isCollision) {
                    break
                }
                if (rotation === 'vertical') {
                    let squareName = `${letter}${Number(number) + count}`
                    occupiedSquares.push(squareName)
                    if ((letterIndex - 1) > -1) { //no checking of if the square is in occupiedSquares, so it can append the same square multiple times, for now it does not really affect optimization
                        occupiedSquares.push(`${secondGridLetters[letterIndex - 1]}${Number(number) + count}`)
                    }
                    if ((letterIndex + 1) < 10) { //here too
                        occupiedSquares.push(`${secondGridLetters[letterIndex + 1]}${Number(number) + count}`)
                    }
                    count++
                }
                if (rotation === 'horizontal') {
                    let squareName = `${secondGridLetters[letterIndex + count]}${number}`
                    occupiedSquares.push(squareName)
                    if (numberIndex - 1 > -1) {
                        occupiedSquares.push(`${secondGridLetters[letterIndex + count]}${Number(number) - 1}`)
                    }
                    if (numberIndex + 1 < 10) {
                        occupiedSquares.push(`${secondGridLetters[letterIndex + count]}${Number(number) + 1}`)
                    }
                    count++
                }
            }
        }
        sqr.addEventListener('click', listener)
        document.getElementById('secondSquares').appendChild(sqr)
    })
})

////////////////////////////////////////////////////////////////////////////////////////////////////

addEventListener('keyup', event => {
    if (event.key === 'r') {
        rotate()
    }
})
