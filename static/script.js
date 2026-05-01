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

let squatCount = 0
let squatPosition = "up"

function startSquatAI() {

navigator.mediaDevices
.getUserMedia({ video: true })
.then(function(stream) {

let video =
document.getElementById("video")

video.srcObject = stream

initializePose(video)

})

}



function initializePose(videoElement) {

const pose = new Pose({

locateFile: (file) => {

return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`

}

})

pose.setOptions({

modelComplexity: 0,
smoothLandmarks: true,
enableSegmentation: false,
minDetectionConfidence: 0.5,
minTrackingConfidence: 0.5

})

pose.onResults(onResults)



const camera = new Camera(videoElement, {

onFrame: async () => {

await pose.send({
image: videoElement
})

},

width: 640,
height: 480

})

camera.start()

}



function onResults(results) {

if (!results.poseLandmarks)
return



let hip =
results.poseLandmarks[24]

let knee =
results.poseLandmarks[26]

let ankle =
results.poseLandmarks[28]



let angle =
calculateAngle(
hip,
knee,
ankle
)



if (angle < 90 && squatPosition === "up") {

squatPosition = "down"

}



if (angle > 160 && squatPosition === "down") {

squatPosition = "up"

squatCount++

updateSquatUI()

}

}



function calculateAngle(a, b, c) {

let ab = {

x: a.x - b.x,
y: a.y - b.y

}

let cb = {

x: c.x - b.x,
y: c.y - b.y

}



let dot =
ab.x * cb.x +
ab.y * cb.y



let magAB =
Math.sqrt(
ab.x * ab.x +
ab.y * ab.y
)



let magCB =
Math.sqrt(
cb.x * cb.x +
cb.y * cb.y
)



let angle =
Math.acos(
dot /
(magAB * magCB)
)



return angle * (180 / Math.PI)

}



function updateSquatUI() {

document.getElementById(
"squatCounter"
).innerText =
"Squats: " + squatCount



if (squatCount >= 20) {

document.getElementById(
"done1"
).innerText =
" ✅"

exercisesDone[1] = true

checkAllDone()

speak(
"Exercise completed"
)

}

}



function speak(text) {

let msg =
new SpeechSynthesisUtterance()

msg.text = text

speechSynthesis.speak(msg)

}