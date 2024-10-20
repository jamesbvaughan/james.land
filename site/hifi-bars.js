// This import results in multiple versions of three.js being downloaded.
// See https://github.com/esm-dev/esm.sh/discussions/845 for context.
import Globe from "https://esm.sh/globe.gl@2.33.0";
import hifiBars from "./hifi-bar-list.js";

const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;

function hifiBarToElement(hifiBar) {
  const element = document.createElement("a");

  element.href = hifiBar.url;
  element.target = "_blank";
  element.className = "hifi-bar-marker";
  element.innerHTML = hifiBar.name;

  element.addEventListener("touchmove", (event) => {
    event.preventDefault();
  });

  return element;
}

const globe = Globe({
  animateIn: false,
})(document.getElementById("root"))
  .globeImageUrl("/images/earth-night.jpg")
  .backgroundColor(isDarkMode ? "#1e1e2e" : "#EFF1F5")
  .atmosphereColor(isDarkMode ? "#cdd6f4" : "#4C4F69")
  .pointOfView({
    lat: 37.80641605541192,
    lng: -122.27070496043847,
    altitude: 1,
  })
  .htmlElementsData(hifiBars)
  .htmlElement(hifiBarToElement)
  .width(window.innerWidth)
  .height(window.innerHeight);

window.addEventListener("resize", () => {
  globe.width(window.innerWidth);
  globe.height(window.innerHeight);
});
