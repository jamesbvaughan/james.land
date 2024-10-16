import React from "https://esm.sh/react@18/?dev";
import ReactDOM from "https://esm.sh/react-dom@18/client?dev";
import Globe from "https://esm.sh/react-globe.gl@2/?deps=react@18&dev";

const hifiBars = [
  // U.S.

  /// California
  {
    name: "Bar Shiru",
    url: "https://maps.app.goo.gl/3H8hHffbh8hmdoAN6",
    lat: 37.80641605541192,
    lng: -122.27070496043847,
    size: 10,
  },

  // Europe

  /// Ireland
  {
    name: "Fidelity Bar",
    url: "https://maps.app.goo.gl/YK6gEFXL4UQsFAmVA",
    lat: 53.34712096788844,
    lng: -6.280387338405552,
  },
  /// Switzerland
  {
    name: "Stereo",
    url: "https://maps.app.goo.gl/KepcV6LETDmpgJCA7",
    lat: 47.377943469588175,
    lng: 8.527304143206587,
  },
  /// Spain
  {
    name: "Lonely",
    url: "https://maps.app.goo.gl/7faq9o3Rsyy7FooKA",
    lat: 41.39884988560985,
    lng: 2.155175333005087,
  },
  {
    name: "Oblicuo",
    url: "https://maps.app.goo.gl/R3xbyBb9vNjVquaD8",
    lat: 41.401476723824,
    lng: 2.1549146970909336,
  },
  {
    name: "Curtis Audiophile Cafe",
    url: "https://maps.app.goo.gl/exaHmrbxuoP3hWss9",
    lat: 41.39210493208592,
    lng: 2.1578633268503906,
  },
];

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

function App() {
  const globeRef = React.createRef();
  const [width, setWidth] = React.useState(window.innerWidth);
  const [height, setHeight] = React.useState(window.innerHeight);

  React.useEffect(() => {
    // globeRef.current.controls().enableDamping = false;
    globeRef.current.pointOfView({ lat: 37.8, lng: -122, altitude: 1 });

    window.addEventListener("resize", () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    });
  }, []);

  return React.createElement(Globe, {
    ref: globeRef,
    backgroundColor: "#1e1e2e",
    animateIn: false,
    atmosphereColor: "#cdd6f4",
    pointOfView: {
      lat: 37.80641605541192,
      lng: -122.27070496043847,
    },
    globeImageUrl: "/images/earth-night.jpg",
    htmlElementsData: hifiBars,
    htmlElement: hifiBarToElement,
    height,
    width,
  });
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(App));
