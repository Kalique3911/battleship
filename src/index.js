document.getElementById("head").innerHTML = "Battleship"

let letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]

letters.map(l => {
    let letter = document.createElement('div')
    letter.innerHTML = l
    document.getElementById('letters').appendChild(letter)
})

let numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]

numbers.map(n => {
    let number = document.createElement('div')
    number.innerHTML = n
    number.addEventListener("click", () => {alert(`you clicked number ${n}`)})
    document.getElementById('numbers').appendChild(number)
})

numbers.map(n => {
    letters.map(l => {
        let sqr = document.createElement('div')
        // sqr.innerHTML = l + n
        sqr.addEventListener("click", () => {alert(`you clicked square ${l + n}`)})
        document.getElementById('squares').appendChild(sqr)
    })
})