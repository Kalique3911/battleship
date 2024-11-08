class Ship {
    size
    name
    coordinates = []
    rotation = 'horizontal' || 'vertical'

    constructor(options) {
        this.size = options.size
        this.name = options.name
    }

    addCoordinate(c) {
        this.coordinates = c
    }

    rotate = () => {
        if (this.rotation === 'vertical') {
            this.rotation = 'horizontal'
            document.getElementById(this.name).style.flexDirection = 'row'
        } else {
            this.rotation = 'vertical'
            document.getElementById(this.name).style.flexDirection = 'column'
        }
    }
}

//grid preparation
let letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
let numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
let coordinates = []
numbers.map(number => {letters.map(letter => {coordinates.push(`${letter}${number}`)})})

// ships selector preparations
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

// placment rules
let horizontalPlacement = numbers.map(number => letters.map(letter => (`${letter}${number}`)))
let verticalPlacement = letters.map(letter => numbers.map(number => (`${letter}${number}`)))
let selectedShip
let selectedShipSegment
let placedShips = []
let occupiedSquares = []

// grid rendering

letters.map(letter => {
    let letterElement = document.createElement('div')
    letterElement.innerHTML = letter
    document.getElementById('secondLetters').appendChild(letterElement)
})

numbers.map(number => {
    let numberElement = document.createElement('div')
    numberElement.innerHTML = number
    document.getElementById('secondNumbers').appendChild(numberElement)
})

