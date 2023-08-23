// import 'chrome-types'

chrome.runtime.onInstalled.addListener(function () {
    chrome.contextMenus.create({
        id: "sendToNotes",
        title: "Send to Notes",
        contexts: ["selection"],
    });
});

chrome.contextMenus.onClicked.addListener(function (info: chrome.contextMenus.OnClickData, tab: chrome.tabs.Tab|undefined) {
    if (info.menuItemId === "sendToNotes") {
        const text = info.selectionText;
        const url = tab?.url;
        console.log(text, url);
        sendToNotes(text, url)
    }
});

const sendToNotes = async (content: string | undefined, url: string | undefined) => {
    chrome.storage.sync.get("userId", result => {
        console.log("Value currently is " + result.userId);
        if (content != undefined && url != undefined) {
            try {
                fetch(`https://prod.nandanvarma.com/api/note/${result.userId}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        details: content,
                        src: url,
                    }),
                }).then((response)=>{
                    if (response.ok) {
                        response.json().then((data) => console.log(data));
                    } else {
                        console.error("Failed to add note");
                    }
                });
                } 
            catch (error) {
                    console.error("Error adding note", error);
            }
        }
      });
}