
const addMissionerButton = document.getElementById("add-missioner")
const missionersDiv = document.getElementById("missioners")
const missionerDiv = document.querySelector("#missioner")
const missionerInput = document.querySelector("#input-missioner")

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