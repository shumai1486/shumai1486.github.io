// toggle fullscreen 
var btnFS = document.querySelector("#btnFS");
btnFS.addEventListener("click", function () {
  clickSound.play();
  if (!document.fullscreenElement) {
    btnFS.style.backgroundImage = 'url("images/exitfullscreen.jpg")';
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    }
  } else {
    btnFS.style.backgroundImage = 'url("images/fullscreen.jpg")';
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
});

// page btns
var homebtn = document.querySelector("#homebtn");
var page1btn = document.querySelector("#page1btn");
var page2btn = document.querySelector("#page2btn");
var page3btn = document.querySelector("#page3btn");
var page4btn = document.querySelector("#page4btn");
var page5btn = document.querySelector("#page5btn");
var allpages = document.querySelectorAll(".page");
var clickSound = new Audio("audio/buttonclick.mp3");

// toggle menu visibility 
var hamBtn = document.querySelector("#hamIcon");
var menuItemsList = document.querySelector("nav ul");
hamBtn.addEventListener("click", toggleMenus);

// star popup btns
var starButtons = document.querySelectorAll(".star");
var popups = document.querySelectorAll(".popup");
var closeBtns = document.querySelectorAll(".closebtn");

// vocaloid page sections
var vocaloidSections = document.querySelectorAll(".textbox-grid, .textbox-grid2");

var audioFiles = [
  new Audio("audio/miku.mp3"),
  new Audio("audio/rinlen.mp3"),
  new Audio("audio/luka.mp3"),
  new Audio("audio/meiko.mp3"),
  new Audio("audio/kaito.mp3")
];

var audiobtn = document.querySelectorAll(".playaudiobtn");
var currentlyPlayingIndex = null;
var currentAudio = null;
var currentPage = 0;
var currentVocaloid = 0;

// hide all pages by default
function hideall() {
  for (var i = 0; i < allpages.length; i++) {
    allpages[i].style.display = "none";
    allpages[i].style.opacity = 1;
    allpages[i].classList.remove("fade-out");
  }
}

// stop all audio
function stopAllAudio() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }
  for (var i = 0; i < audioFiles.length; i++) {
    audioFiles[i].pause();
    audioFiles[i].currentTime = 0;
    audiobtn[i].classList.remove("paused");
  }
  currentlyPlayingIndex = null;
}

// btn to show pages
function show(newPage) {
  stopAllAudio();
  clickSound.play();
  if (newPage === currentPage) return;
  var oldPage = document.querySelector("#page" + currentPage);
  var nextPage = document.querySelector("#page" + newPage);
  if (!nextPage) return;

  // fade transition
  oldPage.classList.add("fade-out");
  setTimeout(function () {
    oldPage.style.display = "none";
    oldPage.classList.remove("fade-out");
    nextPage.style.display = "block";
    nextPage.style.opacity = 0;
    void nextPage.offsetWidth;
    nextPage.style.opacity = 1;
    currentPage = newPage;
  }, 700);
}

homebtn.addEventListener("click", function () { show(0); });
page1btn.addEventListener("click", function () { show(1); });
page2btn.addEventListener("click", function () { show(2); });
page3btn.addEventListener("click", function () { show(3); });
page4btn.addEventListener("click", function () { show(4); });
page5btn.addEventListener("click", function () { show(5); });

hideall();
// show homepage menu by default
document.querySelector("#page0").style.display = "block";
currentPage = 0;

// toggle menu visibility
function toggleMenus() {
  menuItemsList.classList.toggle("menuShow");
  clickSound.play();
  hamBtn.innerHTML = menuItemsList.classList.contains("menuShow") ? "Close Menu" : "Open Menu";
}

// show popup when clicking star btn
function starButtonClickHandler() {
  clickSound.play();
  var targetPopup = document.getElementById(this.dataset.popup);
  if (targetPopup) {
    targetPopup.style.display = "block";
    targetPopup.classList.remove("hide");
    targetPopup.classList.add("show");
  }
}

for (var i = 0; i < starButtons.length; i++) {
  starButtons[i].addEventListener("click", starButtonClickHandler);
}

// close popup when clicking close btn
function closeBtnClickHandler() {
  clickSound.play();
  var popup = this.closest(".popup");
  popup.classList.remove("show");
  popup.classList.add("hide");
}

for (var i = 0; i < closeBtns.length; i++) {
  closeBtns[i].addEventListener("click", closeBtnClickHandler);
}

// popup animation
function popupAnimationEndHandler(e) {
  if (e.animationName === "popupFadeOut") {
    this.style.display = "none";
    this.classList.remove("hide");
  }
}

for (var i = 0; i < popups.length; i++) {
  popups[i].addEventListener("animationend", popupAnimationEndHandler);
}

// vocaloid page sections
function updateVocaloidView(index) {
  for (var i = 0; i < vocaloidSections.length; i++) {
    vocaloidSections[i].style.display = (i === index) ? "grid" : "none";
  }
}
updateVocaloidView(currentVocaloid);

//  switch sections when clicking left and right btns
var leftButtons = document.querySelectorAll(".leftbtn");
function leftBtnClickHandler() {
  currentVocaloid = (currentVocaloid - 1 + vocaloidSections.length) % vocaloidSections.length;
  updateVocaloidView(currentVocaloid);
  stopAllAudio();
  clickSound.play();
}

for (var i = 0; i < leftButtons.length; i++) {
  leftButtons[i].addEventListener("click", leftBtnClickHandler);
}

var rightButtons = document.querySelectorAll(".rightbtn");
function rightBtnClickHandler() {
  currentVocaloid = (currentVocaloid + 1) % vocaloidSections.length;
  updateVocaloidView(currentVocaloid);
  stopAllAudio();
  clickSound.play();
}

