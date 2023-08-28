const generateSTYLES = () => {
    return `<style>
    body {
        background-color: black;
        color: white;
        font-family: 'Roboto', sans-serif;
        font-weight: 500;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
      }
      .text {
        animation-name: slideIn;
        animation-duration: 2s;
        font-size: 50px;
      }
      @keyframes slideIn {
        from {
          transform: translateX(-100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
     </style>`;
  };
  
const generateHTML = (pageName:string) => {
    return `
    <div class='main'>
        <div class='text'>GET BACK TO WORK</div>
        <div class='text'>STUDYING > ${pageName}</div>
    </div>
     `;
  };
window.onload = (event) => {
  chrome.storage.sync.get("blocklist",(data)=>{
    console.log(data.blocklist)
    if(data.blocklist.includes(window.location.hostname)){
        document.body.innerHTML = generateHTML(window.location.hostname);
        document.head.innerHTML = generateSTYLES();
    }
  })
};
