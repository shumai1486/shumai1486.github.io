/* jshint esversion: 6 */

// fullscreen
const btnFS=document.querySelector("#btnFS");
btnFS.addEventListener("click", () => {
  if (!document.fullscreenElement) {
    // Enter fullscreen
    btnFS.style.backgroundImage = 'url("images/exitfullscreen.png")';
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) { // Firefox
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) { // Chrome, Safari, and Opera
      document.documentElement.webkitRequestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) { // IE/Edge
      document.documentElement.msRequestFullscreen();
    }
  } else {
    // Exit fullscreen
    btnFS.style.backgroundImage = 'url("images/fullscreen.png")';
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { // Firefox
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { // Chrome, Safari, and Opera
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { // IE/Edge
      document.msExitFullscreen();
    }
  }
});

// target all elements to save to constants
const homebtn = document.querySelector("#homebtn");
const page1btn = document.querySelector("#page1btn");
const page2btn = document.querySelector("#page2btn");
const page3btn = document.querySelector("#page3btn");
const page4btn = document.querySelector("#page4btn");
const page5btn = document.querySelector("#page5btn");
const allpages = document.querySelectorAll(".page");

// for menu
const hamBtn = document.querySelector("#hamIcon");
const menuItemsList = document.querySelector("nav ul");
hamBtn.addEventListener("click", toggleMenus);

// for popup windows
const starButtons = document.querySelectorAll(".star");
const popups = document.querySelectorAll(".popup");
const closeBtns = document.querySelectorAll(".closebtn");

// for voicebank page switch
const vocaloidSections = document.querySelectorAll(".textbox-grid, .textbox-grid2");

// for voicebank audio
const audioFiles = [
  new Audio("audio/miku.mp3"),
  new Audio("audio/rinlen.mp3"),
  new Audio("audio/luka.mp3"),
  new Audio("audio/meiko.mp3"),
  new Audio("audio/kaito.mp3")
];

const buttons = document.querySelectorAll(".playaudiobtn");
// keep track of currently playing audio
let currentlyPlayingIndex = null;
let currentAudio = null;

// track current visible page
let currentPage = 0;

// track current vocaloid/voicebank page
let currentVocaloid = 0;

function hideall() {
    allpages.forEach(page => {
      page.style.display = "none";
      page.style.opacity = 1;
      page.classList.remove("fade-out");
    });
}

function stopAllAudio() {
  // stop concert audio
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  // stop voicebank audios
  audioFiles.forEach((audio, i) => {
    audio.pause();
    audio.currentTime = 0;
    buttons[i].classList.remove("paused");
  });

  // reset state
  currentlyPlayingIndex = null;
}

function show(newPage) {
  stopAllAudio();
  if (newPage === currentPage) return; // do nothing if same page

  const oldPage = document.querySelector("#page" + currentPage);
  const nextPage = document.querySelector("#page" + newPage);

  if (!nextPage) return;

  // fade out old page
  oldPage.classList.add("fade-out");

  setTimeout(() => {
    // hide old page after fade out
    oldPage.style.display = "none";
    oldPage.classList.remove("fade-out");

    // show and fade in new page
    nextPage.style.display = "block";
    nextPage.style.opacity = 0;

    // enable transition
    void nextPage.offsetWidth;

    nextPage.style.opacity = 1;

    currentPage = newPage;
  }, 700); // match CSS transition duration
}

/* Listen for clicks on the buttons, assign anonymous
event handler functions to call show function */
homebtn.addEventListener("click", () => show(0));
page1btn.addEventListener("click", () => show(1));
page2btn.addEventListener("click", () => show(2));
page3btn.addEventListener("click", () => show(3));
page4btn.addEventListener("click", () => show(4));
page5btn.addEventListener("click", () => show(5));

// Initialize: hide all and show page0
hideall();
document.querySelector("#page0").style.display = "block";
currentPage = 0;

function toggleMenus() {
  // toggle menu visibility
  menuItemsList.classList.toggle("menuShow");

  if (menuItemsList.classList.contains("menuShow")) {
    hamBtn.innerHTML = "Close Menu";
  } else {
    hamBtn.innerHTML = "Open Menu";
  }
}

// open popup
starButtons.forEach(button => {
  button.addEventListener("click", () => {
    const targetPopup = document.getElementById(button.dataset.popup);
    if (targetPopup) {
      // show popup and reset display so animation can run
      targetPopup.style.display = "block";
      targetPopup.classList.remove("hide");
      targetPopup.classList.add("show");
    }
  });
});

// close popup
closeBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    const popup = btn.closest(".popup");
    popup.classList.remove("show");
    popup.classList.add("hide");
  });
});

