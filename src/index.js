class Ship {
    constructor(options) {
        this.size = options.size
        this.name = options.name
        this.isPlaced = false
        this.coordinates = []
    }
    place() {
        this.isPlaced = true
    }
    addCoordinates(c) {
        this.coordinates.push(c)
    }
}
let shipsSizes = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1]
let ships = shipsSizes.map((n, i) => {
    let name
    if (n === 4) {
        name = 'Battleship'
    } else if (n === 3) {
        name = 'Cruiser ' + `${i}`
    } else if (n === 2) {
        name = 'Destroyer ' + `${i - 2}`
    } else {
        name = 'Boat ' + `${i - 5}`
    }
    return new Ship({size: n, name: `${name}`})
})
let selectedShip
let placedShips = []
let occupiedSquares = []
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
            if (selectedShip) {
                let count = 0
                let letterIndex = secondGridLetters.indexOf(letter)
                let numberIndex = secondGridNumbers.indexOf(number)
                let isCollision = false
                let collisionCount = 0
                let extensionShipSize = selectedShip.size
                let passed = false
                while (selectedShip.size > count) {
                    if (rotation === 'vertical') {
                        let squareName = `${letter}${Number(number) + count}`
                        while (selectedShip.size > collisionCount) {
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
                            selectedShip.addCoordinates(squareName)
                            count++
                        } else {
                            break
                        }
                    }
                    if (rotation === 'horizontal') {
                        let squareName = `${secondGridLetters[letterIndex + count]}${number}`
                        while (selectedShip.size > collisionCount) {
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
                            selectedShip.addCoordinates(squareName)
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
                    extensionShipSize++
                }
                while (extensionShipSize > count) {
                    if (isCollision) {
                        break
                    } else {
                        passed = true
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
                if (passed) {
                    document.getElementById(`${selectedShip.name}`).style.display = 'none'
                    selectedShip = null
                }
            }
        }
        sqr.addEventListener('click', listener)
        document.getElementById('secondSquares').appendChild(sqr)
    })
})

////////////////////////////////////////////////////////////////////////////////////////////////////

ships.forEach(ship => {
    let button = document.createElement('button')
    button.innerHTML = `${ship.name}`
    button.id = `${ship.name}`
    button.addEventListener('click', () => {
        selectedShip = ship
    })
    document.getElementById('shipSelector').appendChild(button)
})

////////////////////////////////////////////////////////////////////////////////////////////////////

addEventListener('keyup', event => {
    if (event.key === 'r') {
        rotate()
    }
})
