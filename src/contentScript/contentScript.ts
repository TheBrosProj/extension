/**
 * add text on screen if it is in blocklist
 */

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
    .blocker {
      z-index: 1000;
      position: fixed;
      top: 0;
      left: 0;
      color: white;
      font-family: 'Roboto', sans-serif;
      font-weight: 500;
      height: 100vh;
      width: 100%;
      text-align: center;
      overflow: hidden;
      background-color: rgba(60, 60, 60, 0.4);
      backdrop-filter: blur(10px);
    }
    .blocker-text {
      position: relative;
      padding: 20vh 2rem 0 2rem;
      font-size: 2rem;
    }
    .animated-blocker-text{
      animation-name: appearFromRandomDirection;
      animation-duration: 2s;
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
  blocker.className = "blocker";
  const blocker_text = document.createElement("p");
  blocker_text.className = "blocker-text";
  blocker_text.innerHTML = `This page  ( ${pageName} )  is Blacklisted.`;
  const blocker_text2 = document.createElement("p");
  blocker_text2.className = "blocker-text";
  blocker_text2.innerHTML = "Continue working.";
  blocker.appendChild(blocker_text);
  // blocker.appendChild(document.createElement("br"));
  blocker.appendChild(blocker_text2);
  return blocker
}


window.onload = (event) => {
  chrome.storage.sync.get("blocklistStatus", ({ "blocklistStatus": status }) => {
    if(status){
      chrome.storage.sync.get("blocklist", (data) => {
    if (data.blocklist.includes(window.location.hostname)) {
      document.body.appendChild(create_blocker(window.location.hostname));
      document.head.appendChild(generateSTYLES());
      // disable scroll
      // const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      // const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
          // if any scroll is attempted, set this to the previous value
          window.onscroll = function() {
              window.scrollTo(0, 0);
            };
          }
        });
      }});
};