coordinates.map((coordinate) => {
        let sqr = document.createElement('div')
        sqr.id = `${coordinate}`
        sqr.row = horizontalPlacement.findIndex(r => r.find(coordinate => coordinate === sqr.id))
        sqr.column = verticalPlacement.findIndex(c => c.find(coordinate => coordinate === sqr.id))

        let listener = () => {
            if (selectedShip) {
                let appenCoordinateRow = horizontalPlacement[sqr.row]
                let appenCoordinateColumn = verticalPlacement[sqr.column]
                let appenCoordinateList = []
                let appenOccupiedSquares = []

                try {
                    switch(selectedShip.rotation) {
                        case 'horizontal':
                            for (let i = 0; i < selectedShip.size; i++) {
                                let coordinateIndex = appenCoordinateRow.indexOf(coordinate)
                                if (!appenCoordinateRow[coordinateIndex + i] || occupiedSquares.includes(appenCoordinateRow[coordinateIndex + i])) {
                                    throw new Error('invalid placement')
                                }
                                let appendingCoordinate = appenCoordinateRow[coordinateIndex + i]
                                appenCoordinateList.push(appendingCoordinate)
                                appenOccupiedSquares.push(appendingCoordinate)
                                // adding prohibited squares
                                if (i === 0 && appenCoordinateRow[coordinateIndex - 1]) {
                                    appenOccupiedSquares.push(appenCoordinateRow[coordinateIndex - 1])
                                    // checking if square row has upper or lower row next to it to provide adding squares to occupiedSquares
                                    if (sqr.row !== 0) appenOccupiedSquares.push(horizontalPlacement[sqr.row - 1][coordinateIndex - 1])
                                    if (sqr.row !== 9) appenOccupiedSquares.push(horizontalPlacement[sqr.row + 1][coordinateIndex - 1])
                                }
        
                                if (i === selectedShip.size - 1 && appenCoordinateRow[coordinateIndex + i + 1]) {
                                    appenOccupiedSquares.push(appenCoordinateRow[coordinateIndex + i + 1])
                                    // checking if square row has upper or lower row next to it to provide adding squares to occupiedSquares
                                    if (sqr.row !== 0) appenOccupiedSquares.push(horizontalPlacement[sqr.row - 1][coordinateIndex + i + 1])
                                    if (sqr.row !== 9) appenOccupiedSquares.push(horizontalPlacement[sqr.row + 1][coordinateIndex + i + 1])
                                }
    
                                if (sqr.row !== 0) appenOccupiedSquares.push(horizontalPlacement[sqr.row - 1][coordinateIndex + i])
                                if (sqr.row !== 9) appenOccupiedSquares.push(horizontalPlacement[sqr.row + 1][coordinateIndex + i])
                            
                            }
                            break
                        case 'vertical':
                            for (let i = 0; i < selectedShip.size; i++) {
                                let coordinateIndex = appenCoordinateColumn.indexOf(coordinate)
                                if (!appenCoordinateColumn[coordinateIndex + i] || occupiedSquares.includes(appenCoordinateColumn[coordinateIndex + i])) {
                                    throw new Error('invalid placement')
                                }
                                let appendingCoordinate = appenCoordinateColumn[coordinateIndex + i]
                                appenCoordinateList.push(appendingCoordinate)
                                appenOccupiedSquares.push(appendingCoordinate)
                                // adding prohibited squares
                                if (i === 0 && appenCoordinateColumn[coordinateIndex - 1]) {
                                    appenOccupiedSquares.push(appenCoordinateColumn[coordinateIndex - 1])
                                    // checking if square column has upper or lower column next to it to provide adding squares to occupiedSquares
                                    if (sqr.column !== 0) appenOccupiedSquares.push(verticalPlacement[sqr.column - 1][coordinateIndex - 1])
                                    if (sqr.column !== 9) appenOccupiedSquares.push(verticalPlacement[sqr.column + 1][coordinateIndex - 1])
                                }
                                if (i === selectedShip.size - 1 && appenCoordinateColumn[coordinateIndex + i + 1]) {
                                    appenOccupiedSquares.push(appenCoordinateColumn[coordinateIndex + i + 1])
                                    // checking if square column has upper or lower column next to it to provide adding squares to occupiedSquares
                                    if (sqr.column !== 0) appenOccupiedSquares.push(verticalPlacement[sqr.column - 1][coordinateIndex + i + 1])
                                    if (sqr.column !== 9) appenOccupiedSquares.push(verticalPlacement[sqr.column + 1][coordinateIndex + i + 1])
                                }
                                if (sqr.column !== 0) appenOccupiedSquares.push(verticalPlacement[sqr.column - 1][coordinateIndex + i])
                                if (sqr.column !== 9) appenOccupiedSquares.push(verticalPlacement[sqr.column + 1][coordinateIndex + i])
                            
                            }
                            break
                    }

                    selectedShip.addCoordinate(appenCoordinateList)
                    placedShips.push(selectedShip)
                    occupiedSquares = occupiedSquares.concat(appenOccupiedSquares)
                    occupiedSquares = [...new Set(occupiedSquares)] // removing duplicated squares to not paint them multiple times

                    occupiedSquares.forEach(square => {
                        document.getElementById(square).style.background = 'blue'
                    })
                    placedShips.forEach(ship => {
                        ship.coordinates.forEach(coord => {
                            document.getElementById(coord).style.background = 'grey'
                        })
                    })
                    
                    document.getElementById('shipSelector').removeChild(document.getElementById(`${selectedShip.name}`))
                    selectedShip = null
                } catch(error) {
                    console.log(error)
                }
            }
        }
        sqr.addEventListener('click', listener)
        document.getElementById('secondSquares').appendChild(sqr)
    })


// ships selector

ships.forEach(ship => {
    let placingShip = document.createElement('span')
    for (let i = 0; i < ship.size; i++) {
        let shipSegment = document.createElement('div')
        shipSegment.id = ship.name + ` ${i + 1}`
        shipSegment.index = i
        placingShip.appendChild(shipSegment)
    }
    placingShip.id = `${ship.name}`
    placingShip.addEventListener('click', () => { // todo draggable
        selectedShip = ship
    })
    document.getElementById('shipSelector').appendChild(placingShip)
})

// rotate listener

addEventListener('keyup', event => {
    if (event.key === 'r') {
        selectedShip?.rotate()
    }
})
