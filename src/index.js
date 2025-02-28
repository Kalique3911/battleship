class Ship {
    size
    name
    coordinates = []
    occupiedSquares = []
    rotation = "horizontal" || "vertical"
    placedRotation = "horizontal" || "vertical"
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

    setXY = (X, Y) => {
        this.XY = { X: X, Y: Y }
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
let invalidPlacement = null
let replacedShip
let mouseLeaveListener = (event) => {
    // Redrawing listener when leawing the square
    if (selectedShip) {
        if (!replacedShip) {
            replacedShip = placedShips.find((ship) => ship.name === selectedShip.name)
        }
        selectedShip.occupiedSquares.forEach((square) => {
            if (!placedShips.find((ship) => ship !== replacedShip && ship.occupiedSquares.includes(square))) {
                document.getElementById(square).style.background = "navy"
            }
        })
    }
    event.target.removeEventListener("mouseleave", mouseLeaveListener)
}

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
        if (selectedShip) {
            let appenCoordinateRow = horizontalPlacement[sqr.row]
            let appenCoordinateColumn = verticalPlacement[sqr.column]
            let appenCoordinateList = []
            let appenOccupiedSquares = []
            let collisionSquares = []
            replacedShip = placedShips.find((ship) => ship.name === selectedShip.name)

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
                        if (i === 0 && appenCoordinateRow[coordinateIndex - 1]) {
                            appenOccupiedSquares.push(appenCoordinateRow[coordinateIndex - 1])
                            if (sqr.row !== 0) appenOccupiedSquares.push(horizontalPlacement[sqr.row - 1][coordinateIndex - 1])
                            if (sqr.row !== 9) appenOccupiedSquares.push(horizontalPlacement[sqr.row + 1][coordinateIndex - 1])
                        }

                        if (i === selectedShip.size - 1 && appenCoordinateRow[coordinateIndex + i + 1]) {
                            appenOccupiedSquares.push(appenCoordinateRow[coordinateIndex + i + 1])
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
                        if (i === 0 && appenCoordinateColumn[coordinateIndex - 1]) {
                            appenOccupiedSquares.push(appenCoordinateColumn[coordinateIndex - 1])
                            if (sqr.column !== 0) appenOccupiedSquares.push(verticalPlacement[sqr.column - 1][coordinateIndex - 1])
                            if (sqr.column !== 9) appenOccupiedSquares.push(verticalPlacement[sqr.column + 1][coordinateIndex - 1])
                        }
                        if (i === selectedShip.size - 1 && appenCoordinateColumn[coordinateIndex + i + 1]) {
                            appenOccupiedSquares.push(appenCoordinateColumn[coordinateIndex + i + 1])
                            if (sqr.column !== 0) appenOccupiedSquares.push(verticalPlacement[sqr.column - 1][coordinateIndex + i + 1])
                            if (sqr.column !== 9) appenOccupiedSquares.push(verticalPlacement[sqr.column + 1][coordinateIndex + i + 1])
                        }
                        if (sqr.column !== 0) appenOccupiedSquares.push(verticalPlacement[sqr.column - 1][coordinateIndex + i])
                        if (sqr.column !== 9) appenOccupiedSquares.push(verticalPlacement[sqr.column + 1][coordinateIndex + i])
                    }
                    break
            }

            collisionSquares = placedShips.map((ship) => ship.occupiedSquares.filter((square) => appenCoordinateList.includes(square))).flat()
            collisionSquares = collisionSquares.concat(appenOccupiedSquares.filter((occSqr) => placedShips.find((ship) => ship.name !== replacedShip?.name && ship.coordinates.includes(occSqr))))
            shipsSquares = placedShips.map((ship) => !ship.coordinates.includes(replacedShip?.coordinates[0]) && ship.coordinates).flat()
            shipsSquares = shipsSquares.filter((square) => square)

            appenOccupiedSquares.forEach((square) => {
                document.getElementById(square).style.background = "blue"
            })
            appenCoordinateList.forEach((coord) => {
                document.getElementById(coord).style.background = "grey"
                document.getElementById(coord).style.border = "solid 1px black"
            })
            placedShips.forEach((ship) => {
                if (ship !== replacedShip) {
                    ship.coordinates.forEach((coord) => {
                        document.getElementById(coord).style.background = "grey"
                        document.getElementById(coord).style.border = "solid 1px black"
                    })
                }
            })
            collisionSquares.forEach((coord) => {
                if (!replacedShip?.occupiedSquares.includes(coord)) {
                    document.getElementById(coord).style.background = "red"
                }
            })

            let mouseLeaveListener = (event) => {
                // Redrawing listener when leawing the square
                if (selectedShip) {
                    if (!replacedShip) {
                        replacedShip = placedShips.find((ship) => ship.name === selectedShip.name)
                    }

                    appenOccupiedSquares.forEach((square) => {
                        if (!placedShips.find((ship) => ship !== replacedShip && ship.occupiedSquares.includes(square))) {
                            document.getElementById(square).style.background = "navy"
                        }
                    })
                }
                event.target.removeEventListener("mouseleave", mouseLeaveListener)
            }
            document.getElementById(coordinate).addEventListener("mouseleave", mouseLeaveListener)
        }
    }

    let placementListener = () => {
        // Drawing listener when placed the ship
        if (selectedShip) {
            try {
                let clientGrid = document.getElementById("secondSquares").getBoundingClientRect()
                let shipRect = document.getElementById(selectedShip.name).getBoundingClientRect()
                if (!(shipRect.left >= clientGrid.left && shipRect.right <= clientGrid.right && shipRect.top >= clientGrid.top && shipRect.bottom <= clientGrid.bottom)) {
                    throw new Error("invalid placement")
                }

                let appenCoordinateRow = horizontalPlacement[sqr.row]
                let appenCoordinateColumn = verticalPlacement[sqr.column]
                let appenCoordinateList = []
                let appenOccupiedSquares = []
                replacedShip = placedShips.find((ship) => ship.name === selectedShip.name)

                switch (selectedShip.rotation) {
                    case "horizontal":
                        selectedShip.placedRotation = "horizontal"
                        for (let i = 0; i < selectedShip.size; i++) {
                            let coordinateIndex = appenCoordinateRow.indexOf(coordinate) - selectedShip.selectedSegment

                            if (!appenCoordinateRow[coordinateIndex + i] || placedShips.find((ship) => ship !== replacedShip && ship.occupiedSquares.includes(appenCoordinateRow[coordinateIndex + i]))) {
                                throw new Error("invalid placement")
                            }
                            let appendingCoordinate = appenCoordinateRow[coordinateIndex + i]
                            appenCoordinateList.push(appendingCoordinate)
                            appenOccupiedSquares.push(appendingCoordinate)
                            if (i === 0 && appenCoordinateRow[coordinateIndex - 1]) {
                                appenOccupiedSquares.push(appenCoordinateRow[coordinateIndex - 1])
                                if (sqr.row !== 0) appenOccupiedSquares.push(horizontalPlacement[sqr.row - 1][coordinateIndex - 1])
                                if (sqr.row !== 9) appenOccupiedSquares.push(horizontalPlacement[sqr.row + 1][coordinateIndex - 1])
                            }

                            if (i === selectedShip.size - 1 && appenCoordinateRow[coordinateIndex + i + 1]) {
                                appenOccupiedSquares.push(appenCoordinateRow[coordinateIndex + i + 1])
                                if (sqr.row !== 0) appenOccupiedSquares.push(horizontalPlacement[sqr.row - 1][coordinateIndex + i + 1])
                                if (sqr.row !== 9) appenOccupiedSquares.push(horizontalPlacement[sqr.row + 1][coordinateIndex + i + 1])
                            }

                            if (sqr.row !== 0) appenOccupiedSquares.push(horizontalPlacement[sqr.row - 1][coordinateIndex + i])
                            if (sqr.row !== 9) appenOccupiedSquares.push(horizontalPlacement[sqr.row + 1][coordinateIndex + i])
                        }
                        break
                    case "vertical":
                        selectedShip.placedRotation = "vertical"
                        for (let i = 0; i < selectedShip.size; i++) {
                            let coordinateIndex = appenCoordinateColumn.indexOf(coordinate) - selectedShip.selectedSegment
                            if (!appenCoordinateColumn[coordinateIndex + i] || placedShips.find((ship) => ship !== replacedShip && ship.occupiedSquares.includes(appenCoordinateColumn[coordinateIndex + i]))) {
                                throw new Error("invalid placement")
                            }
                            let appendingCoordinate = appenCoordinateColumn[coordinateIndex + i]
                            appenCoordinateList.push(appendingCoordinate)
                            appenOccupiedSquares.push(appendingCoordinate)
                            if (i === 0 && appenCoordinateColumn[coordinateIndex - 1]) {
                                appenOccupiedSquares.push(appenCoordinateColumn[coordinateIndex - 1])
                                if (sqr.column !== 0) appenOccupiedSquares.push(verticalPlacement[sqr.column - 1][coordinateIndex - 1])
                                if (sqr.column !== 9) appenOccupiedSquares.push(verticalPlacement[sqr.column + 1][coordinateIndex - 1])
                            }
                            if (i === selectedShip.size - 1 && appenCoordinateColumn[coordinateIndex + i + 1]) {
                                appenOccupiedSquares.push(appenCoordinateColumn[coordinateIndex + i + 1])
                                if (sqr.column !== 0) appenOccupiedSquares.push(verticalPlacement[sqr.column - 1][coordinateIndex + i + 1])
                                if (sqr.column !== 9) appenOccupiedSquares.push(verticalPlacement[sqr.column + 1][coordinateIndex + i + 1])
                            }
                            if (sqr.column !== 0) appenOccupiedSquares.push(verticalPlacement[sqr.column - 1][coordinateIndex + i])
                            if (sqr.column !== 9) appenOccupiedSquares.push(verticalPlacement[sqr.column + 1][coordinateIndex + i])
                        }
                        break
                }

                if (replacedShip) {
                    replacedShip.occupiedSquares.forEach((square) => {
                        document.getElementById(square).style.background = "navy"
                    })
                    placedShips = placedShips.filter((ship) => !(ship.name === replacedShip.name))
                }

                selectedShip.addCoordinate(appenCoordinateList)
                selectedShip.addOccupiedSquares(appenOccupiedSquares)
                placedShips.push(selectedShip)

                placedShips.forEach((ship) => {
                    ship.occupiedSquares.forEach((coord) => {
                        document.getElementById(coord).style.background = "blue"
                    })
                })
                placedShips.forEach((ship) => {
                    ship.coordinates.forEach((coord) => {
                        document.getElementById(coord).style.background = "grey"
                        document.getElementById(coord).style.border = "solid 1px black"
                    })
                })

                coordinates.forEach((coord) => document.getElementById(coord).removeEventListener("mouseleave", mouseLeaveListener))
                placedShips.forEach((ship) => ship.coordinates.forEach((coord) => document.getElementById(coord).addEventListener("mouseleave", mouseLeaveListener)))
            } catch (error) {
                coordinates.forEach((coord) => (document.getElementById(coord).style.background = "navy"))
                placedShips.forEach((ship) => {
                    ship.occupiedSquares.forEach((coord) => {
                        document.getElementById(coord).style.background = "blue"
                    })
                })
                placedShips.forEach((ship) => {
                    ship.coordinates.forEach((coord) => {
                        document.getElementById(coord).style.background = "grey"
                        document.getElementById(coord).style.border = "solid 1px black"
                    })
                })
                coordinates.forEach((coord) => document.getElementById(coord).removeEventListener("mouseleave", mouseLeaveListener))
                placedShips.forEach((ship) => ship.coordinates.forEach((coord) => document.getElementById(coord).addEventListener("mouseleave", mouseLeaveListener)))

                console.log(error)
                invalidPlacement = error
            }
        }
    }

    sqr.addEventListener("mouseenter", placemenPreviewtListener)
    sqr.addEventListener("click", placementListener)
    document.getElementById("secondSquares").appendChild(sqr)
})

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
        // here we are triggering events, because when you drag the ship it overshadows grid
        hoveringSquare = document.elementsFromPoint(moveEvent.clientX, moveEvent.clientY).find((element) => coordinates.some((coord) => coord === element.id))
        if (hoveringSquare && prevHoveringSquare && hoveringSquare.id !== prevHoveringSquare.id && selectedShip) {
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
        offsetLeft = placingShip.offsetLeft
        offsetTop = placingShip.offsetTop
        offsetX = downEvent.clientX - offsetLeft
        offsetY = downEvent.clientY - offsetTop
        selectedShip = ship

        let placingShipRect = placingShip.getBoundingClientRect()
        if (Math.abs(placingShipRect.top - downEvent.clientY) < placingShipRect.height * 0.1) {
            offsetY = offsetY + 5
        } else if (Math.abs(placingShipRect.bottom - downEvent.clientY) < 5) {
            offsetY = offsetY - 5
        }
        if (Math.abs(placingShipRect.left - downEvent.clientX) < 5) {
            offsetX = offsetX + 5
        } else if (Math.abs(placingShipRect.right - downEvent.clientX) < 5) {
            offsetX = offsetX - 5
        }
        Array.from(document.getElementById("shipSelector").children).forEach((c) => {
            if (c.id !== selectedShip.name) {
                c.style.zIndex = -999
            }
        })

        let rotateListener = (keyEvent) => {
            if (keyEvent.key === "r") {
                selectedShip.rotate()
                let rotateHoveringSquare = hoveringSquare
                if (selectedShip.rotation === "vertical") {
                    let tempX = offsetX
                    let tempY = 32 - offsetY
                    offsetY = tempX
                    offsetX = tempY
                    document.dispatchEvent(new MouseEvent("mousemove"))
                    rotateHoveringSquare?.dispatchEvent(new MouseEvent("mouseleave"))
                    rotateHoveringSquare?.dispatchEvent(new MouseEvent("mouseenter"))
                    hoveringSquare = rotateHoveringSquare
                } else if (selectedShip.rotation === "horizontal") {
                    let tempX = 32 - offsetX
                    let tempY = offsetY
                    offsetX = tempY
                    offsetY = tempX
                    document.dispatchEvent(new MouseEvent("mousemove"))
                    rotateHoveringSquare?.dispatchEvent(new MouseEvent("mouseleave"))
                    rotateHoveringSquare?.dispatchEvent(new MouseEvent("mouseenter"))
                    hoveringSquare = rotateHoveringSquare
                }
            }
        }

        placingShip.style.position = "absolute"
        document.addEventListener("mousemove", mouseMoveListener)
        mouseDispatchX = downEvent.clientX
        mouseDispatchY = downEvent.clientY

        document.dispatchEvent(
            new MouseEvent("mousemove", {
                clientX: downEvent.clientX,
                clientY: downEvent.clientY,
            })
        )
        document.addEventListener("keyup", rotateListener)

        let mouseUpListener = () => {
            // placing ship
            Array.from(document.getElementById("shipSelector").children).forEach((c) => {
                if (c.id !== selectedShip.name) {
                    c.style.zIndex = ""
                }
            })
            hoveringSquare ? hoveringSquare.dispatchEvent(new MouseEvent("click")) : prevHoveringSquare?.dispatchEvent(new MouseEvent("click"))
            if (!hoveringSquare && !prevHoveringSquare) {
                invalidPlacement = true
            }
            if (selectedShip?.rotation !== selectedShip?.placedRotation && invalidPlacement) {
                selectedShip.rotate()
            }

            document.removeEventListener("mousemove", mouseMoveListener)
            document.removeEventListener("keyup", rotateListener)
            placingShip.removeEventListener("mouseup", mouseUpListener)
            if (hoveringSquare && !invalidPlacement) {
                placingShip.style.top = hoveringSquare.getBoundingClientRect().top - (selectedShip?.rotation === "vertical" ? 32 * selectedShip.selectedSegment : 0) + "px"
                placingShip.style.left = hoveringSquare.getBoundingClientRect().left - (selectedShip?.rotation === "horizontal" ? 32 * selectedShip.selectedSegment : 0) + "px"
                selectedShip.setXY(placingShip.style.left, placingShip.style.top)
            } else if (placedShips.find((ship) => ship.name === selectedShip.name)) {
                placingShip.style.top = selectedShip.XY.Y
                placingShip.style.left = selectedShip.XY.X
                selectedShip.rotation = selectedShip.placedRotation
            } else {
                placingShip.style.position = ""
                placingShip.style.top = ""
                placingShip.style.left = ""
            }

            replacedShip = null
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
        }
        placingShip.addEventListener("mouseup", mouseUpListener)
    }

    placingShip.addEventListener("mousedown", mouseDownListener)
    document.getElementById("shipSelector").appendChild(placingShip)
})

window.addEventListener("resize", () => {
    placedShips.forEach((ship) => {
        let placedShip = document.getElementById(ship.name)
        let squareCoordinates = document.getElementById(ship.coordinates[0]).getBoundingClientRect()
        ship.setXY(squareCoordinates.left, squareCoordinates.top)
        placedShip.style.top = ship.XY.Y + "px"
        placedShip.style.left = ship.XY.X + "px"
    })
})
