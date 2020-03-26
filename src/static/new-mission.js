
const addMissionerButton = document.getElementById("add-missioner")
const missionersDiv = document.getElementById("missioners")
const missionerDiv = document.querySelector("#missioner")
const missionerInput = document.querySelector("#input-missioner")
const dateInput = document.querySelector("#input-date")

// let missionersNumber = 1

addMissionerButton.addEventListener("click", () => {
    const newMissioner = missionerDiv.cloneNode(true)
    const input = newMissioner.querySelector("input")
    input.value = ''
    missionersDiv.appendChild(newMissioner)
    const newInput = document.querySelectorAll("#input-missioner")
    newInput[newInput.length - 1].focus();
})

function removeMissioner(e) {
    missionersDiv.removeChild(e.target.parentNode)
}

//const today = new Date()

// const localToday = today.getFullYear() + '-' + today.getMonth() + '-' + today.getDay()
//dateInput.setAttribute("min", today)
// dateInput.setAttribute("value", localToday)
