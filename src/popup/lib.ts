const openURL = (urlLocation: string) => {
    chrome.tabs.create({ active: true, url: urlLocation });
}

export { openURL }