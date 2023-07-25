const DARKMODE_COOKIE_NAME = "dark-theme";
const DARKMODE_CLASS = "dark-theme";
const LIGHTMODE_CLASS = "light-theme";

window.onload = () => { setColorschemeOnload(); };

function setColorschemeOnload() {
  var darkmode = check_cached_colorscheme_preference();

  if (darkmode == null) {
    darkmode = check_mediaquery_colorscheme_preference();
  }

  setDarkMode(darkmode);
  if (darkmode) {
    if ((slider = document.getElementById("darkmode-slider")) != null) {
      slider.checked = true;
    }
  }
}

/// check the colorscheme from localstorage
function check_cached_colorscheme_preference() {
  switch (localStorage.getItem(DARKMODE_COOKIE_NAME)) {
  case "true":
    return true;
  case "false":
    return false;
  default:
    return null;
  }
}

/// check the colorscheme from mediaquery
function check_mediaquery_colorscheme_preference() {
  return window.matchMedia("(prefers-color-scheme)").matches;
}

function setDarkMode(darkmode) {
  if (darkmode) {
    document.body.classList.add(DARKMODE_CLASS);
    document.body.classList.remove(LIGHTMODE_CLASS);
  } else {
    document.body.classList.add(LIGHTMODE_CLASS);
    document.body.classList.remove(DARKMODE_CLASS);
  }
}

function toggleDarkMode() {
  var darkmode = document.body.classList.contains(DARKMODE_CLASS);
  setDarkMode(!darkmode);
  localStorage.setItem(DARKMODE_COOKIE_NAME, !darkmode);
}

// FROM LANYON
(function (document) {
var toggle = document.querySelector(".sidebar-toggle");
var sidebar = document.querySelector("#sidebar");
var checkbox = document.querySelector("#sidebar-checkbox");

  document.addEventListener(
    "click",
    function (e) {
  var target = e.target;

  if (!checkbox.checked || sidebar.contains(target) || target === checkbox ||
      target === toggle)
    return;

  checkbox.checked = false;
    },
    false
  );
})(document);
