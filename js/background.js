// Set the panel behavior
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

// Global variable to store the base64 video
let base64VideoData = null;

// Function to start the recording
const startRecording = async () => {
    await chrome.tabs.query({ 'active': true, 'lastFocusedWindow': true, 'currentWindow': true }, async function (tabs) {

        const currentTab = tabs[0];

        chrome.windows.create({
            url: chrome.runtime.getURL('html/recording_screen.html'),
            type: 'popup',
            left: 0,
            top: 0,
            width: 10,
            height: 10
        }, function (window) {
            // Listen for tab updates
            chrome.tabs.onUpdated.addListener(function listener(tabId, info, tab) {
                // Check if the updated tab belongs to the new window and its status is 'complete'
                if (tab.windowId === window.id && info.status === 'complete' && tab.url === chrome.runtime.getURL('html/recording_screen.html')) {
                    // Remove the listener
                    chrome.tabs.onUpdated.removeListener(listener);

                    // Send the message
                    chrome.tabs.sendMessage(tabId, {
                        name: 'startRecordingOnBackground',
                        body: {
                            currentTab: currentTab,
                        },
                    });
                }
            });
        });
    });
};

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.name) {
        case 'editGifOpen':
            console.log("The gif is open");
            sendResponse({ data: base64VideoData });
            break;

        case 'startRecording':
            console.log("Started recording");
            startRecording();
            break;

        case 'editgif':
            base64VideoData = request.data;
            chrome.sidePanel.setOptions({ path: "html/editGifPanel.html" });
            break;

        case 'stop':
            console.log("Stopped recording");
            break;

        case 'myMessage':
            console.log(request.data);  // "Hello from recording_screen.js"
            break;

        case 'videoData':
            console.log("Received video data");
            // Handle the base64 video data
            base64VideoData = request.data;
            chrome.runtime.sendMessage({
                name: 'sendVideo',
                data: { value: base64VideoData }
            });
            break;
    }
});
