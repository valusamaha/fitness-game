let playerName = ""
let avatarSrc = ""

/* -------------------------
   SCREEN FLOW
--------------------------*/

function goToAvatar() {

    playerName =
        document.getElementById("username").value

    if (playerName === "") {

        alert("Enter your name first!")

        return

    }

    document.getElementById("login-screen")
        .style.display = "none"

    document.getElementById("avatar-screen")
        .style.display = "block"

}


/* -------------------------
   AVATAR SELECTION
--------------------------*/

function selectAvatar(img) {

    avatarSrc = img.src

}


/* -------------------------
   START GAME
--------------------------*/

function startGame() {

    if (avatarSrc === "") {

        alert("Select an avatar first!")

        return

    }

    document.getElementById("avatar-screen")
        .style.display = "none"

    document.getElementById("game-screen")
        .style.display = "block"

    document.getElementById("welcome")
        .innerText =
        "Welcome, " + playerName + " ⚔️"

    document.getElementById("avatar")
        .src = avatarSrc

}


/* -------------------------
   UPDATE GAME UI
--------------------------*/

function updateUI(data) {

    document.getElementById("xp").innerText =
        data.xp

    document.getElementById("hp").innerText =
        data.hp

    document.getElementById("gold").innerText =
        data.gold

    let progress =
        data.xp % 100

    document.getElementById("progress")
        .style.width =
        progress + "%"



    /* Rank system */

    if (data.level <= 10)

        document.getElementById("rank")
            .innerText =
            "LEVEL " +
            data.level +
            " — RECRUIT"

    else if (data.level <= 30)

        document.getElementById("rank")
            .innerText =
            "LEVEL " +
            data.level +
            " — WARRIOR"

    else

        document.getElementById("rank")
            .innerText =
            "LEVEL " +
            data.level +
            " — LEGEND"

}


/* -------------------------
   WORKOUT ACTIONS
--------------------------*/

function completeWorkout() {

    fetch("/complete_workout", {

        method: "POST",

        headers: {

            "Content-Type":
                "application/json"

        },

        body: JSON.stringify({

            workout: "normal"

        })

    })

    .then(res => res.json())

    .then(data => {

        updateUI(data)

        saveProgress(data)

    })

}



function extraWorkout() {

    fetch("/complete_workout", {

        method: "POST",

        headers: {

            "Content-Type":
                "application/json"

        },

        body: JSON.stringify({

            workout: "extra"

        })

    })

    .then(res => res.json())

    .then(data => {

        updateUI(data)

        saveProgress(data)

    })

}



function missedDay() {

    fetch("/missed_day", {

        method: "POST"

    })

    .then(res => res.json())

    .then(data => {

        updateUI(data)

        saveProgress(data)

    })

}


/* -------------------------
   SAVE PROGRESS
--------------------------*/

function saveProgress(data) {

    localStorage.setItem(

        "fitquest_data",

        JSON.stringify(data)

    )

}


/* -------------------------
   LOAD SAVED PROGRESS
--------------------------*/

window.onload = function() {

    let saved =

        localStorage.getItem(

            "fitquest_data"

        )

    if (saved) {

        let data =

            JSON.parse(saved)

        updateUI(data)

    }

}


/* -------------------------
   VIDEO CAMERA
--------------------------*/

function startCamera() {

    navigator.mediaDevices

        .getUserMedia({

            video: true

        })

        .then(function(stream) {

            let video =

                document.getElementById("video")

            video.srcObject = stream

        })

}