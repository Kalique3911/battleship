let placedShips = []
let shipSize = 3

////////////////////////////////////////////////////////////////////////////////////////////////////

document.getElementById("head").innerHTML = "Battleship"

////////////////////////////////////////////////////////////////////////////////////////////////////

let letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]

letters.map(l => {
    let letter = document.createElement("div")
    letter.innerHTML = l
    document.getElementById("firstLetters").appendChild(letter)
})

let numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]

numbers.map(n => {
    let number = document.createElement('div')
    number.innerHTML = n
    number.addEventListener("click", () => {alert(`you clicked number ${n}`)})
    document.getElementById("firstNumbers").appendChild(number)
})

numbers.map(n => {
    letters.map(l => {
        let sqr = document.createElement("div")
        sqr.addEventListener("click", () => {
            alert(`you clicked square ${l + n}`)
        }, {once: true})
        document.getElementById("firstSquares").appendChild(sqr)
    })
})

////////////////////////////////////////////////////////////////////////////////////////////////////

let secondLetters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]

secondLetters.map(l => {
    let letter = document.createElement("div")
    letter.innerHTML = l
    document.getElementById("secondLetters").appendChild(letter)
})

let secondNumbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]

secondNumbers.map(n => {
    let number = document.createElement('div')
    number.innerHTML = n
    number.addEventListener("click", () => {alert(`you clicked number ${n}`)})
    document.getElementById("secondNumbers").appendChild(number)
})

secondNumbers.map(n => {
    secondLetters.map(l => {
        let sqr = document.createElement("div")
        sqr.addEventListener("click", () => {
            let c = 0
            while (shipSize > c) {
                placedShips.push(`${l}${Number(n) + c}`)
                c++
            }

        }, {once: true})
        document.getElementById("secondSquares").appendChild(sqr)
    })
})