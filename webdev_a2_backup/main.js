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
const closeBtns = document.querySelectorAll(".close-btn");

// for voicebank page switch
const vocaloidSections = document.querySelectorAll(".textbox-grid, .textbox-grid2");

// for voicebank audio
const audioFiles = [
  new Audio("audio/miku.mp3"),
  new Audio("audio/rin.mp3"),
  new Audio("audio/luka.mp3"),
  new Audio("audio/meiko.mp3"),
  new Audio("audio/kaito.mp3")
];

const buttons = document.querySelectorAll(".playaudiobtn");
// keep track of currently playing audio
let currentlyPlayingIndex = null;

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

function show(newPage) {
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
  });
});

document.querySelectorAll(".rightbtn").forEach(button => {
  button.addEventListener("click", () => {
    currentVocaloid = (currentVocaloid + 1) % vocaloidSections.length;
    updateVocaloidView(currentVocaloid);
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
      audioFiles.forEach((audio, i) => {
        if (i !== index) {
          audio.pause();
          audio.currentTime = 0;
          buttons[i].classList.remove("paused");
        }
      });

      // play selected audio
      selectedAudio.play();
      btn.classList.add("paused");
      currentlyPlayingIndex = index;
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const songSelect = document.getElementById("song");
  const lightingSelect = document.getElementById("lighting");
  const outfitImg = document.querySelector(".concert-stage .outfit");
  const outfitSelect = document.getElementById("outfit");
  const lightingImg = document.querySelector(".concert-stage .lighting");

  const button = document.getElementById("startconcertbtn");
  const resultDiv = document.getElementById("result");


  // update visuals in real time
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
      case 7:
        lightingImg.src = "images/concertgreenlight.png";
        break;
      case 5:
        lightingImg.src = "images/concertspotlight.png";
        break;
      default:
        lightingImg.src = "";
    }
  });

  // calculate score
  button.addEventListener("click", () => {
    const song = parseInt(songSelect.value);
    const lighting = parseInt(lightingSelect.value);
    const outfit = parseInt(outfitSelect.value);

    if (isNaN(song) || isNaN(lighting) || isNaN(outfit)) {
      resultDiv.innerHTML = `<p style="color: crimson;">Please choose a song, lighting, and outfit before starting!</p>`;
      return;
    }

    const randomBoost = Math.floor(Math.random() * 6);
    const score = song + lighting + outfit + randomBoost;

    let reaction = "";
    if (score > 30) reaction = "Legendary Show!!";
    else if (score > 25) reaction = "Great Show!";
    else if (score > 20) reaction = "Pretty Good!";
    else reaction = "It was... okay!";

    resultDiv.innerHTML = `
      <p>Total Hype Score: <strong>${score}</strong></p>
      <p>${reaction}</p>
    `;
  });
});
