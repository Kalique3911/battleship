class Ship {
    size
    name
    coordinates = []
    occupiedSquares = []
    rotation = "horizontal" || "vertical"
    selectedSegment
    XY

    constructor(options) {
        this.size = options.size
        this.name = options.name
    }

    addCoordinate = (coords) => {
        this.coordinates = coords
    }

    addOccupiedSquares = (coords) => {
        this.occupiedSquares = coords
    }

    rotate = () => {
        if (this.rotation === "vertical") {
            this.rotation = "horizontal"
            document.getElementById(this.name).style.flexDirection = "row"
        } else {
            this.rotation = "vertical"
            document.getElementById(this.name).style.flexDirection = "column"
        }
    }

    setSelectedSegment = (segment) => {
        this.selectedSegment = segment
    }
}

//grid preparation
let letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
let numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
let coordinates = []
numbers.map((number) => {
    letters.map((letter) => {
        coordinates.push(`${letter}${number}`)
    })
})

// ships selector preparations
let shipsSizes = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1]
let ships = shipsSizes.map((n, i) => {
    let name
    if (n === 4) {
        name = "Battleship"
    } else if (n === 3) {
        name = "Cruiser " + `${i}`
    } else if (n === 2) {
        name = "Destroyer " + `${i - 2}`
    } else {
        name = "Boat " + `${i - 5}`
    }
    return new Ship({ size: n, name: `${name}` })
})

// placment rules
let horizontalPlacement = numbers.map((number) => letters.map((letter) => `${letter}${number}`))
let verticalPlacement = letters.map((letter) => numbers.map((number) => `${letter}${number}`))
let selectedShip
let selectedShipSegment
let placedShips = []
let occupiedSquares = []
let invalidPlacement = null

// grid rendering

letters.map((letter) => {
    let letterElement = document.createElement("div")
    letterElement.innerHTML = letter
    document.getElementById("secondLetters").appendChild(letterElement)
})

numbers.map((number) => {
    let numberElement = document.createElement("div")
    numberElement.innerHTML = number
    document.getElementById("secondNumbers").appendChild(numberElement)
})

