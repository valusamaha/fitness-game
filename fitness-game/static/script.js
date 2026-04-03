function updateUI(data) {

    document.getElementById("level").innerText = data.level
    document.getElementById("xp").innerText = data.xp
    document.getElementById("hp").innerText = data.hp
    document.getElementById("gold").innerText = data.gold

}

function completeWorkout() {

    fetch("/complete_workout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            workout: "normal"
        })
    })
    .then(res => res.json())
    .then(data => updateUI(data))

}

function extraWorkout() {

    fetch("/complete_workout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            workout: "extra"
        })
    })
    .then(res => res.json())
    .then(data => updateUI(data))

}

function missedDay() {

    fetch("/missed_day", {
        method: "POST"
    })
    .then(res => res.json())
    .then(data => updateUI(data))

}