// add listener to handle hiding after animation
popups.forEach(popup => {
  popup.addEventListener("animationend", (e) => {
    if (e.animationName === "popupFadeOut") {
      popup.style.display = "none";
      popup.classList.remove("hide");
    }
  });
});

// hide/show vocaloid pages
function updateVocaloidView(index) {
  vocaloidSections.forEach((section, i) => {
    section.style.display = i === index ? "grid" : "none";
  });
}

// set initial visible page
updateVocaloidView(currentVocaloid);

// left/right button clicks
document.querySelectorAll(".leftbtn").forEach(button => {
  button.addEventListener("click", () => {
    currentVocaloid = (currentVocaloid - 1 + vocaloidSections.length) % vocaloidSections.length;
    updateVocaloidView(currentVocaloid);
    stopAllAudio();
  });
});

document.querySelectorAll(".rightbtn").forEach(button => {
  button.addEventListener("click", () => {
    currentVocaloid = (currentVocaloid + 1) % vocaloidSections.length;
    updateVocaloidView(currentVocaloid);
    stopAllAudio();
  });
});

// play audio when clicking button
buttons.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    const selectedAudio = audioFiles[index];

    // if alr playing, pause it
    if (currentlyPlayingIndex === index && !selectedAudio.paused) {
      selectedAudio.pause();
      selectedAudio.currentTime = 0;
      btn.classList.remove("paused");
      currentlyPlayingIndex = null;
    } else {
      // pause all other audios
      stopAllAudio();

      // play selected audio
      selectedAudio.play();
      btn.classList.add("paused");
      currentlyPlayingIndex = index;
    }
  });
});

// to link to yt and spotify pages
document.querySelector("#iyowaytbtn").addEventListener("click", () => {
  window.open("https://www.youtube.com/@igusuri_please", "_blank");
});
document.querySelector("#iyowaspotifybtn").addEventListener("click", () => {
  window.open("https://open.spotify.com/artist/0gox2jF74UUFl8bDQYyTFr", "_blank");
});
document.querySelector("#syudouytbtn").addEventListener("click", () => {
  window.open("https://www.youtube.com/@syudou_official", "_blank");
});
document.querySelector("#syudouspotifybtn").addEventListener("click", () => {
  window.open("https://open.spotify.com/artist/43XkWaoCS0wKjuMJrWFgoa", "_blank");
});
document.querySelector("#kikuoytbtn").addEventListener("click", () => {
  window.open("https://www.youtube.com/@kikuo_sound", "_blank");
});

document.querySelector("#kikuospotifybtn").addEventListener("click", () => {
  window.open("https://open.spotify.com/artist/5FhcqamaRFfpZb4VHV47fu", "_blank");
});