coordinates.map((coordinate) => {
    let sqr = document.createElement("div")
    sqr.id = `${coordinate}`
    sqr.row = horizontalPlacement.findIndex((r) => r.find((coordinate) => coordinate === sqr.id))
    sqr.column = verticalPlacement.findIndex((c) => c.find((coordinate) => coordinate === sqr.id))

    let placemenPreviewtListener = () => {
        // Drawing listener when howering the ship over grid
        console.log("placemenPreviewt")
        if (selectedShip) {
            let appenCoordinateRow = horizontalPlacement[sqr.row]
            let appenCoordinateColumn = verticalPlacement[sqr.column]
            let appenCoordinateList = []
            let appenOccupiedSquares = []
            let collisionSquares = []

            switch (selectedShip.rotation) {
                case "horizontal":
                    for (let i = 0; i < selectedShip.size; i++) {
                        let coordinateIndex = appenCoordinateRow.indexOf(coordinate) - selectedShip.selectedSegment
                        if (!appenCoordinateRow[coordinateIndex + i]) {
                            continue
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
                case "vertical":
                    for (let i = 0; i < selectedShip.size; i++) {
                        let coordinateIndex = appenCoordinateColumn.indexOf(coordinate) - selectedShip.selectedSegment
                        if (!appenCoordinateRow[coordinateIndex + i]) {
                            continue
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

            collisionSquares = occupiedSquares.filter((occSqr) => appenCoordinateList.includes(occSqr))
            collisionSquares = collisionSquares.concat(appenOccupiedSquares.filter((occSqr) => placedShips.find((ship) => ship.coordinates.includes(occSqr))))

            appenOccupiedSquares.forEach((square) => {
                document.getElementById(square).style.background = "blue"
            })
            appenCoordinateList.forEach((coord) => {
                document.getElementById(coord).style.background = "grey"
                document.getElementById(coord).style.border = "solid 1px black"
            })
            collisionSquares.forEach((coord) => {
                document.getElementById(coord).style.background = "red"
            })
            document.getElementById(coordinate).addEventListener("mouseleave", () => {
                // Redrawing listener when leawing the square
                console.log("mouseleave")
                appenOccupiedSquares.forEach((square) => {
                    document.getElementById(square).style.background = "navy"
                })
                appenCoordinateList.forEach((coord) => {
                    document.getElementById(coord).style.background = "navy"
                })
                occupiedSquares.forEach((square) => {
                    document.getElementById(square).style.background = "blue"
                })
                placedShips.forEach((ship) => {
                    ship.coordinates.forEach((coord) => {
                        document.getElementById(coord).style.background = "grey"
                        document.getElementById(coord).style.border = "solid 1px black"
                    })
                })
            })
        }
    }

    let placementListener = () => {
        // Drawing listener when placed the ship
        console.log("placement")
        if (selectedShip) {
            try {
                let appenCoordinateRow = horizontalPlacement[sqr.row]
                let appenCoordinateColumn = verticalPlacement[sqr.column]
                let appenCoordinateList = []
                let appenOccupiedSquares = []

                switch (selectedShip.rotation) {
                    case "horizontal":
                        for (let i = 0; i < selectedShip.size; i++) {
                            let coordinateIndex = appenCoordinateRow.indexOf(coordinate) - selectedShip.selectedSegment
                            if (!appenCoordinateRow[coordinateIndex + i] || occupiedSquares.includes(appenCoordinateRow[coordinateIndex + i])) {
                                throw new Error("invalid placement")
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
                    case "vertical":
                        for (let i = 0; i < selectedShip.size; i++) {
                            let coordinateIndex = appenCoordinateColumn.indexOf(coordinate) - selectedShip.selectedSegment
                            if (!appenCoordinateColumn[coordinateIndex + i] || occupiedSquares.includes(appenCoordinateColumn[coordinateIndex + i])) {
                                throw new Error("invalid placement")
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

                // repainting if placed ship is moved
                let replacedShip = placedShips.find((ship) => ship.name === selectedShip.name)
                if (replacedShip) {
                    replacedShip.occupiedSquares.forEach((square) => {
                        document.getElementById(square).style.background = "navy"
                    })
                    occupiedSquares = occupiedSquares.filter((square) => !replacedShip.occupiedSquares.includes(square))
                    placedShips = placedShips.filter((ship) => !(ship.name === replacedShip.name))
                }

                selectedShip.addCoordinate(appenCoordinateList)
                selectedShip.addOccupiedSquares(appenOccupiedSquares.filter((square) => !occupiedSquares.includes(square)))
                placedShips.push(selectedShip)
                occupiedSquares = occupiedSquares.concat(appenOccupiedSquares)
                occupiedSquares = [...new Set(occupiedSquares)] // removing duplicated squares to not paint them multiple times

                occupiedSquares.forEach((square) => {
                    document.getElementById(square).style.background = "blue"
                })
                placedShips.forEach((ship) => {
                    ship.coordinates.forEach((coord) => {
                        document.getElementById(coord).style.background = "grey"
                        document.getElementById(coord).style.border = "solid 1px black"
                    })
                })
            } catch (error) {
                console.log(error)
                invalidPlacement = error
            }
        }
    }

    sqr.addEventListener("mouseenter", placemenPreviewtListener)
    sqr.addEventListener("click", placementListener)
    document.getElementById("secondSquares").appendChild(sqr)
})

// ships selector
let prevHoveringSquare
let hoveringSquare
let offsetLeft
let offsetTop
let offsetX
let offsetY
let mouseDispatchX
let mouseDispatchY

ships.forEach((ship) => {
    let placingShip = document.createElement("span")
    for (let i = 0; i < ship.size; i++) {
        let shipSegment = document.createElement("div")
        shipSegment.id = ship.name + ` ${i + 1}`
        shipSegment.index = i
        shipSegment.addEventListener("mousedown", () => {
            // Listener to set ship segment index for dragging
            console.log("mousedown on ship segment")
            setTimeout(() => {
                // without this timeout selected ship will be undefined in this listener
                selectedShip.setSelectedSegment(shipSegment.index)
            }, 0)
        })
        placingShip.appendChild(shipSegment)
    }
    placingShip.id = `${ship.name}`

    let mouseMoveListener = (moveEvent) => {
        // Drawing dragging ship
        console.log("mousemove")
        // here we are triggering events, because when you drag the ship it overshadows grid
        hoveringSquare = document.elementsFromPoint(moveEvent.clientX, moveEvent.clientY).find((element) => coordinates.some((coord) => coord === element.id))
        if (hoveringSquare && prevHoveringSquare && hoveringSquare.id !== prevHoveringSquare.id) {
            prevHoveringSquare.dispatchEvent(new MouseEvent("mouseleave"))
            hoveringSquare.dispatchEvent(new MouseEvent("mouseenter"))
        }
        if (hoveringSquare) prevHoveringSquare = hoveringSquare

        mouseDispatchX = moveEvent.clientX ? moveEvent.clientX : mouseDispatchX
        mouseDispatchY = moveEvent.clientY ? moveEvent.clientY : mouseDispatchY
        placingShip.style.left = mouseDispatchX - offsetX + "px"
        placingShip.style.top = mouseDispatchY - offsetY + "px"
    }

    let mouseDownListener = (downEvent) => {
        // Setting the ship to drag
        console.log("mousedown on ship")
        offsetLeft = placingShip.offsetLeft
        offsetTop = placingShip.offsetTop
        offsetX = downEvent.clientX - offsetLeft
        offsetY = downEvent.clientY - offsetTop
        selectedShip = ship

        Array.from(document.getElementById("shipSelector").children).forEach((c) => {
            if (c.id !== selectedShip.name) {
                c.style.zIndex = -999
            }
        })

        let rotateListener = (keyEvent) => {
            console.log("rotate")
            if (keyEvent.key === "r") {
                selectedShip.rotate()
                let rotateHoveringSquare = hoveringSquare
                if (selectedShip.rotation === "vertical") {
                    offsetX = 15
                    offsetY = 15 * (selectedShip.selectedSegment + 1) * 2
                    document.dispatchEvent(new MouseEvent("mousemove"))
                    rotateHoveringSquare?.dispatchEvent(new MouseEvent("mouseleave"))
                    rotateHoveringSquare?.dispatchEvent(new MouseEvent("mouseenter"))
                    hoveringSquare = rotateHoveringSquare // this is needed for the same reason above
                } else {
                    offsetX = downEvent.clientX - offsetLeft
                    offsetY = downEvent.clientY - offsetTop
                    document.dispatchEvent(new MouseEvent("mousemove"))
                    rotateHoveringSquare?.dispatchEvent(new MouseEvent("mouseleave"))
                    rotateHoveringSquare?.dispatchEvent(new MouseEvent("mouseenter"))
                    hoveringSquare = rotateHoveringSquare // this is needed for the same reason above
                }
            }
        }

        placingShip.style.position = "absolute"
        document.addEventListener("mousemove", mouseMoveListener)
        mouseDispatchX = downEvent.clientX
        mouseDispatchY = downEvent.clientY
        document.dispatchEvent(new MouseEvent("mousemove"))
        document.addEventListener("keyup", rotateListener)

        let mouseUpListener = () => {
            console.log("mousesup")
            Array.from(document.getElementById("shipSelector").children).forEach((c) => {
                if (c.id !== selectedShip.name) {
                    c.style.zIndex = ""
                }
            })
            hoveringSquare?.dispatchEvent(new MouseEvent("click"))
            prevHoveringSquare?.dispatchEvent(new MouseEvent("mouseleave"))
            // TODO ROTATION ISSUE and REPLACING SHIP IN ITS COORDS
            if (selectedShip?.rotation === "vertical" && !hoveringSquare) {
                selectedShip.rotate()
            }

            document.removeEventListener("mousemove", mouseMoveListener)
            document.removeEventListener("keyup", rotateListener)
            placingShip.removeEventListener("mouseup", mouseUpListener)
            if (hoveringSquare && !invalidPlacement) {
                console.log(hoveringSquare.getBoundingClientRect().top, selectedShip)
                placingShip.style.top = hoveringSquare.getBoundingClientRect().top - (selectedShip?.rotation === "vertical" ? 33 * selectedShip.selectedSegment : 0) + "px"
                placingShip.style.left = hoveringSquare.getBoundingClientRect().left - (selectedShip?.rotation === "horizontal" ? 33 * selectedShip.selectedSegment : 0) + "px"
                placingShip.XY = { X: placingShip.style.left, Y: placingShip.style.top }
            } else if (placedShips.find((ship) => ship.name === selectedShip.name)) {
                placingShip.style.top = placingShip.XY.Y
                placingShip.style.left = placingShip.XY.X
                // doing nothing if placed ship is replaced incorrectly
            } else {
                placingShip.style.position = ""
                placingShip.style.top = ""
                placingShip.style.left = ""
            }

            invalidPlacement = null
            prevHoveringSquare = null
            hoveringSquare = null
            offsetLeft = 0
            offsetTop = 0
            offsetX = 0
            offsetY = 0
            mouseDispatchX = 0
            mouseDispatchY = 0
            selectedShip = null
            console.log(occupiedSquares, placedShips)
        }
        placingShip.addEventListener("mouseup", mouseUpListener)
    }

    placingShip.addEventListener("mousedown", mouseDownListener)
    document.getElementById("shipSelector").appendChild(placingShip)
})
