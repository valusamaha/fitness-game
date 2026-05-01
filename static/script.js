let playerName = ""
let avatarSrc = ""

let gameData = {

level: 1,
xp: 0,
hp: 100,
gold: 0,
inventory: []

}

let exercisesDone = [false, false, false]



/* LOADING */

setTimeout(() => {

document.getElementById("loading-screen").style.display = "none"
document.getElementById("login-screen").style.display = "block"

}, 2000)



/* LOGIN */

function goToAvatar() {

playerName =
document.getElementById("username").value

if (playerName === "") {

alert("Enter your name first!")
return

}

document.getElementById("login-screen").style.display = "none"
document.getElementById("avatar-screen").style.display = "block"

}



/* AVATAR */

function selectAvatar(img) {

let avatars =
document.querySelectorAll(".avatar-option")

avatars.forEach(a => {

a.classList.remove("selected")

})

img.classList.add("selected")

avatarSrc = img.src

}



/* LEVEL MAP */

function goToLevels() {

if (avatarSrc === "") {

alert("Select an avatar first!")
return

}

document.getElementById("avatar-screen").style.display = "none"
document.getElementById("level-screen").style.display = "block"

generateLevels()

}



function generateLevels() {

let grid =
document.getElementById("level-grid")

grid.innerHTML = ""

for (let i = 1; i <= 100; i++) {

let box =
document.createElement("div")

box.className = "level-box"

if (i > gameData.level) {

box.classList.add("locked")
box.innerText = "🔒"

}

else {

box.innerText = i

box.onclick = function () {

startLevel(i)

}

}

grid.appendChild(box)

}

}



function startLevel(level) {

document.getElementById("level-screen").style.display = "none"
document.getElementById("game-screen").style.display = "block"

document.getElementById("welcome").innerText =
"Welcome, " + playerName

document.getElementById("avatar").src =
avatarSrc

resetExercises()

updateUI()

}



function resetExercises() {

exercisesDone = [false, false, false]

for (let i = 0; i < 3; i++) {

document.getElementById("done" + i).innerText = ""

}

document.getElementById("completeBtn").disabled = true

}



/* VIDEO */

function startExercise(index) {

navigator.mediaDevices
.getUserMedia({
video: true
})
.then(function(stream) {

let video =
document.getElementById("video")

video.srcObject = stream

})

exercisesDone[index] = true

document.getElementById(
"done" + index
).innerText = " ✅"

checkAllDone()

}



function checkAllDone() {

if (

exercisesDone[0] &&
exercisesDone[1] &&
exercisesDone[2]

) {

document.getElementById(
"completeBtn"
).disabled = false

}

}



/* COMPLETE */

function completeLevel() {

gameData.xp += 100
gameData.gold += 50

if (gameData.level < 100) {

gameData.level += 1

}

saveProgress()

showRewards()

}



function showRewards() {

document.getElementById("game-screen").style.display = "none"
document.getElementById("reward-screen").style.display = "block"

document.getElementById("rewardXP").innerText =
gameData.xp

document.getElementById("rewardHP").innerText =
gameData.hp

document.getElementById("rewardGold").innerText =
gameData.gold

}



/* SHOP */

function buyItem(item, cost) {

if (gameData.gold < cost) {

alert("Not enough gold!")
return

}

gameData.gold -= cost

gameData.inventory.push(item)

alert(item + " purchased!")

saveProgress()

showRewards()

}



/* BACK */

function backToLevels() {

document.getElementById("reward-screen").style.display = "none"
document.getElementById("level-screen").style.display = "block"

generateLevels()

}



/* UPDATE */

function updateUI() {

document.getElementById("xp").innerText =
gameData.xp

document.getElementById("hp").innerText =
gameData.hp

document.getElementById("gold").innerText =
gameData.gold

}



/* SAVE */

function saveProgress() {

localStorage.setItem(
"fitquest_data",
JSON.stringify(gameData)
)

}



/* LOAD */

window.onload = function() {

let saved =
localStorage.getItem("fitquest_data")

if (saved) {

gameData =
JSON.parse(saved)

}

}