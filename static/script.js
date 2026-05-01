let playerName = ""
let avatarSrc = ""

let gameData = {
level: 1,
xp: 0,
hp: 100,
gold: 0
}

let exercisesDone = {}

let counters = {
squat: 0,
pushup: 0,
jack: 0
}

let positions = {
squat: "up",
pushup: "up",
jack: "down"
}



const levelConfig = {

1: [{ type: "squat", reps: 20 }],

2: [{ type: "jack", reps: 20 }],

3: [
{ type: "squat", reps: 20 },
{ type: "jack", reps: 20 }
],

4: [{ type: "pushup", reps: 20 }],

5: [
{ type: "squat", reps: 20 },
{ type: "pushup", reps: 20 }
],

6: [
{ type: "pushup", reps: 20 },
{ type: "jack", reps: 20 }
],

7: [
{ type: "squat", reps: 20 },
{ type: "pushup", reps: 20 },
{ type: "jack", reps: 20 }
],

8: [{ type: "squat", reps: 25 }],

9: [{ type: "pushup", reps: 25 }],

10: [
{ type: "squat", reps: 30 },
{ type: "pushup", reps: 30 },
{ type: "jack", reps: 30 }
]

}



function startLevel(level) {

document.getElementById("level-screen").style.display = "none"
document.getElementById("game-screen").style.display = "block"

renderExercises(level)

resetCounters()

}



function renderExercises(level) {

let container =
document.getElementById("exerciseList")

container.innerHTML = ""

let exercises =
levelConfig[level]

exercises.forEach((ex, index) => {

let div =
document.createElement("div")

div.className = "exercise"

div.innerHTML =

`
<p>Complete ${ex.reps} ${ex.type.toUpperCase()}</p>

<button onclick="startExercise('${ex.type}', ${ex.reps})">
START VIDEO
</button>

<h3 id="${ex.type}Counter">
${ex.type}: 0
</h3>

<span id="done-${ex.type}"></span>
`

container.appendChild(div)

})

}



function resetCounters() {

counters = {
squat: 0,
pushup: 0,
jack: 0
}

exercisesDone = {}

}



function startExercise(type, reps) {

navigator.mediaDevices
.getUserMedia({ video: true })
.then(stream => {

let video =
document.getElementById("video")

video.srcObject = stream

initializePose(video, type, reps)

})

}



function initializePose(videoElement, type, reps) {

const pose = new Pose({

locateFile: file =>

`https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`

})

pose.setOptions({
modelComplexity: 0
})

pose.onResults(results =>
onResults(results, type, reps)
)



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



function onResults(results, type, reps) {

if (!results.poseLandmarks)
return



if (type === "squat")
detectSquat(results, reps)

if (type === "pushup")
detectPushup(results, reps)

if (type === "jack")
detectJumpingJack(results, reps)

}



function detectSquat(results, reps) {

let hip =
results.poseLandmarks[24]

let knee =
results.poseLandmarks[26]

let ankle =
results.poseLandmarks[28]

let angle =
calculateAngle(hip, knee, ankle)



if (angle < 90 && positions.squat === "up")
positions.squat = "down"



if (angle > 160 && positions.squat === "down") {

positions.squat = "up"

counters.squat++

updateCounter("squat", reps)

}

}



function detectPushup(results, reps) {

let shoulder =
results.poseLandmarks[12]

let elbow =
results.poseLandmarks[14]

let wrist =
results.poseLandmarks[16]

let angle =
calculateAngle(shoulder, elbow, wrist)



if (angle < 90 && positions.pushup === "up")
positions.pushup = "down"



if (angle > 160 && positions.pushup === "down") {

positions.pushup = "up"

counters.pushup++

updateCounter("pushup", reps)

}

}



function detectJumpingJack(results, reps) {

let leftHand =
results.poseLandmarks[15]

let rightHand =
results.poseLandmarks[16]

let leftFoot =
results.poseLandmarks[27]

let rightFoot =
results.poseLandmarks[28]



let handsUp =
leftHand.y < 0.4 &&
rightHand.y < 0.4



let feetWide =
Math.abs(leftFoot.x - rightFoot.x) > 0.4



if (handsUp && feetWide &&
positions.jack === "down")

positions.jack = "up"



if (!handsUp && !feetWide &&
positions.jack === "up") {

positions.jack = "down"

counters.jack++

updateCounter("jack", reps)

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
Math.sqrt(ab.x ** 2 + ab.y ** 2)

let magCB =
Math.sqrt(cb.x ** 2 + cb.y ** 2)



let angle =
Math.acos(dot / (magAB * magCB))

return angle * (180 / Math.PI)

}



function updateCounter(type, reps) {

document.getElementById(
type + "Counter"
).innerText =
type + ": " + counters[type]



if (counters[type] >= reps) {

document.getElementById(
"done-" + type
).innerText =
" ✅"

exercisesDone[type] = true

checkLevelComplete()

}

}



function checkLevelComplete() {

let level =
gameData.level

let exercises =
levelConfig[level]

let allDone =
exercises.every(
ex => exercisesDone[ex.type]
)



if (allDone) {

document.getElementById(
"completeBtn"
).disabled = false

}

}



function completeLevel() {

gameData.level++

gameData.xp += 100
gameData.gold += 50

alert("LEVEL COMPLETE!")

}