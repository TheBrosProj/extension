const generateSTYLES = () => {
  function getRandomCoordinate() {
    return Math.random() * 200 - 100 + '%';
  }
  
  function getRandomAngle() {
    return Math.random() * 360;
  }

  const styleElement = document.createElement('style');
  styleElement.innerHTML = `
  function getRandomCoordinate() {
    return Math.random() * 200 - 100 + 'px';
  }
  
  function getRandomAngle() {
    return Math.random() * 360;
  }
    .blur {
      background-color: rgba(60, 60, 60, 0.4);
      backdrop-filter: blur(10px);
    }
    .blocker {
      z-index: 10000;
      position: absolute;
      top: 0;
      left: 0;
      color: white;
      font-family: 'Roboto', sans-serif;
      font-weight: 500;
      height: 100vh;
      width: 100%;
      text-align: center;
      overflow: hidden;
    }
    .blocker-text {
      padding: 20vh 10vw 0 10vw;
      animation-name: appearFromRandomDirection;
      animation-duration: 2s;
      font-size: 50px;
    }
    @keyframes appearFromRandomDirection {
      from {
        transform: translate(${getRandomCoordinate()}, ${getRandomCoordinate()}) rotate(${getRandomAngle()}deg);
        opacity: 0;
      }
      to {
        transform: translate(0, 0) rotate(0);
        opacity: 1;
      }
    }
  `;
  return styleElement;
};


const create_blocker = (pageName: string) => {
  const blocker = document.createElement("div");
  blocker.className = "blocker blur";
  const blocker_text = document.createElement("p");
  blocker_text.className = "blocker-text";
  blocker_text.innerHTML = "This page ( "+pageName+" ) is Blacklisted.";
  const blocker_text2 = document.createElement("p");
  blocker_text2.className = "blocker-text";
  blocker_text2.innerHTML = "Continue working.";
  blocker.appendChild(blocker_text);
  // blocker.appendChild(document.createElement("br"));
  blocker.appendChild(blocker_text2);
  return blocker
}


window.onload = (event) => {
  chrome.storage.sync.get("blocklist", (data) => {
    console.log(data.blocklist)
    if (data.blocklist.includes(window.location.hostname)) {
      document.body.appendChild(create_blocker(window.location.hostname));
      document.head.appendChild(generateSTYLES());
      // disable scroll
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
          // if any scroll is attempted, set this to the previous value
          window.onscroll = function() {
              window.scrollTo(scrollLeft, scrollTop);
          };
    }
  })
};