document.addEventListener("DOMContentLoaded", () => {
  const songSelect = document.getElementById("song");
  const lightingSelect = document.getElementById("lighting");
  const outfitImg = document.querySelector(".concert-stage .outfit");
  const outfitSelect = document.getElementById("outfit");
  const lightingImg = document.querySelector(".concert-stage .lighting");

  const button = document.getElementById("startconcertbtn");
  const star = document.getElementById("starClicker");
  const resultDiv = document.getElementById("result");
  const timerBar = document.getElementById("timerBar");

  let concertScore = 0;
  let starInterval;

  function moveStar() {
    const randXPercent = 10 + Math.random() * 80; // avoid edges
    const randYPercent = Math.random() * 60 - 20;

    star.style.left = randXPercent + "%";
    star.style.top = randYPercent + "%";

    star.classList.remove("shrink");
    star.classList.add("anim1");
    star.style.display = "block";
  }

  function catchStar() {
    concertScore += 3;
    star.classList.add("shrink");
    star.classList.remove("anim1");
    showFloatingPoints("+3", star.style.left, star.style.top);
    setTimeout(() => (star.style.display = "none"), 300);
  }

  function showFloatingPoints(text, leftPercent, topPercent) {
    const point = document.createElement("span");
    point.textContent = text;
    point.className = "star-points";
    
    point.style.left = leftPercent;
    point.style.top = topPercent;

    document.querySelector(".concert-stage").appendChild(point);

    setTimeout(() => point.remove(), 1000);
  }

  star.addEventListener("click", catchStar);

  // update song based on chosen option
  songSelect.addEventListener("change", () => {
    // stop any previous audio
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    const song = parseInt(songSelect.value);
    switch (song) {
      case 10:
        currentAudio = new Audio("audio/melt.mp3");
        break;
      case 9:
        currentAudio = new Audio("audio/worldismine.mp3");
        break;
      case 8:
        currentAudio = new Audio("audio/tellyourworld.mp3");
        break;
      default:
      currentAudio = null;
    }
    if (currentAudio) {
      currentAudio.play();
    }
  });

  // update visuals based on chosen options
  outfitSelect.addEventListener("change", () => {
    const outfit = parseInt(outfitSelect.value);
    switch (outfit) {
      case 9:
        outfitImg.src = "images/concertannivfit.png";
        break;
      case 6:
        outfitImg.src = "images/concertclassicfit.png";
        break;
      case 4:
        outfitImg.src = "images/concerthoodiefit.png";
        break;
      default:
        outfitImg.src = "images/concertdefaultfit.png";
    }
  });

  lightingSelect.addEventListener("change", () => {
    const lighting = parseInt(lightingSelect.value);
    switch (lighting) {
      case 10:
        lightingImg.src = "images/concertlaser.png";
        break;
      case 8:
        lightingImg.src = "images/concertgreenlight.png";
        break;
      case 6:
        lightingImg.src = "images/concertspotlight.png";
        break;
      default:
        lightingImg.src = "images/concerttransparent.png";
    }
  });

  // calculate score and start bonus minigame
  button.addEventListener("click", () => {
    resultDiv.innerHTML = "";
    const song = parseInt(songSelect.value);
    const lighting = parseInt(lightingSelect.value);
    const outfit = parseInt(outfitSelect.value);

    if (isNaN(song) || isNaN(lighting) || isNaN(outfit)) {
      resultDiv.innerHTML = `<p style="color: crimson;">Please choose a song, lighting, and outfit before starting!</p>`;
      return;
    }

    button.disabled = true; // disable start button

    const randomBoost = Math.floor(Math.random() * 6);
    const baseScore = song + lighting + outfit + randomBoost;
    concertScore = 0; // reset bonus score

    // show and restart timer animation
    timerBar.style.display = "block";
    timerBar.classList.remove("countdown-reset");
    void timerBar.offsetWidth;

    // start 10s bonus game
    moveStar();
    starInterval = setInterval(moveStar, 1000);

    setTimeout(() => {
      clearInterval(starInterval);
      star.style.display = "none";
      timerBar.style.display = "none";
      button.disabled = false; // re-enable start button

      const finalScore = baseScore + concertScore;
      let reaction = "";
      if (finalScore > 50) reaction = "Legendary Show!!";
      else if (finalScore > 30) reaction = "Great Show!";
      else reaction = "It was... okay!";

      resultDiv.innerHTML = `
        <p>Base score:  ${baseScore}</p>
        <p>Bonus points: + ${concertScore}</p>
        <p>Total Score: <strong>${finalScore}</strong></p>
        <p>${reaction}</p>
      `;
    }, 10000);
  });
});

