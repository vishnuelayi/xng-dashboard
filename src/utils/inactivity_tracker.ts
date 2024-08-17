import logoutRedirect from "./logout_redirect";

// Most of this code comes from here: https://stackoverflow.com/questions/667555/how-to-detect-idle-time-in-javascript

export default function inactivityTracker(callback?: () => void) {
  let time: NodeJS.Timeout | undefined;
  let debounce: NodeJS.Timeout | number | undefined;

  // DOM Events
  window.addEventListener("mousemove", resetTimer, true);
  window.addEventListener("mousedown", resetTimer, true);
  window.addEventListener("touchstart", resetTimer, true);
  window.addEventListener("touchmove", resetTimer, true);
  window.addEventListener("click", resetTimer, true);
  window.addEventListener("keydown", resetTimer, true);
  window.addEventListener("scroll", resetTimer, true);

  function resetTimer() {
    // initialize timer
    if (!time) {
      time = setTimeout(logoutRedirect, 1800000);
    }
    if (debounce) {
      return;
    } else {
      debounce = setTimeout(() => (debounce = 0), 60000);

      clearTimeout(time);
      time = setTimeout(logoutRedirect, 1800000);
    }
  }
  resetTimer();
}