for (var i = 0; i < rightButtons.length; i++) {
  rightButtons[i].addEventListener("click", rightBtnClickHandler);
}

// play vocaloid audio sample when clicking play btn
function audioBtnClickHandler(index) {
  return function () {
    var selectedAudio = audioFiles[index];
    if (currentlyPlayingIndex === index && !selectedAudio.paused) {
      selectedAudio.pause();
      selectedAudio.currentTime = 0;
      audiobtn[index].classList.remove("paused");
      currentlyPlayingIndex = null;
    } else {
      stopAllAudio();
      selectedAudio.play();
      audiobtn[index].classList.add("paused");
      currentlyPlayingIndex = index;
    }
  };
}

for (var i = 0; i < audiobtn.length; i++) {
  audiobtn[i].addEventListener("click", audioBtnClickHandler(i));
}

// yt and spotify btns
document.querySelector("#iyowaytbtn").addEventListener("click", function () {
  window.open("https://www.youtube.com/@igusuri_please", "_blank");
});
document.querySelector("#iyowaspotifybtn").addEventListener("click", function () {
  window.open("https://open.spotify.com/artist/0gox2jF74UUFl8bDQYyTFr", "_blank");
});
document.querySelector("#syudouytbtn").addEventListener("click", function () {
  window.open("https://www.youtube.com/@syudou_official", "_blank");
});
document.querySelector("#syudouspotifybtn").addEventListener("click", function () {
  window.open("https://open.spotify.com/artist/43XkWaoCS0wKjuMJrWFgoa", "_blank");
});
document.querySelector("#kikuoytbtn").addEventListener("click", function () {
  window.open("https://www.youtube.com/@kikuo_sound", "_blank");
});
document.querySelector("#kikuospotifybtn").addEventListener("click", function () {
  window.open("https://open.spotify.com/artist/5FhcqamaRFfpZb4VHV47fu", "_blank");
});

document.addEventListener("DOMContentLoaded", function () {
  // concert options
  var songSelect = document.getElementById("song");
  var lightingSelect = document.getElementById("lighting");
  var outfitImg = document.querySelector(".concert-stage .outfit");
  var outfitSelect = document.getElementById("outfit");
  var lightingImg = document.querySelector(".concert-stage .lighting");
  // concert minigame
  var button = document.getElementById("startconcertbtn");
  var star = document.getElementById("starClicker");
  var resultDiv = document.getElementById("result");
  var timerBar = document.getElementById("timerBar");
  var concertScore = 0;
  var starInterval;

  // move star around smoothly
  function moveStar() {
    var randXPercent = 10 + Math.random() * 80;
    var randYPercent = Math.random() * 60 - 20;
    star.style.left = randXPercent + "%";
    star.style.top = randYPercent + "%";
    star.classList.remove("shrink");
    star.classList.add("anim1");
    star.style.display = "block";
  }

  // shrink animation when star is clicked
  function catchStar() {
    concertScore += 3;
    star.classList.add("shrink");
    star.classList.remove("anim1");
    showFloatingPoints("+3", star.style.left, star.style.top);
    setTimeout(function () {
      star.style.display = "none";
    }, 300);
  }

  // floating +3 animation when star is clicked
  function showFloatingPoints(text, leftPercent, topPercent) {
    var point = document.createElement("span");
    point.textContent = text;
    point.className = "star-points";
    point.style.left = leftPercent;
    point.style.top = topPercent;
    document.querySelector(".concert-stage").appendChild(point);
    setTimeout(function () {
      point.remove();
    }, 1000);
  }
  star.addEventListener("click", catchStar);

  // select and play song based on option chosen
  songSelect.addEventListener("change", function () {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
    // add to score based on value
    var song = parseInt(songSelect.value);
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

  // select and change outfit based on option chosen
  outfitSelect.addEventListener("change", function () {
    // add to score based on value
    var outfit = parseInt(outfitSelect.value);
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

  // select and change lighting based on option chosen
  lightingSelect.addEventListener("change", function () {
    // add to score based on value
    var lighting = parseInt(lightingSelect.value);
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

  // start 10s minigame when clicking start btn
  button.addEventListener("click", function () {
    // clear results
    resultDiv.innerHTML = "";
    button.disabled = true;

    // get value of chosen options
    var song = parseInt(songSelect.value);
    var lighting = parseInt(lightingSelect.value);
    var outfit = parseInt(outfitSelect.value);

    // if one of the options isnt chosen
    if (isNaN(song) || isNaN(lighting) || isNaN(outfit)) {
      resultDiv.innerHTML = "<p style='color: crimson;'>Please choose a song, lighting, and outfit before starting!</p>";
      return;
    }

    // add random boost for unpredictability
    var randomBoost = Math.floor(Math.random() * 6);
    var baseScore = song + lighting + outfit + randomBoost;
    concertScore = 0;

    // timer bar countdown
    timerBar.style.display = "block";
    timerBar.classList.remove("countdown-reset");
    void timerBar.offsetWidth;

    moveStar();
    starInterval = setInterval(moveStar, 1000);

    setTimeout(function () {
      clearInterval(starInterval);
      star.style.display = "none";
      timerBar.style.display = "none";
      button.disabled = false;

      // display results + show audience rating
      var finalScore = baseScore + concertScore;
      var reaction = "";
      if (finalScore > 50) reaction = "Legendary Show!!";
      else if (finalScore > 30) reaction = "Great Show!";
      else reaction = "It was... okay!";

      resultDiv.innerHTML =
        "<p>Base score: " + baseScore + "</p>" +
        "<p>Bonus points: + " + concertScore + "</p>" +
        "<p>Total Score: <strong>" + finalScore + "</strong></p>" +
        "<p>" + reaction + "</p>";
    }, 10000);
  });
});